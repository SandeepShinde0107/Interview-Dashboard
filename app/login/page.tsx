"use client";
import { useState } from "react";
import { useAuth } from "../../src/context/AuthContext";
import { Button, TextField, MenuItem, Typography, Box, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { Role } from "@/src/types/data";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [form, setForm] = useState({
        username: "",
        password: "",
        role: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: any) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("https://dummyjson.com/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: form.username,
                    password: form.password,
                }),
            });

            if (!res.ok) throw new Error("Invalid credentials");

            const data = await res.json();
            const userWithRole = {
            ...data,
            role: form.role  as Role  // <--- ADD THIS FIX
        };

            login(userWithRole);

            if (form.role === "admin") router.push("/dashboard");
            else router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
                background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    width: "100%",
                    maxWidth: 420,
                    p: 4,
                    borderRadius: 3,
                    backdropFilter: "blur(6px)",
                }}
            >
                <Typography
                    variant="h4"
                    align="center"
                    fontWeight={600}
                    mb={2}
                    sx={{ color: "primary.main" }}
                >
                    Welcome Back
                </Typography>

                <Typography
                    variant="body2"
                    align="center"
                    color="text.primary"
                    mb={3}
                >
                    Please login to continue
                </Typography>

                <TextField
                    label="Username"
                    name="username"
                    fullWidth
                    variant="outlined"
                    value={form.username}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={form.password}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />

                <TextField
                    select
                    label="Select Role"
                    name="role"
                    fullWidth
                    variant="outlined"
                    value={form.role}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="panelist">Panelist</MenuItem>
                    <MenuItem value="ta_member">TA Member</MenuItem>
                </TextField>

                {error && (
                    <Typography
                        variant="body2"
                        color="error"
                        sx={{ mb: 2, textAlign: "center" }}
                    >
                        {error}
                    </Typography>
                )}

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                    onClick={handleSubmit}
                    sx={{
                        py: 1.2,
                        fontSize: "1rem",
                        fontWeight: 600,
                        borderRadius: 2,
                        transition: "0.3s",
                        ":hover": {
                            transform: "translateY(-2px)",
                            boxShadow: 4,
                        },
                    }}
                >
                    {loading ? "Logging in..." : "Login"}
                </Button>
            </Paper>
        </Box>
    );
}