import ProtectedRoute from "../../src/route/ProtectedRoute";
import CreateCandidate from "./create/CreateCandidate";
import CandidateDashboard from "./CandidateDashboard";

export default function CandidatePage() {
    return (
        // <ProtectedRoute>
            <CandidateDashboard />
        // </ProtectedRoute>
    )
}