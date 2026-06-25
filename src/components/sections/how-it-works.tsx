"use client";

import { motion } from "framer-motion";
import { Link2, Cpu, FileText } from "lucide-react";

const steps = [
  {
    icon: Link2,
    step: "01",
    title: "Paste YouTube URL",
    description: "Simply copy and paste any public YouTube video URL into the analysis input box. Our system supports all YouTube URL formats including watch links, short links, and embed URLs.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Analyzes",
    description: "Our AI engine fetches publicly available video data, calculates performance scores, analyzes engagement patterns, and compares upload timing against category benchmarks to generate comprehensive insights.",
  },
  {
    icon: FileText,
    step: "03",
    title: "Get Recommendations",
    description: "Receive a detailed AI report with performance scores, timing analysis, engagement metrics, best upload times, content suggestions, and actionable growth strategies tailored to your content category.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-brand uppercase tracking-wider">How It Works</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            Three Steps to <span className="gradient-text">Smarter Uploads</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get actionable insights in seconds, not hours. No complex setup required.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-brand/30 to-transparent" />
              )}

              <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-card border border-border mb-6 relative">
                <step.icon className="w-10 h-10 text-brand" />
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-brand to-brand-purple text-white text-xs font-bold flex items-center justify-center">
                  {step.step}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
