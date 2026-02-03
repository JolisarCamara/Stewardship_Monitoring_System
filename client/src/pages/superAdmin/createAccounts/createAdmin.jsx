import { useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CreateAdminButton = ({ onCreated }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleClose = () => setOpen(false);

  const handleCreate = async () => {
    try {
      await axios.post("/api/users/create-admin", {
        name,
        email,
        password,
        role: "admin",
      });
      onCreated();
      handleClose();
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error creating admin:", error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
              <Button
            variant="contained"
            fullWidth
            sx={{
              maxWidth: 260,
              bgcolor: "#C9A227",
              borderRadius: "8px",
              "&:hover": { bgcolor: "#B8960F" },
            }}
            onClick={() => setOpen(true)}
          >
            + Create Admin Account
          </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "2.5rem", // Very rounded corners
            border: "4px solid #2D3E50", // The thick navy border
            padding: "2rem",
            overflow: "hidden",
          },
        }}
      >
        <DialogContent>
          <Stack spacing={3} alignItems="center">
            {/* Logo */}
            <img src="/logo.png" alt="Logo" className="w-50 h-40" />
            <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 16, top: 16 }}  
          >
            <CloseIcon/>
            </IconButton>

            <div style={{ textAlign: "center" }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#2D3E50" }}>
                Add New Admin
              </Typography>
              <Typography variant="body2" sx={{ color: "gray", mt: 1 }}>
                Please insert the details of the new admin
              </Typography>
            </div>

            {/* Inputs styled to match the image */}
            <Stack spacing={2} width="100%" mt={2}>
              <TextField
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="standard"
                InputProps={{ disableUnderline: true }}
                sx={inputStyle}
              />
              <TextField
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="standard"
                InputProps={{ disableUnderline: true }}
              sx={inputStyle}
              />
              <TextField
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="standard"
                InputProps={{ disableUnderline: true }}
                sx={inputStyle}
              />
            </Stack>

            {/* Confirm Button */}
            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                bgcolor: "#2D3E50",
                color: "white",
                fontWeight: "bold",
                borderRadius: "12px",
                py: 1.5,
                width: "60%",
                letterSpacing: "1px",
                "&:hover": { bgcolor: "#1e2a36" },
              }}
              onClick={handleCreate}
            >
              CONFIRM
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Custom style for the fields to get that light-gray "borderless" look
const inputStyle = {
  bgcolor: "#F5F5F5",
  borderRadius: "12px",
  px: 2,
  py: 1,
  "& .MuiInputBase-input": {
    fontSize: "0.95rem",
  }
};

export default CreateAdminButton;


