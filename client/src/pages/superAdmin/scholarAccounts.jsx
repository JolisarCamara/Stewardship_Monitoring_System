import React, { useState, useEffect } from "react";
import axios from "axios";
import SettingsIcon from "@mui/icons-material/Settings";

import SearchInput from "../../components/ui/SearchInput";
import AccountListItem from "../../components/ui/AccountListItem";
import CreateScholarButton from "./createAccounts/createScholar";

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

const ScholarAccounts = () => {
  const [scholars, setScholars] = useState([]);
  const [search, setSearch] = useState("");

  // Ui Dialog
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedScholars, setSelectedScholars] = useState(null);

  // Edit form
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Get Scholar Accounts
  const fetchScholars = async () => {
    const res = await axios.get("/api/users/scholar-accounts");
    setScholars(res.data);
  };

  useEffect(() => {
    fetchScholars();
  }, []);

  // Open dialogs
  const handleOpenEdit = (scholars) => {
    setSelectedScholars(scholars);
    setEditName(scholars.name);
    setEditEmail(scholars.email);
    setOpenEdit(true);
  };

  const handleOpenDelete = (scholars) => {
    setSelectedScholars(scholars);
    setOpenDelete(true);
  };

  const handleCloseDialogs = () => {
    setOpenEdit(false);
    setOpenDelete(false);
    setSelectedScholars(null);
  };

  // Update Scholars
  const handleUpdate = async () => {
    await axios.put(`/api/users/${selectedScholars.id}`, {
      name: editName,
      email: editEmail,
    });
    fetchScholars();
    handleCloseDialogs();
  };

  // Delete Scholars
  const handleConfirmDelete = async () => {
    await axios.delete(`/api/users/${selectedScholars.id}`);
    fetchScholars();
    handleCloseDialogs();
  };

  // Search filter
  const filteredScholars = scholars.filter(
    (scholars) =>
      scholars.name.toLowerCase().includes(search.toLowerCase()) ||
      scholars.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#3D5A80] mb-6">
        SCHOLAR ACCOUNTS
      </h1>

      <div className="flex items-center gap-2 mb-4">
        <p className="text-gray-600">MANAGE SCHOLAR ACCOUNTS</p>
        <SettingsIcon className="text-gray-400" />
        <CreateScholarButton onCreated={fetchScholars} />
      </div>

      <SearchInput onSearch={setSearch} />

      <div className="space-y-3 mt-6">
              {filteredScholars.length > 0 ? (
                filteredScholars.map((scholars) => (
                  <AccountListItem
                    key={scholars.id}
                    name={scholars.name}
                    email={scholars.email}
                    onEdit={() => handleOpenEdit(scholars)}
                    onDelete={() => handleOpenDelete(scholars)}
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

                  <h2 className="text-2xl font-bold text-[#24324D] mb-1">Edit Scholar Details</h2>
                  <p className="text-sm text-gray-500 font-normal">Please update the information for this scholar</p>
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
        <DialogTitle>Delete Scholar</DialogTitle>

        <DialogContent>
          Are you sure you want to delete{" "}
          <strong>{selectedScholars?.name}</strong>?
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

export default ScholarAccounts;
