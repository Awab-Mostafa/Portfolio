import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type Project = { id: string; title: string; description: string; tech: string; url: string };
type ProjectInput = Omit<Project, "id">;

type ProjectsContextValue = {
  projects: Project[];
  loading: boolean;
  add: (project: ProjectInput) => Promise<void>;
  update: (id: string, project: ProjectInput) => Promise<void>;
  remove: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

export function useProjectsCtx() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjectsCtx must be used within <ProjectsProvider>");
  return ctx;
}

const PROJECTS_COLLECTION = "projects";
const projectsCollectionRef = collection(db, PROJECTS_COLLECTION);
const projectsQuery = query(projectsCollectionRef, orderBy("title", "asc"));

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      projectsQuery,
      (snapshot) => {
        const docs: Project[] = snapshot.docs.map(mapProjectDoc);
        setProjects(docs);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to subscribe to projects:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const value = useMemo<ProjectsContextValue>(
    () => ({
      projects,
      loading,
      add: async (project) => {
        await addDoc(projectsCollectionRef, {
          ...project,
          createdAt: serverTimestamp(),
        });
      },
      update: async (id, project) => {
        await updateDoc(doc(db, PROJECTS_COLLECTION, id), {
          ...project,
          updatedAt: serverTimestamp(),
        });
      },
      remove: async (id) => {
        await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
      },
      refresh: async () => {
        setLoading(true);
        try {
          const snapshot = await getDocs(projectsQuery);
          const docs: Project[] = snapshot.docs.map(mapProjectDoc);
          setProjects(docs);
        } finally {
          setLoading(false);
        }
      },
    }),
    [projects, loading],
  );

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

function mapProjectDoc(document: QueryDocumentSnapshot<DocumentData>): Project {
  const data = document.data() as Partial<ProjectInput>;
  return {
    id: document.id,
    title: data.title ?? "",
    description: data.description ?? "",
    tech: data.tech ?? "",
    url: data.url ?? "",
  };
}
