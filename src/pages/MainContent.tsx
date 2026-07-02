import { ComponentType, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/animations/reveal";
import { cn } from "@/lib/utils";
import { focusSection } from "@/lib/focus-section";
import type { SectionFocusDetail } from "@/lib/focus-section";

import {
  SiCss3,
  SiExpress,
  SiFirebase,
  SiHtml5,
  SiJavascript,
  SiMysql,
  SiNestjs,
  SiNodedotjs,
  SiPostgresql,
  SiRadixui,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from "react-icons/si";
import { FiMail } from "react-icons/fi";

const heroIllustration = "/Designer.png";

type SkillGroup = {
  label: string;
  icons: ComponentType<{ className?: string }>[];
};

const skillGroups: SkillGroup[] = [
  {
    label:
      "Front-End: HTML, CSS, Tailwind, JavaScript, shadcn/ui, Vite, React, TypeScript",
    icons: [
      SiHtml5,
      SiCss3,
      SiTailwindcss,
      SiJavascript,
      SiRadixui,
      SiVite,
      SiReact,
      SiTypescript,
    ],
  },
  {
    label: "Back-End: Node.js, Express, NestJS, Firebase",
    icons: [SiNodedotjs, SiExpress, SiNestjs, SiFirebase],
  },
  {
    label: "Databases: MySQL, MSSQL, PostgreSQL",
    icons: [SiMysql, SiPostgresql],
  },
] as const;

const services = [
  {
    title: "Full Website Builds",
    description:
      "Designing and developing complete web experiences with fast performance, strong accessibility, and maintainable architecture.",
    highlights: [
      "Responsive UI/UX",
      "SEO-ready structure",
      "Optimized asset pipeline",
    ],
  },
  {
    title: "Custom Dashboards & Integrations",
    description:
      "Building interactive dashboards, data visualizations, and admin tools powered by secure APIs and real-time data flows.",
    highlights: [
      "API integrations",
      "Role-based access",
      "Analytics visualization",
    ],
  },
  {
    title: "Automation & AI Enhancements",
    description:
      "Embedding AI features and smart automations into existing products to streamline workflows and personalize user journeys.",
    highlights: [
      "AI chat & recommendations",
      "Workflow automation",
      "Scalable infrastructure",
    ],
  },
] as const;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function MainContent() {
  const location = useLocation();
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const activeHash = location.hash.toLowerCase();
  const activeAnchorId =
    activeHash.startsWith("#") && activeHash.length > 1
      ? activeHash.slice(1)
      : activeHash;

  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const targetId = location.hash.slice(1).toLowerCase();
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setFocusedId(targetId);
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (event: Event) => {
      const detail = (event as CustomEvent<SectionFocusDetail>).detail;
      if (!detail) return;
      const nextId = (detail.highlightId ?? detail.targetId).toLowerCase();
      setFocusedId(nextId);
    };

    window.addEventListener("section-focus", handler as EventListener);
    return () =>
      window.removeEventListener("section-focus", handler as EventListener);
  }, []);

  return (
  <main className="mx-auto w-full max-w-6xl space-y-14 px-4 py-12 sm:space-y-16 sm:px-6 sm:py-16 lg:max-w-7xl lg:space-y-20 lg:px-8 xl:space-y-24 2xl:max-w-[1320px] 2xl:px-10">
    <Reveal direction="up">
      <section className="flex flex-col items-center gap-12 rounded-[2.25rem] border border-border/60 bg-background/80 p-6 shadow-xl shadow-[#3b82f6]/10 backdrop-blur sm:p-8 lg:flex-row lg:items-center lg:gap-16 lg:rounded-[2.5rem] lg:p-12">
        <div className="order-2 w-full max-w-2xl text-center lg:order-1 lg:text-left">
          <Reveal delay={0.05} direction="up">
            <div className="inline-block rounded-full bg-[#3b82f6]/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#3b82f6] sm:text-sm">
              About
            </div>
          </Reveal>

          <Reveal delay={0.1} direction="up">
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:mt-6 sm:text-3xl lg:text-4xl">
              Who Am I?
            </h2>
          </Reveal>

          <Reveal delay={0.16} direction="up">
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:text-base lg:text-lg">
              I&#39;m Awab Mostafa, a full-stack web developer. On the front end I work with HTML, CSS, Tailwind, React, and TypeScript to ship accessible, responsive interfaces. On the back end I build RESTful APIs with Node.js (Express/NestJS) and Firebase services where it makes sense. I design and optimize databases in MySQL, MSSQL, PostgreSQL and Supabase focusing on clear schemas and efficient queries. My goal is simple: deliver maintainable code, fast load times, and features that are easy to extend.
            </p>
          </Reveal>


            <div className="mt-8 grid w-full gap-4">
              {skillGroups.map((group, index) => (
                <Reveal
                  key={group.label}
                  delay={0.22 + index * 0.08}
                  className="h-full"
                >
                  <div className="flex h-full flex-col items-center gap-4 rounded-[3rem] border border-[#3b82f6]/35 bg-[#3b82f6]/10 px-6 py-5 text-[#3b82f6] shadow-sm sm:flex-row sm:justify-between sm:gap-6 sm:px-8 sm:py-6 lg:px-10">
                    <div className="flex flex-wrap justify-center gap-3 text-[#3b82f6] sm:justify-start">
                      {group.icons.map((Icon, iconIndex) => (
                        <Icon
                          key={iconIndex}
                          className="h-8 w-8 text-[#3b82f6] md:h-9 md:w-9"
                        />
                      ))}
                    </div>
                    <p className="text-center text-sm font-semibold leading-relaxed sm:text-right sm:text-base md:text-lg">
                      {group.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.28} className="order-1 w-full max-w-sm lg:order-2">
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-[2.75rem] bg-gradient-to-tr from-[#3b82f6]/30 via-foreground/5 to-transparent blur-3xl sm:rounded-[3rem]" />
              <img
                src={heroIllustration}
                alt="Creative collaboration illustration"
                className="mx-auto w-full max-w-[220px] rounded-[2.75rem] border border-[#3b82f6]/40 shadow-[0_30px_90px_-40px_rgba(59,130,246,0.7)] sm:max-w-xs sm:rounded-[3rem] lg:max-w-sm"
              />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-border/40 bg-background/80 px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground shadow-lg backdrop-blur sm:text-sm">
                Web Dev
              </div>
            </div>
          </Reveal>
        </section>
      </Reveal>

      <section id="services" className="space-y-8 scroll-mt-32">
        <Reveal direction="up">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#3b82f6]/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#3b82f6] sm:text-sm">
              Services
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              What I Deliver
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm text-muted-foreground sm:text-base lg:text-lg">
              Whether you need a fresh product, a dashboard to guide decisions,
              or new AI features, I help teams ship reliable software with a
              polished experience end to end.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const serviceSlug = slugify(service.title);
            const serviceId = `service-${serviceSlug}`;
            const highlightIds = service.highlights.map(
              (point) => `${serviceId}-${slugify(point)}`
            );
            const isServiceActive =
              activeAnchorId === serviceId ||
              highlightIds.includes(activeAnchorId) ||
              focusedId === serviceId ||
              (focusedId !== null && highlightIds.includes(focusedId));

            return (
  <Reveal
    key={service.title}
    delay={0.12 + index * 0.08}
    className="h-full"
  >
    <Card
      id={serviceId}
      className={cn(
        "h-full scroll-mt-32 border border-border/60 bg-background/85 shadow-lg shadow-[#3b82f6]/10 transition hover:-translate-y-2 hover:shadow-xl",
        isServiceActive &&
          "border-[#3b82f6] bg-[#3b82f6]/10 shadow-xl shadow-[#3b82f6]/20",
      )}
    >
      <CardHeader className="space-y-3">
        <CardTitle className="text-xl font-semibold text-foreground/90 sm:text-2xl">
          {service.title}
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          {service.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2 text-sm text-muted-foreground sm:text-base">
        {service.highlights.map((point) => {
          const highlightSlug = slugify(point);
          const highlightId = `${serviceId}-${highlightSlug}`;
          const isHighlightActive =
            activeAnchorId === highlightId || focusedId === highlightId;

          return (
            <button
              type="button"
              key={point}
              id={highlightId}
              onClick={() => focusSection(serviceId, highlightId)}
              className={cn(
                "flex items-center gap-2 rounded-full border border-[#3b82f6]/20 bg-[#3b82f6]/5 px-3 py-2 text-left text-[#3b82f6] transition hover:border-[#3b82f6]/40 hover:bg-[#3b82f6]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6]/40",
                isHighlightActive &&
                  "border-[#3b82f6]/60 bg-[#3b82f6]/20 text-[#3b82f6] shadow-inner",
              )}
            >
              <span className="h-2 w-2 rounded-full bg-[#3b82f6]" />
              <span>{point}</span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  </Reveal>
);
})}
</div>
</section>

{/* Contact CTA at the very end */}
<Reveal direction="up">
  <section id="contact-cta" className="scroll-mt-32">
    <Card className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/85 shadow-xl shadow-[#3b82f6]/10 backdrop-blur-sm">
      {/* soft gradient glow background, preserves look & feel */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-tr from-[#3b82f6]/20 via-transparent to-foreground/5 blur-2xl" />

      <CardHeader className="space-y-2 text-center sm:text-left">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#3b82f6]/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#3b82f6] sm:mx-0 sm:text-sm">
          Contact
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Ready to build something great?
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          I’m available for freelance and collaborations. Let’s talk about your
          idea and how we can ship it fast with quality.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-center text-sm text-muted-foreground sm:text-left sm:text-base">
          Send me a message and I’ll get back to you shortly.
        </p>

        <Button
          asChild
          aria-label="Go to contact page"
          className="rounded-3xl border border-[#3b82f6]/40 bg-[#3b82f6]/10 px-5 py-3 text-[#3b82f6]"

        >
          <Link to="/contact">
            <span className="flex items-center gap-2 text-base font-semibold tracking-wide">
              <FiMail className="h-5 w-5 transition-transform group-hover:-rotate-6" />
              Contact Me
            </span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  </section>
</Reveal>
</main>
);
}

export default MainContent;
