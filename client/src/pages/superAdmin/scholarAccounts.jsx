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
import CloseIcon from "@mui/icons-material/Close";
import { Tooltip, Box, Typography } from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const ScholarAccounts = () => {
  const [scholars, setScholars] = useState([]);
  const [search, setSearch] = useState("");

  const [openInfo, setOpenInfo] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedScholars, setSelectedScholars] = useState(null);

  const [editFormData, setEditFormData] = useState({
    name: "",
    password: "",
    email: "",
    student_id: "",
    course: "",
    year_level: "",
    designation: "",
    committed_day: "",
    committed_time: "",
    required_stewardship_hours: "",
    counterpart: "",
    coordinator: ""
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchScholars = async () => {
    try {
      const res = await axios.get("/api/users/scholar-accounts");
      setScholars(res.data);
    } catch (err) {
      console.error("Error fetching scholars:", err);
    }
  };

  useEffect(() => {
    fetchScholars();
  }, []);

  const handleOpenEdit = (scholar) => {
    setSelectedScholars(scholar);
    setEditFormData(scholar); 
    setOpenEdit(true);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleOpenDelete = (scholar) => {
    setSelectedScholars(scholar);
    setOpenDelete(true);
  };

  const handleCloseDialogs = () => {
    setOpenEdit(false);
    setOpenDelete(false);
    setOpenInfo(false);
    setSelectedScholars(null);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/users/${selectedScholars.id}`, editFormData);
      fetchScholars();
      handleCloseDialogs();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/api/users/${selectedScholars.id}`);
      fetchScholars();
      handleCloseDialogs();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredScholars = scholars.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  const InfoPreview = ({ s }) => (
    <Box sx={{ p: 1 }}>
      <Typography variant="caption" display="block"><strong>Student ID:</strong> {s.student_id}</Typography>
      <Typography variant="caption" display="block"><strong>Course:</strong> {s.course}</Typography>
      <Typography variant="caption" display="block"><strong>Coordinator:</strong> {s.coordinator}</Typography>
      <Typography variant="caption" display="block"><strong>Hours:</strong> {s.required_stewardship_hours} hrs</Typography>
    </Box>
  );

  const inputStyle = { bgcolor: "#F5F5F5", borderRadius: "12px", px: 2, py: 1, "& .MuiInputBase-input": { fontSize: "0.85rem" } };

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6">
      {/* HEADER */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3D5A80] mb-4">
        SCHOLAR ACCOUNTS
      </h1>

      <div className="flex items-center gap-2 mb-6">
        <p className="text-xs sm:text-sm text-gray-600">MANAGE SCHOLAR ACCOUNTS</p>
        <SettingsIcon className="text-gray-400" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchInput onSearch={setSearch} />
        <CreateScholarButton onCreated={fetchScholars} />
      </div>

      {/* LIST */}
      <div className="space-y-3 mt-6">
        {filteredScholars.length > 0 ? (
          filteredScholars.map((scholar) => (
            <Tooltip
              key={scholar.id}
              title={<InfoPreview s={scholar} />}
              arrow
              placement="top-start"
            >
              <div 
                onClick={() => { setSelectedScholars(scholar); setOpenInfo(true); }} 
                className="cursor-pointer"
              >
                <AccountListItem
                  name={scholar.name}
                  email={scholar.email}
                  onEdit={(e) => { 
                    e.stopPropagation(); 
                    handleOpenEdit(scholar); 
                  }}
                  onDelete={(e) => { 
                    e.stopPropagation(); 
                    handleOpenDelete(scholar); 
                  }}
                />
              </div>
            </Tooltip>
          ))
        ) : (
          <div className="border rounded-xl py-12 text-center text-gray-400">
            No account found
          </div>
        )}
      </div>

      {/* SCHOLAR INFORMATION DIALOG (Clicked) */}
      <Dialog 
        open={openInfo} 
        onClose={handleCloseDialogs} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{sx: { borderRadius: "2.5rem", border: "4px solid #2D3E50", padding: "2rem" }}}
      >
        <DialogContent>
          <Stack spacing={3} alignItems="center">
            <img src="/logo.png" alt="Logo" className="w-40 h-32 object-contain" />
            <IconButton onClick={handleCloseDialogs} sx={{ position: "absolute", right: 24, top: 24 }}>
              <CloseIcon />
            </IconButton>

            <div style={{ textAlign: "center" }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#2D3E50" }}>
                Scholar Information
              </Typography>
            </div>

            {selectedScholars && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 w-full text-sm mt-2">
                <p><strong>Student ID:</strong> {selectedScholars.student_id}</p>
                <p><strong>Course/Year:</strong> {selectedScholars.course} - {selectedScholars.year_level}</p>
                <p><strong>Designation:</strong> {selectedScholars.designation}</p>
                <p><strong>Hours:</strong> {selectedScholars.required_stewardship_hours}</p>
                <p><strong>Coordinator:</strong> {selectedScholars.coordinator}</p>
                <p><strong>Counterpart:</strong> ₱{selectedScholars.counterpart}</p>
                <p className="sm:col-span-2"><strong>Schedule:</strong> {selectedScholars.committed_day} ({selectedScholars.committed_time})</p>
              </div>
            )}
          </Stack>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
              <Dialog
          open={openEdit}
          onClose={handleCloseDialogs}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "2.5rem", // Extra rounded corners from your image
              border: "4px solid #2D3E50", // The thick navy border
              padding: "2rem",
              overflow: "hidden",
            },
          }}
        >
          <DialogContent>
            <Stack spacing={3} alignItems="center">
              {/* Close Icon */}
              <IconButton 
                onClick={handleCloseDialogs} 
                sx={{ position: "absolute", right: 24, top: 24 }}
              >
                <CloseIcon />
              </IconButton>

              {/* Centered Logo/Icon */}
              <img src="/logo.png" alt="Logo" className="h-24 w-auto object-contain" />

              {/* Header Text */}
              <div className="text-center">
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#2D3E50" }}>
                  Edit Scholar Account
                </Typography>
                <Typography variant="body2" sx={{ color: "gray", mt: 0.5 }}>
                  Please insert the details of the scholar
                </Typography>
              </div>

              {/* Compact Inputs */}
              <Stack spacing={1.5} width="100%" sx={{ mt: 1 }}>
                <TextField
                  name="name"
                  value={editFormData.name || ""}
                  onChange={handleEditChange}
                  placeholder="Name"
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  sx={inputStyle}
                />
                <TextField
                  name="email"
                  value={editFormData.email || ""}
                  onChange={handleEditChange}
                  placeholder="Email Address"
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  sx={inputStyle}
                />
              </Stack>

              {/* Centered Confirm Button */}
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  bgcolor: "#2D3E50",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "12px",
                  py: 1.5,
                  width: "60%", // Shorter width to match screenshot
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
      <Dialog open={openDelete} onClose={handleCloseDialogs}>
        <DialogTitle>Delete Scholar</DialogTitle>
        <DialogContent>
          Delete <strong>{selectedScholars?.name}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ScholarAccounts;