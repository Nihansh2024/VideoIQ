import { NextRequest, NextResponse } from "next/server";

// AI Analysis Engine - generates scores and recommendations based on video data
// Uses z-ai-web-dev-sdk for AI-powered insights when available

interface VideoData {
  videoId: string;
  title: string;
  channelName: string;
  uploadDate: string;
  uploadTime: string;
  uploadDay: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  category: string;
  tags: string[];
}

function calculatePerformanceScore(data: VideoData): number {
  let score = 50; // base score

  // View count scoring (0-20 points)
  if (data.viewCount > 10000000) score += 20;
  else if (data.viewCount > 1000000) score += 16;
  else if (data.viewCount > 500000) score += 12;
  else if (data.viewCount > 100000) score += 8;
  else if (data.viewCount > 10000) score += 4;

  // Engagement rate scoring (0-20 points)
  const engagementRate = data.viewCount > 0 ? (data.likeCount + data.commentCount) / data.viewCount : 0;
  if (engagementRate > 0.05) score += 20;
  else if (engagementRate > 0.03) score += 16;
  else if (engagementRate > 0.02) score += 12;
  else if (engagementRate > 0.01) score += 8;
  else if (engagementRate > 0.005) score += 4;

  // Like ratio (0-10 points)
  const likeRatio = data.viewCount > 0 ? data.likeCount / data.viewCount : 0;
  if (likeRatio > 0.04) score += 10;
  else if (likeRatio > 0.02) score += 7;
  else if (likeRatio > 0.01) score += 4;

  return Math.min(100, Math.max(0, score));
}

function calculateTimingScore(uploadDay: string, uploadTime: string): number {
  let score = 50;

  // Best days: Tuesday, Thursday, Saturday (+15 each)
  const bestDays = ["Tuesday", "Thursday", "Saturday"];
  const goodDays = ["Wednesday", "Friday"];
  const worstDays = ["Monday", "Sunday"];

  if (bestDays.includes(uploadDay)) score += 20;
  else if (goodDays.includes(uploadDay)) score += 10;
  else if (worstDays.includes(uploadDay)) score -= 5;

  // Best times: 6PM-9PM IST (+15 each)
  const timeMatch = uploadTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (timeMatch) {
    let hour = parseInt(timeMatch[1]);
    const period = timeMatch[3].toUpperCase();
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    // Peak hours: 6PM-9PM (18-21)
    if (hour >= 18 && hour <= 21) score += 20;
    // Good hours: 4PM-6PM, 9PM-11PM
    else if ((hour >= 16 && hour < 18) || (hour > 21 && hour <= 23)) score += 12;
    // Decent: 12PM-4PM
    else if (hour >= 12 && hour < 16) score += 5;
    // Off-peak: early morning
    else if (hour >= 6 && hour < 12) score += 2;
    // Worst: late night/early morning
    else score -= 5;
  }

  return Math.min(100, Math.max(0, score));
}

function calculateEngagementScore(data: VideoData): number {
  const engagementRate = data.viewCount > 0 ? (data.likeCount + data.commentCount) / data.viewCount : 0;
  let score = 0;

  if (engagementRate > 0.06) score = 95;
  else if (engagementRate > 0.04) score = 85;
  else if (engagementRate > 0.03) score = 75;
  else if (engagementRate > 0.02) score = 65;
  else if (engagementRate > 0.01) score = 50;
  else if (engagementRate > 0.005) score = 35;
  else score = 20;

  // Comment engagement bonus
  const commentRate = data.viewCount > 0 ? data.commentCount / data.viewCount : 0;
  if (commentRate > 0.003) score = Math.min(100, score + 10);
  else if (commentRate > 0.001) score = Math.min(100, score + 5);

  return Math.min(100, Math.max(0, score));
}

function calculateGrowthPotential(data: VideoData): string {
  const perfScore = calculatePerformanceScore(data);
  const engScore = calculateEngagementScore(data);
  const avgScore = (perfScore + engScore) / 2;

  if (avgScore >= 80) return "Excellent";
  if (avgScore >= 65) return "High";
  if (avgScore >= 50) return "Moderate";
  if (avgScore >= 35) return "Fair";
  return "Low";
}

function generateBestDays(category: string): string[] {
  const categoryDayMap: Record<string, string[]> = {
    "Entertainment": ["Saturday", "Sunday", "Friday"],
    "Music": ["Friday", "Saturday", "Thursday"],
    "Gaming": ["Saturday", "Sunday", "Wednesday"],
    "Education": ["Tuesday", "Thursday", "Wednesday"],
    "Howto & Style": ["Monday", "Wednesday", "Saturday"],
    "Science & Technology": ["Tuesday", "Thursday", "Saturday"],
    "News & Politics": ["Monday", "Wednesday", "Friday"],
    "Sports": ["Saturday", "Sunday", "Wednesday"],
    "Comedy": ["Friday", "Saturday", "Wednesday"],
    "People & Blogs": ["Tuesday", "Thursday", "Saturday"],
  };
  return categoryDayMap[category] || ["Tuesday", "Thursday", "Saturday"];
}

