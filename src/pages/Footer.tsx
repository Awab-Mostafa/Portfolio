import { Button } from "@/components/ui/button"
import { focusSection } from "@/lib/focus-section"
import { Github, Instagram, Linkedin, MessageCircle } from "lucide-react"

const headingClass =
  "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#3b82f6] sm:text-sm";


type QuickLink =
  | { label: string; href: string }
  | { label: string; targetId: string; highlightId?: string }

const quickLinks: QuickLink[] = [
  { label: "Who am I?", href: "/" },
  {
    label: "Services",
    targetId: "services",
    highlightId: "service-full-website-builds",
  },
  { label: "Web Projects", href: "/WebProjects" },
  { label: "Contact", href: "/contact" },
]

type ServiceHighlightLink = {
  label: string
  targetId: string
}

type ServiceLink = {
  label: string
  targetId: string
  highlights: ServiceHighlightLink[]
}

const servicesLinks: ServiceLink[] = [
  {
    label: "Full Website Builds",
    targetId: "service-full-website-builds",
    highlights: [
      {
        label: "Responsive UI/UX",
        targetId: "service-full-website-builds-responsive-ui-ux",
      },
      {
        label: "SEO-ready structure",
        targetId: "service-full-website-builds-seo-ready-structure",
      },
      {
        label: "Optimized asset pipeline",
        targetId: "service-full-website-builds-optimized-asset-pipeline",
      },
    ],
  },
  {
    label: "Custom Dashboards & Integrations",
    targetId: "service-custom-dashboards-integrations",
    highlights: [
      {
        label: "API integrations",
        targetId: "service-custom-dashboards-integrations-api-integrations",
      },
      {
        label: "Role-based access",
        targetId: "service-custom-dashboards-integrations-role-based-access",
      },
      {
        label: "Analytics visualization",
        targetId: "service-custom-dashboards-integrations-analytics-visualization",
      },
    ],
  },
  {
    label: "Automation & AI Enhancements",
    targetId: "service-automation-ai-enhancements",
    highlights: [
      {
        label: "AI chat & recommendations",
        targetId: "service-automation-ai-enhancements-ai-chat-recommendations",
      },
      {
        label: "Workflow automation",
        targetId: "service-automation-ai-enhancements-workflow-automation",
      },
      {
        label: "Scalable infrastructure",
        targetId: "service-automation-ai-enhancements-scalable-infrastructure",
      },
    ],
  },
] as const

type ContactDetail = {
  label: string
  value: string
  href?: string
}

const contactDetails: ContactDetail[] = [
  {
    label: "Email",
    value: "awabmostafa222@outlook.com",
    href: "mailto:awabmostafa222@outlook.com",
  },
  { label: "Phone", value: "01553141469", href: "tel:+201553141469" },
  { label: "Address", value: "Egypt" },
]

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mohamed-mahmoud-7117a1306?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    icon: Linkedin,
  },
  {
    label: "GitHub",
    href: "https://github.com/Awab-Mostafa",
    icon: Github,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/awab_mostafa_11/",
    icon: Instagram,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/201553141469",
    icon: MessageCircle,
  },
] as const

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const handleFocus = (targetId: string, highlightId?: string) => () => {
    focusSection(targetId, highlightId)
  }

  return (
    <footer className="relative mt-20 border-t border-[#3b82f6
]/30 bg-[#3b82f6
]/10 text-foreground sm:mt-24">
      <div className="absolute inset-x-0 -top-1 h-1 bg-gradient-to-r from-transparent via-[#3b82f6
] to-transparent opacity-75" />
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:max-w-7xl lg:grid-cols-[1.2fr_1fr_1.1fr_1fr] lg:gap-16 lg:px-8 lg:py-16 2xl:max-w-[1320px] 2xl:px-10">
        <div className="space-y-6">
          <div className={`${headingClass} rounded-full bg-background/70 px-4 py-1`}>
            Connect
          </div>
          <h4 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Building futuristic experiences with design &amp; intelligence.
          </h4>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Let&apos;s collaborate on interfaces that feel alive, accessible, and
            powered by modern AI workflows. Every interaction is crafted to be
            thoughtful, inclusive, and beautifully engineered.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {socials.map(({ label, href, icon: Icon }) => (
              <Button
                key={label}
                asChild
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-full border-border/70 bg-background/80 text-foreground shadow-lg shadow-[#3b82f6
]/10 transition-all hover:-translate-y-1 hover:border-[#3b82f6
]/60 hover:bg-[#3b82f6
]/15 hover:text-[#3b82f6
] dark:bg-background/60 sm:h-12 sm:w-12"
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </a>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h5 className={`${headingClass} px-1`}>Important Links</h5>
          <ul className="space-y-3 text-sm text-muted-foreground sm:text-base">
            {quickLinks.map((link) => (
              <li key={link.label}>
                {"targetId" in link ? (
                  <button
                    type="button"
                    onClick={handleFocus(link.targetId, link.highlightId)}
                    className="inline-flex items-center gap-2 text-foreground/80 transition hover:translate-x-1 hover:text-[#3b82f6
] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6
]/40"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3b82f6
]/70" />
                    {link.label}
                  </button>
                ) : (
                  <a
                    href={link.href}
                    className="inline-flex items-center gap-2 text-foreground/80 transition hover:translate-x-1 hover:text-[#3b82f6
]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3b82f6
]/70" />
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h5 className={`${headingClass} px-1`}>Services</h5>
          <ul className="space-y-4 text-sm text-muted-foreground sm:text-base">
            {servicesLinks.map((service) => (
              <li key={service.label} className="space-y-2">
                <button
                  type="button"
                  onClick={handleFocus(service.targetId)}
                  className="inline-flex items-center gap-2 font-semibold text-foreground/80 transition hover:translate-x-1 hover:text-[#3b82f6
] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6
]/40"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3b82f6
]/70" />
                  {service.label}
                </button>
                <ul className="space-y-1 pl-4 text-xs text-muted-foreground/90 sm:text-sm">
                  {service.highlights.map((item) => (
                    <li key={item.label}>
                      <button
                        type="button"
                        onClick={handleFocus(service.targetId, item.targetId)}
                        className="inline-flex items-center gap-2 transition hover:translate-x-1 hover:text-[#3b82f6
] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6
]/40"
                      >
                        <span className="h-1 w-1 rounded-full bg-[#3b82f6
]/60" />
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h5 className={`${headingClass} px-1`}>Contact</h5>
          <ul className="space-y-3 text-sm text-muted-foreground sm:text-base">
            {contactDetails.map((item) => (
              <li key={item.label} className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/60">
                  {item.label}
                </span>
                {item.href ? (
                  <a
                    href={item.href}
                    className="mt-1 text-foreground/85 transition hover:text-[#3b82f6
]"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="mt-1 text-foreground/85">{item.value}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 bg-background/75">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-center text-xs text-muted-foreground sm:text-sm md:flex-row md:items-center md:justify-between lg:px-8">
          <p>All rights reserved to Awab Mostafa  {currentYear}</p>
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-foreground/60 sm:text-xs">
            Crafted with Full-stack web developer / Front-End / Back-End
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
