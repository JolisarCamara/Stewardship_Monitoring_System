// createAccounts/createSuperAdmin.jsx
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
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const CreateSuperAdminButton = ({ onCreated }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClose = () => setOpen(false);

  const handleCreate = async () => {
    try {
      await axios.post("/api/auth/register-super-admin", {
        name,
        email,
        password,
        role: "super-admin",
      });
      onCreated();
      handleClose();
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error creating super-admin:", error);
    }
  };

  return (
    <div  className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
      {/* BUTTON */}
      <Button
        variant="contained"
        fullWidth={isMobile}
        sx={{
          maxWidth: 260,
          bgcolor: "#C9A227",
          textTransform: "none",
          borderRadius: "8px",
          "&:hover": { bgcolor: "#B8960F" },
        }}
        onClick={() => setOpen(true)}
      >
        + Create Super Admin Account
      </Button>

      {/* DIALOG */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : "2.5rem",
            border: isMobile ? "none" : "4px solid #2D3E50",
            p: isMobile ? 2 : 4,
          },
        }}
      >
        <DialogContent>
          <Stack spacing={3} alignItems="center">
            <IconButton
              onClick={handleClose}
              sx={{ position: "absolute", right: 16, top: 16 }}
            >
              <CloseIcon />
            </IconButton>

            <img src="/logo.png" alt="Logo" className="h-32" />

            <div className="text-center">
              <Typography variant="h5" fontWeight={800}>
                Add New Super Admin
              </Typography>
              <Typography variant="body2" color="gray">
                Please insert the details of the new super admin
              </Typography>
            </div>

            <Stack spacing={2} width="100%">
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

            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: "#2D3E50",
                fontWeight: "bold",
                borderRadius: "12px",
                py: 1.5,
                maxWidth: 300,
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

const inputStyle = {
  bgcolor: "#F5F5F5",
  borderRadius: "12px",
  px: 2,
  py: 1,
};

export default CreateSuperAdminButton;