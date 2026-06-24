"use client";

import { motion } from "framer-motion";
import { BarChart3, Users, TrendingUp } from "lucide-react";

const stats = [
  { icon: BarChart3, value: "10,000+", label: "Videos Analyzed", color: "text-brand" },
  { icon: Users, value: "5,000+", label: "Creators", color: "text-brand-purple" },
  { icon: TrendingUp, value: "95%", label: "Satisfaction Rate", color: "text-brand-cyan" },
];

export function SocialProof() {
  return (
    <section className="py-16 border-y border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className={`w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center mb-3`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-3xl sm:text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
