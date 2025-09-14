
import React, { useState, useEffect } from "react";
import { Defect, Team, Category } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bug,
  Users,
  Sparkles,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { isWithinInterval, parseISO } from "date-fns";

import MetricCard from "../components/dashboard/MetricCard";
import AIInsights from "../components/dashboard/AIInsights";
import TeamPerformance from "../components/dashboard/TeamPerformance";
import RecentDefects from "../components/dashboard/RecentDefects";
import DefectDetails from "../components/defects/DefectDetails";

export default function Dashboard({ dateRange }) {
  const [defects, setDefects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedDefect, setSelectedDefect] = useState(null);

  useEffect(() => {
    loadData();
    // Removed generateAIInsights() from here to prevent immediate LLM call on mount
    // The AIInsights component will trigger its own refresh
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [defectsData, teamsData] = await Promise.all([
        Defect.list('-created_date'),
        Team.list()
      ]);
      setDefects(defectsData);
      setTeams(teamsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  const generateAIInsights = async () => {
    setIsAiLoading(true);
    try {
      const response = await InvokeLLM({
        prompt: `Analyze the current defect management situation and provide executive insights. Consider trends, patterns, priorities, and actionable recommendations for the development teams. Focus on:
        1. Key trends and patterns
        2. Risk areas that need attention
        3. Team performance insights
        4. Strategic recommendations
        5. Priority actions for the next sprint

        Provide a concise, executive-level summary with specific, actionable insights.`,
        response_json_schema: {
          type: "object",
          properties: {
            executive_summary: { type: "string" },
            key_trends: { type: "array", items: { type: "string" } },
            risk_areas: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } }
          }
        }
      });
      setAiInsights(response);
    } catch (error) {
      console.error('Error generating AI insights:', error);
    }
    setIsAiLoading(false);
  };

  const getFilteredDefects = () => {
    if (!dateRange?.from) return defects;

    return defects.filter(defect => {
      const defectDate = parseISO(defect.created_date);
      const endDate = dateRange.to
        ? new Date(dateRange.to.getFullYear(), dateRange.to.getMonth(), dateRange.to.getDate(), 23, 59, 59, 999)
        : new Date(dateRange.from.getFullYear(), dateRange.from.getMonth(), dateRange.from.getDate(), 23, 59, 59, 999);

      return isWithinInterval(defectDate, {
        start: dateRange.from,
        end: endDate
      });
    });
  };

  const getMetrics = () => {
    const filteredDefects = getFilteredDefects();
    const total = filteredDefects.length;
    const open = filteredDefects.filter(d => ['new', 'open', 'in_progress'].includes(d.status)).length;
    const closed = filteredDefects.filter(d => d.status === 'closed').length;
    const newDefects = filteredDefects.filter(d => d.status === 'new').length;
    const critical = filteredDefects.filter(d => d.priority === 'critical').length;
    const recurring = filteredDefects.filter(d => d.is_recurring).length;

    return { total, open, closed, newDefects, critical, recurring };
  };

  const handleDefectUpdate = (updatedDefect) => {
    setDefects(prevDefects =>
      prevDefects.map(d => (d.id === updatedDefect.id ? updatedDefect : d))
    );
    setSelectedDefect(null);
  };

  const metrics = getMetrics();
  const filteredDefects = getFilteredDefects();

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 via-pink-50/30 to-rose-50/20 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Info */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-slate-600">
            <Filter className="w-4 h-4 text-[#e20074]" />
            {dateRange?.from ? (
              <span>Showing data for selected date range</span>
            ) : (
              <span>Showing all-time data • Use date filter to analyze specific periods</span>
            )}
          </div>
        </div>

        {/* AI Executive Summary */}
        <AIInsights insights={aiInsights} isLoading={isAiLoading} onRefresh={generateAIInsights} />

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
          <MetricCard
            title="Total Defects"
            value={metrics.total}
            icon={Bug}
            trend={{ direction: "up", value: "12%" }}
            color="magenta"
            description="All tracked defects"
          />
          <MetricCard
            title="Open Defects"
            value={metrics.open}
            icon={AlertTriangle}
            trend={{ direction: "up", value: "5%" }}
            color="amber"
            description="Active & in progress"
          />
          <MetricCard
            title="Closed"
            value={metrics.closed}
            icon={CheckCircle}
            trend={{ direction: "up", value: "18%" }}
            color="emerald"
            description="Successfully resolved"
          />
          <MetricCard
            title="New"
            value={metrics.newDefects}
            icon={Clock}
            trend={{ direction: "down", value: "3%" }}
            color="purple"
            description="Recently reported"
          />
          <MetricCard
            title="Critical"
            value={metrics.critical}
            icon={AlertTriangle}
            trend={{ direction: "stable" }}
            color="red"
            description="High priority issues"
          />
          <MetricCard
            title="Recurring"
            value={metrics.recurring}
            icon={TrendingUp}
            trend={{ direction: "down", value: "8%" }}
            color="pink"
            description="Repeated patterns"
          />
        </div>

        {/* Charts and Analysis */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <TeamPerformance defects={filteredDefects} teams={teams} />
          <RecentDefects
            defects={filteredDefects}
            isLoading={isLoading}
            onDefectSelect={setSelectedDefect}
          />
        </div>

        {/* Selected Defect Details */}
        {selectedDefect && (
          <DefectDetails
            defect={selectedDefect}
            onClose={() => setSelectedDefect(null)}
            onUpdate={handleDefectUpdate}
          />
        )}
      </div>
    </div>
  );
}
