import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | VideoIQ",
  description:
    "Learn how VideoIQ collects, uses, and protects your personal information when you use our AI-powered YouTube analytics platform.",
};

const LAST_UPDATED = "June 24, 2026";

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    body: [
      "VideoIQ (\"we\", \"us\", or \"our\") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains what information we collect when you use our AI-powered YouTube upload timing analytics platform (the \"Service\"), how we use it, and the choices you have over your data.",
      "This policy complies with the Digital Personal Data Protection Act, 2023 (DPDP Act) of India and aligns with international best practices including the GDPR and CCPA where applicable to Indian users. By using the Service, you consent to the data practices described in this policy.",
      "If you do not agree with the practices described here, you should not use the Service. We may update this Privacy Policy from time to time; significant changes will be communicated via email or in-app notification at least 14 days before they take effect.",
    ],
  },
  {
    id: "data-we-collect",
    title: "2. Information We Collect",
    body: [
      "Information you provide directly: When you create an account or subscribe to Pro, we collect your email address, name (optional), billing name, and transaction metadata (excluding full card numbers, which are handled entirely by Razorpay). When you contact support, we collect the contents of your message.",
      "Information collected automatically: We collect technical data such as IP address, browser type and version, device identifiers, referring URLs, pages visited within the Service, and timestamps. This data is collected via cookies and similar tracking technologies described in Section 4 below.",
      "YouTube data you submit: When you analyze a YouTube video, we receive the video URL you enter. We use the YouTube Data API to retrieve publicly available statistics for that video (view count, like count, comment count, publish date, and category). We do not request or store your private YouTube Analytics data or OAuth tokens.",
    ],
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Information",
    body: [
      "We use your information to: (a) provide, operate, and maintain the Service; (b) create and process analytics reports including PDF exports; (c) process payments and verify subscription status; (d) send you service-related notifications such as subscription renewals and security alerts; (e) respond to your support requests and feedback; (f) monitor and analyze usage patterns to improve our AI models, features, and user experience; and (g) detect, prevent, and address technical issues, fraud, and abuse of the Service.",
      "We do not sell your personal information to any third party. We do not use your data to train AI models that are shared with or licensed to other organizations. Any model training we conduct is solely to improve the Service for all users.",
      "Where we rely on consent as the legal basis for processing (e.g., marketing emails), you may withdraw consent at any time by following the unsubscribe link in our emails or contacting us at privacy@videoiq.app.",
    ],
  },
  {
    id: "cookies",
    title: "4. Cookies and Tracking Technologies",
    body: [
      "We use cookies and similar tracking technologies (local storage, session storage, pixel tags) to authenticate sessions, remember preferences, measure traffic, and detect abuse. Cookies are small text files stored on your device; they do not contain malware and do not grant us access to your device.",
      "We classify cookies into four categories: strictly necessary (authentication, security), functional (theme preference), performance (anonymous usage analytics), and marketing (if applicable, opt-in only). Strictly necessary cookies cannot be disabled as the Service will not function without them.",
      "You can manage cookie preferences through your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are being sent. Note that disabling strictly necessary cookies may prevent you from logging in or using the Service.",
    ],
  },
  {
    id: "data-sharing",
    title: "5. Data Sharing and Sub-Processors",
    body: [
      "We share personal data with the following categories of trusted third-party service providers, who process data on our behalf under written agreements that meet the standards of the DPDP Act: (a) Razorpay — payment processing and subscription management; (b) Google Cloud / YouTube Data API — public video metadata retrieval; (c) Vercel / cloud hosting providers — application hosting and content delivery; (d) transactional email providers — for service notifications.",
      "We may also disclose information when required by law, court order, or government request, or when we believe in good faith that disclosure is necessary to protect our rights, the safety of any person, or to investigate fraud or security issues.",
      "We do not transfer your personal data outside of India except where required to deliver the Service (e.g., using global cloud infrastructure). Where such transfers occur, we ensure they are protected by appropriate safeguards such as Standard Contractual Clauses or equivalent mechanisms.",
    ],
  },
  {
    id: "data-retention",
    title: "6. Data Retention",
    body: [
      "We retain personal data only as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Account data is retained for the lifetime of your account plus 30 days after deletion. Payment records are retained for 7 years as required by Indian tax law.",
      "Anonymous, aggregated usage data may be retained indefinitely for product analytics and AI model training, as it can no longer be linked to an identifiable individual.",
      "You may request early deletion of your account and associated data at any time by contacting info.videoiq@gmail.com. We will process such requests within 30 days, subject to legal retention obligations.",
    ],
  },
  {
    id: "your-rights",
    title: "7. Your Privacy Rights",
    body: [
      "Under the DPDP Act and similar regulations, you have the right to: (a) access the personal data we hold about you; (b) request correction of inaccurate or incomplete data; (c) request deletion of your personal data (\"right to be forgotten\"); (d) request a portable copy of your data in a structured, machine-readable format; (e) object to or restrict certain processing activities; and (f) withdraw consent for consent-based processing.",
      "To exercise any of these rights, please email info.videoiq@gmail.com with the subject line \"Privacy Rights Request\" and include your account email. We will verify your identity before processing the request and respond within 30 days.",
      "If you are unsatisfied with our response, you have the right to lodge a complaint with the Data Protection Board of India or your local data protection authority.",
    ],
  },
  {
    id: "security",
    title: "8. Data Security",
    body: [
      "We implement industry-standard technical and organizational measures to protect your personal data, including: TLS encryption in transit, AES-256 encryption at rest for sensitive fields, role-based access controls with least-privilege principles, regular security audits, and continuous monitoring for suspicious activity.",
      "Despite our best efforts, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security, but we are committed to investigating and mitigating any breach in accordance with applicable law.",
      "In the event of a personal data breach, we will notify affected users and the relevant Data Protection Authority within 72 hours of becoming aware of the breach, as required by the DPDP Act.",
    ],
  },
  {
    id: "children",
    title: "9. Children's Privacy",
    body: [
      "The Service is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at privacy@videoiq.app.",
      "If we become aware that we have collected personal data from a child under 13 without parental consent, we will take steps to delete such information as soon as possible.",
    ],
  },
  {
    id: "changes",
    title: "10. Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will post the updated policy on this page with a revised \"Last updated\" date.",
      "For material changes that affect your rights, we will provide notice via email or a prominent in-app banner at least 14 days before the changes take effect. We encourage you to review this page periodically.",
    ],
  },
  {
    id: "contact",
    title: "11. Contact Us",
    body: [
      "If you have any questions, requests, or concerns about this Privacy Policy or our data practices, please contact our Data Protection Officer at privacy@videoiq.app or write to us at: VideoIQ, Privacy Team, Bengaluru, Karnataka, India. We aim to respond within two business days.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to VideoIQ
        </Link>

        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </header>

        <div className="prose prose-invert max-w-none space-y-10">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-20">
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-foreground">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.body.map((paragraph, idx) => (
                  <p key={idx} className="text-muted-foreground leading-relaxed text-[15px]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 p-6 rounded-xl border border-border/50 bg-muted/30">
          <h3 className="font-semibold mb-2">Want to exercise your privacy rights?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Email us at info.videoiq@gmail.com or use our contact form to get started.
          </p>
          <Link href="/contact">
            <Button>Contact Our Privacy Team</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
