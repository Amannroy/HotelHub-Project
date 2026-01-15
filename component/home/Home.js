import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  BackgroundContainer,
  TransparentBox,
  TransparentBoxx,
} from "@/component/home/styles/backgroundStyles";
import {
  datePickerStyles,
  dateLabelStyles,
  buttonStyles,
  transparentBoxStyles,
  formContainerStyles,
  selectStyles,
} from "@/component/home/styles/customStyles";

export default function Home() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  // State to store form values
  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
    guests: 1,
  });

  const [errors, setErrors] = useState({
    checkInDate: false,
    checkOutDate: false,
  });

 
  // Options for guests dropdown
  const guestOptions = [1, 2, 3, 4, 5, 6, 7,8,9];

 
  return (
    <BackgroundContainer
      sx={{ marginBottom: isSmallScreen ? "300px" : "20px" }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <TransparentBoxx sx={transparentBoxStyles(isSmallScreen)}>
              <Typography variant="h4" component="h1">
                Listify: Discover, Compare, and Choose
              </Typography>
              <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                Your Ultimate Guide to Finding the Best Products, Services, and
                Deals Online
              </Typography>
            </TransparentBoxx>
          </Grid>

          <Grid item xs={12} md={8}>
            <TransparentBox sx={{ p: 2, borderRadius: 1 }}>
              <Box sx={formContainerStyles(isSmallScreen)}>
                {/* Check-in Date */}
                <TextField
                  id="checkInDate"
                  name="checkInDate"
                  label="Check-in Date"
                  type="date"
                  sx={datePickerStyles}
                  InputLabelProps={{
                    shrink: true,
                    ...dateLabelStyles,
                  }}
                  value={formData.checkInDate}
                //  onChange={handleInputChange}
                  inputProps={{
                    min: new Date().toISOString().split("T")[0],
                  }}
                  error={errors.checkInDate}
                  helperText={
                    errors.checkInDate ? "Please select check-in date" : ""
                  }
                  fullWidth
                />

                {/* Check-out Date */}
                <TextField
                  id="checkOutDate"
                  name="checkOutDate"
                  label="Check-out Date"
                  type="date"
                  sx={datePickerStyles}
                  InputLabelProps={{
                    shrink: true,
                    ...dateLabelStyles,
                  }}
                  value={formData.checkOutDate}
              //    onChange={handleInputChange}
                //   inputProps={{
                //     min: minCheckoutDate,
                //   }}
                  error={errors.checkOutDate}
                  helperText={
                    errors.checkOutDate ? "Please select check-out date" : ""
                  }
                  fullWidth
                />

                {/* Guests Select - Fixed with proper handler */}
                <FormControl sx={selectStyles} fullWidth>
                  <InputLabel id="guests-label">Number of Guests</InputLabel>
                  <Select
                    labelId="guests-label"
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    label="Number of Guests"
                  //  onChange={handleSelectChange} // Using specific handler
                  >
                    {guestOptions.map((number) => (
                      <MenuItem key={number} value={number}>
                        {number} {number === 1 ? "Guest" : "Guests"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  sx={buttonStyles}
              //    onClick={handleCheckAvailability}
                  fullWidth
                >
                  Check Availability
                </Button>
              </Box>
            </TransparentBox>
          </Grid>
        </Grid>
      </Container>
    </BackgroundContainer>
  );
}