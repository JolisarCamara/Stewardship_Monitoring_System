import { useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CreateAdminButton = ({ onCreated }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleClose = () => setOpen(false);

  const handleCreate = async () => {
    await axios.post("/api/users/create-admin", {
      name,
      email,
      password,
      role: "admin"
    });

    onCreated(); 
    handleClose();
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6"
>
      <Button
        variant="contained"
        sx={{
          position: "absolute", 
          right: "2%", 
          top: "15.5%",
          width: 270,
          bgcolor: "#C9A227",
          "&:hover": { bgcolor: "#B8960F"
          },
        }}
        onClick={() => setOpen(true)}
      >
        + Create Admin Account
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          Create Admin Account
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 16, top: 16 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#415a77",
              "&:hover": { bgcolor: "#344966" },
            }}
            onClick={handleCreate}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateAdminButton;
