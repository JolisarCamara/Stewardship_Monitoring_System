// adminAccounts.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import SettingsIcon from "@mui/icons-material/Settings";

import SearchInput from "../../components/ui/SearchInput";
import AccountListItem from "../../components/ui/AccountListItem";
import CreateAdminButton from "./createAccounts/createAdmin";

// MUI Dialog imports
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { MenuItem, Select, FormControl } from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const AdminAccounts = () => {
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const [editPlacement, setEditPlacement] = useState("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [placements, setPlacements] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchAdmins = async () => {
    const res = await axios.get("/api/users/admin-accounts");
    setAdmins(res.data);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);
  
  useEffect(() => {
  if (openEdit) {
    axios.get("/api/users/admin-placements")
      .then(res => setPlacements(res.data))
      .catch(err => console.error(err));
  }
}, [openEdit]);

  const handleOpenEdit = (admin) => {
  setSelectedAdmin(admin);
  setEditName(admin.name);
  setEditEmail(admin.email);
  setEditPlacement(admin.coordinator_placement || ""); 
  setOpenEdit(true);
};

  const handleOpenDelete = (admin) => {
    setSelectedAdmin(admin);
    setOpenDelete(true);
  };

  const handleCloseDialogs = () => {
    setOpenEdit(false);
    setOpenDelete(false);
    setSelectedAdmin(null);
  };

 const handleUpdate = async () => {
  try {
    await axios.put(`/api/users/update-admin/${selectedAdmin.id}`, {
      name: editName,
      email: editEmail,
      coordinator_placement: editPlacement, // You were missing this!
    });
    fetchAdmins();
    handleCloseDialogs();
  } catch (error) {
    console.error("Error updating admin:", error);
    alert("Failed to update admin.");
  }
};

  const handleConfirmDelete = async () => {
    await axios.delete(`/api/users/${selectedAdmin.id}`);
    fetchAdmins();
    handleCloseDialogs();
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(search.toLowerCase()) ||
      admin.email.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = {
  bgcolor: "#F5F5F5",
  borderRadius: "12px",
  px: 2,
  py: 1,
  width: "100%",
  "& .MuiInputBase-input": {
    fontSize: "0.95rem",
  },
};

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6">
      {/* HEADER */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3D5A80] mb-4">
        ADMIN ACCOUNTS
      </h1>

      <div className="flex items-center gap-2 mb-6">
        <p className="text-xs sm:text-sm text-gray-600">
          MANAGE ADMIN ACCOUNTS
        </p>
        <SettingsIcon className="text-gray-400" />
      </div>

      {/* SEARCH + CREATE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchInput onSearch={setSearch} />
        <CreateAdminButton onCreated={fetchAdmins} />
      </div>

      {/* LIST */}
      <div className="space-y-3 mt-6">
        {filteredAdmins.length ? (
          filteredAdmins.map((admin) => (
            <AccountListItem
              key={admin.id}
              name={admin.name}
              email={admin.email}
              onEdit={() => handleOpenEdit(admin)}
              onDelete={() => handleOpenDelete(admin)}
            />
          ))
        ) : (
          <div className="border rounded-xl py-12 text-center text-gray-400">
            No account found
          </div>
        )}
      </div>

      {/* EDIT DIALOG */}
  <Dialog
  open={openEdit}
  onClose={handleCloseDialogs}
  fullScreen={isMobile}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: "2.5rem", // Extra rounded corners
      border: "4px solid #2D3E50", // Thick navy border
      padding: "2rem",
      overflow: "hidden",
    },
  }}
>
  <DialogContent>
    <Stack spacing={3} alignItems="center">
      {/* Close Button */}
      <IconButton
        onClick={handleCloseDialogs}
        sx={{ position: "absolute", right: 24, top: 24 }}
      >
        <CloseIcon />
      </IconButton>

      {/* Centered Logo */}
      <img src="/logo.png" alt="Logo" className="h-24 w-auto object-contain" />

      {/* Centered Header Text */}
      <div className="text-center">
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#2D3E50" }}>
          Edit Admin
        </Typography>
        <Typography variant="body2" sx={{ color: "gray", mt: 0.5 }}>
          Please insert the details of the admin
        </Typography>
      </div>

      {/* Input Fields - Matching the clean, gray style */}
      <Stack spacing={1.5} width="100%" sx={{ mt: 1 }}>
        <TextField
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder="Name"
          variant="standard"
          InputProps={{ disableUnderline: true }}
          sx={inputStyle}
        />
        <TextField
          value={editEmail}
          onChange={(e) => setEditEmail(e.target.value)}
          placeholder="Email Address"
          variant="standard"
          InputProps={{ disableUnderline: true }}
          sx={inputStyle}
        />
          <FormControl fullWidth sx={inputStyle}>
            <Select
              value={editPlacement}
              onChange={(e) => setEditPlacement(e.target.value)}
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

      {/* Navy Confirm Button - Centered and 60% width */}
      <Button
        variant="contained"
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
        onClick={handleUpdate}
      >
        CONFIRM
      </Button>
    </Stack>
  </DialogContent>
</Dialog>

      {/* DELETE DIALOG */}
      <Dialog
        open={openDelete}
        onClose={handleCloseDialogs}
        fullScreen={isMobile}
      >
        <DialogTitle>Delete Admin</DialogTitle>
        <DialogContent>
          Delete <strong>{selectedAdmin?.name}</strong>?
        </DialogContent>
        <DialogActions>
          <Button fullWidth={isMobile} onClick={handleCloseDialogs}>
            Cancel
          </Button>
          <Button
            fullWidth={isMobile}
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminAccounts;