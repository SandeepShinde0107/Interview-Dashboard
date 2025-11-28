"use client";

import { useState, useEffect } from "react";
import {
    Card,
    Typography,
    Stack,
    IconButton,
    Button,
    Chip,
    Box,
    Divider,
    Grid,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
    listFeedbackByCandidate,
    deleteFeedback,
} from "@/src/utils/feedbackStore";

import FeedbackModal from "./FeedbackModal";
import FeedbackForm from "./FeedbackForm";

export default function FeedbackSection({ candidateId, onUpdated, showToast }: any) {
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [editingFeedback, setEditingFeedback] = useState<any | null>(null);

    const load = () => {
        setFeedbacks(listFeedbackByCandidate(candidateId));
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <>
            <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                mb={2}
            >
                <Button
                    variant="contained"
                    size="small"
                    sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        px: 2.5,
                        py: 1,
                        fontWeight: 600,
                    }}
                    onClick={() => {
                        setEditingFeedback(null);
                        setOpenModal(true);
                    }}
                >
                    Add Feedback
                </Button>
            </Box>

            <Stack spacing={2}>
                {feedbacks.map((fb) => (
                    <Card
                        key={fb.id}
                        elevation={2}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "divider",
                            transition: "0.25s",
                            "&:hover": {
                                borderColor: "primary.main",
                                boxShadow: 6,
                            },
                        }}
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}
                        >
                            <Box display="flex" alignItems="center">
                                <Typography
                                    fontWeight={600}
                                    sx={{ mr: 1 }}
                                    color="text.primary"
                                >
                                    Score:
                                </Typography>

                                <Chip
                                    label={fb.score}
                                    size="small"
                                    color={
                                        fb.score >= 4
                                            ? "success"
                                            : fb.score >= 2
                                                ? "warning"
                                                : "error"
                                    }
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: "0.85rem",
                                        px: 0.5,
                                    }}
                                />
                            </Box>

                            <Stack direction="row" spacing={1}>
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setEditingFeedback(fb);
                                        setOpenModal(true);
                                    }}
                                    sx={{
                                        bgcolor: "primary.light",
                                        color: "black",
                                        "&:hover": {
                                            bgcolor: "primary.main",
                                            color: "white",
                                        },
                                    }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>

                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        deleteFeedback(fb.id);
                                        load();
                                        onUpdated();
                                        showToast("Feedback deleted successfully", "success");
                                    }}
                                    sx={{
                                        bgcolor: "error.light",
                                        color: "black",
                                        "&:hover": {
                                            bgcolor: "error.main",
                                            color: "white",
                                        },
                                    }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Stack>
                        </Box>

                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 700,
                                        color: "text.primary",
                                        mb: 1,
                                    }}
                                >
                                    Strengths
                                </Typography>

                                <Box
                                    component="div"
                                    sx={{
                                        whiteSpace: "pre-wrap",
                                        color: "text.secondary",
                                        pl: 1.5,
                                        fontSize: "0.9rem",
                                        lineHeight: 1.55,
                                        textAlign: "left",
                                        borderLeft: "2px solid #ccc",
                                    }}
                                >
                                    {fb.strengths}
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 700,
                                        color: "text.primary",
                                        mb: 1,
                                    }}
                                >
                                    Improvements
                                </Typography>

                                <Box
                                    component="div"
                                    sx={{
                                        whiteSpace: "pre-wrap",
                                        color: "text.secondary",
                                        pl: 1.5,
                                        fontSize: "0.9rem",
                                        lineHeight: 1.55,
                                        textAlign: "left",
                                        borderLeft: "2px solid #ccc",
                                    }}
                                >
                                    {fb.improvements}
                                </Box>
                            </Grid>
                        </Grid>
                    </Card>
                ))}
            </Stack>

            <FeedbackModal
                open={openModal}
                title={editingFeedback ? "Edit Feedback" : "Add Feedback"}
                onClose={() => setOpenModal(false)}
            >
                <FeedbackForm
                    candidateId={candidateId}
                    editingFeedback={editingFeedback}
                    onSubmitted={() => {
                        setOpenModal(false);
                        load();
                        onUpdated();
                        showToast(
                            editingFeedback ? "Feedback updated successfully" : "Feedback added successfully",
                            "success"
                        );
                    }}
                />
            </FeedbackModal>
        </>
    );
}
