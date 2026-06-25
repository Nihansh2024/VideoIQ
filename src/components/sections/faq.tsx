"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does VideoIQ analyze YouTube videos?",
    answer: "VideoIQ fetches publicly available data from YouTube using the YouTube Data API, including video statistics, upload timing, engagement metrics, and channel information. Our AI engine then processes this data through multiple scoring algorithms that compare the video's performance against category benchmarks, analyze upload timing patterns, and generate personalized recommendations for optimal content scheduling. The entire process takes just seconds and requires no login for your first free analysis.",
  },
  {
    question: "Is my data safe? What information do you collect?",
    answer: "We only collect the YouTube video URLs you submit for analysis. We do not access your private YouTube analytics, channel data, or personal information. All analysis is based on publicly available video data. Your analysis history is stored securely and is only accessible to you. We never share your data with third parties, and you can delete your analysis history at any time from your account settings.",
  },
  {
    question: "How accurate are the AI recommendations?",
    answer: "Our recommendations are based on analysis of publicly available YouTube data and AI pattern recognition across millions of videos. The scoring algorithms consider multiple factors including engagement rates, upload timing benchmarks, category-specific patterns, and audience behavior estimates. While our recommendations are data-driven and many creators have seen significant improvements, actual performance may vary depending on content quality, audience size, and other factors beyond timing alone.",
  },
  {
    question: "What is the difference between Free and Pro plans?",
    answer: "The Free plan gives you one video analysis per week with a basic AI report including performance scores and timing insights. The Pro plan at just ₹399/month unlocks unlimited analyses, full AI-powered reports with advanced insights, competitor channel analysis, PDF export capability, upload schedule recommendations, and priority processing. Pro users also get access to trend analysis and receive recommendations without watermarks.",
  },
  {
    question: "Can I analyze my competitors' channels?",
    answer: "Yes! Competitor analysis is available on the Pro plan. You can enter any public YouTube channel URL, and our AI will analyze their last 50 videos to identify common upload patterns, peak performance times, average engagement rates, and growth trends. This competitive intelligence helps you understand what works in your niche and optimize your own upload strategy accordingly.",
  },
  {
    question: "Do I need to connect my YouTube account?",
    answer: "No, you do not need to connect your YouTube account or provide any login credentials for YouTube. VideoIQ works with any public YouTube video URL. Simply paste the URL and get instant analysis. This means you can analyze any public video on YouTube, not just your own, making it a powerful tool for research and competitive analysis.",
  },
  {
    question: "Can I cancel my Pro subscription anytime?",
    answer: "Absolutely. There are no long-term contracts or commitments. You can cancel your Pro subscription at any time from your account settings, and you will continue to have access to Pro features until the end of your current billing period. After cancellation, your account will automatically revert to the Free plan. No cancellation fees, no questions asked.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept payments through Razorpay, which supports all major credit and debit cards, UPI payments, net banking, and popular digital wallets in India. This includes Visa, Mastercard, RuPay, Google Pay, PhonePe, Paytm, and many more. All transactions are encrypted and processed securely through Razorpay's PCI DSS compliant payment gateway.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-brand uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Got questions? We have answers.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="px-6 rounded-xl border border-border bg-card hover:border-brand/20 transition-colors"
              >
                <AccordionTrigger className="text-left text-sm sm:text-base font-medium hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
