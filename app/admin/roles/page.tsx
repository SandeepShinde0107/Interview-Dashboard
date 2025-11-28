"use client";

import {
  Box,
  Card,
  TextField,
  Typography,
  Button,
  MenuItem,
  Stack,
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  listInterviewers,
  createInterviewer,
  updateInterviewer,
  deleteInterviewer,
  type User,
  type UserRole,
} from "@/src/utils/interviewerStore";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function RolesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const {user, logout} = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "panelist" | "ta_member">("panelist");
  const router = useRouter();
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const load = () => setUsers(listInterviewers());

  useEffect(() => {
    load();
    const listener = () => load();
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  const showToast = (m: string, s: "success" | "error") =>
    setToast({ open: true, message: m, severity: s });

  const handleAdd = () => {
    if (!name.trim() || !email.trim())
      return showToast("Name and email are required", "error");

    createInterviewer({ name, email, role });

    showToast("User added successfully", "success");
    setName("");
    setEmail("");
    setRole("ta_member");
    load();
  };

  const handleRoleChange = (id: string, newRole: UserRole) => {
    updateInterviewer(id, { role: newRole as any });
    load();
    showToast("Role updated", "success");
  };

  const handleDelete = (id: string) => {
    deleteInterviewer(id);
    load();
    showToast("User deleted", "success");
  };

  return (
    <Box p={4} sx={{ minHeight: "100vh", bgcolor: "grey.100" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        mb={4}
        alignItems="center"
      >
        <Box>
          <Typography variant="h4" fontWeight={700} color="grey.900">
            Welcome, {user?.username}
          </Typography>
          <Typography color="grey.600">
            Overview of your Roles activity
          </Typography>
        </Box>

        <Stack alignItems="flex-end">
          <Typography color="grey.700" mb={1}>
            Role:{" "}
            <strong style={{ color: "#1976d2" }}>
              {user?.role?.toUpperCase()}
            </strong>
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
      <Card sx={{ p: 3, borderRadius: 3, mb: 4 }}>
         <Box display="flex" alignItems="center" gap={2} mb={2}>
          <IconButton
            onClick={() => router.push("/dashboard")}
            sx={{
              bgcolor: "primary.main",
              color: "#fff",
              transition: "0.25s ease",
              ":hover": {
                bgcolor: "primary.dark",
                transform: "translateX(-4px)",
                boxShadow: 4,
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="h5" fontWeight={700}>
            Roles Dashboard
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={3}>
          <TextField
            fullWidth
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            select
            fullWidth
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "panelist" | "ta_member")}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="panelist">Panelist</MenuItem>
            <MenuItem value="ta_member">TA Member</MenuItem>
          </TextField>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ minWidth: "140px" }}
          >
            Add User
          </Button>
        </Stack>
      </Card>

      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" mb={2} fontWeight={600}>
          Users List
        </Typography>

        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: "grey.200" }}>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      value={u.role}
                      onChange={(e) =>
                        handleRoleChange(u.id, e.target.value as unknown as UserRole)
                      }
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="panelist">Panelist</MenuItem>
                      <MenuItem value="ta_member">TA Member</MenuItem>
                    </TextField>
                  </TableCell>

                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(u.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      
      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert severity={toast.severity} variant="filled">
          {toast.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
