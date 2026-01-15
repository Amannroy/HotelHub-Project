import {withAuth} from "next-auth/middleware";


import { NextResponse } from "next/server";



export const config = {
    matcher: [

        // We will proctect eash path using user
        "/dashboard/user/:path*",
        "/dashboard/admin/:path*",

        "/api/user/:path*",
        "/api/admin/:path*",

    ],
};


// We have to wrap the middleware function with auth to force the Authentication
export default withAuth(
    async function middleware(req){
        
        // Get the request root path
        const url = req.nextUrl.pathname;

        // Access the user auth token from next auth
        const token = req.nextauth?.token;

        // Get the user role admin users from the token
        const userRole = token?.user?.role;

        if(url?.includes("/admin") && userRole !== "admin"){
            return NextResponse.redirect(new URL("/", req.url));
        }
        if(url?.includes("/user") && userRole !== "user"){
            return NextResponse.redirect(new URL("/", req.url));
        }
        
    },

    {
        // We have to check the callbacks to decide if the user is authorized to access the route or not.
        callbacks:{
            authorized: ({token}) => {
                if(!token){
                    return false;
                }
                return true;
            }
        }
    }
)