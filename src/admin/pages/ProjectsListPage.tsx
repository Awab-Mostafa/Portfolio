import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCcw } from "lucide-react";

import { useProjectsCtx } from "@/admin/context/ProjectsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ProjectsListPage() {
  const { projects, loading, remove, refresh } = useProjectsCtx();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const selectedProject = selectedProjectId ? projects.find((project) => project.id === selectedProjectId) : null;

  useEffect(() => {
    if (selectedProjectId && !selectedProject) {
      setSelectedProjectId(null);
      setDialogOpen(false);
    }
  }, [selectedProjectId, selectedProject]);

  const handleViewProject = (id: string) => {
    setSelectedProjectId(id);
    setDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedProjectId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${title}"?`);
    if (!confirmed) return;
    await remove(id);
    if (selectedProjectId === id) {
      setSelectedProjectId(null);
      setDialogOpen(false);
    }
  };

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await refresh();
    } catch (error) {
      console.error("Failed to refresh projects:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>
      <Card className="border border-border/70 bg-background/85 shadow-lg shadow-[#3b82f6
]/10">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Projects</CardTitle>
              <CardDescription>All projects in your portfolio.</CardDescription>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
              className="rounded-xl border-border/60 text-muted-foreground transition hover:text-[#3b82f6
]"
            >
              <RefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh projects</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && (
            <p className="text-sm text-muted-foreground">Loading projects...</p>
          )}
          <div className="grid gap-4">
            {projects.map((project) => (
              <div key={project.id} className="rounded-xl border border-border/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex text-xs font-semibold text-[#3b82f6
] transition hover:underline"
                    >
                      {project.url}
                    </a>
                  </div>
                  <div className="text-xs text-muted-foreground">{project.tech}</div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                  <Button variant="secondary" size="sm" onClick={() => handleViewProject(project.id)}>
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(project.id, project.title)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            {!loading && projects.length === 0 && (
              <p className="text-sm text-muted-foreground">No projects yet. Create one from "Add Project".</p>
            )}
          </div>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen && !!selectedProject} onOpenChange={handleDialogChange}>
        {selectedProject && (
          <DialogContent className="max-w-xl gap-5 rounded-3xl border border-border/70 bg-background/95 p-6 shadow-2xl shadow-[#3b82f6
]/25">
            <DialogHeader className="text-left">
              <DialogTitle>{selectedProject.title}</DialogTitle>
              <DialogDescription>{selectedProject.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-left">
              {selectedProject.images && selectedProject.images.length > 0 && (
                <div className="grid gap-3">
                  {selectedProject.images.map((image, index) => (
                    <div key={`${image.url}-${index}`} className="overflow-hidden rounded-xl border border-border/60">
                      <img src={image.url} alt={image.caption || selectedProject.title} className="max-h-64 w-full object-cover" />
                      {(image.caption || image.role) && (
                        <div className="space-y-1 p-3">
                          {image.caption && <p className="text-sm text-foreground">{image.caption}</p>}
                          {image.role && (
                            <p className="text-xs font-medium text-[#3b82f6]">{image.role}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Tech Stack</p>
                <p className="mt-1 text-sm text-foreground">{selectedProject.tech}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Website</p>
                <a
                  href={selectedProject.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex text-sm font-semibold text-[#3b82f6
] transition hover:underline"
                >
                  {selectedProject.url}
                </a>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
