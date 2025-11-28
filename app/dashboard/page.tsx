"use client";

import {
  Box,
  Card,
  Typography,
  Button,
  Grid,
  MenuItem,
  TextField,
  Stack,
  Paper,
} from "@mui/material";

import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useRef, type ReactNode } from "react";
import type { Candidate, Interview } from "@/src/types/data";
import { listCandidates } from "@/src/utils/candidateStore";
import { listAllInterviews } from "@/src/utils/interviewStore";
import { listInterviewers } from "@/src/utils/interviewerStore";
import KPICard from "@/src/components/KPICard";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ProtectedRoute from "@/src/route/ProtectedRoute";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);

  const [interviewerFilter, setInterviewerFilter] = useState("all");

  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });

  const [dateTo, setDateTo] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );

  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    try {
      setCandidates(listCandidates());
      setInterviews(listAllInterviews());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => load(), []);

  const interviewers = listInterviewers();

  const filteredInterviews = useMemo(() => {
    const from = new Date(`${dateFrom}T00:00:00`);
    const to = new Date(`${dateTo}T23:59:59`);

    return interviews.filter((iv) => {
      const d = new Date(iv.date);
      if (d < from || d > to) return false;
      if (interviewerFilter !== "all" && iv.interviewerId !== interviewerFilter)
        return false;
      return true;
    });
  }, [dateFrom, dateTo, interviewerFilter, interviews]);

  const totalCandidates = new Set(filteredInterviews.map((i) => i.candidateId))
    .size;

  const completedInterviews = filteredInterviews.filter((i) => i.status === "completed")
    .length;

  return (
    <ProtectedRoute allowedRoles={["admin", "panelist", "ta_member"]}>
      <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb", p: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          mb={4}
          alignItems="center"
        >
          <Box>
            <Typography variant="h4" fontWeight={700} color="#1e293b">
              Welcome, {user?.username}
            </Typography>
            <Typography color="#475569">
              Overview of Interview Activity
            </Typography>
          </Box>

          <Stack alignItems="flex-end">
            <Typography color="#64748b" mb={1}>
              Role:{" "}
              <strong style={{ color: "#1565c0" }}>
                {user?.role?.toUpperCase()}
              </strong>
            </Typography>

            <Button
              variant="contained"
              sx={{
                bgcolor: "#1565c0",
                ":hover": { bgcolor: "#0f4c8c" },
                borderRadius: 2,
                px: 3,
                py: 1,
              }}
              onClick={() => {
                logout();
                router.push("/login");
              }}
            >
              Logout
            </Button>
          </Stack>
        </Stack>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            bgcolor: "#ffffff",
            border: "1px solid #e3e8ef",
            boxShadow: "0 2px 6px rgba(15, 23, 42, 0.07)",
          }}
        >
          <Typography fontWeight={700} mb={2} color="#1e293b">
            Filters
          </Typography>

          <Stack direction="row" spacing={3} flexWrap="wrap">
            <TextField
              select
              label="Interviewer"
              value={interviewerFilter}
              onChange={(e) => setInterviewerFilter(e.target.value)}
              sx={{
                minWidth: 250,
                "& .MuiInputBase-root": {
                  borderRadius: 2,
                },
              }}
            >
              <MenuItem value="all">All</MenuItem>
              {interviewers.map((iv) => (
                <MenuItem key={iv.id} value={iv.id}>
                  {iv.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="date"
              label="From"
              inputRef={fromRef}
              InputLabelProps={{ shrink: true }}
              value={dateFrom}
              onClick={() => fromRef.current?.showPicker()}
              onChange={(e) => setDateFrom(e.target.value)}
              sx={{ "& .MuiInputBase-root": { borderRadius: 2 } }}
            />
            <TextField
              type="date"
              label="To"
              inputRef={toRef}
              InputLabelProps={{ shrink: true }}
              value={dateTo}
              onClick={() => toRef.current?.showPicker()}
              onChange={(e) => setDateTo(e.target.value)}
              sx={{ "& .MuiInputBase-root": { borderRadius: 2 } }}
            />
          </Stack>
        </Paper>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <KPICard title="Total Candidates" value={totalCandidates} icon={<GroupIcon sx={{ color: "#1565c0" }} />} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <KPICard title="Completed Interviews" value={completedInterviews} icon={<AssignmentIcon sx={{ color: "#059669" }} />} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <KPICard title="Interviews This Week" value={filteredInterviews.length} icon={<CalendarTodayIcon sx={{ color: "#d97706" }} />} />
          </Grid>
        </Grid>

        {/* QUICK ACTIONS */}
        <Typography variant="h6" fontWeight={700} mt={6} mb={2} color="#1e293b">
          Quick Actions
        </Typography>

        <Grid container spacing={3}>
          {(user?.role === "admin" || user?.role === "ta_member") && (
            <Grid size={{ xs: 12, md: 4 }}>
              <ActionCard
                title="Manage Candidates"
                subtitle="Add, edit or delete candidates"
                onClick={() => router.push("/candidate")}
                icon={<GroupIcon sx={{ color: "#1565c0" }} />}
              />
            </Grid>
          )}

          {(user?.role === "admin" || user?.role === "ta_member") && (
            <Grid size={{ xs: 12, md: 4 }}>
              <ActionCard
                title="Schedule Interviews"
                subtitle="Create new interview sessions"
                onClick={() => router.push("/candidate")}
                icon={<CalendarTodayIcon sx={{ color: "#d97706" }} />}
              />
            </Grid>
          )}

          {user?.role === "panelist" && (
            <Grid size={{ xs: 12, md: 4 }}>
              <ActionCard
                title="Submit Feedback"
                subtitle="Give feedback for completed interviews"
                onClick={() => router.push("/candidate")}
                icon={<AssignmentIcon sx={{ color: "#059669" }} />}
              />
            </Grid>
          )}

          {user?.role === "admin" && (
            <Grid size={{ xs: 12, md: 4 }}>
              <ActionCard
                title="Role Management"
                subtitle="Manage users & permissions"
                onClick={() => router.push("/admin/roles")}
                icon={<VerifiedUserIcon sx={{ color: "#7c3aed" }} />}
              />
            </Grid>
          )}
        </Grid>
      </Box>

    </ProtectedRoute>
  );
}

interface ActionCardProps {
  title: string;
  subtitle?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

function ActionCard({ title, subtitle, onClick, icon }: ActionCardProps) {
  return (
    <Card
      onClick={onClick}
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        cursor: "pointer",
        bgcolor: "#ffffff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.06)",
        transition: "0.2s",
        "&:hover": {
          bgcolor: "#f8fafc",
          transform: "translateY(-3px)",
          boxShadow: "0 6px 14px rgba(0,0,0,0.10)",
        },
      }}
    >

      <Stack direction="row" spacing={2} alignItems="center">
        {icon}
        <Box>
          <Typography fontWeight={700}>{title}</Typography>
          <Typography color="grey.600">{subtitle}</Typography>
        </Box>
      </Stack>
    </Card>
  );
}
