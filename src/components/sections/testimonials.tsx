"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Arjun Mehta",
    role: "Tech YouTuber • 500K Subscribers",
    content: "VideoIQ completely changed my upload strategy. I shifted from random posting times to data-driven scheduling and saw a 40% increase in my first-week views within the first month.",
    avatar: "AM",
    color: "from-brand to-brand-purple",
  },
  {
    name: "Priya Sharma",
    role: "Lifestyle Creator • 200K Subscribers",
    content: "The AI insights are incredibly accurate. It told me my audience was most active at 7 PM, and when I started uploading at that time, my engagement doubled. Worth every rupee of the Pro plan.",
    avatar: "PS",
    color: "from-brand-purple to-pink-500",
  },
  {
    name: "Rahul Verma",
    role: "Gaming Channel • 1.2M Subscribers",
    content: "The competitor analysis feature alone is worth the Pro subscription. I can see when top gaming channels upload and schedule my content to maximize visibility. Game changer for real.",
    avatar: "RV",
    color: "from-brand-cyan to-brand",
  },
  {
    name: "Sneha Patel",
    role: "Education Creator • 80K Subscribers",
    content: "As a smaller creator, I needed every advantage I could get. VideoIQ helped me understand that Tuesday and Thursday at 6 PM were my golden slots. My channel grew 3x in 3 months.",
    avatar: "SP",
    color: "from-green-500 to-brand-cyan",
  },
  {
    name: "Vikram Singh",
    role: "Agency Owner • Managing 15 Channels",
    content: "Managing multiple YouTube channels was chaos until I started using VideoIQ. The consistent analysis framework and scheduling recommendations save my team at least 10 hours per week.",
    avatar: "VS",
    color: "from-amber-500 to-orange-500",
  },
  {
    name: "Ananya Gupta",
    role: "Cooking Channel • 350K Subscribers",
    content: "I was skeptical at first, but the AI recommendations were spot on. My weekend recipe videos now go live at the perfect time and my watch time has increased by 55%. Absolutely recommend it.",
    avatar: "AG",
    color: "from-rose-500 to-brand-purple",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-brand uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            Loved by <span className="gradient-text">YouTube Creators</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of creators who use VideoIQ to optimize their YouTube strategy.
          </p>
        </motion.div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border hover:border-brand/20 transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-5 text-foreground/90">{testimonial.content}</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white text-xs font-bold`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
