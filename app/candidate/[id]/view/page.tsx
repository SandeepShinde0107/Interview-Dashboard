"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { getCandidate } from "@/src/utils/candidateStore";
import { listFeedbackByCandidate } from "@/src/utils/feedbackStore";
import {
    Box,
    Card,
    Typography,
    Button,
    Grid,
    Stack,
    Paper,
    List,
    ListItemButton,
    ListItemText,
    Snackbar,
    Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ScheduledInterview from "./ScheduledInterviews";
import {
    listInterviewByCandidate,
    deleteInterview,
} from "@/src/utils/interviewStore";

export default function ViewCandidateDetails() {
    const router = useRouter();
    const { id } = useParams() as { id: string };
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const tab = (searchParams.get("tab") || "profile") as
        | "profile"
        | "schedule"
        | "feedback";

    const [loading, setLoading] = useState(false);
    const [candidate, setCandidate] = useState<any>(null);
    const [interviews, setInterviews] = useState<any[]>([]);
    const [feedbackList, setFeedbackList] = useState<any[]>([]);

    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "success" as
            | "success"
            | "error"
            | "warning"
            | "info",
    });

    const loadAll = () => {
        const c = getCandidate(id);
        setCandidate(c ?? null);

        const iv = listInterviewByCandidate(id);
        setInterviews(iv);

        const fb = listFeedbackByCandidate(id);
        setFeedbackList(fb);
    };

    useEffect(() => {
        loadAll();
        const listener = () => loadAll();
        window.addEventListener("storage", listener);
        return () => window.removeEventListener("storage", listener);
    }, [id]);

    const counts = useMemo(() => {
        return {
            completed: interviews.filter((i) => i.completed).length,
            scheduled: interviews.filter((i) => !i.completed).length,
            feedbackCount: feedbackList.length,
        };
    }, [interviews, feedbackList]);

    const goToTab = (value: string) => {
        router.push(`/candidate/${id}?tab=${value}`);
    };

    const deleteInterviewById = (interviewId: string) => {
        deleteInterview(interviewId);

        setToast({
            open: true,
            message: "Interview Deleted Successfully",
            severity: "success",
        });
        setTimeout(() => loadAll(), 300);
    };

    if (!candidate) {
        return (
            <Box p={4}>
                <Typography color="error">Candidate not found.</Typography>
            </Box>
        );
    }
    const showToast = (message: string, severity: "success" | "error" | "warning" | "info") => {
        setToast({
            open: true,
            message,
            severity,
        });
    };
    return (
        <>
            <Snackbar
                open={toast.open}
                autoHideDuration={1500}
                onClose={() =>
                    setToast((prev) => ({ ...prev, open: false }))
                }
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    severity={toast.severity}
                    variant="filled"
                    onClose={() =>
                        setToast((prev) => ({ ...prev, open: false }))
                    }
                >
                    {toast.message}
                </Alert>
            </Snackbar>

            <Box sx={{ minHeight: "100vh", bgcolor: "grey.100", p: 4 }}>
                <Card
                    elevation={3}
                    sx={{ p: 3, mb: 4, borderRadius: 3 }}
                >
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => router.push("/candidate")}
                        >
                            Back
                        </Button>

                        <Box>
                            <Typography variant="h5" fontWeight={700}>
                                {candidate.firstName} {candidate.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {candidate.designation}
                            </Typography>
                        </Box>
                    </Stack>
                </Card>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Card sx={{ p: 2, borderRadius: 3 }} elevation={2}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    mb: 2,
                                    textTransform: "uppercase",
                                    color: "text.secondary",
                                }}
                            >
                                Navigation
                            </Typography>
                            <List>
                                <ListItemButton
                                    selected={tab === "profile"}
                                    onClick={() => goToTab("profile")}
                                >
                                    <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                                    <ListItemText primary="Profile" />
                                </ListItemButton>

                                <ListItemButton
                                    selected={tab === "schedule"}
                                    onClick={() => goToTab("schedule")}
                                >
                                    <CalendarMonthIcon fontSize="small" sx={{ mr: 1 }} />
                                    <ListItemText
                                        primary={`Scheduled Interviews`}
                                    />
                                </ListItemButton>

                                <ListItemButton
                                    selected={tab === "feedback"}
                                    onClick={() => goToTab("feedback")}
                                >
                                    <FeedbackIcon fontSize="small" sx={{ mr: 1 }} />
                                    <ListItemText
                                        primary={`Feedbacks`}
                                    />
                                </ListItemButton>
                            </List>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 9 }}>
                        <Card sx={{ p: 4, borderRadius: 3 }} elevation={3}>
                            {tab === "profile" && (
                                <Box>
                                    <Typography variant="h6" mb={3} fontWeight={600}>
                                        Candidate Profile
                                    </Typography>

                                    <Grid container spacing={3}>
                                        {[
                                            { label: "First Name", value: candidate.firstName },
                                            { label: "Last Name", value: candidate.lastName },
                                            { label: "Email", value: candidate.email },
                                            { label: "Department", value: candidate.department },
                                            { label: "Role", value: candidate.designation },
                                        ].map((item, i) => (
                                            <Grid size={{ xs: 12, sm: 6 }} key={i}>
                                                <Paper sx={{ p: 2, borderRadius: 3 }} elevation={1}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {item.label}
                                                    </Typography>
                                                    <Typography
                                                        variant="body1"
                                                        fontWeight={500}
                                                        sx={{ mt: 0.5 }}
                                                    >
                                                        {item.value}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}

                            {tab === "schedule" && (
                                <Box textAlign="center" py={3}>
                                    <ScheduledInterview
                                        interviews={interviews}
                                        candidateId={candidate.id}
                                        candidateStatus="scheduled"
                                        onDeleteInterview={deleteInterviewById}
                                        showToast={showToast}
                                    />
                                </Box>
                            )}

                            {tab === "feedback" && (
                                <Box>
                                    <Typography variant="h6" mb={3} fontWeight={600}>
                                        Feedback
                                    </Typography>

                                    {user?.role === "panelist" ? (
                                        <Typography color="text.secondary">
                                            Feedback section coming soon.
                                        </Typography>
                                    ) : (
                                        <Typography color="text.secondary" variant="body2">
                                            Only panelists can view feedback.
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