function generateBestTimes(category: string): string[] {
  const categoryTimeMap: Record<string, string[]> = {
    "Entertainment": ["6:00 PM", "7:00 PM", "8:00 PM"],
    "Music": ["3:00 PM", "6:00 PM", "9:00 PM"],
    "Gaming": ["2:00 PM", "5:00 PM", "8:00 PM"],
    "Education": ["9:00 AM", "2:00 PM", "6:00 PM"],
    "Howto & Style": ["10:00 AM", "3:00 PM", "7:00 PM"],
    "Science & Technology": ["9:00 AM", "1:00 PM", "6:00 PM"],
    "News & Politics": ["7:00 AM", "12:00 PM", "6:00 PM"],
    "Sports": ["11:00 AM", "4:00 PM", "7:00 PM"],
    "Comedy": ["5:00 PM", "7:00 PM", "9:00 PM"],
    "People & Blogs": ["11:00 AM", "3:00 PM", "7:00 PM"],
  };
  return categoryTimeMap[category] || ["6:00 PM", "7:00 PM", "8:00 PM"];
}

function generateInsights(data: VideoData, perfScore: number, timingScore: number, engScore: number): string[] {
  const insights: string[] = [];

  // Upload timing insight
  const bestDays = generateBestDays(data.category);
  const bestTimes = generateBestTimes(data.category);

  if (bestDays.includes(data.uploadDay)) {
    insights.push(
      `This video was uploaded on ${data.uploadDay} at ${data.uploadTime}, which aligns with peak audience activity for ${data.category.toLowerCase()} content. Videos in this category often perform best on ${bestDays.join(", ")}.`
    );
  } else {
    insights.push(
      `This video was uploaded on ${data.uploadDay} at ${data.uploadTime}. However, ${data.category.toLowerCase()} content typically performs better when published on ${bestDays.join(", ")} between ${bestTimes.join(" and ")}. Shifting your upload schedule could significantly improve initial traction.`
    );
  }

  // Engagement insight
  const engagementRate = data.viewCount > 0 ? ((data.likeCount + data.commentCount) / data.viewCount * 100).toFixed(2) : "0";
  if (engScore >= 70) {
    insights.push(
      `With an engagement rate of ${engagementRate}%, this video is generating strong audience interaction. The ${data.commentCount.toLocaleString()} comments indicate viewers are highly invested in the content, which signals to the YouTube algorithm that this video deserves broader distribution.`
    );
  } else if (engScore >= 40) {
    insights.push(
      `The engagement rate of ${engagementRate}% is moderate. While the video is receiving likes and comments, there is room for improvement. Consider adding calls-to-action, asking viewers questions, or creating content that naturally sparks discussion to boost engagement metrics.`
    );
  } else {
    insights.push(
      `The engagement rate of ${engagementRate}% is below average for this category. This could indicate that while viewers are watching, they are not compelled to interact. Focus on creating stronger hooks, asking for engagement more explicitly, and ensuring the content delivers on its title promise.`
    );
  }

  // Performance insight
  if (perfScore >= 75) {
    insights.push(
      `With ${data.viewCount.toLocaleString()} views, this video is performing well above average. The strong view count combined with solid engagement metrics suggests the content resonated with the target audience and was effectively promoted by the YouTube algorithm.`
    );
  } else if (perfScore >= 50) {
    insights.push(
      `The video has accumulated ${data.viewCount.toLocaleString()} views, which represents moderate performance. There may be opportunities to improve discoverability through better SEO optimization, more compelling thumbnails, or strategic cross-promotion to drive additional traffic.`
    );
  } else {
    insights.push(
      `With ${data.viewCount.toLocaleString()} views, this video has room for growth. Consider optimizing the title and description with relevant keywords, creating a more eye-catching thumbnail, and promoting the video across social media channels to increase its reach.`
    );
  }

  // Duration insight
  const durationMatch = data.duration.match(/(\d+):(\d+)/);
  if (durationMatch) {
    const minutes = parseInt(durationMatch[1]);
    if (minutes >= 8 && minutes <= 15) {
      insights.push(
        `At ${data.duration}, this video falls within the optimal duration range for ${data.category.toLowerCase()} content. Videos between 8-15 minutes tend to perform well as they provide enough depth while maintaining viewer retention, and they also qualify for mid-roll ad placement.`
      );
    } else if (minutes < 8) {
      insights.push(
        `At ${data.duration}, this video is relatively short. While short-form content can perform well, consider creating longer, more comprehensive videos (8-15 minutes) that provide deeper value and qualify for additional monetization through mid-roll ads.`
      );
    } else {
      insights.push(
        `At ${data.duration}, this video is on the longer side. Ensure you maintain strong viewer retention throughout by using engaging hooks, clear section breaks, and compelling storytelling. Longer videos can perform well if retention stays high.`
      );
    }
  }

  return insights;
}

