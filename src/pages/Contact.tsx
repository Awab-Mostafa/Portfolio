import { FormEvent, useMemo, useState } from "react"
import { Send } from "lucide-react"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"

import Reveal from "@/components/animations/reveal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { db } from "@/lib/firebase"

type SubmitStatus = "idle" | "submitting" | "success" | "error"

function Contact() {
  const [status, setStatus] = useState<SubmitStatus>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const categories = useMemo(
    () => ["General", "Web Design", "Redesign", "Branding", "SEO", "Consultation"],
    [],
  )
  const [category, setCategory] = useState(categories[0])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === "submitting") return

    const form = event.currentTarget
    const formData = new FormData(form)
    const name = (formData.get("name") ?? "").toString().trim()
    const email = (formData.get("email") ?? "").toString().trim()
    const text = (formData.get("message") ?? "").toString().trim()

    if (!name || !email || !text) {
      setErrorMessage("Please fill in all required fields.")
      return
    }

    try {
      setStatus("submitting")
      setErrorMessage(null)
      const messageRef = await addDoc(collection(db, "messages"), {
        name,
        email,
        text,
        category,
        createdAt: serverTimestamp(),
      })
      await addDoc(collection(db, "notifications"), {
        title: `New message from ${name}`,
        body: text.length > 140 ? `${text.slice(0, 137)}...` : text,
        read: false,
        createdAt: serverTimestamp(),
        type: "message",
        messageId: messageRef.id,
        email,
        category,
      })
      setStatus("success")
      form.reset()
      setCategory(categories[0])
    } catch (error) {
      console.error("Failed to send message:", error)
      setErrorMessage("Something went wrong. Please try again.")
      setStatus("error")
    } finally {
      setTimeout(() => {
        setStatus("idle")
      }, 2500)
    }
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Reveal direction="up">
        <header className="mb-12 text-center sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#3b82f6
]/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#3b82f6
] sm:text-sm">
            Contact
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:mt-6 sm:text-4xl">
            Let&apos;s build something remarkable
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Share your idea, collaboration, or project brief. I&apos;ll get back
            to you within 24 hours with next steps that align with your vision
            and timeline.
          </p>
        </header>
      </Reveal>

      <Reveal direction="up" delay={0.12}>
        <Card className="border-dashed border-border/60 bg-background/85 shadow-xl shadow-[#3b82f6
]/15 backdrop-blur">
          <CardContent>
            <form
              onSubmit={handleSubmit}
            className="grid gap-6 text-left"
            noValidate
          >
              <div className="grid gap-2">
                <label
                  htmlFor="name"
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-sm"
                >
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  autoComplete="name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-sm"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="category"
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-sm"
                >
                  Category
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="message"
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-sm"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about your project"
                  rows={6}
                  required
                />
              </div>
              {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
              {status === "success" && (
                <p className="text-sm text-emerald-500">
                  Thank you! Your message has been sent successfully.
                </p>
              )}
              <Button
                type="submit"
                disabled={status === "submitting"}
                className="group h-12 w-full justify-center gap-2 rounded-2xl border-none bg-[#3b82f6
] px-6 text-sm font-semibold text-white shadow-lg shadow-[#3b82f6
]/30 transition hover:bg-[#3b82f6
]/90 focus-visible:ring-[#3b82f6
]/40 disabled:opacity-70 sm:w-auto sm:text-base"
              >
                {status === "submitting" ? "Sending..." : "Send Message"}
                <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </Reveal>
    </section>
  )
}

export default Contact
