import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, Moon, Sun, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"

type NavLink = {
  to: string
  label: string
  hash?: string
}

const links: NavLink[] = [
  { to: "/", label: "Who am I?" },
  { to: "/WebProjects", label: "Web Projects" },
  { to: "/contact", label: "Contact" },
]

function Navbar() {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname, location.hash])

  const isLinkActive = (link: NavLink) => {
    if (link.hash) {
      return location.pathname === link.to && location.hash === link.hash
    }

    if (link.to === "/") {
      return location.pathname === "/" && !location.hash
    }

    return (
      location.pathname === link.to ||
      location.pathname.startsWith(`${link.to}/`)
    )
  }

  const linkTarget = (link: NavLink) =>
    link.hash ? `${link.to}${link.hash}` : link.to

  return (
<motion.div
  className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur-xl"
  initial={{ y: -40, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
>
  <motion.nav
    className="mx-auto w-full max-w-5xl px-4 py-3 sm:px-6 md:py-4"
    initial={false}
  >
    <div className="flex items-center justify-between">
      <motion.div whileTap={{ scale: 0.95 }} className="sm:hidden">
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={() => setIsOpen((prev) => !prev)}
          className="h-10 w-10 rounded-full border-border/70 bg-background text-foreground shadow-md shadow-[#3b82f6]/10 transition hover:border-[#3b82f6]/60 hover:bg-[#3b82f6]/10 hover:text-[#3b82f6] dark:bg-background/70"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? (
            <X className="h-5 w-5" strokeWidth={1.8} />
          ) : (
            <Menu className="h-5 w-5" strokeWidth={1.8} />
          )}
        </Button>
      </motion.div>

      <motion.div
        className="hidden flex-1 items-center justify-center gap-6 text-base font-semibold text-foreground/80 sm:flex sm:gap-10 md:text-lg"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {links.map((item, index) => {
          const active = isLinkActive(item);

          return (
            <motion.div
              key={`${item.to}${item.hash ?? ""}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.05, duration: 0.35 }}
            >
              <Link
                to={linkTarget(item)}
                className="group relative px-2 transition-colors duration-300 hover:text-[#3b82f6]"
              >
                <span className="relative z-10">{item.label}</span>
                <span
                  className={`pointer-events-none absolute left-0 top-full h-1 w-full origin-left rounded-full bg-[#3b82f6] transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }}>
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={toggleTheme}
          className="h-10 w-10 shrink-0 rounded-full border-border/70 bg-background text-foreground shadow-md shadow-[#3b82f6]/10 transition hover:-translate-y-1 hover:border-[#3b82f6]/60 hover:bg-[#3b82f6]/10 hover:text-[#3b82f6] dark:bg-background/70 sm:h-11 sm:w-11"
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" strokeWidth={1.8} />
          ) : (
            <Moon className="h-5 w-5" strokeWidth={1.8} />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </motion.div>
    </div>

    <AnimatePresence initial={false}>
      {isOpen ? (
        <motion.div
          key="mobile-menu"
          className="grid gap-2 pt-3 sm:hidden"
          initial={{ opacity: 0, height: 0, y: -12 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {links.map((item) => {
            const active = isLinkActive(item);

            return (
              <motion.div
                key={`${item.to}${item.hash ?? ""}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Link
                  to={linkTarget(item)}
                  className={`block rounded-full border px-4 py-2 text-center text-sm font-semibold transition duration-200 ${
                    active
                      ? "border-[#3b82f6]/60 bg-[#3b82f6]/10 text-[#3b82f6]"
                      : "border-border/70 bg-background/95 text-foreground/80 hover:border-[#3b82f6]/40 hover:text-[#3b82f6]"
                  }`}
                >
                  {item.label}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      ) : null}
    </AnimatePresence>
  </motion.nav>

  <motion.div
    className="h-1 w-full bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent opacity-80"
    initial={{ scaleX: 0 }}
    animate={{ scaleX: 1 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
  />
</motion.div>

  )
}

export default Navbar
