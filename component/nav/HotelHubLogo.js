// components/XpointLogo.js
import { Box, Typography } from "@mui/material";
import { styled, keyframes } from "@mui/system";

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const glow = keyframes`
  0% {
    text-shadow: 0 0 5px #fff, 0 0 10px #ffb703, 0 0 20px #fb8500;
  }
  50% {
    text-shadow: 0 0 10px #fff, 0 0 25px #fb8500, 0 0 40px #ff006e;
  }
  100% {
    text-shadow: 0 0 5px #fff, 0 0 10px #ffb703, 0 0 20px #fb8500;
  }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  50% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
`;

const styles = [
  // 🔥 H → animation moved HERE
  {
    color: "#ff006e",
    fontSize: "2.7rem",
    fontWeight: "bold",
    textShadow: "2px 2px 4px #000",
    animation: `${rotate} 2s infinite`,
  },
  {
    color: "#8338ec",
    fontSize: "2rem",
    textDecoration: "underline",
    fontWeight: "bolder",
    transform: "skewX(-10deg)",
  },
  {
    color: "#3a86ff",
    fontSize: "2.3rem",
    fontStyle: "italic",
    textShadow: "2px 2px 4px #000",
  },
  {
    background: "linear-gradient(to right, #06d6a0, #118ab2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: "2rem",
    letterSpacing: "4px",
    textShadow: "2px 2px 4px #000",
    animation: `${pulse} 2s infinite`,
  },
  {
    background: "linear-gradient(to right, #ffd166, #ef476f)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: "2rem",
    letterSpacing: "4px",
    textShadow: "2px 2px 4px #000",
    animation: `${pulse} 2s infinite`,
  },
  {
    color: "#fb8500",
    fontSize: "2rem",
    textShadow: "2px 2px 4px #000",
    transform: "rotate(10deg)",
  },
  {
    background: "linear-gradient(to left, #ffbe0b, #ff006e)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: "2rem",
    fontWeight: "lighter",
    animation: `${glow} 1.5s infinite`,
  },
  {
    color: "#8d0801",
    fontSize: "2rem",
    textDecoration: "underline",
    fontWeight: "bolder",
    transform: "skewX(-10deg)",
  },
];

const StyledTypography = styled(Typography)``;

const XpointLogo = () => {
  const logoText = "Hotelhub";

  return (
    <Box display="flex">
      {logoText.split("").map((char, index) => (
        <StyledTypography key={index} sx={styles[index]}>
          {char}
        </StyledTypography>
      ))}
    </Box>
  );
};

export default XpointLogo;
