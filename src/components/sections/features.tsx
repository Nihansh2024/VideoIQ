"use client";

import { motion } from "framer-motion";
import { Clock, BarChart3, Users, Search, TrendingUp, Zap } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "AI Timing Detection",
    description: "Our AI analyzes upload patterns across millions of videos to determine the optimal posting times for your specific content category and audience.",
    color: "from-brand to-brand-purple",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Get a comprehensive performance score based on views, engagement rates, and growth metrics. Understand how your video compares to category benchmarks.",
    color: "from-brand-purple to-pink-500",
  },
  {
    icon: Users,
    title: "Competitor Intelligence",
    description: "Analyze competitor channels to discover their upload schedules, engagement patterns, and strategies that drive their success. Pro feature for deep analysis.",
    color: "from-brand-cyan to-brand",
  },
  {
    icon: Search,
    title: "SEO Suggestions",
    description: "Receive AI-generated recommendations for titles, descriptions, tags, and keywords to maximize your video discoverability in YouTube search results.",
    color: "from-green-500 to-brand-cyan",
  },
  {
    icon: TrendingUp,
    title: "Growth Recommendations",
    description: "Get personalized content strategy suggestions based on your video performance data, audience behavior patterns, and trending topics in your niche.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Zap,
    title: "Instant Analysis",
    description: "No login required for your first analysis. Simply paste a YouTube URL and get a complete AI-powered report in seconds with actionable insights.",
    color: "from-brand to-brand-cyan",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-brand uppercase tracking-wider">Features</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            Everything You Need to <span className="gradient-text">Grow on YouTube</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful AI tools designed to help you make data-driven decisions about your YouTube content strategy.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-brand/30 transition-all duration-300 hover:shadow-lg hover:shadow-brand/5"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
