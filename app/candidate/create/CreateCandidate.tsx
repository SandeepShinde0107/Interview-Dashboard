"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCandidate } from "@/src/utils/candidateStore";
import { nanoid } from "nanoid";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import ProtectedRoute from "@/src/route/ProtectedRoute";
import {
  Box,
  Card,
  TextField,
  Typography,
  Button,
  MenuItem,
  Alert,
  Stack,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Paper,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

export default function CreateCandidate() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    designation: "",
  });
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const [error, setError] = useState("");

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.department ||
      !form.designation
    ) {
      setToast({
        open: true,
        message: "All fields are required.",
        severity: "error",
      });
      return;
    }

    const newCandidate = {
      id: nanoid(),
      ...form,
      status: "scheduled" as const,
    };

    createCandidate(newCandidate);
    setToast({
      open: true,
      message: "Candidate created successfully!",
      severity: "success",
    });
    setTimeout(() => {
      router.push("/candidate");
    }, 1200);
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "ta_member"]}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "grey.100",
          py: 6,
          px: { xs: 2, sm: 4 },
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card
          elevation={4}
          sx={{
            width: "100%",
            maxWidth: 720,
            p: 4,
            borderRadius: 4,
            bgcolor: "background.paper",
            boxShadow: (theme) => theme.shadows[5],
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={3}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => router.back()}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Back
              </Button>

              <Typography variant="h5" fontWeight={700}>
                Fill Candidate Details
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "grey.50",
              border: "1px solid",
              borderColor: "grey.200",
              mb: 3,
            }}
          >
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 2, fontWeight: 700, letterSpacing: 0.5 }}
            >
              Personal Information
            </Typography>

            <Stack spacing={3}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="First Name"
                  fullWidth
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                />
                <TextField
                  label="Last Name"
                  fullWidth
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                />
              </Stack>

              <TextField
                type="email"
                label="Email"
                fullWidth
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "grey.50",
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 2, fontWeight: 700, letterSpacing: 0.5 }}
            >
              Job Details
            </Typography>

            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  label="Department"
                  value={form.department}
                  onChange={(e) => update("department", e.target.value)}
                >
                  <MenuItem value="Engineering">Engineering</MenuItem>
                  <MenuItem value="Data">Data</MenuItem>
                  <MenuItem value="Product">Product</MenuItem>
                  <MenuItem value="Design">Design</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Designation</InputLabel>
                <Select
                  label="Designation"
                  value={form.designation}
                  onChange={(e) => update("designation", e.target.value)}
                >
                  <MenuItem value="Frontend Developer">
                    Frontend Developer
                  </MenuItem>
                  <MenuItem value="Backend Developer">
                    Backend Developer
                  </MenuItem>
                  <MenuItem value="FullStack Developer">
                    Fullstack Developer
                  </MenuItem>
                  <MenuItem value="Data Scientist">Data Scientist</MenuItem>
                  <MenuItem value="Product Manager">Product Manager</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Paper>

          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            size="large"
            onClick={handleSubmit}
            sx={{
              mt: 4,
              py: 1.4,
              fontSize: "1rem",
              fontWeight: 700,
              borderRadius: 3,
              textTransform: "none",
              boxShadow: 3,
              transition: "0.3s ease",
              ":hover": {
                boxShadow: 6,
                transform: "translateY(-2px)",
              },
            }}
            fullWidth
          >
            Save Candidate
          </Button>
          <Snackbar
            open={toast.open}
            autoHideDuration={2000}
            onClose={() => setToast((prev) => ({ ...prev, open: false }))}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              onClose={() => setToast((prev) => ({ ...prev, open: false }))}
              severity={toast.severity}
              sx={{ width: "100%" }}
            >
              {toast.message}
            </MuiAlert>
          </Snackbar>
        </Card>
      </Box>
    </ProtectedRoute >
  );
}
