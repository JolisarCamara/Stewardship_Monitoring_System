import React, { useState, useEffect } from "react";
import axios from "axios";
import SettingsIcon from "@mui/icons-material/Settings";

import SearchInput from "../../components/ui/SearchInput";
import AccountListItem from "../../components/ui/AccountListItem";
import CreateSuperAdminButton from "./createAccounts/createSuperAdmin";

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

const SuperAdminAccounts = () => {
  const [superAdmins, setSuperAdmins] = useState([]);
  const [search, setSearch] = useState("");

  // Ui Dialog
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedSuperAdmins, setSelectedSuperAdmins] = useState(null);

  // Edit form
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Fetch Super-admins
  const fetchSuperAdmins = async () => {
    const res = await axios.get("/api/users/super-admin-accounts");
    setSuperAdmins(res.data);
  };

  useEffect(() => {
    fetchSuperAdmins();
  }, []);

  // Open dialogs
  const handleOpenEdit = (superAdmins) => {
    setSelectedSuperAdmins(superAdmins);
    setEditName(superAdmins.name);
    setEditEmail(superAdmins.email);
    setOpenEdit(true);
  };

  const handleOpenDelete = (superAdmins) => {
    setSelectedSuperAdmins(superAdmins);
    setOpenDelete(true);
  };

  const handleCloseDialogs = () => {
    setOpenEdit(false);
    setOpenDelete(false);
    setSelectedSuperAdmins(null);
  };

  // Update Super-admin
  const handleUpdate = async () => {
    await axios.put(`/api/users/${selectedSuperAdmins.id}`, {
      name: editName,
      email: editEmail,
    });
    fetchSuperAdmins();
    handleCloseDialogs();
  };

  // Delete Super-admin
  const handleConfirmDelete = async () => {
    await axios.delete(`/api/users/${selectedSuperAdmins.id}`);
    fetchSuperAdmins();
    handleCloseDialogs();
  };

  // Search filter
  const filteredSuperAdmins = superAdmins.filter(
    (superAdmins) =>
      superAdmins.name.toLowerCase().includes(search.toLowerCase()) ||
      superAdmins.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#3D5A80] mb-6">
        SUPER ADMIN ACCOUNTS
      </h1>

      <div className="flex items-center gap-2 mb-4">
        <p className="text-gray-600">MANAGE SUPER ADMIN ACCOUNTS</p>
        <SettingsIcon className="text-gray-400" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
      <SearchInput onSearch={setSearch} /> 
      <CreateSuperAdminButton onCreated={fetchSuperAdmins} />
        </div>
      </div>
      
    
      <div className="space-y-3 mt-6">
         {filteredSuperAdmins.length > 0 ? (
           filteredSuperAdmins.map((superAdmins) => (
            <AccountListItem
              key={superAdmins.id}
              name={superAdmins.name}
              email={superAdmins.email}
              onEdit={() => handleOpenEdit(superAdmins)}
              onDelete={() => handleOpenDelete(superAdmins)}
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

          <h2 className="text-2xl font-bold text-[#24324D] mb-1">Edit Super Admin Details</h2>
          <p className="text-sm text-gray-500 font-normal">Please update the information for this super administrator</p>
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
        <DialogTitle>Delete Super-Admin</DialogTitle>

        <DialogContent>
          Are you sure you want to delete{" "}
          <strong>{selectedSuperAdmins?.name}</strong>?
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

export default SuperAdminAccounts;
