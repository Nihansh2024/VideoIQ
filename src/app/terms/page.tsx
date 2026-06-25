import { LegalPage, Section } from "@/components/legal-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | VideoIQ",
  description: "Terms and Conditions governing your use of VideoIQ's AI-powered YouTube analytics platform.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      lastUpdated="June 25, 2026"
      intro="Welcome to VideoIQ. By accessing or using our website and services, you agree to be bound by these Terms and Conditions. Please read them carefully before using the platform."
    >
      <Section title="1. Acceptance of Terms">
        <p>
          By creating an account, browsing the site, or using any feature of VideoIQ (the &quot;Service&quot;),
          you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions,
          our Privacy Policy, and any other applicable policies. If you do not agree with any part of these
          terms, you must not use the Service. These Terms constitute a legally binding agreement between
          you (&quot;User&quot;, &quot;you&quot;, or &quot;your&quot;) and VideoIQ (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
        </p>
        <p>
          If you are using the Service on behalf of an organization, you represent and warrant that you have
          the authority to bind that organization to these Terms, and the terms &quot;you&quot; and &quot;your&quot;
          will refer to that organization.
        </p>
      </Section>

      <Section title="2. Description of Service">
        <p>
          VideoIQ is an AI-powered analytics platform that analyzes publicly available YouTube video data
          to provide insights on upload timing, performance scoring, engagement patterns, and growth
          opportunities. The Service is offered in two plans: a Free plan with limited weekly analyses and
          a Pro plan with unlimited analyses and additional premium features.
        </p>
        <p>
          We reserve the right to modify, suspend, or discontinue any part of the Service at any time,
          with or without notice. We are not liable to you or any third party for any such modification,
          suspension, or discontinuance, except as required by applicable law.
        </p>
      </Section>

      <Section title="3. Account Registration & Responsibilities">
        <p>
          To access certain features (such as the Pro plan), you must provide a valid email address and
          name. You agree to provide accurate, current, and complete information during registration and
          to update such information to keep it accurate. You are solely responsible for maintaining the
          confidentiality of your account and for all activities that occur under your account.
        </p>
        <p>
          You agree to notify us immediately at{" "}
          <a href="mailto:info.videoiq@gmail.com" className="text-brand hover:underline">info.videoiq@gmail.com</a>{" "}
          of any unauthorized use of your account or any other security breach. We will not be liable for
          any loss or damage arising from your failure to comply with this obligation.
        </p>
        <p>You agree NOT to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Use the Service for any unlawful purpose or in violation of any local, state, national, or international law.</li>
          <li>Attempt to reverse-engineer, decompile, disassemble, or otherwise derive source code from the Service.</li>
          <li>Use automated scripts, bots, scrapers, or crawlers to access the Service in a way that exceeds reasonable human use.</li>
          <li>Resell, sublicense, or redistribute access to the Service without our written consent.</li>
          <li>Use the Service to infringe upon the intellectual property rights or privacy of any third party.</li>
          <li>Interfere with or disrupt the Service, servers, or networks connected to the Service.</li>
        </ul>
      </Section>

      <Section title="4. Subscriptions, Billing & Payments">
        <p>
          The Pro plan is billed monthly at ₹399 (Indian Rupees) and is processed securely through our
          payment partner Razorpay. By subscribing to the Pro plan, you authorize us to charge the
          recurring monthly fee to your designated payment method until you cancel the subscription.
        </p>
        <p>
          Subscriptions auto-renew each month on the anniversary of your original subscription date. You
          may cancel your subscription at any time from your account settings, with cancellation taking
          effect at the end of the current billing period. No partial refunds are issued for unused
          days within a billing cycle except as described in our Cancellation &amp; Refund Policy.
        </p>
        <p>
          We reserve the right to change our fees upon reasonable notice. Any fee changes will take
          effect at the start of your next billing cycle following the notice.
        </p>
      </Section>

      <Section title="5. Intellectual Property Rights">
        <p>
          The Service, including its design, code, branding, features, and original content, is the
          exclusive property of VideoIQ and is protected by Indian and international intellectual
          property laws. You may not copy, modify, distribute, or create derivative works from any part
          of the Service without our prior written consent.
        </p>
        <p>
          All YouTube video data, thumbnails, titles, and metadata accessed through the Service remain
          the property of their respective creators and YouTube/Google LLC. VideoIQ only analyzes
          publicly available data and does not claim any ownership over such content.
        </p>
        <p>
          Insights, scores, and reports generated by the Service for your use are provided to you for
          personal or internal business use. You retain ownership of any content you submit, and you
          grant us a non-exclusive, royalty-free license to process such content solely to provide the
          Service to you.
        </p>
      </Section>

      <Section title="6. Disclaimers & Limitation of Liability">
        <p>
          The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without
          warranties of any kind, whether express or implied. We do not guarantee that the insights,
          scores, or recommendations provided by the Service will be accurate, complete, or result in
          any specific outcome. Actual YouTube video performance depends on many factors beyond upload
          timing, including content quality, audience engagement, algorithm changes, and market trends.
        </p>
        <p>
          To the maximum extent permitted by law, VideoIQ, its directors, employees, partners, or
          affiliates shall not be liable for any indirect, incidental, special, consequential, or
          punitive damages, including loss of profits, data, business opportunities, or goodwill,
          arising out of or in connection with your use of the Service.
        </p>
        <p>
          Our total aggregate liability for any claim arising from these Terms or your use of the
          Service shall not exceed the amount you paid to us in the 12 months preceding the claim.
        </p>
      </Section>

      <Section title="7. Indemnification">
        <p>
          You agree to indemnify and hold harmless VideoIQ, its affiliates, and their respective
          directors, officers, employees, and agents from any claims, damages, losses, liabilities,
          costs, or expenses (including reasonable legal fees) arising out of your use of the Service,
          your violation of these Terms, or your infringement of any third-party rights.
        </p>
      </Section>

      <Section title="8. Termination">
        <p>
          We may suspend or terminate your access to the Service at any time, with or without cause or
          notice, if we believe you have violated these Terms or for any other reason at our discretion.
          Upon termination, all licenses and rights granted to you under these Terms will immediately
          cease, and you must stop using the Service.
        </p>
        <p>
          You may stop using the Service at any time. If you wish to delete your account and any
          associated data, contact us at{" "}
          <a href="mailto:info.videoiq@gmail.com" className="text-brand hover:underline">info.videoiq@gmail.com</a>.
        </p>
      </Section>

      <Section title="9. Governing Law & Dispute Resolution">
        <p>
          These Terms are governed by and construed in accordance with the laws of the Republic of
          India. Any dispute arising out of or in connection with these Terms shall first be attempted
          to be resolved through amicable negotiation between the parties for a period of 30 days.
        </p>
        <p>
          If the dispute cannot be resolved through negotiation, it shall be subject to the exclusive
          jurisdiction of the courts of Pune, Maharashtra, India. You agree to submit to the personal
          jurisdiction of these courts.
        </p>
      </Section>

      <Section title="10. Changes to These Terms">
        <p>
          We reserve the right to update or modify these Terms at any time. We will notify users of
          material changes by posting the updated Terms on this page with a new &quot;Last updated&quot;
          date and, where appropriate, by email. Your continued use of the Service after any such
          changes constitutes your acceptance of the new Terms.
        </p>
      </Section>

      <Section title="11. Contact Information">
        <p>
          If you have any questions about these Terms and Conditions, please contact us:
        </p>
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
