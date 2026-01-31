import React, { useState, useEffect } from "react";
import axios from "axios";
import SettingsIcon from "@mui/icons-material/Settings";

import SearchInput from "../../components/ui/SearchInput";
import AccountListItem from "../../components/ui/AccountListItem";

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

const AdminPage = () => {
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

      <div className="space-y-3 mt-6">
        {filteredAdmins.map((admin) => (
          <AccountListItem
            key={admin.id}
            name={admin.name}
            email={admin.email}
            onEdit={() => handleOpenEdit(admin)}
            onDelete={() => handleOpenDelete(admin)}
          />
        ))}
      </div>

      {/* ================= EDIT DIALOG ================= */}
      <Dialog open={openEdit} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
        <DialogTitle  sx={{ fontWeight: 600 }}>
          Edit Admin
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

export default AdminPage;
