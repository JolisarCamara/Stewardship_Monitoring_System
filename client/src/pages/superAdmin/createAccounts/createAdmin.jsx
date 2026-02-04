import { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  Stack,
  Typography,
  IconButton,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CreateAdminButton = ({ onCreated }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // New States for Placements
  const [placements, setPlacements] = useState([]);
  const [selectedPlacement, setSelectedPlacement] = useState("");

  // Fetch placements from the backend
  const fetchPlacements = async () => {
    try {
      const response = await axios.get("/api/users/admin-placements"); // Adjust path as needed
      setPlacements(response.data);
    } catch (error) {
      console.error("Error fetching placements:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchPlacements();
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    // Reset fields
    setName("");
    setEmail("");
    setPassword("");
    setSelectedPlacement("");
  };

  const handleCreate = async () => {
    try {
      await axios.post("/api/users/create-admin", {
        name,
        email,
        password,
        role: "admin",
        // Sending the string name as your backend logic expects
        coordinator_placement: selectedPlacement, 
      });
      onCreated();
      handleClose();
    } catch (error) {
      alert(error.response?.data?.message || "Error creating admin");
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
            borderRadius: "2.5rem",
            border: "4px solid #2D3E50",
            padding: "2rem",
            overflow: "hidden",
          },
        }}
      >
        <DialogContent>
          <Stack spacing={3} alignItems="center">
            <img src="/logo.png" alt="Logo" className="w-50 h-40" />
            <IconButton
              onClick={handleClose}
              sx={{ position: "absolute", right: 16, top: 16 }}
            >
              <CloseIcon />
            </IconButton>

            <div style={{ textAlign: "center" }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#2D3E50" }}>
                Add New Admin
              </Typography>
              <Typography variant="body2" sx={{ color: "gray", mt: 1 }}>
                Please insert the details of the new admin
              </Typography>
            </div>

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

              {/* Placement Selector */}
              <FormControl fullWidth sx={inputStyle}>
                <Select
                  value={selectedPlacement}
                  onChange={(e) => setSelectedPlacement(e.target.value)}
                  displayEmpty
                  variant="standard"
                  disableUnderline
                  sx={{ fontSize: "0.95rem" }}
                >
                  <MenuItem value="" disabled>
                    <span style={{ color: "#aaa" }}>Select Coordinator Placement</span>
                  </MenuItem>
                  {placements.map((p) => (
                    <MenuItem key={p.placement_id} value={p.coordinator_placement}>
                      {p.coordinator_placement}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

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
              disabled={!name || !email || !password || !selectedPlacement}
            >
              CONFIRM
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const inputStyle = {
  bgcolor: "#F5F5F5",
  borderRadius: "12px",
  px: 2,
  py: 0.5, // Reduced padding slightly to accommodate Select height
  "& .MuiInputBase-input": {
    fontSize: "0.95rem",
    py: 1.5 // Standardizing height
  }
};

export default CreateAdminButton;