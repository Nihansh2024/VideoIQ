"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Clock, Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Facebook, Twitter, Youtube, Instagram,
} from "@/components/social-icons";

const CONTACT_EMAIL = "info.videoiq@gmail.com";
const CONTACT_ADDRESS = "Pune, Maharashtra, India — 411014";
const SOCIAL_LINKS = [
  { label: "YouTube", icon: Youtube, url: "https://youtube.com/@videoiq-2026?si=-ZL5R5oSIkvW3_49" },
  { label: "Facebook", icon: Facebook, url: "https://www.facebook.com/profile.php?id=61591618310725" },
  { label: "X (Twitter)", icon: Twitter, url: "https://x.com/VideoIQ2026" },
  { label: "Instagram", icon: Instagram, url: "https://www.instagram.com/videoiq2026/" },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorText("Please fill in your name, email, and message.");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setErrorText("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    try {
      // Open the user's email client with a pre-filled message addressed to us.
      // This is the simplest no-backend contact form that works reliably.
      const mailtoSubject = encodeURIComponent(subject.trim() || `VideoIQ contact from ${name}`);
      const mailtoBody = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}\n\n— Sent from the VideoIQ Contact page`
      );
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`;
      // Mark as success after a short delay (give the mailto a moment to open).
      setTimeout(() => setStatus("success"), 1500);
    } catch (err) {
      setStatus("error");
      setErrorText("Something went wrong. Please email us directly at " + CONTACT_EMAIL);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Contact <span className="gradient-text">VideoIQ</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have a question, suggestion, or need help with your subscription? We&apos;d love to hear
            from you. Our team typically responds within 1 business day.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Contact info */}
          <div className="space-y-6">
            {/* Email */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand to-brand-purple flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold mb-1">Email Us</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    For support, billing, or general inquiries.
                  </p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-sm font-medium text-brand hover:underline break-all"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-purple to-pink-500 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Our Address</h3>
                  <p className="text-sm text-muted-foreground">
                    {CONTACT_ADDRESS}
                  </p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-cyan to-brand flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Support Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    Monday – Saturday<br />
                    10:00 AM – 7:00 PM IST
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Typical response time: within 1 business day
                  </p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold mb-3">Follow Us</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Stay updated with the latest YouTube growth tips, feature releases, and creator
                stories on our social channels.
              </p>
              <div className="flex flex-wrap gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit VideoIQ on ${social.label}`}
                    title={social.label}
                    className="w-10 h-10 rounded-xl bg-muted/60 hover:bg-gradient-to-br hover:from-brand hover:to-brand-purple border border-border hover:border-brand/30 transition-all flex items-center justify-center group"
                  >
                    <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact form */}
          <div className="p-6 rounded-2xl bg-card border border-border">
            {status === "success" ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Message Ready!</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                  Your email app should have opened with a pre-filled message to us. If not, please
                  email us directly at{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-brand hover:underline font-medium"
                  >
                    {CONTACT_EMAIL}
                  </a>.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatus("idle");
                    setName("");
                    setEmail("");
                    setSubject("");
                    setMessage("");
                  }}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-semibold text-lg mb-4">Send us a message</h3>

                <div>
                  <Label htmlFor="name" className="text-sm mb-1.5 block">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-10"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm mb-1.5 block">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10"
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-sm mb-1.5 block">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What is this about?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm mb-1.5 block">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    className="resize-none"
                  />
                </div>

                {errorText && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {errorText}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full h-11 bg-gradient-to-r from-brand to-brand-purple text-white hover:opacity-90"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Opening your email app...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting, you agree to be contacted at the email you provided.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Quick FAQ teaser */}
        <div className="mt-16 p-6 rounded-2xl bg-gradient-to-br from-brand/5 to-brand-purple/5 border border-brand/20 text-center">
          <h3 className="font-semibold mb-2">Looking for quick answers?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Visit our FAQ section for instant answers to common questions about pricing, features,
            and how VideoIQ works.
          </p>
          <Button asChild variant="outline">
            <Link href="/#faq">View FAQ</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
