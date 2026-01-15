"use client";

import React, { useState } from "react";
import {
  Divider,
  Container,
  Grid,
  TextField,
  Button,
  Link,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { signIn } from "next-auth/react";
import HotelHubLogo from "@/component/nav/HotelHubLogo";
import { useRouter } from "next/navigation";
import GoogleIcon from "@mui/icons-material/Google";

const LoginPage = () => {

  const [loginId, setLoginId] = useState("");

  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);   // Controls popup visibility
  const [snackbarMessage, setSnackbarMesage] = useState(""); // Message inside popup
  const [snackbarSeverity, setSnackbarSeverity] = useState(""); // Type of popup -> success or error
 
  const [isEmail, setIsEmail] = useState(true);
  
  const router = useRouter();

  // Email Validation
  const validateEmail = (email) => {
     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
     return re.test(email);
  }
 
  // Phone Validation
  const validatePhone = (phone) => {
     const re = /^\d{10}$/;
     return re.test(phone);
  }
 
  // Login Logic(Stops page refresh, validates input, Calls login API, shows messsage, Redirects on success)
  const handleLogin = async(e) => {
      e.preventDefault();

      const isInputEmail = validateEmail(loginId);
      const isInputPhone = validatePhone(loginId);

      if(!loginId || !password){
        setSnackbarMesage("Login Id and Password are required")

        setSnackbarSeverity("error");

        setOpenSnackbar(true);
        return;
      }

      if(!isInputEmail && !isInputPhone){
        setSnackbarMesage("Please Enter a valid email or phone number");
        setSnackbarSeverity("error");

        setOpenSnackbar(true);
        return;
      }

      try{
         const result = await signIn("credentials", {
          redirect: false,
          [isInputEmail ? "email" : "phone"]: loginId,
          password,
         });
          
          if(result?.error){
            setSnackbarMesage(result.error || "login failed");
            setSnackbarSeverity("error");
          }else{
            setSnackbarMesage("Login Successful");
            setSnackbarSeverity("success");

            router.push("/");
          }

      }catch(error){
         setSnackbarMesage("An error occured. Please try again.")
      }

      setOpenSnackbar(true);
  };


  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  }

  // Detect Email or Phone while typing(If user types @-> email, If user types only numbers-> phone)
  const handleLoginIdChange = (e) => {
    const value = e.target.value;
    setLoginId(value);

    if(value.includes("@")){
      setIsEmail(true);
    }else if(/^[0-9]+$/.test(value)){
      setIsEmail(false);
    }
  }


  return (
    <Container maxWidth="xxl">
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item xs={12} md={6}>
          <Box
            component="form"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{ p: 3 }}
            onSubmit={handleLogin}
          >
            <Typography variant="h4" gutterBottom>
              <HotelHubLogo />
            </Typography>

            <Typography variant="h4" gutterBottom>
              Login
            </Typography>
            <TextField
              label={isEmail ? "Email" : "Phone Number"}
              type={isEmail ? "email" : "tel"}
              variant="outlined"
              fullWidth
              margin="normal"
              value={loginId}
              onChange={handleLoginIdChange}
              InputLabelProps={{
                style: { color: "#EA580C" },
              }}
              InputProps={{
                style: {
                  color: "#fff",
                  borderColor: "#EA580C",
                },
              }}
              sx={{
                input: { color: "black" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#EA580C",
                  },
                  "&:hover fieldset": {
                    borderColor: "#EA580C",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#EA580C",
                  },
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"

              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{
                style: { color: "#EA580C" },
              }}
              InputProps={{
                style: {
                  color: "#fff",
                  borderColor: "#EA580C",
                },
              }}
              sx={{
                input: { color: "black" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#EA580C",
                  },
                  "&:hover fieldset": {
                    borderColor: "#EA580C",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#EA580C",
                  },
                },
              }}
            />

            <Divider sx={{ mt: 2 }}>or</Divider>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{
                color: "white",
                backgroundColor: "#EA580C",
                "&:hover": {
                  color: "white",
                  backgroundColor: "#EA580C",
                },
                mt: 2,
                width: "100%",
              }}
              onClick={() => signIn("google")}
            >
              Log In with Google
            </Button>

            <Link
              href="/forgot-password"
              variant="body2"
              sx={{ alignSelf: "flex-end", mt: 1 }}
            >
              Forgot Password?
            </Link>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#EA580C",
                "&:hover": {
                  backgroundColor: "#EA580C",
                },
                mt: 2,
                width: "100%",
              }}
            >
              Login
            </Button>
            <Link href="/register" variant="body2" sx={{ mt: 2 }}>
              Don't have an account? Sign Up
            </Link>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: "100%",
              height: "100vh",
              display: { xs: "none", md: "block" },
            }}
          >
            <Box
              component="img"
              src="/images/login5.jpg"
              alt="Login image"
              sx={{
                marginTop:"3px",
                marginBottom:"2px",
                width: "100%",
                height: "100vh",
                objectFit: "cover",
              }}
            />
          </Box>
        </Grid>
      </Grid>
      <Snackbar
       open={openSnackbar}
        autoHideDuration={6000}
       onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        sx={{
          "& .MuiSnackbar-root": {
            top: "24px",
            left: "24px",
          },
        }}
      >
        <Alert
         onClose={handleCloseSnackbar}
        severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
         {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginPage;