"use client";

import { Card, Box, Typography, Stack } from "@mui/material";
import type { ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
}

export default function KPICard({ title, value, icon }: KPICardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "primary.light",
          boxShadow: 6,
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        
        {/* ICON */}
        {icon && (
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: "grey.100",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "primary.main",
              fontSize: 26,
            }}
          >
            {icon}
          </Box>
        )}

        {/* TEXT */}
        <Box flex={1}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 600, letterSpacing: 0.3 }}
          >
            {title}
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mt: 0.5,
              color: "text.primary",
              fontSize: "1.9rem",
            }}
          >
            {value}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}
