import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

import Reveal from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project as AdminProject } from "@/admin/context/ProjectsContext";
import { db } from "@/lib/firebase";

type Project = AdminProject & { techStack: string[] };

export default function WebProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsQuery = query(collection(db, "projects"), orderBy("title", "asc"));
        const snapshot = await getDocs(projectsQuery);
        const items: Project[] = snapshot.docs.map((doc) => {
          const data = doc.data() as Partial<AdminProject>;
          const techStack = (data.tech ?? "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
          return {
            id: doc.id,
            title: data.title ?? "Untitled project",
            description: data.description ?? "",
            url: data.url ?? "#",
            tech: data.tech ?? "",
            techStack,
          };
        });
        setProjects(items);
      } catch (err) {
        console.error("Failed to load projects:", err);
        setError("Unable to load projects right now. Please try again soon.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-14 pt-10 sm:px-6 lg:max-w-7xl lg:px-8 lg:pb-20 lg:pt-16 2xl:max-w-[1320px] 2xl:px-10">
      <Reveal direction="up">
        <div className="mb-10 flex flex-col items-center gap-6 text-center lg:mb-14 lg:flex-row lg:items-end lg:justify-between lg:text-left">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#3b82f6
]/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#3b82f6
] sm:text-sm">
              Selected Work
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Web Projects
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
              Interfaces engineered for performance, accessibility, and polish. Each project blends
              motion, storytelling, and smart data handling to deliver production-ready experiences.
            </p>
          </div>
        </div>
      </Reveal>

      {loading ? (
        <p className="rounded-3xl border border-border/60 bg-background/80 p-6 text-center text-sm text-muted-foreground">
          Loading projects...
        </p>
      ) : error ? (
        <p className="rounded-3xl border border-red-500/40 bg-red-500/10 p-6 text-center text-sm text-red-500">
          {error}
        </p>
      ) : projects.length === 0 ? (
        <p className="rounded-3xl border border-border/60 bg-background/80 p-6 text-center text-sm text-muted-foreground">
          No projects published yet. Check back soon.
        </p>
      ) : (
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={0.1 + index * 0.08} className="h-full">
              <Card className="h-full border border-border/70 bg-background/85 shadow-lg shadow-[#3b82f6
]/12 transition-all hover:-translate-y-2 hover:border-[#3b82f6
]/50 hover:shadow-xl">
                <CardHeader className="space-y-3">
                  <CardTitle className="text-xl font-semibold text-foreground/90 sm:text-2xl">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground/90 sm:text-base">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex h-full flex-col gap-6">
                  <div className="flex flex-wrap gap-3">
                    {project.techStack.map((stack) => (
                      <span
                        key={`${project.id}-${stack}`}
                        className="rounded-full border border-[#3b82f6
]/40 bg-[#3b82f6
]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#3b82f6
]"
                      >
                        {stack}
                      </span>
                    ))}
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    className="group w-fit border border-transparent px-0 text-sm font-semibold text-[#3b82f6
] hover:text-[#3b82f6
]"
                  >
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      Visit project
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      )}

      <Reveal direction="up">
        <Card className="mt-10 border border-[#3b82f6
]/30 bg-background/85 shadow-lg shadow-[#3b82f6
]/10">
          <CardHeader className="space-y-2 text-center sm:text-left">
            <CardTitle className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Ready to collaborate?
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Have an idea or need a fast, high-quality build? Reach out via the contact page.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-sm text-muted-foreground">
              We build fast, secure, and scalable websites.
            </div>
            <Button
              asChild
              className="group rounded-full bg-[#3b82f6
] px-5 py-2 text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#3b82f6
]/90 focus-visible:ring-[#3b82f6
]"
            >
              <a href="/contact" className="inline-flex items-center gap-2">
                Contact me
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </Reveal>
    </section>
  );
}
