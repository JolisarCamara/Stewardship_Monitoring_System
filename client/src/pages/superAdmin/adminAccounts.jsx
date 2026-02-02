import React, { useState, useEffect } from "react";
import axios from "axios";
import SettingsIcon from "@mui/icons-material/Settings";

//Mobile Version

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
import CloseIcon from '@mui/icons-material/Close';

const AdminAccounts = () => {
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");

  // Dialog states
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Edit form states
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Fetch admins
  const fetchAdmins = async () => {
    const res = await axios.get("/api/users/admin-accounts");
    setAdmins(res.data);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Open dialogs
  const handleOpenEdit = (admin) => {
    setSelectedAdmin(admin);
    setEditName(admin.name);
    setEditEmail(admin.email);
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

  // Update admin
  const handleUpdate = async () => {
    await axios.put(`/api/users/${selectedAdmin.id}`, {
      name: editName,
      email: editEmail,
    });
    fetchAdmins();
    handleCloseDialogs();
  };

  // Delete admin
  const handleConfirmDelete = async () => {
    await axios.delete(`/api/users/${selectedAdmin.id}`);
    fetchAdmins();
    handleCloseDialogs();
  };

  // Search filter
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(search.toLowerCase()) ||
      admin.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#3D5A80] mb-6">
        ADMIN ACCOUNTS
      </h1>

      <div className="flex items-center gap-2 mb-4">
        <p className="text-gray-600">MANAGE ADMIN ACCOUNTS</p>
        <SettingsIcon className="text-gray-400" />
      </div>

      <SearchInput onSearch={setSearch} />
      <CreateAdminButton onCreated={fetchAdmins} />

      <div className="space-y-3 mt-6">
        {filteredAdmins.length > 0 ? (
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
          <div className="bg-white/50 border-2  border-gray-300 rounded-2xl py-12 text-center">
            <p className="text-gray-400 text-sm font-medium">No account found </p>
          </div>
        )}
    </div>
      {/* ================= EDIT DIALOG ================= */}
              <Dialog 
          open={openEdit} 
          onClose={handleCloseDialogs} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: { borderRadius: '28px', p: 2 } // Matches the rounded corners in image_2d7d2a.png
          }}
        >
          <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
            <IconButton
              onClick={handleCloseDialogs}
              sx={{ position: "absolute", right: 20, top: 20, color: 'gray' }}
            >
              <CloseIcon />
            </IconButton>
            
            {/* Fingerprint Logo from image_2d7d2a.png */}
            <div className="flex justify-center mb-4">
              <img src="/logo.png" alt="Logo" className="h-24 w-auto" />
            </div>

            <h2 className="text-2xl font-bold text-[#24324D] mb-1">Edit Admin Details</h2>
            <p className="text-sm text-gray-500 font-normal">Please update the information for this administrator</p>
          </DialogTitle>

          <DialogContent sx={{ border: 'none', px: 4 }}>
            <Stack spacing={2.5} mt={2}>
              <TextField
                placeholder="Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                fullWidth
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    bgcolor: '#F3F4F6', // Light gray background from image_2d7d2a.png
                    borderRadius: '12px',
                    px: 2,
                    py: 1,
                    fontSize: '0.9rem'
                  }
                }}
              />
              <TextField
                placeholder="Email Address"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                fullWidth
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    bgcolor: '#F3F4F6',
                    borderRadius: '12px',
                    px: 2,
                    py: 1,
                    fontSize: '0.9rem'
                  }
                }}
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ justifyContent: 'center', pb: 5, pt: 3 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                mx: 4,
                py: 1.5,
                bgcolor: "#24324D", // Navy blue from image_2d7d2a.png
                borderRadius: "12px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "1px",
                "&:hover": { bgcolor: "#1a263e" }
              }}
              onClick={handleUpdate}
            >
              Confirm Update
            </Button>
          </DialogActions>
        </Dialog>

      {/* ================= DELETE DIALOG ================= */}
      <Dialog open={openDelete} onClose={handleCloseDialogs}>
        <DialogTitle>Delete Admin</DialogTitle>

        <DialogContent>
          Are you sure you want to delete{" "}
          <strong>{selectedAdmin?.name}</strong>?
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button
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
