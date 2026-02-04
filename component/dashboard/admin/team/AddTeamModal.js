import React, { useState } from "react";
import {
  Box,
  Modal,
  TextField,
  Stack,
  Input,
  Button,
  Avatar,
} from "@mui/material";
import { toast } from "react-toastify";
import { modalStyle } from "./styles";

export default function AddTeamModal({
  open,
  onClose,
  onSuccess,
  loading,
  setLoading,
}) {
  // State to store new team member details
  const [newMember, setNewMember] = useState({
    name: "",
    position: "",
    image: null,          // actual file object
    previewImage: "",     // base64 preview for UI
  });

  // Handles text input changes (name & position)
  // Updates the corresponding field in state dynamically
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handles image file selection
  // Converts image into preview using FileReader
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      // Runs after file is fully read
      reader.onloadend = () => {
        setNewMember((prev) => ({
          ...prev,
          image: file,               // store original file
          previewImage: reader.result, // base64 preview
        }));
      };

      // Convert image file to base64
      reader.readAsDataURL(file);
    }
  };

  // Main function to add a new team member
  // 1. Validate inputs
  // 2. Upload image to Cloudinary (if exists)
  // 3. Send data to backend API
  const handleAddMember = async () => {
    // Validation: required fields
    if (!newMember.name || !newMember.position) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = "";

      // If image exists, upload it to Cloudinary
      if (newMember.image) {
        const imageData = new FormData();
        imageData.append("file", newMember.image);
        imageData.append("upload_preset", "ml_default");

        // Upload image to Cloudinary
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: imageData,
          }
        );

        // Extract secure image URL
        const data = await response.json();
        imageUrl = data.secure_url;
      }

      // Send team member data to backend API
      const response = await fetch(`${process.env.API}/admin/team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newMember.name,
          position: newMember.position,
          image: imageUrl,
        }),
      });

      const data = await response.json();

      // Inform parent component about success
      onSuccess(data);

      toast.success("Team member added successfully");

      // Reset form state after success
      setNewMember({
        name: "",
        position: "",
        image: null,
        previewImage: "",
      });
    } catch (error) {
      console.log("Error Adding Team", error);
      toast.error("Failed to add team member");
    } finally {
      // Always stop loading spinner
      setLoading(false);
    }
  };


  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-team-modal">
      <Box sx={modalStyle}>
        <h2
          style={{
            marginTop: 0,
            marginBottom: "12px",
            fontWeight: 700,
            fontSize: "1.75rem",
            color: "#1a202c",
          }}
        >
          Add New Team Member
        </h2>

        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={newMember.name}
            onChange={handleInputChange}
            variant="outlined"
            disabled={loading}
            InputLabelProps={{ style: { color: "#8A12FC" } }}
            sx={{
              input: { color: "black" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#8A12FC" },
                "&:hover fieldset": { borderColor: "#8A12FC" },
                "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
              },
            }}
          />

          <TextField
            fullWidth
            label="Position"
            name="position"
            value={newMember.position}
            onChange={handleInputChange}
            variant="outlined"
            disabled={loading}
            InputLabelProps={{ style: { color: "#8A12FC" } }}
            sx={{
              input: { color: "black" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#8A12FC" },
                "&:hover fieldset": { borderColor: "#8A12FC" },
                "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
              },
            }}
          />

          <Box>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              id="add-image-upload"
              sx={{ display: "none" }}
              disabled={loading}
            />
            <label htmlFor="add-image-upload">
              <Button
                variant="contained"
                component="span"
                fullWidth
                disabled={loading}
                sx={{
                  backgroundColor: "#8A12FC",
                  "&:hover": { backgroundColor: "#7a0eeb" },
                }}
              >
                Upload Image
              </Button>
            </label>
            {newMember.previewImage && (
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Avatar
                  src={newMember.previewImage}
                  alt="Preview"
                  sx={{
                    width: 100,
                    height: 100,
                    border: "3px solid white",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ borderRadius: "12px" }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddMember}
              sx={{
                backgroundColor: "#8A12FC",
                "&:hover": { backgroundColor: "#7a0eeb" },
              }}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Member"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}
