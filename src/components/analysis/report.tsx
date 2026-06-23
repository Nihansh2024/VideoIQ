"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft, Eye, ThumbsUp, MessageSquare, Clock, Calendar,
  TrendingUp, Target, Zap, Lightbulb, Download, Share2, Lock,
  ChevronRight, AlertTriangle, Tag, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAppStore, formatNumber, type AnalysisResult } from "@/lib/store";
import { usePaymentStore } from "@/lib/payment-store";
import { generatePDFReport, shareAnalysis } from "@/lib/pdf-report";

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
          <motion.circle
            cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="text-2xl font-bold"
          >
            {score}
          </motion.span>
        </div>
      </div>
      <span className="text-sm text-muted-foreground mt-2">{label}</span>
    </div>
  );
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#4F46E5";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs Improvement";
}

export function Report() {
  const { analysisResult, reset } = useAppStore();
  const { setIsPaymentModalOpen, setSelectedPlan } = usePaymentStore();
  if (!analysisResult) return null;

  const r = analysisResult;

  const handleUpgrade = () => {
    setSelectedPlan("pro");
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button variant="ghost" onClick={reset} className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </motion.div>

        {/* Section 1: Video Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden mb-8">
            <div className="flex flex-col md:flex-row">
              {/* Thumbnail */}
              <div className="md:w-2/5 relative">
                <img
                  src={r.thumbnailUrl}
                  alt={r.title}
                  className="w-full h-48 md:h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/640x360/1e1e3a/818CF8?text=${encodeURIComponent(r.videoId)}`;
                  }}
                />
                <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                  {r.duration}
                </Badge>
                {r.isLive && (
                  <Badge className="absolute top-2 left-2 bg-green-500/90 text-white text-[10px] gap-1 px-2 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
                    Live Data
                  </Badge>
                )}
              </div>

              {/* Video Info */}
              <div className="md:w-3/5 p-6">
                <h1 className="text-xl sm:text-2xl font-bold mb-2 line-clamp-2">{r.title}</h1>
                <p className="text-muted-foreground text-sm mb-4">{r.channelName}</p>

                <div className="flex flex-wrap gap-3 mb-4">
                  <Badge variant="secondary" className="gap-1">
                    <Eye className="w-3 h-3" />
                    {formatNumber(r.viewCount)} views
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    {formatNumber(r.likeCount)} likes
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {formatNumber(r.commentCount)} comments
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-brand" />
                    <span>{r.uploadDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4 text-brand-purple" />
                    <span>{r.uploadTime} ({r.uploadDay})</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Tag className="w-4 h-4 text-brand-cyan" />
                    <span>{r.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <span>Engagement: {r.engagementRate}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Section 2: Performance Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-brand" />
            Performance Dashboard
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Performance Score */}
            <Card className="text-center p-4">
              <CardContent className="p-0">
                <ScoreRing score={r.performanceScore} label="Performance" color={getScoreColor(r.performanceScore)} />
                <p className="text-xs text-muted-foreground mt-1">{getScoreLabel(r.performanceScore)}</p>
              </CardContent>
            </Card>

            {/* Timing Score */}
            <Card className="text-center p-4">
              <CardContent className="p-0">
                <ScoreRing score={r.timingScore} label="Timing" color={getScoreColor(r.timingScore)} />
                <p className="text-xs text-muted-foreground mt-1">{getScoreLabel(r.timingScore)}</p>
              </CardContent>
            </Card>

            {/* Engagement Score */}
            <Card className="text-center p-4">
              <CardContent className="p-0">
                <ScoreRing score={r.engagementScore} label="Engagement" color={getScoreColor(r.engagementScore)} />
                <p className="text-xs text-muted-foreground mt-1">{getScoreLabel(r.engagementScore)}</p>
              </CardContent>
            </Card>

            {/* Growth Potential */}
            <Card className="flex flex-col items-center justify-center p-4">
              <CardContent className="p-0 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand to-brand-purple flex items-center justify-center mb-2"
                >
                  <TrendingUp className="w-8 h-8 text-white" />
                </motion.div>
                <p className="text-lg font-bold">{r.growthPotential}</p>
                <p className="text-xs text-muted-foreground">Growth Potential</p>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Metrics Bar */}
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Engagement Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Engagement Rate</span>
                  <span className="font-medium">{r.engagementRate}</span>
                </div>
                <Progress value={parseFloat(r.engagementRate) * 10} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Like Rate</span>
                  <span className="font-medium">{r.likeRate}</span>
                </div>
                <Progress value={parseFloat(r.likeRate) * 10} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Comment Rate</span>
                  <span className="font-medium">{r.commentRate}%</span>
                </div>
                <Progress value={parseFloat(r.commentRate) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section 3: AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            AI Insights
          </h2>

          <Card className="mb-8">
            <CardContent className="p-6 space-y-4">
              {r.insights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.15 }}
                  className="flex gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-brand">{i + 1}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{insight}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Section 4: Recommended Upload Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-purple" />
            Recommended Upload Schedule
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Best Days */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Best Upload Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {r.bestDays.map((day, i) => (
                    <div key={day} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                        i === 0 ? "bg-gradient-to-br from-brand to-brand-purple" :
                        i === 1 ? "bg-gradient-to-br from-brand-purple to-pink-500" :
                        "bg-gradient-to-br from-brand-cyan to-brand"
                      }`}>
                        {i + 1}
                      </div>
                      <span className="font-medium">{day}</span>
                      {i === 0 && <Badge className="ml-auto bg-brand/10 text-brand border-brand/20 text-xs">Top Pick</Badge>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Best Times */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Best Upload Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {r.bestTimes.map((time, i) => (
                    <div key={time} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                        i === 0 ? "bg-gradient-to-br from-brand to-brand-purple" :
                        i === 1 ? "bg-gradient-to-br from-brand-purple to-pink-500" :
                        "bg-gradient-to-br from-brand-cyan to-brand"
                      }`}>
                        {i + 1}
                      </div>
                      <span className="font-medium">{time}</span>
                      {i === 0 && <Badge className="ml-auto bg-brand/10 text-brand border-brand/20 text-xs">Peak Hour</Badge>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Section 5: Content Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-brand-cyan" />
            Content Suggestions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Title Ideas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand" />
                  Better Title Ideas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {r.contentSuggestions.titleIdeas.map((idea, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ChevronRight className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                      <span>{idea}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* SEO Improvements */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-brand-purple" />
                  SEO Improvements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {r.contentSuggestions.seoImprovements.map((improvement, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ChevronRight className="w-4 h-4 text-brand-purple flex-shrink-0 mt-0.5" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Keyword Suggestions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Tag className="w-4 h-4 text-brand-cyan" />
                  Keyword Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {r.contentSuggestions.keywordSuggestions.map((keyword, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Description Tips */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-500" />
                  Description Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {r.contentSuggestions.descriptionTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ChevronRight className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Pro Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-brand/20 bg-gradient-to-br from-brand/5 to-brand-purple/5 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand to-brand-purple flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h3 className="font-bold mb-1">Unlock Competitor Analysis & PDF Export</h3>
                  <p className="text-sm text-muted-foreground">
                    Upgrade to Pro to analyze competitor channels, export reports as PDF, and get advanced AI insights with priority processing.
                  </p>
                </div>
                <Button onClick={handleUpgrade} className="bg-gradient-to-r from-brand to-brand-purple text-white hover:opacity-90 flex-shrink-0">
                  Upgrade to Pro - ₹399/mo
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <Button
            variant="outline"
            className="gap-2 flex-1"
            onClick={() => generatePDFReport(r)}
          >
            <Download className="w-4 h-4" />
            Download Report
          </Button>
          <Button
            variant="outline"
            className="gap-2 flex-1"
            onClick={() => shareAnalysis(r)}
          >
            <Share2 className="w-4 h-4" />
            Share Analysis
          </Button>
          <Button onClick={reset} className="gap-2 flex-1 bg-gradient-to-r from-brand to-brand-purple text-white hover:opacity-90">
            Analyze Another Video
          </Button>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-start gap-2 p-4 rounded-xl bg-muted/50 border border-border"
        >
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">{r.disclaimer}</p>
        </motion.div>
      </div>
    </div>
  );
}
