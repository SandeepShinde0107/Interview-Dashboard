// "use client";

import EditCandidateForm from "./EditCandidateForm";

interface EditPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditCandidatePage({ params }: EditPageProps) {
    const { id } = await params;
    return (
            <EditCandidateForm id={id} />
    );
}
