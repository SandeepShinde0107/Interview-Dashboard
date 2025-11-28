"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useState } from "react";
import { createInterviewer } from "../../../../src/utils/interviewerStore";
import { nanoid } from "nanoid";

export default function AddInterviewerModal({
  open,
  onClose,
  onAdded,
}: {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  })

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAdd = () => {
    let valid = true;
    const newErrors = { name: "", email: "" };

    if (!name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Enter a valid email";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;
    const newInterviewer = {
      id: nanoid(),
      name,
      email,
      role: "panelist" as "admin" | "panelist" | "ta_member",
    };

    createInterviewer(newInterviewer);
    setToast({
      open: true,
      message: "Interviewer Added Suceessfully",
      severity: "success"
    });
    
    setTimeout(() => {
      onAdded();
      onClose();
    }, 1200);
  
    setName("");
    setEmail("");
    setErrors({ name: "", email: "" });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Add Interviewer</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: "" }));
            }}
            error={Boolean(errors.name)}
            helperText={errors.name}
          />

          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />
        </Stack>
      </DialogContent>
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
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button color="inherit" onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={!name.trim() || !email.trim()}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
