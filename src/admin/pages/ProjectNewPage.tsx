import { useNavigate } from "react-router-dom";

import ProjectForm, { type ProjectFormValues } from "@/admin/components/ProjectForm";
import { useProjectsCtx } from "@/admin/context/ProjectsContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectNewPage() {
  const { add } = useProjectsCtx();
  const navigate = useNavigate();

  const handleSubmit = async (values: ProjectFormValues) => {
    await add(values);
    navigate("/admin/projects");
  };

  return (
    <Card className="border border-border/70 bg-background/85 shadow-lg shadow-[#3b82f6
]/10">
      <CardHeader>
        <CardTitle>Add Project</CardTitle>
        <CardDescription>Create a new project entry.</CardDescription>
      </CardHeader>
      <CardContent>
        <ProjectForm submitLabel="Save" onSubmit={handleSubmit} onCancel={() => navigate(-1)} />
      </CardContent>
    </Card>
  );
}
