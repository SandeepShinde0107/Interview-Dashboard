"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { getCandidate } from "@/src/utils/candidateStore";
import { listFeedbackByCandidate } from "@/src/utils/feedbackStore";
import ProtectedRoute from "@/src/route/ProtectedRoute";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ScheduledInterview from "./view/ScheduledInterviews";
import { listInterviewByCandidate, deleteInterview } from "@/src/utils/interviewStore";
import FeedbackSection from "./components/feedback/FeedbackSection";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function ViewCandidateDetails() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const tab = (searchParams.get("tab") || "profile") as
    | "profile"
    | "schedule"
    | "feedback";

  const [candidate, setCandidate] = useState<any | null>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });
  const loadAll = () => {
    setLoading(true);
    try {
      const c = getCandidate(id);
      setCandidate(c ?? null);
      const iv = listInterviewByCandidate(id);
      setInterviews(iv);
      console.log("Interviews:", iv);
      const f = listFeedbackByCandidate(id);
      setFeedbackList(f);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    const listener = () => loadAll();
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, [id]);

  const counts = useMemo(() => {
    const completed = interviews.filter((i) => i.completed).length;
    const scheduled = interviews.filter((i) => !i.completed).length;
    const feedbackCount = feedbackList.length;
    return { completed, scheduled, feedbackCount };
  }, [interviews, feedbackList]);

  if (loading) {
    return (
      <Box p={4}>
        <Typography color="text.secondary">Loading candidate…</Typography>
      </Box>
    );
  }

  if (!candidate) {
    return (
      <Box p={4}>
        <Typography color="error">Candidate not found.</Typography>
      </Box>
    );
  }

  const handleDelete = (interviewId: string) => {
    deleteInterview(interviewId);

    setToast({
      open: true,
      message: "Interview deleted successfully",
      severity: "success",
    });

    loadAll();
  };


  const showToast = (message: string, severity: "success" | "error" | "warning" | "info") => {
    setToast({
      open: true,
      message,
      severity,
    });
  };
  const goToTab = (value: string) => {
    router.push(`/candidate/${candidate.id}?tab=${value}`);
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "ta_member", "panelist"]}>
      <Box sx={{ minHeight: "100vh", bgcolor: "grey.100", p: 4 }}>
        <Card
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            bgcolor: "background.paper",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
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
                {candidate.designation ?? "—"}
              </Typography>
            </Box>
          </Stack>
        </Card>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card sx={{ borderRadius: 3, p: 2 }} elevation={2}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 2, textTransform: "uppercase", color: "text.secondary" }}
              >
                Navigation
              </Typography>

              <List>
                <ListItemButton
                  selected={tab === "profile"}
                  onClick={() => goToTab("profile")}
                  sx={{ borderRadius: 2 }}
                >
                  <PersonIcon sx={{ mr: 1 }} fontSize="small" />
                  <ListItemText primary="Profile" />
                </ListItemButton>

                <ListItemButton
                  selected={tab === "schedule"}
                  onClick={() => goToTab("schedule")}
                  sx={{ borderRadius: 2 }}
                >
                  <CalendarMonthIcon sx={{ mr: 1 }} fontSize="small" />
                  <ListItemText
                    primary={`Scheduled Interviews`}
                  />
                </ListItemButton>
                <ListItemButton
                  selected={tab === "feedback"}
                  onClick={() => goToTab("feedback")}
                  sx={{ borderRadius: 2 }}
                >
                  <FeedbackIcon sx={{ mr: 1 }} fontSize="small" />
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
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Paper sx={{ p: 2, borderRadius: 3 }} elevation={1}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          First Name
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {candidate.firstName}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Paper sx={{ p: 2, borderRadius: 3 }} elevation={1}>
                        <Typography variant="caption" color="text.secondary">
                          Last Name
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {candidate.lastName}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Paper sx={{ p: 2, borderRadius: 3 }} elevation={1}>
                        <Typography variant="caption" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {candidate.email ?? "—"}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Paper sx={{ p: 2, borderRadius: 3 }} elevation={1}>
                        <Typography variant="caption" color="text.secondary">
                          Department
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {candidate.department ?? "—"}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Paper sx={{ p: 2, borderRadius: 3 }} elevation={1}>
                        <Typography variant="caption" color="text.secondary">
                          Role
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {candidate.designation ?? "—"}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
              {tab === "schedule" && (
                <>
                  {(user?.role === "admin" || user?.role === "ta_member") ? (
                    <Box textAlign="center" py={5} color="text.secondary">
                      <ScheduledInterview
                        interviews={interviews}
                        candidateStatus={"scheduled"}
                        onDeleteInterview={handleDelete}
                        onRefresh={loadAll}
                        showToast={showToast}
                        candidateId={candidate.id}
                      />
                    </Box>
                  ) : (
                    <Box textAlign="center" py={5} color="text.secondary" fontSize={16}>
                      As a panelist, you can’t schedule interviews.
                    </Box>
                  )}
                </>
              )}
              {tab === "feedback" && (
                <Box>
                  <Typography variant="h6" mb={1} fontWeight={600}>
                    FeedBacks
                  </Typography>
                  {user?.role === "panelist" ? (
                    <Box py={1} textAlign="center" color="text.secondary">
                      <FeedbackSection candidateId={candidate.id} onUpdated={() => {
                        loadAll();
                        showToast("Feedback updated successfully", "success");
                      }} showToast={showToast} />
                    </Box>
                  ) : (
                    <Typography color="text.secondary" variant="body2">
                      Only panelists can view and submit feedback.
                    </Typography>
                  )}
                </Box>
              )}
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
          </Grid>
        </Grid>
      </Box>
    </ProtectedRoute>
  );
}
