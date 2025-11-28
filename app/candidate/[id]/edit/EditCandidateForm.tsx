"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { getCandidate, updateCandidate } from "@/src/utils/candidateStore";

export default function EditCandidateForm({ id }: { id: string }) {
    const router = useRouter();
    const candidateId = id;
    const isEdit = Boolean(candidateId);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        department: "",
        designation: "",
        status: "scheduled" as "scheduled" | "completed" | "cancelled",
    });
    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error" | "warning" | "info",
    });


    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isEdit) return;

        const existingCandidate = getCandidate(candidateId);
        if (!existingCandidate) {
            setError("Candidate not found");
            return;
        }

        setForm({
            firstName: existingCandidate.firstName,
            lastName: existingCandidate.lastName,
            email: existingCandidate.email ?? "",
            department: existingCandidate.department ?? "",
            designation: existingCandidate.designation ?? "",
            status:
                ["scheduled", "completed", "cancelled"].includes(
                    existingCandidate.status
                )
                    ? (existingCandidate.status as any)
                    : "scheduled",
        });
    }, [candidateId, isEdit]);

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
            !form.designation ||
            !form.status
        ) {
            setToast({
                open: true,
                message: "All fields are required.",
                severity: "error",
            });
            return;
        }

        updateCandidate(candidateId, form);
        setToast({
            open: true,
            message: "Candidate updated successfully!",
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
                        spacing={2}
                        mb={3}
                    >
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => router.back()}
                            variant="outlined"
                            size="small"
                            sx={{
                                textTransform: "none",
                                borderRadius: 3,
                                fontWeight: 600,
                            }}
                        >
                            Back
                        </Button>

                        <Typography variant="h5" fontWeight={700}>
                            Edit Candidate Details
                        </Typography>
                    </Stack>

                    <Divider sx={{ mb: 3 }} />

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 3,
                            bgcolor: "grey.50",
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "grey.200",
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
                            mb: 3,
                            bgcolor: "grey.50",
                            borderRadius: 3,
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

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 3,
                            bgcolor: "grey.50",
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "grey.200",
                        }}
                    >
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ mb: 2, fontWeight: 700, letterSpacing: 0.5 }}
                        >
                            Interview Status
                        </Typography>

                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                label="Status"
                                value={form.status}
                                onChange={(e) => update("status", e.target.value)}
                            >
                                <MenuItem value="scheduled">Scheduled</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                            </Select>
                        </FormControl>
                    </Paper>

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<SaveIcon />}
                        onClick={handleSubmit}
                        sx={{
                            mt: 1,
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
                        Save Changes
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
        </ProtectedRoute>
    );
}
