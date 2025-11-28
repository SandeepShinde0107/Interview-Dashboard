"use client";

import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Chip,
  Tooltip,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { parseISO } from "date-fns";
import { useState } from "react";
import type { status , Interview} from "@/src/types/data";
import { listInterviewers } from "@/src/utils/interviewerStore";
import ScheduleInterviewModal from "@/app/candidate/[id]/components/ScheduleInterviewModal";

interface Props {
  interviews: Interview[];
  candidateStatus: status;
  candidateId: number
  onDeleteInterview: (id: string) => void;
  onRefresh?: () => void;
  showToast?: (msg: string, severity: "success" | "error") => void;
}

export default function InterviewSchedule({
  interviews,
  candidateStatus,
  candidateId,
  onDeleteInterview,
  onRefresh,
  showToast,
}: Props) {
  const [editing, setEditing] = useState<any | null>(null);
  const interviewers = listInterviewers();
  const interviewMap = new Map(interviewers.map((i) => [i.id, i]));

  const statusColors = {
    scheduled: "info",
    completed: "success",
    cancelled: "error",
  } as const;

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={3}>
        Scheduled Interviews
      </Typography>
      {interviews.length === 0 && (
        <Card
          elevation={1}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            bgcolor: "background.default",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography color="text.secondary">
            No interviews scheduled yet.
          </Typography>
        </Card>
      )}
      <Stack spacing={2}>
        {interviews.map((iv) => {
          const formattedDate = parseISO(iv.date).toLocaleString();
          const interviewer = interviewMap.get(iv.interviewerId);

          return (
            <Card
              key={iv.id}
              elevation={2}
              sx={{
                borderRadius: 3,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                transition: "0.3s",
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent
                sx={{
                  py: 2.5,
                  px: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    {formattedDate}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" mt={0.3}>
                    Scheduled by{" "}
                    <strong>{interviewer?.name || "Unknown"}</strong>
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Chip
                    label={
                     iv.status.charAt(0).toUpperCase() + iv.status.slice(1)
                    }
                    color={statusColors[iv.status]}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />

                  <Tooltip title="Edit Interview">
                    <IconButton
                      sx={{
                        bgcolor: "primary.light",
                        color: "black",
                        "&:hover": { bgcolor: "primary.main", color: "#fff" },
                      }}
                      onClick={() => setEditing(iv)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete Interview">
                    <IconButton
                      sx={{
                        bgcolor: "error.light",
                        color: "black",
                        "&:hover": { bgcolor: "error.main", color: "#fff" },
                      }}
                      onClick={() => {
                        onDeleteInterview(iv.id);
                        showToast?.("Interview deleted successfully", "success");
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      {editing && (
        <ScheduleInterviewModal
          open={true}
          onClose={() => setEditing(null)}
          interview={editing}
          candidateId={String(candidateId)}
          onSuccess={() => {
            setEditing(null);
            onRefresh?.();
            showToast?.("Interview updated successfully", "success");
          }}
        />
      )}
    </Box>
  );
}
