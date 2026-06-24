import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions | VideoIQ",
  description:
    "Read the Terms and Conditions governing your use of VideoIQ, the AI-powered YouTube upload timing analytics platform.",
};

const LAST_UPDATED = "June 24, 2026";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    body: [
      "By accessing or using VideoIQ (the \"Service\"), you agree to be bound by these Terms and Conditions (\"Terms\"). If you do not agree to any part of these Terms, you must not access or use the Service. These Terms form a legally binding agreement between you (\"User\", \"you\", or \"your\") and VideoIQ (\"Company\", \"we\", \"us\", or \"our\").",
      "We may revise these Terms at any time at our sole discretion. The most current version will always be posted on this page with the \"Last updated\" date at the top. Your continued use of the Service after any changes take effect constitutes your acceptance of the revised Terms. We encourage you to review this page periodically to stay informed of any updates.",
      "If you are using the Service on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms, and in such cases \"you\" and \"your\" shall refer to that organization.",
    ],
  },
  {
    id: "description",
    title: "2. Description of Service",
    body: [
      "VideoIQ is an AI-powered analytics platform that analyzes publicly available YouTube video metadata to help creators identify optimal upload times, engagement patterns, and growth opportunities. The Service uses the YouTube Data API to retrieve public video statistics and applies machine-learning models to surface timing recommendations.",
      "The Service is offered in two tiers: a free tier with limited monthly analyses and a paid \"Pro\" subscription that unlocks unlimited analyses, PDF report export, and advanced insights. Pricing for the Pro tier is displayed on the homepage and may be changed at any time with reasonable advance notice to existing subscribers.",
      "We reserve the right to modify, suspend, or discontinue any feature of the Service at any time, with or without notice. We will not be liable to you or any third party for any such modification, suspension, or discontinuance.",
    ],
  },
  {
    id: "eligibility",
    title: "3. User Eligibility and Accounts",
    body: [
      "You must be at least 13 years of age to use the Service. If you are between 13 and 18 years old, you represent that your parent or legal guardian has reviewed and agreed to these Terms on your behalf. Users in jurisdictions with a higher minimum age for digital consent must meet that higher threshold.",
      "You are responsible for maintaining the confidentiality of any account credentials, payment instruments, and API keys associated with your use of the Service. You agree to notify us immediately at support@videoiq.app of any unauthorized access or security breach.",
      "We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us so we can promptly delete it.",
    ],
  },
  {
    id: "acceptable-use",
    title: "4. Acceptable Use Policy",
    body: [
      "You agree not to: (a) use the Service for any unlawful purpose or in violation of any local, state, national, or international law; (b) attempt to reverse engineer, decompile, or disassemble any part of the Service; (c) scrape, crawl, or otherwise extract data from the Service at scale without our written consent; (d) abuse, overload, or interfere with the Service's infrastructure, including rate-limit bypasses and denial-of-service attempts; (e) submit malicious, infringing, or fraudulent content; or (f) resell, sublicense, or redistribute access to the Service without our written permission.",
      "You also agree to comply with the YouTube API Services Developer Policies, Google's Terms of Service, and any other applicable third-party terms when interacting with YouTube data through the Service. Violations may result in immediate account suspension and forfeiture of any prepaid subscription fees.",
      "We reserve the right to suspend or terminate access for any user who violates this Acceptable Use Policy, with or without prior notice and with no obligation to refund any fees paid.",
    ],
  },
  {
    id: "intellectual-property",
    title: "5. Intellectual Property Rights",
    body: [
      "The Service, including its source code, design, branding, AI models, analytics reports, and documentation, is the exclusive property of VideoIQ and is protected by Indian and international copyright, trademark, and other intellectual-property laws. The \"VideoIQ\" name and logo are trademarks of the Company.",
      "We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for your personal or internal business purposes during the term of these Terms. This license does not include any right to redistribute, resell, or commercially exploit the Service or its outputs without our prior written consent.",
      "You retain all rights to the YouTube video URLs you submit for analysis. We do not claim ownership over your input data, but you grant us a worldwide, royalty-free license to process such inputs solely to provide the Service to you.",
    ],
  },
  {
    id: "payments",
    title: "6. Payments and Subscriptions",
    body: [
      "The Pro subscription is billed in Indian Rupees (INR) through Razorpay, our authorized payment gateway. By subscribing, you authorize us to charge the displayed subscription fee to your selected payment method (UPI, credit/debit card, or net banking, depending on availability).",
      "Subscription fees are non-refundable except as expressly provided in our Cancellation and Refund Policy. If you cancel a subscription, you will retain access to Pro features until the end of the current billing cycle, after which your account will revert to the free tier automatically.",
      "We may change our pricing at any time. Price changes will apply to your next billing cycle following at least 14 days' notice via email or in-app notification. You may cancel before the price change takes effect to avoid being charged at the new rate.",
    ],
  },
  {
    id: "disclaimer",
    title: "7. Disclaimer of Warranties",
    body: [
      "The Service is provided \"AS IS\" and \"AS AVAILABLE\" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, non-infringement, or accuracy of results.",
      "We do not guarantee that the timing recommendations or engagement predictions produced by the Service will result in any specific outcome, including increased views, watch time, or subscriber growth. YouTube's algorithm and audience behavior are influenced by many factors outside our control.",
      "Any reliance on the Service's output is at your sole risk. You should always combine our insights with your own judgment, audience research, and YouTube Studio analytics before making publishing decisions.",
    ],
  },
  {
    id: "liability",
    title: "8. Limitation of Liability",
    body: [
      "To the maximum extent permitted by law, in no event shall VideoIQ, its directors, employees, affiliates, or partners be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, or goodwill, arising out of or related to your use of the Service.",
      "Our total aggregate liability for any claim arising out of or related to the Service shall not exceed the amount you paid us in the 12 months preceding the claim, or one hundred Indian Rupees (₹100), whichever is greater.",
      "The foregoing limitations apply even if we have been advised of the possibility of such damages and notwithstanding any failure of essential purpose of any limited remedy.",
    ],
  },
  {
    id: "indemnification",
    title: "9. Indemnification",
    body: [
      "You agree to indemnify, defend, and hold harmless VideoIQ, its affiliates, and their respective directors, officers, employees, and agents from any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of: (a) your breach of these Terms; (b) your violation of any law or third-party rights; or (c) your misuse of the Service.",
      "We reserve the right to assume the exclusive defense and control of any matter otherwise subject to indemnification by you, in which case you will cooperate with us in asserting any available defenses. You may not settle any matter without our prior written consent.",
    ],
  },
  {
    id: "termination",
    title: "10. Termination",
    body: [
      "You may terminate your account or stop using the Service at any time by contacting support@videoiq.app. No refund will be issued for the remaining portion of any prepaid subscription period except as provided in our Cancellation and Refund Policy.",
      "We may suspend or terminate your access to the Service immediately, without prior notice or liability, if you breach these Terms, if we reasonably suspect fraudulent activity, or if required to comply with applicable law or a legal request.",
      "Upon termination, all licenses granted to you under these Terms will immediately cease. Sections that by their nature should survive termination (including intellectual property, disclaimer, limitation of liability, and governing law) shall remain in effect.",
    ],
  },
  {
    id: "governing-law",
    title: "11. Governing Law and Dispute Resolution",
    body: [
      "These Terms shall be governed by and construed in accordance with the laws of the Republic of India, without regard to its conflict-of-law provisions. The courts of Bengaluru, Karnataka shall have exclusive jurisdiction over any disputes arising out of or related to these Terms or the Service.",
      "Before initiating litigation, both parties agree to attempt in good faith to resolve any dispute through informal negotiation within 30 days of written notice. If the dispute remains unresolved, either party may initiate proceedings in the aforementioned courts.",
      "If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.",
    ],
  },
  {
    id: "contact",
    title: "12. Contact Us",
    body: [
      "If you have any questions, concerns, or notices regarding these Terms, please contact us at support@videoiq.app or through our Contact Us page. We aim to respond to all inquiries within two business days.",
    ],
  },
];

export default function TermsPage() {
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
            Terms and <span className="gradient-text">Conditions</span>
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
          <h3 className="font-semibold mb-2">Questions about these terms?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            We're happy to clarify anything in this document before you subscribe.
          </p>
          <Link href="/contact">
            <Button>Contact Support</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
