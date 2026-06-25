import { LegalPage, Section } from "@/components/legal-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | VideoIQ",
  description: "How VideoIQ collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="June 25, 2026"
      intro="Your privacy matters to us. This Privacy Policy explains what information VideoIQ collects, how we use it, who we share it with, and the choices you have regarding your data. By using our Service, you consent to the practices described in this policy."
    >
      <Section title="1. Information We Collect">
        <p>We collect the following categories of information to provide and improve our Service:</p>
        <p><strong>Information you provide directly:</strong></p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Email address</strong> — collected when you sign up for the Free plan (via email entry) or upgrade to Pro. Used for account identification, payment receipts, and service communications.</li>
          <li><strong>Name</strong> — collected during the Pro checkout process for personalization and payment records.</li>
          <li><strong>YouTube video URLs</strong> — collected when you submit a video for analysis. Used solely to fetch public video data for the requested analysis.</li>
          <li><strong>Payment information</strong> — handled entirely by our payment processor Razorpay. We never store your card number, UPI PIN, or other sensitive financial data on our servers.</li>
        </ul>
        <p><strong>Information collected automatically:</strong></p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Anonymous identifier</strong> — a randomly generated ID stored in your browser&apos;s localStorage and a cookie, used to enforce the Free plan&apos;s weekly analysis limit for users who are not signed in.</li>
          <li><strong>Usage data</strong> — timestamps of analyses, plan status, and feature usage. Used for billing, rate-limit enforcement, and product improvement.</li>
          <li><strong>Technical data</strong> — IP address, browser type, device type, and referral source. Used for security, abuse prevention, and aggregated analytics.</li>
        </ul>
      </Section>

      <Section title="2. How We Use Your Information">
        <p>We use the information we collect for the following specific purposes:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>To provide the core analytics Service — fetching public YouTube data and generating insights, scores, and recommendations.</li>
          <li>To enforce plan limits — including the Free plan&apos;s one-analysis-per-week limit and the Pro plan&apos;s unlimited access.</li>
          <li>To process subscription payments, issue receipts, and manage renewals and cancellations.</li>
          <li>To send you service-related communications such as payment confirmations, security alerts, and important policy updates.</li>
          <li>To detect, prevent, and respond to fraud, abuse, security incidents, and other violations of our Terms.</li>
          <li>To improve our Service by analyzing aggregated, anonymized usage patterns to identify popular features and areas for improvement.</li>
          <li>To comply with our legal obligations under Indian law and the applicable laws of your jurisdiction.</li>
        </ul>
        <p>
          We do NOT sell your personal information to third parties. We do NOT use your data to train
          third-party AI models. AI-generated insights are produced on-demand for your analysis request
          and are not stored in a way that would leak your queries to other users.
        </p>
      </Section>

      <Section title="3. Cookies & Local Storage">
        <p>
          VideoIQ uses cookies and browser localStorage to remember your identity and preferences.
          Specifically:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Anonymous ID cookie</strong> (<code>videoiq_anonymous_id</code>): a 1-year cookie storing your anonymous identifier so we can apply the Free weekly limit across sessions.</li>
          <li><strong>Theme cookie</strong>: remembers your light/dark theme preference.</li>
          <li><strong>localStorage entries</strong>: store your email (after you enter it for Free analysis or Pro checkout) and the anonymous ID for client-side use.</li>
        </ul>
        <p>
          You can disable cookies in your browser settings, but this may affect the Service&apos;s ability
          to track your weekly analysis allowance and keep you signed in.
        </p>
      </Section>

      <Section title="4. Data Sharing & Third Parties">
        <p>We share your information only with the following categories of service providers, strictly as needed to operate the Service:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Razorpay</strong> — our payment processor. Razorpay receives your email, name, and payment details to process your Pro subscription. Their handling of your data is governed by their{" "}
            <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Privacy Policy</a>.
          </li>
          <li><strong>YouTube Data API v3</strong> — used to fetch public video metadata (title, view count, upload date, etc.) for the videos you submit. We only request data for videos you explicitly analyze.</li>
          <li><strong>AI inference provider</strong> — used to generate enhanced insights for Pro users. Only the publicly available video metadata is sent; your email and account information are never sent to the AI provider.</li>
        </ul>
        <p>
          We may also disclose your information if required to do so by law, court order, or government
          request, or if we believe in good faith that disclosure is necessary to protect our rights,
          the safety of any person, or to prevent fraud or abuse.
        </p>
      </Section>

      <Section title="5. Data Security">
        <p>
          We take reasonable technical and organizational measures to protect your personal information
          against unauthorized access, alteration, disclosure, or destruction. These measures include:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Encrypted HTTPS (TLS 1.2+) connections for all data in transit between your browser and our servers.</li>
          <li>Razorpay&apos;s PCI-DSS compliant infrastructure for all payment processing — we never see or store your card data.</li>
          <li>Strict access controls limiting internal access to user data on a need-to-know basis.</li>
          <li>Regular security review of authentication, payment, and analysis code paths.</li>
        </ul>
        <p>
          However, no method of transmission or storage is 100% secure. We cannot guarantee absolute
          security, and you acknowledge that you provide your information at your own risk.
        </p>
      </Section>

      <Section title="6. Data Retention">
        <p>
          We retain your personal information for as long as your account is active or as needed to
          provide the Service. Specifically:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>User accounts</strong>: retained indefinitely until you request deletion.</li>
          <li><strong>Usage logs</strong>: retained for 24 months for billing verification and abuse prevention, then automatically purged.</li>
          <li><strong>Payment records</strong>: retained for 7 years as required by Indian tax and accounting law.</li>
          <li><strong>Anonymous usage logs</strong>: retained for 90 days to enforce the Free weekly limit, then automatically purged.</li>
        </ul>
        <p>
          To request deletion of your account and associated data, email us at{" "}
          <a href="mailto:info.videoiq@gmail.com" className="text-brand hover:underline">info.videoiq@gmail.com</a>.
          We will process verified deletion requests within 30 days, except where retention is required by law.
        </p>
      </Section>

      <Section title="7. Your Rights & Choices">
        <p>Depending on your location, you may have the following rights regarding your personal information:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Access</strong>: request a copy of the personal information we hold about you.</li>
          <li><strong>Correction</strong>: request that we correct inaccurate or incomplete information.</li>
          <li><strong>Deletion</strong>: request that we delete your account and associated personal information.</li>
          <li><strong>Opt-out</strong>: unsubscribe from marketing emails by clicking the unsubscribe link in any email we send.</li>
          <li><strong>Withdraw consent</strong>: withdraw any consent you previously gave us for processing your data.</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href="mailto:info.videoiq@gmail.com" className="text-brand hover:underline">info.videoiq@gmail.com</a>{" "}
          with the subject line &quot;Privacy Request&quot;. We will respond to verified requests within
          30 days.
        </p>
      </Section>

      <Section title="8. Children&apos;s Privacy">
        <p>
          The Service is not directed at children under the age of 13, and we do not knowingly collect
          personal information from children under 13. If you believe a child has provided us with
          personal information, please contact us immediately at{" "}
          <a href="mailto:info.videoiq@gmail.com" className="text-brand hover:underline">info.videoiq@gmail.com</a>,
          and we will take steps to delete such information.
        </p>
      </Section>

      <Section title="9. International Users">
        <p>
          VideoIQ is operated from India. If you access the Service from outside India, you understand
          and consent to the transfer, processing, and storage of your information in India, which may
          have data protection laws that differ from those in your country of residence. We will take
          reasonable steps to ensure your information is treated securely and in accordance with this
          Privacy Policy regardless of where it is processed.
        </p>
      </Section>

      <Section title="10. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. When we do, we will revise the
          &quot;Last updated&quot; date at the top of this page. For material changes that affect how we
          process your data, we will provide prominent notice (such as by email or a notification on
          the homepage) before the changes take effect. We encourage you to review this policy
          periodically to stay informed about how we protect your information.
        </p>
      </Section>

      <Section title="11. Contact Us">
        <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:</p>
        <ul className="list-none pl-0 space-y-1">
          <li><strong>Email:</strong>{" "}
            <a href="mailto:info.videoiq@gmail.com" className="text-brand hover:underline">
              info.videoiq@gmail.com
            </a>
          </li>
          <li><strong>Address:</strong> Pune, Maharashtra, India — 411014</li>
        </ul>
      </Section>
    </LegalPage>
  );
}
