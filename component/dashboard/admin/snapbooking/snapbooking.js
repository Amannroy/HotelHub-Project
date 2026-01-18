"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";


export default function PromoCardEditor() {
  const [form, setForm] = useState({
    shortTile: "",
    mainTitle: "",

    shortDesc: "",
    linkUrl: "",
    photo: null,
    existingPhotoUrl: "",
  });

  const [imagePreview, setImagePreview] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState({
    text: "",
    isError: false,
  });

  useEffect(() => {
      
    const fetchPromoData = async() => {
        try{

          setIsLoading(true);
          const response = await fetch(`${process.env.API}/admin/bookArea`);

          if(!response.ok){
            throw new Error("Failed to fetch promo data");
          }

          const data = await response.json();

          if(data){
            setForm({
              shortTile: data?.shortTile || "",
              mainTitle: data?.mainTitle || "",
              shortDesc: data?.shortDesc || "",
              linkUrk: data?.linkUrk || "",
              photo: null,
              existingPhotoUrl: data?.photoUrl || "",
            });


          if(data?.photoUrl){
            setImagePreview(data?.photoUrl);
          }
          }

        }catch(error){
          console.log("Error Fetching promo data", error);

          setServerMessage({text: "Failed to load promo data", isError: true})
          
        }finally{
          setIsLoading(false);
        }
    }
    fetchPromoData();
  },[])

  // It is called whenever the user type in any input field
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Here we will get the image preview
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setForm((prev) => ({ ...prev, photo: file }));

      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to uplaod selected iamge to the Cloudinary
  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData(); // This is a object by default inside the browser so that we can use it

    formData.append("file", imageFile);
    formData.append("upload_preset", "ml_default");

    // We have to make post request to the cloudinary
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to uplaod image to the cloudinary");
      }

      const data = await response.json();
      console.log(data);
      return data?.secure_url;
    } catch (error) {
      console.log("Cloudinary Upload Error", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    setServerMessage({ text: "", isError: false });

    try {
      let imageUrl = form.existingPhotoUrl;

      // If selected a new image, then upload it to the cloudinary
      if (form.photo) {
        imageUrl = await uploadImageToCloudinary(form.photo);
      }

      const requestBody = {
        shortTitle: form.shortTile,
        mainTitle: form.mainTitle,
        shortDesc: form.shortDesc,
        linkUrl: form.linkUrl,
        photoUrl: imageUrl,
      };

      // PUT request to update this book room on the server
      const response = await fetch(`${process.env.API}/admin/bookArea`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(requestBody), // Sending request body to the server side
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message || "Failed to save promo");
      }

      const result = await response.json();

      setServerMessage({
        text: result.message || "Promo Updated Successfully",
        isError: false,
      });

      setForm((prev) => ({
        ...prev,
        existingPhotoUrl: imageUrl,
        photo: null,
      }));
    } catch (error) {
      setServerMessage({
        text: error.message || "An Error occured while saving",
        isError: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        p: 2,
        borderRadius: 2,
        boxShadow: 2,
        mt: 4,
      }}
    >
      <Typography variant="h6" mb={2}>
        Snap Booking
      </Typography>

      {serverMessage.text && (
        <Alert
          severity={serverMessage.isError ? "error" : "success"}
          sx={{ mb: 2 }}
        >
          {serverMessage.text}
        </Alert>
      )}

      <Stack spacing={2}>
        <TextField
          name="shortTitle"
          label="Short Title"
          value={form.shortTitle}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{
            style: { color: "#8A12FC" },
          }}
          sx={{
            mb: 3,
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#8A12FC",
              },
              "&:hover fieldset": {
                borderColor: "#8A12FC",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#8A12FC",
              },
            },
          }}
        />
        <TextField
          name="mainTitle"
          label="Main Title"
          value={form.mainTitle}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{
            style: { color: "#8A12FC" },
          }}
          sx={{
            mb: 3,
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#8A12FC",
              },
              "&:hover fieldset": {
                borderColor: "#8A12FC",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#8A12FC",
              },
            },
          }}
        />
        <TextField
          name="shortDesc"
          label="Short Description"
          value={form.shortDesc}
          onChange={handleChange}
          rows={5}
          fullWidth
          InputLabelProps={{
            style: { color: "#8A12FC" },
          }}
          sx={{
            mb: 3,
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#8A12FC",
              },
              "&:hover fieldset": {
                borderColor: "#8A12FC",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#8A12FC",
              },
            },
          }}
        />
        <TextField
          name="linkUrl"
          label="Link URL"
          value={form.linkUrl}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{
            style: { color: "#8A12FC" },
          }}
          sx={{
            mb: 3,
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#8A12FC",
              },
              "&:hover fieldset": {
                borderColor: "#8A12FC",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#8A12FC",
              },
            },
          }}
        />

        {/* Image preview */}
        {imagePreview && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Image Preview:
            </Typography>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                borderRadius: "4px",
              }}
            />
          </Box>
        )}

        <Button
          variant="contained"
          component="label"
          disabled={isSubmitting}
          sx={{
            backgroundColor: "#8A12FC",
            "&:hover": {
              backgroundColor: "#7a0ae8",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#8A12FC",
              },
              "&:hover fieldset": {
                borderColor: "#8A12FC",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#8A12FC",
              },
            },
          }}
        >
          {imagePreview ? "Change Photo" : "Upload Photo"}
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept="image/*"
          />
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          sx={{
            backgroundColor: "#8A12FC",
            "&:hover": {
              backgroundColor: "#7a0ae8",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#8A12FC",
              },
              "&:hover fieldset": {
                borderColor: "#8A12FC",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#8A12FC",
              },
            },
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Update Snap Booking"
          )}
        </Button>
      </Stack>
    </Box>
  );
}
