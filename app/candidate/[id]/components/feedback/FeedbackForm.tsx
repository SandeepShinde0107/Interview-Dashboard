"use client";

import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import {
  createFeedback,
  updateFeedback,
} from "@/src/utils/feedbackStore";

export default function FeedbackForm({
  candidateId,
  editingFeedback,
  onSubmitted,
}: any) {
  const [score, setScore] = useState<number | "">("");
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingFeedback) {
      setScore(editingFeedback.score);
      setStrengths(editingFeedback.strengths);
      setImprovements(editingFeedback.improvements);
    }
  }, [editingFeedback]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError("");

    if (score === "" || score < 1 || score > 5) {
      setError("Score must be between 1 and 5");
      return;
    }

    if (editingFeedback) {
      updateFeedback(editingFeedback.id, {
        score,
        strengths,
        improvements,
      });
    } else {
      createFeedback({
        candidateId,
        score,
        strengths,
        improvements,
      });
    }

    onSubmitted();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Score (1-5)"
          type="number"
          inputProps={{ min: 1, max: 5 }}
          value={score}
          onChange={(e) =>
            setScore(e.target.value === "" ? "" : Number(e.target.value))
          }
          fullWidth
        />

        <TextField
          label="Strengths"
          multiline
          rows={3}
          value={strengths}
          onChange={(e) => setStrengths(e.target.value)}
          fullWidth
        />

        <TextField
          label="Areas for Improvement"
          multiline
          rows={3}
          value={improvements}
          onChange={(e) => setImprovements(e.target.value)}
          fullWidth
        />
        
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button type="submit" variant="contained">
            {editingFeedback ? "Save Changes" : "Submit"}
          </Button>

          <Button
            variant="outlined"
            onClick={() => {
              setScore("");
              setStrengths("");
              setImprovements("");
            }}
          >
            Reset
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
