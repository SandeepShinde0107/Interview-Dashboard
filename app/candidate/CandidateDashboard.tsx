"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import ScheduleInterviewModal from "./[id]/components/ScheduleInterviewModal";

import {
  Box,
  Button,
  Card,
  Typography,
  TextField,
  MenuItem,
  Collapse,
  InputAdornment,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EventIcon from "@mui/icons-material/Event";

import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";

import { listCandidates, deleteCandidate } from "../../src/utils/candidateStore";
import type { Candidate } from "../../src/types/data";
import { useAuth } from "@/src/context/AuthContext";

export default function CandidatesDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [designation, setDesignation] = useState("all");
  const [status, setStatus] = useState("all");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);


  const load = () => {
    setLoading(true);
    try {
      setCandidates(listCandidates());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const onStorage = () => load();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const departmentOptions = useMemo(
    () => Array.from(new Set(candidates.map((c) => c.department).filter(Boolean))),
    [candidates]
  );

  const designationOptions = useMemo(
    () => Array.from(new Set(candidates.map((c) => c.designation).filter(Boolean))),
    [candidates]
  );

  const rows = useMemo(() => {
    return candidates.filter((c) => {
      const query = search.toLowerCase();
      const haystack = `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase();

      if (query && !haystack.includes(query)) return false;
      if (department !== "all" && c.department !== department) return false;
      if (designation !== "all" && c.designation !== designation) return false;
      if (status !== "all" && c.status !== status) return false;

      return true;
    });
  }, [candidates, search, department, designation, status]);

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "name",
        headerName: "Name",
        minWidth: 130,   // ⬅ reduced width
        flex: 1,
        valueGetter: (value, row) =>
          `${row.firstName ?? ""} ${row.lastName ?? ""}`,
      },
      {
        field: "email",
        headerName: "Email",
        minWidth: 160,   // ⬅ reduced width
        flex: 1,
      },
      {
        field: "department",
        headerName: "Department",
        width: 150,
        flex:1
      },
      {
        field: "designation",
        headerName: "Designation",
        width: 150,
        flex:1
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        width: 150,
        flex:1,
        getActions: (params: { row: Candidate; id: string }) => [
          <GridActionsCellItem
            key="view"
            icon={
              <Tooltip title="View">
                <VisibilityIcon fontSize="small" sx={{ color: "primary.main" }} />
              </Tooltip>
            }
            label="View"
            onClick={() => router.push(`/candidate/${params.id}/view`)}
          />,
          <GridActionsCellItem
            key="edit"
            icon={
              <Tooltip title="Edit">
                <EditIcon fontSize="small" sx={{ color: "secondary.main" }} />
              </Tooltip>
            }
            label="Edit"
            onClick={() => router.push(`/candidate/${params.id}/edit`)}
          />,
          <GridActionsCellItem
            key="schedule"
            icon={
              <Tooltip title="Schedule Interview">
                <EventIcon fontSize="small" sx={{ color: "info.main" }} />
              </Tooltip>
            }
            label="Schedule"
            onClick={() => {
              setSelectedCandidate(params.row);
              setOpenScheduleModal(true);
            }}
          />,
          <GridActionsCellItem
            key="delete"
            icon={
              <Tooltip title="Delete">
                <DeleteIcon fontSize="small" sx={{ color: "error.main" }} />
              </Tooltip>
            }
            label="Delete"
            onClick={() => {
              if (confirm("Delete this candidate?")) {
                deleteCandidate(params.id as string);
                load();
              }
            }}
          />,
        ],
      },
    ],
    [router]
  );


  const logout = () => {
    router.push("/login");
  }
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", p: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        mb={4}
        alignItems="center"
      >
        <Box>
          <Typography variant="h4" fontWeight={700} color="grey.900">
            Welcome, {user?.username}
          </Typography>
          <Typography color="grey.600">
            Overview of your interview activity
          </Typography>
        </Box>

        <Stack alignItems="flex-end">
          <Typography color="grey.700" mb={1}>
            Role:{" "}
            <strong style={{ color: "#1976d2" }}>
              {user?.role?.toUpperCase()}
            </strong>
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
      <Card
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "background.paper",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            onClick={() => router.push("/dashboard")}
            sx={{
              bgcolor: "primary.main",
              color: "#fff",
              transition: "0.25s ease",
              ":hover": {
                bgcolor: "primary.dark",
                transform: "translateX(-4px)",
                boxShadow: 4,
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="h5" fontWeight={700}>
            Candidates Dashboard
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setFiltersOpen((open) => !open)}
            sx={{ borderRadius: 3 }}
          >
            Filters
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push("/candidate/create")}
            sx={{
              px: 3,
              py: 1.1,
              borderRadius: 3,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Add Candidate
          </Button>
        </Stack>
      </Card>

      <Collapse in={filtersOpen}>
        <Card
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 4,
          }}
        >
          <Box
            display="grid"
            gap={3}
            gridTemplateColumns={{
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(4, 1fr)",
            }}
          >
            <TextField
              label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ opacity: 0.6 }} />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />

            <TextField
              select
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              fullWidth
            >
              <MenuItem value="all">All</MenuItem>
              {departmentOptions.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              fullWidth
            >
              <MenuItem value="all">All</MenuItem>
              {designationOptions.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </TextField>

            {/* <TextField
              select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              fullWidth
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField> */}
          </Box>

          <Stack direction="row" justifyContent="flex-end" mt={3} spacing={2}>
            <Button
              variant="outlined"
              onClick={() => {
                setSearch("");
                setDepartment("all");
                setDesignation("all");
                setStatus("all");
              }}
            >
              Reset
            </Button>

            <Button variant="contained">Apply</Button>
          </Stack>
        </Card>
      </Collapse>

      {/* DATAGRID */}
      <Card elevation={3} sx={{ p: 2, borderRadius: 4 }}>
        <Box sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => setPaginationModel(model)}
            pageSizeOptions={[5, 10, 20, 50]}
            // components={{ Toolbar: GridToolbar }}
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "grey.100",
                fontWeight: 700,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "grey.50",
              },
            }}
          />
        </Box>
      </Card>
      {openScheduleModal && (
        <ScheduleInterviewModal
          open={openScheduleModal}
          onClose={() => setOpenScheduleModal(false)}
          interview={null}
          candidateId={String(selectedCandidate?.id)}
          onSuccess={() => {
            setOpenScheduleModal(false);
            load();  // refresh table if you want
          }}
        />
      )}

    </Box>
  );
}

/* Small chip for statuses */
import { Chip } from "@mui/material";
function ChipSmall({ label, color }: { label: any; color?: any }) {
  return <Chip label={label} size="small" color={color} />;
}
