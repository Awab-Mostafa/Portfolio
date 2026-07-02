import { motion } from "framer-motion"

import Reveal from "@/components/animations/reveal"
import { Button } from "@/components/ui/button"
import { Github, Instagram, Linkedin } from "lucide-react"

const profileImage = "/profile_512w.webp"

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mohamed-mahmoud-7117a1306?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    icon: Linkedin,
  },
  {
    label: "GitHub",
    href: "https://github.com/Mohamedalmasr",
    icon: Github,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/mohamedvvv018?igsh=MXdheXliMGxmZXFzcg==",
    icon: Instagram,
  },
]

function Header() {
  return (
    <header className="relative isolate overflow-hidden">
      <motion.div
       className="absolute inset-0 -z-10 h-[220px] w-full bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.22),_transparent_55%),linear-gradient(135deg,rgba(59,130,246,0.1),transparent)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.32),_rgba(12,12,12,0.92))] sm:h-[260px] lg:h-[320px]"

        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-14 pt-14 sm:px-6 md:flex-row md:items-end md:justify-between md:gap-12 md:pb-20 md:pt-16 lg:max-w-7xl lg:px-8 xl:pt-20 2xl:max-w-[1320px] 2xl:px-10">
        <Reveal className="flex flex-col items-center gap-8 text-center md:flex-row md:items-end md:gap-12 md:text-left">
          <motion.div
            className="relative flex shrink-0 items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="absolute inset-0 -z-10 h-32 w-32 rounded-full bg-gradient-to-br from-[#3b82f6]/45 via-transparent to-transparent blur-3xl sm:h-36 sm:w-36 md:h-48 md:w-48 md:blur-2xl"

              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            />
            <motion.div
              className="h-28 w-28 overflow-hidden rounded-full border-4 border-[#3b82f6
]/80 shadow-2xl ring-4 ring-background/60 sm:h-32 sm:w-32 md:h-44 md:w-44 lg:h-48 lg:w-48"
              style={{
                backgroundImage: `url(${encodeURI(profileImage)})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
              whileHover={{ rotate: -2, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />
          </motion.div>

          <div className="space-y-6 sm:space-y-7 lg:space-y-8">
            <Reveal delay={0.1}>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground/90 sm:text-3xl md:text-4xl lg:text-5xl">
                Awab Mostafa Saad               </h1>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#3b82f6
]/40 bg-[#3b82f6
]/10 px-4 py-1.5 text-sm font-medium text-[#3b82f6
] shadow-sm backdrop-blur transition hover:border-[#3b82f6
]/60 hover:bg-[#3b82f6
]/15 sm:px-5 sm:py-2 sm:text-base md:text-lg">
                <span className="font-mono text-lg sm:text-xl">&lt;/&gt;</span>
                <span>Web Developer</span>
              </div>
            </Reveal>
            <Reveal delay={0.26}>
              <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base md:mx-0 md:max-w-2xl md:text-lg">
                Full-stack web developer building fast, clean UIs with
                React/TypeScript and reliable Node.js APIs backed by MySQL,
                MSSQL,subabase and PostgreSQL.
              </p>
            </Reveal>
          </div>
        </Reveal>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:justify-end md:gap-5">
          {socials.map(({ label, href, icon: Icon }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: 0.3 + index * 0.08,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -6 }}
            >
              <Button
                asChild
                size="icon-lg"
                variant="outline"
                className="h-12 w-12 rounded-full border-border/60 bg-background/70 text-foreground shadow-lg shadow-[#3b82f6
]/10 transition-all hover:border-[#3b82f6
]/70 hover:bg-[#3b82f6
]/10 hover:text-[#3b82f6
] dark:bg-background/60 sm:h-14 sm:w-14 md:h-16 md:w-16"
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.75} />
                </a>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </header>
  )
}

export default Header
