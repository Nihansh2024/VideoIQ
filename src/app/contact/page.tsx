"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Mail, MessageSquare, Clock, MapPin, Send, CheckCircle2 } from "lucide-react";

const TOPICS = [
  { value: "general", label: "General Inquiry" },
  { value: "support", label: "Technical Support" },
  { value: "refund", label: "Refund Request" },
  { value: "billing", label: "Billing Question" },
  { value: "partnership", label: "Partnership / Business" },
  { value: "privacy", label: "Privacy / Data Request" },
];

const CONTACT_CARDS = [
  {
    icon: Mail,
    title: "Email Support",
    primary: "info.videoiq@gmail.com",
    secondary: "General inquiries & technical support",
    href: "mailto:info.videoiq@gmail.com",
  },
  {
    icon: MessageSquare,
    title: "Privacy Team",
    primary: "info.videoiq@gmail.com",
    secondary: "Data requests & privacy questions",
    href: "mailto:info.videoiq@gmail.com",
  },
  {
    icon: Clock,
    title: "Response Time",
    primary: "Within 24 business hours",
    secondary: "Mon–Sat, 9 AM – 7 PM IST",
    href: undefined,
  },
  {
    icon: MapPin,
    title: "Office Address",
    primary: "Pune, Maharashtra",
    secondary: "India — 411014",
    href: undefined,
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Front-end only — opens user's mail client with prefilled content
    const subject = encodeURIComponent(
      `[VideoIQ Contact] ${form.topic ? `[${form.topic}] ` : ""}${form.subject || "Inquiry"}`
    );
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nTopic: ${form.topic}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:info.videoiq@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to VideoIQ
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            Contact <span className="gradient-text">Us</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl text-[15px] leading-relaxed">
            Have a question about VideoIQ, a feature request, or need help with your subscription?
            Our team is here to help. Fill out the form below and we'll get back to you within 24
            business hours.
          </p>
        </header>

        {/* Contact info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {CONTACT_CARDS.map((card) => {
            const Icon = card.icon;
            const content = (
              <div className="h-full p-5 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 hover:border-border transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">{card.title}</p>
                <p className="font-semibold text-sm mb-1 break-words">{card.primary}</p>
                <p className="text-xs text-muted-foreground">{card.secondary}</p>
              </div>
            );
            return card.href ? (
              <a key={card.title} href={card.href} className="block h-full">
                {content}
              </a>
            ) : (
              <div key={card.title} className="h-full">
                {content}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="p-8 rounded-xl border border-border/50 bg-muted/30 text-center">
                <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Your message is ready to send</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                  We've opened your email client with the message pre-filled. If nothing happened,
                  please email us directly at info.videoiq@gmail.com.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-6 sm:p-8 rounded-xl border border-border/50 bg-muted/20 space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Select value={form.topic} onValueChange={(v) => setForm({ ...form, topic: v })}>
                    <SelectTrigger id="topic">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOPICS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Brief summary of your inquiry"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help..."
                    className="resize-none"
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  By submitting, you agree to our Privacy Policy. We never share your information
                  with third parties.
                </p>
              </form>
            )}
          </div>

          {/* Side info */}
          <aside className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-xl border border-border/50 bg-muted/20">
              <h3 className="font-semibold mb-3">Response Times</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex justify-between">
                  <span>General inquiries</span>
                  <span className="text-foreground">24 hrs</span>
                </li>
                <li className="flex justify-between">
                  <span>Technical support</span>
                  <span className="text-foreground">24 hrs</span>
                </li>
                <li className="flex justify-between">
                  <span>Refund requests</span>
                  <span className="text-foreground">48 hrs</span>
                </li>
                <li className="flex justify-between">
                  <span>Privacy requests</span>
                  <span className="text-foreground">30 days</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl border border-border/50 bg-muted/20">
              <h3 className="font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/terms"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms and Conditions →
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy →
                  </Link>
                </li>
                <li>
                  <Link
                    href="/refunds"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancellation & Refunds →
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Shipping Policy →
                  </Link>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-red-600/10 to-red-500/5 border border-red-500/20">
              <h3 className="font-semibold mb-2">Pro Support</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Pro subscribers receive priority handling. Include your account email for faster
                verification.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
