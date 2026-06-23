"use client";

import { motion } from "framer-motion";

export function LoadingAnimation() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Animated logo */}
        <motion.div
          className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-3"
        >
          Analyzing Your Video
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mb-8"
        >
          Our AI is crunching the numbers...
        </motion.p>

        {/* Progress steps */}
        <div className="space-y-4 text-left">
          {[
            { label: "Fetching video data", delay: 0 },
            { label: "Analyzing upload timing", delay: 0.5 },
            { label: "Calculating engagement scores", delay: 1 },
            { label: "Generating AI insights", delay: 1.5 },
            { label: "Building your report", delay: 2 },
          ].map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: step.delay, duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: step.delay + 0.2, type: "spring" }}
                className="w-6 h-6 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: step.delay + 0.4, type: "spring" }}
                  className="w-3 h-3 rounded-full bg-brand"
                />
              </motion.div>
              <span className="text-sm text-muted-foreground">{step.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Animated bar */}
        <motion.div
          className="mt-8 h-1 rounded-full bg-muted overflow-hidden"
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand to-brand-purple"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
}
