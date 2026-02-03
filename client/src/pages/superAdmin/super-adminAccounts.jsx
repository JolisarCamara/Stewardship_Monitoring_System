// SuperAdminAccounts.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import SettingsIcon from "@mui/icons-material/Settings";

import SearchInput from "../../components/ui/SearchInput";
import AccountListItem from "../../components/ui/AccountListItem";
import CreateSuperAdminButton from "./createAccounts/createSuperAdmin";

// MUI
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

const SuperAdminAccounts = () => {
  const [superAdmins, setSuperAdmins] = useState([]);
  const [search, setSearch] = useState("");

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedSuperAdmin, setSelectedSuperAdmin] = useState(null);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchSuperAdmins = async () => {
    const res = await axios.get("/api/users/super-admin-accounts");
    setSuperAdmins(res.data);
  };

  useEffect(() => {
    fetchSuperAdmins();
  }, []);

  const handleOpenEdit = (admin) => {
    setSelectedSuperAdmin(admin);
    setEditName(admin.name);
    setEditEmail(admin.email);
    setOpenEdit(true);
  };

  const handleOpenDelete = (admin) => {
    setSelectedSuperAdmin(admin);
    setOpenDelete(true);
  };

  const handleCloseDialogs = () => {
    setOpenEdit(false);
    setOpenDelete(false);
    setSelectedSuperAdmin(null);
  };

  const handleUpdate = async () => {
    await axios.put(`/api/users/${selectedSuperAdmin.id}`, {
      name: editName,
      email: editEmail,
    });
    fetchSuperAdmins();
    handleCloseDialogs();
  };

  const handleConfirmDelete = async () => {
    await axios.delete(`/api/users/${selectedSuperAdmin.id}`);
    fetchSuperAdmins();
    handleCloseDialogs();
  };

  const filtered = superAdmins.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
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
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3D5A80] mb-4">
        SUPER ADMIN ACCOUNTS
      </h1>

      <div className="flex items-center gap-2 mb-6">
        <p className="text-xs sm:text-sm text-gray-600">
          MANAGE SUPER ADMIN ACCOUNTS
        </p>
        <SettingsIcon className="text-gray-400" />
      </div>

      {/* SEARCH + CREATE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchInput onSearch={setSearch} />
        <CreateSuperAdminButton onCreated={fetchSuperAdmins} />
      </div>

      {/* LIST */}
      <div className="space-y-3 mt-6">
        {filtered.length ? (
          filtered.map((admin) => (
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
      borderRadius: "2.5rem",
      border: "4px solid #2D3E50",
      padding: "2rem",
      overflow: "hidden",
    },
  }}
>
  <DialogContent>
    <Stack spacing={3} alignItems="center">
      <IconButton
        onClick={handleCloseDialogs}
        sx={{ position: "absolute", right: 24, top: 24 }}
      >
        <CloseIcon />
      </IconButton>

      <img src="/logo.png" alt="Logo" className="h-24 w-auto object-contain" />

      <div className="text-center">
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#2D3E50" }}>
          Edit Super Admin
        </Typography>
        <Typography variant="body2" sx={{ color: "gray", mt: 0.5 }}>
          Please insert the details of the super admin
        </Typography>
      </div>

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
      </Stack>

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

      {/* DELETE */}
      <Dialog open={openDelete} onClose={handleCloseDialogs} fullScreen={isMobile}>
        <DialogTitle>Delete Super Admin</DialogTitle>
        <DialogContent>
          Delete <strong>{selectedSuperAdmin?.name}</strong>?
        </DialogContent>
        <DialogActions>
          <Button fullWidth={isMobile} onClick={handleCloseDialogs}>
            Cancel
          </Button>
          <Button fullWidth={isMobile} variant="contained" color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SuperAdminAccounts;