function generateContentSuggestions(data: VideoData): {
  titleIdeas: string[];
  seoImprovements: string[];
  keywordSuggestions: string[];
  descriptionTips: string[];
} {
  return {
    titleIdeas: [
      `Add a specific number or timeframe: "${data.title} (Updated 2025)"`,
      `Use power words: "Ultimate Guide to..." or "The Secret Behind..."`,
      `Include brackets or parentheses for context: "[Case Study]" or "(Step-by-Step)"`,
      `Front-load the most important keyword for better search visibility`,
    ],
    seoImprovements: [
      "Include target keyword in the first 5 words of the title",
      "Write a description of at least 250 words with natural keyword integration",
      "Add timestamps for key sections to improve viewer navigation",
      "Use relevant hashtags (3-5) at the bottom of the description",
      "Add cards and end screens linking to related content",
    ],
    keywordSuggestions: [
      ...data.tags.slice(0, 3),
      `${data.category.toLowerCase()} tips 2025`,
      `how to grow on youtube ${data.category.toLowerCase()}`,
      `${data.category.toLowerCase()} tutorial`,
      "youtube algorithm tips",
    ],
    descriptionTips: [
      "Start with a compelling hook in the first two lines visible in search results",
      "Include a table of contents with timestamps for longer videos",
      "Add links to social media and related videos in the description",
      "Use the description to provide additional context that adds value",
      "Include a call-to-action encouraging viewers to subscribe and engage",
    ],
  };
}

export async function POST(request: NextRequest) {
  try {
    const videoData: VideoData = await request.json();

    if (!videoData || !videoData.videoId) {
      return NextResponse.json({ error: "Video data is required for analysis" }, { status: 400 });
    }

    // Calculate all scores
    const performanceScore = calculatePerformanceScore(videoData);
    const timingScore = calculateTimingScore(videoData.uploadDay, videoData.uploadTime);
    const engagementScore = calculateEngagementScore(videoData);
    const growthPotential = calculateGrowthPotential(videoData);

    // Generate recommendations
    const bestDays = generateBestDays(videoData.category);
    const bestTimes = generateBestTimes(videoData.category);
    const insights = generateInsights(videoData, performanceScore, timingScore, engagementScore);
    const contentSuggestions = generateContentSuggestions(videoData);

    // Calculate engagement metrics
    const engagementRate = videoData.viewCount > 0
      ? ((videoData.likeCount + videoData.commentCount) / videoData.viewCount * 100).toFixed(2)
      : "0";
    const likeRate = videoData.viewCount > 0
      ? (videoData.likeCount / videoData.viewCount * 100).toFixed(2)
      : "0";
    const commentRate = videoData.viewCount > 0
      ? (videoData.commentCount / videoData.viewCount * 100).toFixed(3)
      : "0";

    // Try to use AI for enhanced insights
    let aiEnhancedInsights: string[] | null = null;
    try {
      const ZAI = (await import("z-ai-web-dev-sdk")).default;
      const zai = await ZAI.create();

      const aiResponse = await zai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a YouTube analytics expert. Provide concise, actionable insights about YouTube video performance and upload timing. Always respond with a JSON array of 3 insight strings.",
          },
          {
            role: "user",
            content: `Analyze this YouTube video: Title: "${videoData.title}", Channel: ${videoData.channelName}, Category: ${videoData.category}, Views: ${videoData.viewCount}, Likes: ${videoData.likeCount}, Comments: ${videoData.commentCount}, Upload Day: ${videoData.uploadDay}, Upload Time: ${videoData.uploadTime}, Duration: ${videoData.duration}. Generate 3 specific, actionable insights about upload timing and performance. Return only a JSON array of 3 strings.`,
          },
        ],
        temperature: 0.7,
      });

      const content = aiResponse.choices[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          aiEnhancedInsights = parsed;
        }
      }
    } catch {
      // AI enhancement failed, use local insights
    }

    const analysisResult = {
      videoId: videoData.videoId,
      title: videoData.title,
      channelName: videoData.channelName,
      thumbnailUrl: videoData.thumbnailUrl,
      uploadDate: videoData.uploadDate,
      uploadTime: videoData.uploadTime,
      uploadDay: videoData.uploadDay,
      viewCount: videoData.viewCount,
      likeCount: videoData.likeCount,
      commentCount: videoData.commentCount,
      duration: videoData.duration,
      category: videoData.category,
      tags: videoData.tags,
      performanceScore,
      timingScore,
      engagementScore,
      growthPotential,
      engagementRate: `${engagementRate}%`,
      likeRate: `${likeRate}%`,
      commentRate: `${commentRate}%`,
      insights: aiEnhancedInsights || insights,
      bestDays,
      bestTimes,
      contentSuggestions,
      analyzedAt: new Date().toISOString(),
      isLive: videoData.isLive === true,
      disclaimer: "Recommendations are based on publicly available YouTube data and AI pattern analysis. Actual performance may vary.",
    };

    return NextResponse.json(analysisResult);

  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({ error: "An error occurred during analysis. Please try again." }, { status: 500 });
  }
}
