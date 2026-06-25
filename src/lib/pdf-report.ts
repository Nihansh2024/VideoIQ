import type { AnalysisResult } from "@/lib/store";

/**
 * Generates a printable PDF report from the analysis result.
 * Uses the browser's print API to produce a clean, formatted PDF.
 */
export function generatePDFReport(result: AnalysisResult): void {
  if (typeof window === "undefined") return;

  const printWindow = window.open("", "_blank", "width=800,height=900");
  if (!printWindow) {
    alert("Please allow popups to download the report.");
    return;
  }

  const date = new Date(result.analyzedAt).toLocaleString("en-US", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>VideoIQ Report - ${escapeHtml(result.title)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0f172a;
      background: #ffffff;
      padding: 40px;
      line-height: 1.6;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 20px;
      border-bottom: 2px solid #4F46E5;
      margin-bottom: 30px;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 24px;
      font-weight: 700;
    }
    .logo-icon {
      width: 36px; height: 36px;
      background: linear-gradient(135deg, #ff0000, #cc0000);
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      color: white;
    }
    .logo-text { color: #4F46E5; }
    .report-meta {
      text-align: right;
      font-size: 12px;
      color: #64748b;
    }
    h1 { font-size: 22px; margin-bottom: 8px; color: #0f172a; }
    h2 {
      font-size: 16px;
      margin: 24px 0 12px 0;
      padding-bottom: 8px;
      border-bottom: 1px solid #e2e8f0;
      color: #4F46E5;
    }
    .video-card {
      display: flex;
      gap: 20px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 12px;
      margin-bottom: 20px;
    }
    .video-card img {
      width: 200px;
      height: 113px;
      object-fit: cover;
      border-radius: 8px;
      flex-shrink: 0;
    }
    .video-info { flex: 1; }
    .video-info h3 { font-size: 18px; margin-bottom: 6px; }
    .video-info p { color: #64748b; font-size: 13px; margin-bottom: 4px; }
    .stats-row {
      display: flex;
      gap: 16px;
      margin-top: 8px;
      flex-wrap: wrap;
    }
    .stat {
      font-size: 12px;
      color: #475569;
      background: white;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }
    .scores-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }
    .score-card {
      text-align: center;
      padding: 16px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }
    .score-value {
      font-size: 32px;
      font-weight: 700;
      color: #4F46E5;
    }
    .score-label {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 4px;
    }
    .insight-list { padding-left: 20px; margin: 8px 0; }
    .insight-list li {
      margin-bottom: 10px;
      font-size: 13px;
      color: #334155;
    }
    .schedule-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }
    .schedule-card {
      padding: 14px;
      background: #f8fafc;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
    }
    .schedule-card h4 {
      font-size: 13px;
      color: #4F46E5;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .schedule-card ol { padding-left: 20px; font-size: 13px; }
    .schedule-card li { margin-bottom: 4px; }
    .suggestions-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }
    .suggestion-card {
      padding: 14px;
      background: #f8fafc;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
    }
    .suggestion-card h4 {
      font-size: 13px;
      color: #4F46E5;
      margin-bottom: 8px;
    }
    .suggestion-card ul { padding-left: 20px; font-size: 12px; }
    .suggestion-card li { margin-bottom: 6px; color: #334155; }
    .keywords {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .keyword {
      background: #4F46E5;
      color: white;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 11px;
    }
    .disclaimer {
      margin-top: 30px;
      padding: 12px;
      background: #fef3c7;
      border-radius: 8px;
      border-left: 4px solid #f59e0b;
      font-size: 11px;
      color: #92400e;
    }
    .footer-note {
      margin-top: 20px;
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
    .print-btn {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4F46E5;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }
    .print-btn:hover { background: #4338ca; }
  </style>
</head>
<body>
  <button class="print-btn no-print" onclick="window.print()">Print / Save as PDF</button>

  <div class="header">
    <div class="logo">
      <div class="logo-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      </div>
      <span>Video<span class="logo-text">IQ</span></span>
    </div>
    <div class="report-meta">
      <div>Report Generated: ${date}</div>
      <div>Video ID: ${escapeHtml(result.videoId)}</div>
    </div>
  </div>

  <h1>YouTube Video Analysis Report</h1>

  <div class="video-card">
    <img src="${escapeHtml(result.thumbnailUrl)}" alt="Thumbnail" onerror="this.style.display='none'">
    <div class="video-info">
      <h3>${escapeHtml(result.title)}</h3>
      <p><strong>Channel:</strong> ${escapeHtml(result.channelName)}</p>
      <p><strong>Category:</strong> ${escapeHtml(result.category)} • <strong>Duration:</strong> ${escapeHtml(result.duration)}</p>
      <p><strong>Uploaded:</strong> ${escapeHtml(result.uploadDate)} at ${escapeHtml(result.uploadTime)} (${escapeHtml(result.uploadDay)})</p>
      <div class="stats-row">
        <span class="stat">Views: ${formatNumber(result.viewCount)}</span>
        <span class="stat">Likes: ${formatNumber(result.likeCount)}</span>
        <span class="stat">Comments: ${formatNumber(result.commentCount)}</span>
        <span class="stat">Engagement: ${escapeHtml(result.engagementRate)}</span>
      </div>
    </div>
  </div>

  <h2>Performance Dashboard</h2>
  <div class="scores-grid">
    <div class="score-card">
      <div class="score-value">${result.performanceScore}</div>
      <div class="score-label">Performance</div>
    </div>
    <div class="score-card">
      <div class="score-value">${result.timingScore}</div>
      <div class="score-label">Timing</div>
    </div>
    <div class="score-card">
      <div class="score-value">${result.engagementScore}</div>
      <div class="score-label">Engagement</div>
    </div>
    <div class="score-card">
      <div class="score-value" style="font-size: 18px; padding-top: 8px;">${escapeHtml(result.growthPotential)}</div>
      <div class="score-label">Growth Potential</div>
    </div>
  </div>

  <h2>AI Insights</h2>
  <ol class="insight-list">
    ${result.insights.map(i => `<li>${escapeHtml(i)}</li>`).join("")}
  </ol>

  <h2>Recommended Upload Schedule</h2>
  <div class="schedule-grid">
    <div class="schedule-card">
      <h4>Best Upload Days</h4>
      <ol>
        ${result.bestDays.map(d => `<li>${escapeHtml(d)}</li>`).join("")}
      </ol>
    </div>
    <div class="schedule-card">
      <h4>Best Upload Times</h4>
      <ol>
        ${result.bestTimes.map(t => `<li>${escapeHtml(t)}</li>`).join("")}
      </ol>
    </div>
  </div>

  <h2>Content Suggestions</h2>
  <div class="suggestions-grid">
    <div class="suggestion-card">
      <h4>Better Title Ideas</h4>
      <ul>
        ${result.contentSuggestions.titleIdeas.map(i => `<li>${escapeHtml(i)}</li>`).join("")}
      </ul>
    </div>
    <div class="suggestion-card">
      <h4>SEO Improvements</h4>
      <ul>
        ${result.contentSuggestions.seoImprovements.map(i => `<li>${escapeHtml(i)}</li>`).join("")}
      </ul>
    </div>
    <div class="suggestion-card">
      <h4>Keyword Suggestions</h4>
      <div class="keywords">
        ${result.contentSuggestions.keywordSuggestions.map(k => `<span class="keyword">${escapeHtml(k)}</span>`).join("")}
      </div>
    </div>
    <div class="suggestion-card">
      <h4>Description Tips</h4>
      <ul>
        ${result.contentSuggestions.descriptionTips.map(i => `<li>${escapeHtml(i)}</li>`).join("")}
      </ul>
    </div>
  </div>

  <div class="disclaimer">
    <strong>Disclaimer:</strong> ${escapeHtml(result.disclaimer)}
  </div>

  <div class="footer-note">
    Generated by VideoIQ AI • www.videoiq.ai • This report is for informational purposes only.
  </div>

  <script>
    // Auto-trigger print dialog after load
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

/**
 * Shares the analysis result via Web Share API or copies link to clipboard
 */
export async function shareAnalysis(result: AnalysisResult): Promise<void> {
  const shareText = `Check out my YouTube video analysis on VideoIQ AI!\n\nVideo: ${result.title}\nChannel: ${result.channelName}\nPerformance Score: ${result.performanceScore}/100\nEngagement Rate: ${result.engagementRate}\n\nAnalyze your own videos at VideoIQ AI!`;

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: "VideoIQ AI Analysis Report",
        text: shareText,
      });
    } catch {
      // User cancelled share
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      alert("Analysis details copied to clipboard!");
    } catch {
      alert("Unable to share. Please copy the URL manually.");
    }
  }
}
