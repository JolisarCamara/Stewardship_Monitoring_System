import React, { useEffect, useState } from "react";
import axios from "axios";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { div } from "framer-motion/client";

/* ================= STYLES ================= */

const StatRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
  padding: theme.spacing(3, 3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  fontWeight: 600,
  width: 520,
}));

const StatValue = styled("div")(({ theme }) => ({
  ...theme.typography.h1,
  fontWeight: 700,
  color: "#1a2b4b",     
  textAlign: "center",
  lineHeight: 1,       
  marginTop: theme.spacing(1),
}));

const StatUnit = styled("div")(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  textAlign: "center",
  textTransform: "uppercase", // Matches the "TOTAL SCHOLARS" style
  fontWeight: 600,
  letterSpacing: "0.05em",
  fontSize: "20px",

}));

/* ================= COMPONENT ================= */

const Stat = ({ value, unit }) => (
  <StatRoot>
    <StatUnit>{unit}</StatUnit>
    <StatValue>{value}</StatValue>
  </StatRoot>
);

export default function TotalAccounts() {
  const [stats, setStats] = useState({
    totalScholars: 0,
    totalAdmins: 0,
    totalSuperAdmins: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await axios.get("/api/users/stats");
      setStats(res.data);
    };

    fetchStats();
  }, []);

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
      <Stat value={stats.totalScholars} unit="SCHOLARS" />
      <Stat value={stats.totalAdmins} unit="ADMINS" />
      <Stat value={stats.totalSuperAdmins} unit="SUPER ADMIN" />
    </Stack>
  );
}
