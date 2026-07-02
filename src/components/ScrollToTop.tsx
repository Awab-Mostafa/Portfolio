import { useEffect } from "react"
import { useLocation } from "react-router-dom"

type ScrollToTopProps = {
  children: React.ReactNode
  behavior?: ScrollBehavior
}

function ScrollToTop({ children, behavior = "smooth" }: ScrollToTopProps) {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior,
      })
    }
  }, [pathname, hash, behavior])

  return <>{children}</>
}

export default ScrollToTop
