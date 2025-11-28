"use client";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Stack,
    IconButton,
    Tooltip,
} from "@mui/material";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState, useRef } from "react";

import { createInterview, updateInterview } from "@/src/utils/interviewStore";
import { listInterviewers } from "@/src/utils/interviewerStore";
import AddInterviewerModal from "./AddInterviewerModal";
import { updateCandidate } from "@/src/utils/candidateStore";
import { status } from "@/src/types/data";

interface Props {
    open: boolean;
    onClose: () => void;
    interview: any | null;
    candidateId: string;
    onSuccess: () => void;
}

export default function ScheduleInterviewModal({
    open,
    onClose,
    interview,
    candidateId,
    onSuccess,
}: Props) {

    const isEdit = !!interview?.id;
    const [form, setForm] = useState({
        interviewerId: "",
        date: "",
        status: "scheduled",
    });

    const [interviewers, setInterviewers] = useState(listInterviewers());
    const [showAddModal, setShowAddModal] = useState(false);

    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error" | "warning" | "info",
    });

    const dateRef = useRef<HTMLInputElement | null>(null);
    const reloadInterviewers = () => setInterviewers(listInterviewers());
    useEffect(() => {
        if (isEdit && interview) {
            setForm({
                interviewerId: interview.interviewerId,
                date: interview.date,
                status: interview.status ?? "scheduled",
            });
        } else {
            setForm({
                interviewerId: "",
                date: "",
                status: "scheduled",
            });
        }
    }, [interview]);
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!form.interviewerId || !form.date) {
            setToast({
                open: true,
                message: "Please select interviewer and date",
                severity: "error",
            });
            return;
        }

        if (isEdit) {
            updateInterview(interview.id, {
                interviewerId: form.interviewerId,
                date: form.date,
                status: form.status as status,
            });

            updateCandidate(candidateId, { status: form.status });

            setToast({
                open: true,
                message: "Interview updated successfully",
                severity: "success",
            });

        } else {
            createInterview({
                candidateId,
                interviewerId: form.interviewerId,
                date: form.date,
                status: form.status as status,
            });

            updateCandidate(candidateId, { status: form.status });

            setToast({
                open: true,
                message: "Interview scheduled successfully",
                severity: "success",
            });
        }
        setTimeout(() => {
            onSuccess();
            onClose();
        }, 700);
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
                <Snackbar
                    open={toast.open}
                    autoHideDuration={1800}
                    onClose={() => setToast((prev) => ({ ...prev, open: false }))}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <MuiAlert
                        elevation={6}
                        variant="filled"
                        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
                        severity={toast.severity}
                    >
                        {toast.message}
                    </MuiAlert>
                </Snackbar>

                <DialogTitle>
                    {isEdit ? "Edit Interview" : "Schedule Interview"}
                </DialogTitle>

                <DialogContent dividers>
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <TextField
                                select
                                fullWidth
                                label="Select Interviewer"
                                name="interviewerId"
                                value={form.interviewerId}
                                onChange={handleChange}
                            >
                                {interviewers.map((p) => (
                                    <MenuItem key={p.id} value={p.id}>
                                        {p.name} ({p.email})
                                    </MenuItem>
                                ))}
                            </TextField>

                            <Tooltip title="Add interviewer">
                                <IconButton color="primary" onClick={() => setShowAddModal(true)}>
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                        <TextField
                            label="Date & Time"
                            type="datetime-local"
                            name="date"
                            inputRef={dateRef}
                            value={form.date}
                            onClick={() => dateRef.current?.showPicker()}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                        <TextField
                            select
                            label="Status"
                            name="status"
                            fullWidth
                            variant="outlined"
                            value={form.status}
                            onChange={handleChange}
                        >
                            <MenuItem value="scheduled">Scheduled</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Button onClick={onClose} color="inherit">
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        {isEdit ? "Save Changes" : "Schedule"}
                    </Button>
                </DialogActions>
            </Dialog>
            {showAddModal && (
                <AddInterviewerModal
                    open={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onAdded={() => {
                        reloadInterviewers();
                        setShowAddModal(false);
                    }}
                />
            )}
        </>
    );
}
