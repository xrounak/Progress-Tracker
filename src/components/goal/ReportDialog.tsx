import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Download, FileText, BarChart3, Palette } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { Task, TaskLog } from "@/types/habits";

interface ReportDialogProps {
    isOpen: boolean;
    onClose: () => void;
    goalTitle: string;
    tasks: Task[];
    logs: TaskLog[];
    dailyTotals: Record<string, number>;
    dates: string[];
}

type FontType = "sans" | "serif" | "mono";
type StyleType = "simple" | "professional" | "creative";
type ThemeType = "blue" | "green" | "purple";
type PDFTheme = "light" | "dark";

export const ReportDialog: React.FC<ReportDialogProps> = ({
    isOpen,
    onClose,
    goalTitle,
    tasks,
    logs,
    dailyTotals,
    dates,
}) => {
    const [font, setFont] = useState<FontType>("sans");
    const [style, setStyle] = useState<StyleType>("simple");
    const [includeGraphs, setIncludeGraphs] = useState(true);
    const [theme, setTheme] = useState<ThemeType>("blue");
    const [pdfTheme, setPdfTheme] = useState<PDFTheme>("light");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        setIsGenerating(true);
        try {
            // Create a temporary container for the report
            const reportContainer = document.createElement("div");
            reportContainer.id = "report-container";
            reportContainer.style.position = "absolute";
            reportContainer.style.left = "-9999px";
            reportContainer.style.top = "0";
            reportContainer.style.width = "800px"; // Fixed width for A4 consistency
            reportContainer.style.backgroundColor = "#ffffff";
            reportContainer.style.padding = "40px";

            // Apply styles based on selection
            const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";
            const themeColor = theme === "blue" ? "#3b82f6" : theme === "green" ? "#10b981" : "#8b5cf6";
            const themeBg = theme === "blue" ? "#eff6ff" : theme === "green" ? "#ecfdf5" : "#f5f3ff";

            // Dark/Light theme colors
            const bgColor = pdfTheme === "dark" ? "#0f172a" : "#ffffff";
            const textColor = pdfTheme === "dark" ? "#f1f5f9" : "#1e293b";
            const mutedColor = pdfTheme === "dark" ? "#94a3b8" : "#64748b";
            const cardBg = pdfTheme === "dark" ? "#1e293b" : themeBg;
            const tableBg = pdfTheme === "dark" ? "#1e293b" : "#f8fafc";
            const borderColor = pdfTheme === "dark" ? "#334155" : "#e2e8f0";

            // Build HTML content
            reportContainer.style.backgroundColor = bgColor;
            let htmlContent = `
        <div class="${fontClass}" style="color: ${textColor};">
          <div style="border-bottom: 2px solid ${themeColor}; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="font-size: 32px; font-weight: bold; color: ${themeColor}; margin: 0;">${goalTitle}</h1>
            <p style="color: ${mutedColor}; margin-top: 8px;">Progress Report</p>
            <p style="color: ${mutedColor}; font-size: 14px;">Generated on ${new Date().toLocaleDateString()}</p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 40px;">
            <div style="background-color: ${cardBg}; padding: 20px; border-radius: 12px;">
              <p style="color: ${mutedColor}; font-size: 14px; margin: 0;">Total Tasks</p>
              <p style="font-size: 24px; font-weight: bold; color: ${themeColor}; margin: 5px 0 0 0;">${tasks.length}</p>
            </div>
            <div style="background-color: ${cardBg}; padding: 20px; border-radius: 12px;">
              <p style="color: ${mutedColor}; font-size: 14px; margin: 0;">Total Points</p>
              <p style="font-size: 24px; font-weight: bold; color: ${themeColor}; margin: 5px 0 0 0;">
                ${Object.values(dailyTotals).reduce((a, b) => a + b, 0)}
              </p>
            </div>
            <div style="background-color: ${cardBg}; padding: 20px; border-radius: 12px;">
              <p style="color: ${mutedColor}; font-size: 14px; margin: 0;">Duration</p>
              <p style="font-size: 24px; font-weight: bold; color: ${themeColor}; margin: 5px 0 0 0;">${dates.length} Days</p>
            </div>
          </div>

          <div style="margin-bottom: 40px;">
            <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 15px; color: ${textColor};">Task Summary</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: ${cardBg};">
                  <th style="text-align: left; padding: 12px; color: ${themeColor}; font-size: 14px;">Task Name</th>
                  <th style="text-align: right; padding: 12px; color: ${themeColor}; font-size: 14px;">Max Points</th>
                  <th style="text-align: right; padding: 12px; color: ${themeColor}; font-size: 14px;">Points Earned</th>
                  <th style="text-align: right; padding: 12px; color: ${themeColor}; font-size: 14px;">Completion</th>
                </tr>
              </thead>
              <tbody>
                ${tasks.map((task, index) => {
                const taskLogs = logs.filter(l => l.task_id === task.id);
                const earned = taskLogs.reduce((sum, l) => sum + l.points_earned, 0);
                const maxPossible = task.points * dates.length;
                const percentage = maxPossible > 0 ? Math.round((earned / maxPossible) * 100) : 0;
                const bg = index % 2 === 0 ? bgColor : tableBg;

                return `
                    <tr style="background-color: ${bg}; border-bottom: 1px solid ${borderColor};">
                      <td style="padding: 12px; font-size: 14px; color: ${textColor};">${task.title}</td>
                      <td style="padding: 12px; text-align: right; font-size: 14px; color: ${textColor};">${task.points}</td>
                      <td style="padding: 12px; text-align: right; font-size: 14px; color: ${textColor};">${earned}</td>
                      <td style="padding: 12px; text-align: right; font-size: 14px; color: ${textColor};">${percentage}%</td>
                    </tr>
                  `;
            }).join("")}
              </tbody>
            </table>
          </div>
      `;

            if (includeGraphs) {
                const maxDaily = Math.max(...Object.values(dailyTotals), 1);
                const chartWidth = 700;
                const chartHeight = 200;
                const padding = 40;
                const graphWidth = chartWidth - padding * 2;
                const graphHeight = chartHeight - padding * 2;

                // Calculate points for the line chart
                const points = dates.map((date, index) => {
                    const val = dailyTotals[date] || 0;
                    const x = padding + (index / (dates.length - 1)) * graphWidth;
                    const y = padding + graphHeight - (val / maxDaily) * graphHeight;
                    return { x, y, val, date };
                });

                // Create SVG path for the line
                const linePath = points.map((p, i) =>
                    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
                ).join(' ');

                // Create area fill path
                const areaPath = `M ${padding} ${padding + graphHeight} L ${points.map(p => `${p.x} ${p.y}`).join(' L ')} L ${padding + graphWidth} ${padding + graphHeight} Z`;

                // Create X-axis labels (show every few days to avoid crowding)
                const labelInterval = Math.ceil(dates.length / 10);
                const xLabels = points.map((p, i) => {
                    if (i % labelInterval === 0 || i === points.length - 1) {
                        return `<text x="${p.x}" y="${chartHeight - 10}" text-anchor="middle" font-size="10" fill="${mutedColor}">${new Date(p.date).getDate()}</text>`;
                    }
                    return '';
                }).join('');

                // Create Y-axis labels
                const ySteps = 4;
                const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => {
                    const value = Math.round((maxDaily / ySteps) * i);
                    const y = padding + graphHeight - (i / ySteps) * graphHeight;
                    return `
                        <text x="${padding - 10}" y="${y + 4}" text-anchor="end" font-size="10" fill="${mutedColor}">${value}</text>
                        <line x1="${padding}" y1="${y}" x2="${padding + graphWidth}" y2="${y}" stroke="${borderColor}" stroke-width="1" stroke-dasharray="2,2"/>
                    `;
                }).join('');

                htmlContent += `
          <div style="margin-top: 40px;">
            <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 20px; color: ${textColor};">Daily Progress</h2>
            <svg width="${chartWidth}" height="${chartHeight}" style="display: block;">
                <!-- Grid lines and Y-axis labels -->
                ${yLabels}
                
                <!-- Area fill under the line -->
                <path d="${areaPath}" fill="${themeColor}" fill-opacity="0.1"/>
                
                <!-- Line chart -->
                <path d="${linePath}" fill="none" stroke="${themeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                
                <!-- Data points -->
                ${points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="3" fill="${themeColor}"/>`).join('')}
                
                <!-- X-axis -->
                <line x1="${padding}" y1="${padding + graphHeight}" x2="${padding + graphWidth}" y2="${padding + graphHeight}" stroke="${borderColor}" stroke-width="2"/>
                
                <!-- Y-axis -->
                <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${padding + graphHeight}" stroke="${borderColor}" stroke-width="2"/>
                
                <!-- X-axis labels -->
                ${xLabels}
            </svg>
          </div>
        `;
            }

            htmlContent += `</div>`;
            reportContainer.innerHTML = htmlContent;
            document.body.appendChild(reportContainer);

            // Generate PDF
            const canvas = await html2canvas(reportContainer, {
                scale: 2, // Better quality
                logging: false,
                useCORS: true
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4"
            });

            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`${goalTitle.replace(/\s+/g, "_")}_Report.pdf`);

            // Cleanup
            document.body.removeChild(reportContainer);
            onClose();
        } catch (error) {
            console.error("Failed to generate PDF", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Download Report">
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Font Style</label>
                        <div className="flex gap-2">
                            {(["sans", "serif", "mono"] as FontType[]).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFont(f)}
                                    className={`flex-1 rounded-md border px-3 py-2 text-xs capitalize transition-all ${font === f
                                        ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                                        : "border-border hover:bg-muted"
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Theme</label>
                        <div className="flex gap-2">
                            {(["blue", "green", "purple"] as ThemeType[]).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTheme(t)}
                                    className={`flex-1 rounded-md border px-3 py-2 text-xs capitalize transition-all ${theme === t
                                        ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                                        : "border-border hover:bg-muted"
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">PDF Theme</label>
                    <div className="flex gap-2">
                        {(["light", "dark"] as PDFTheme[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => setPdfTheme(t)}
                                className={`flex-1 rounded-md border px-3 py-2 text-xs capitalize transition-all ${pdfTheme === t
                                    ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                                    : "border-border hover:bg-muted"
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Options</label>
                    <div className="flex flex-col gap-2">
                        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50">
                            <input
                                type="checkbox"
                                checked={includeGraphs}
                                onChange={(e) => setIncludeGraphs(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <div className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Include Progress Charts</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={onClose} disabled={isGenerating} className="w-full sm:w-auto">
                        Cancel
                    </Button>
                    <Button onClick={handleDownload} disabled={isGenerating} className="gap-2 w-full sm:w-auto">
                        {isGenerating ? (
                            <Spinner size="sm" className="text-primary-foreground" />
                        ) : (
                            <Download className="h-4 w-4" />
                        )}
                        {isGenerating ? "Generating..." : "Download PDF"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
