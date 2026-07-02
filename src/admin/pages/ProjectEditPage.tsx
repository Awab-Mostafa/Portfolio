import { Navigate, useNavigate, useParams } from "react-router-dom";

import ProjectForm, { type ProjectFormValues } from "@/admin/components/ProjectForm";
import { useProjectsCtx } from "@/admin/context/ProjectsContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectEditPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, update, remove } = useProjectsCtx();
  const navigate = useNavigate();

  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    return <Navigate to="/admin/projects" replace />;
  }

  const handleSubmit = async (values: ProjectFormValues) => {
    await update(project.id, values);
    navigate("/admin/projects");
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete "${project.title}"? This cannot be undone.`);
    if (!confirmed) return;
    await remove(project.id);
    navigate("/admin/projects");
  };

  return (
    <Card className="border border-border/70 bg-background/85 shadow-lg shadow-[#3b82f6
]/10">
      <CardHeader>
        <CardTitle>Edit Project</CardTitle>
        <CardDescription>Update the project details below.</CardDescription>
      </CardHeader>
      <CardContent>
        <ProjectForm
          initialValues={{
            title: project.title,
            description: project.description,
            tech: project.tech,
            url: project.url,
          }}
          submitLabel="Update"
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
        />
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleDelete}
            className="text-sm font-semibold text-red-500 transition hover:text-red-400"
          >
            Delete this project
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
