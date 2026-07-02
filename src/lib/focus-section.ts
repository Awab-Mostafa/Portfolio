export type SectionFocusDetail = {
  targetId: string
  highlightId?: string
}

export function focusSection(targetId: string, highlightId?: string, offset = 96) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return
  }

  const normalizedTargetId = targetId.toLowerCase()
  const normalizedHighlightId = highlightId?.toLowerCase()

  const target = document.getElementById(normalizedTargetId)
  if (target) {
    const top =
      target.getBoundingClientRect().top + window.scrollY - Math.max(offset, 0)
    window.scrollTo({
      top: top < 0 ? 0 : top,
      behavior: "smooth",
    })
  }

  window.dispatchEvent(
    new CustomEvent<SectionFocusDetail>("section-focus", {
      detail: {
        targetId: normalizedTargetId,
        highlightId: normalizedHighlightId,
      },
    }),
  )
}
