// This file configures NextAuth to handle login using email/phone with password and Google, validates users using database, compares passwords securely, and manages authentication sessions using JWT.

import User from "@/model/user";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import dbConnect from "@/utils/dbConnect";

export const authOptions = {
  // Use JWT instead of DB sessions
  session: {
    strategy: "jwt",
  },

  // Login methods
  providers: [
    // Email / Phone + Password login
    CredentialsProvider({
      async authorize(credentials, req) {
        await dbConnect(); // Connect to database

        const { email, phone, password } = credentials;

        // Require email or phone
        if (!email && !phone) {
          throw new Error("Email or phone number is required");
        }

        // Find user by email or phone
        const user = await User.findOne({
          $or: [{ email: email || "" }, { phone: phone || "" }],
        });

        // If user exists but has no password (Google login user)
        if (!user?.password) {
          throw new Error("Please login via the method used to sign up");
        }

        // Compare passwords
        const isPasswordValid = user && (await bcrypt.compare(password, user.password));

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        // Login successful
        return user;
      },
    }),

    // Google login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  // Runs after successful login
  callbacks: {
    async signIn({ user, account }) {
      await dbConnect();

      const { email, phone } = user;

      // Check if user exists
      let dbUser = await User.findOne({
        $or: [{ email: email || "" }, { phone: phone || "" }],
      });

      // Create user if logging in via Google for first time
      if (!dbUser && account?.provider === "google") {
        dbUser = await User.create({
          email,
          name: user?.name,
          image: user?.image,
        });
      }

      return true; // Allow login
    },

    async redirect({url, baseUrl}){
      return `${baseUrl}/`;
  },

  jwt: async ({ token, user }) => {
    let dbUser = await User.findOne({
      $or: [{ email: token.email || "" }, { phone: token.phone || "" }],
    });

    if (dbUser) {
      dbUser.password = undefined;

      token.user = {
        ...dbUser.toObject(),
        role: dbUser.role || "user",
      };
    }

    return token;
  },

  session: async ({ session, token }) => {
    session.user = {
      ...token.user,
      role: token.user.role || "user",
    };

    return session;
  },
},

  secret: process.env.NEXTAUTH_SECRET,
  
  pages: {
    signIn: "/login",
  },
};
