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
        {filteredSuperAdmins.map((superAdmins) => (
          <AccountListItem
            key={superAdmins.id}
            name={superAdmins.name}
            email={superAdmins.email}
            onEdit={() => handleOpenEdit(superAdmins)}
            onDelete={() => handleOpenDelete(superAdmins)}
          />
        ))}
      </div>

      {/* ================= EDIT DIALOG ================= */}
      <Dialog open={openEdit} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
        <DialogTitle  sx={{ fontWeight: 600 }}>
          Edit Super-Admin
          <IconButton onClick={handleCloseDialogs}
          sx={{ position: "absolute", right: 16, top: 16 }} >
            <CloseIcon/>
          </IconButton>
          </DialogTitle>

        <DialogContent className="flex flex-col gap-4 mt-2" dividers>
          <Stack spacing={2} mt={1}>
          <TextField
            label="Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="bg-gray-50 border-gray-200"
            fullWidth
          />
          <TextField
            label="Email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            fullWidth
          />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button 
          variant="contained" 
          sx={{
            bgcolor: "#415a77",
            "&:hover": { bgcolor: "#344966" }
          }}
          onClick={handleUpdate}
          >

            Save
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
