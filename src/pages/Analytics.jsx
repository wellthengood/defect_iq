
import React, { useState, useEffect } from "react";
import { Defect, Team } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { parseISO, isWithinInterval } from "date-fns";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  Sparkles,
  TestTube,
  Users2,
  FolderOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Target,
  Zap,
  Brain,
  Filter
} from "lucide-react";
import {
  PieChart as RechartsPieChart,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  LineChart,
  Line,
  ComposedChart,
  Area,
  AreaChart
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AnalyticsPage({ dateRange }) {
  const [defects, setDefects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("all"); // Keep this state for local fallback if no global dateRange
  const [applicationFilter, setApplicationFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [defectsData, teamsData] = await Promise.all([
        Defect.list(),
        Team.list()
      ]);
      setDefects(defectsData);
      setTeams(teamsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  const getFilteredDefects = () => {
    let filtered = defects;

    // Apply global date range filter first
    if (dateRange?.from) {
      filtered = filtered.filter(defect => {
        const defectDate = parseISO(defect.created_date);
        const endDate = dateRange.to
          ? new Date(dateRange.to.getFullYear(), dateRange.to.getMonth(), dateRange.to.getDate(), 23, 59, 59, 999)
          : new Date(dateRange.from.getFullYear(), dateRange.from.getMonth(), dateRange.from.getDate(), 23, 59, 59, 999);

        return isWithinInterval(defectDate, {
          start: dateRange.from,
          end: endDate
        });
      });
    }

    if (applicationFilter !== "all") {
      filtered = filtered.filter(d => d.affected_application === applicationFilter);
    }

    // Only apply local timeFilter if no global dateRange is active
    if (timeFilter !== "all" && !dateRange?.from) {
      const now = new Date();
      const filterDate = new Date();

      switch (timeFilter) {
        case "7days":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "30days":
          filterDate.setDate(now.getDate() - 30);
          break;
        case "90days":
          filterDate.setDate(now.getDate() - 90);
          break;
        default:
          return filtered;
      }

      filtered = filtered.filter(d => new Date(d.created_date) >= filterDate);
    }

    return filtered;
  };

  const getKPIMetrics = () => {
    const filtered = getFilteredDefects();
    const total = filtered.length;
    const critical = filtered.filter(d => d.priority === 'Critical').length;
    const resolved = filtered.filter(d => d.status === 'Resolved' || d.status === 'Closed').length;
    const inProgress = filtered.filter(d => d.status === 'In Progress').length;
    const validationPass = filtered.filter(d => d.validation === 'Pass').length;
    const validationTotal = filtered.filter(d => d.validation).length;
    const blockers = filtered.filter(d => d.severity === 'Blocker').length;

    return {
      total,
      critical,
      resolved,
      inProgress,
      blockers,
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
      validationPassRate: validationTotal > 0 ? Math.round((validationPass / validationTotal) * 100) : 0
    };
  };

  const getPriorityDistribution = () => {
    const filtered = getFilteredDefects();
    const priorities = ['Critical', 'High', 'Medium', 'Low'];
    return priorities.map(priority => ({
      name: priority,
      value: filtered.filter(d => d.priority === priority).length,
      color: priority === 'Critical' ? '#ef4444' :
             priority === 'High' ? '#f97316' :
             priority === 'Medium' ? '#eab308' : '#3b82f6'
    }));
  };

  const getApplicationBreakdown = () => {
    const filtered = getFilteredDefects();
    const apps = [...new Set(filtered.map(d => d.affected_application).filter(Boolean))];
    return apps.map(app => {
      const appDefects = filtered.filter(d => d.affected_application === app);
      return {
        name: app,
        total: appDefects.length,
        critical: appDefects.filter(d => d.priority === 'Critical').length,
        resolved: appDefects.filter(d => d.status === 'Resolved' || d.status === 'Closed').length
      };
    }).sort((a, b) => b.total - a.total);
  };

  const getTeamPerformance = () => {
    const filtered = getFilteredDefects();
    const teamMap = {};

    teams.forEach(team => {
      const teamDefects = filtered.filter(d => d.assigned_team === team.name);
      const resolved = teamDefects.filter(d => d.status === 'Resolved' || d.status === 'Closed').length;
      const critical = teamDefects.filter(d => d.priority === 'Critical').length;

      teamMap[team.name] = {
        name: team.name,
        vp: team.vp,
        total: teamDefects.length,
        resolved: resolved,
        critical: critical,
        resolutionRate: teamDefects.length > 0 ? Math.round((resolved / teamDefects.length) * 100) : 0
      };
    });

    return Object.values(teamMap).filter(team => team.total > 0).sort((a, b) => b.resolutionRate - a.resolutionRate);
  };

  const getTestingMetrics = () => {
    const filtered = getFilteredDefects();
    const validationData = {
      Pass: filtered.filter(d => d.validation === 'Pass').length,
      Fail: filtered.filter(d => d.validation === 'Fail').length,
      Blocked: filtered.filter(d => d.validation === 'Blocked').length
    };

    const testCategories = [...new Set(filtered.map(d => d.test_category).filter(Boolean))];
    const categoryData = testCategories.map(cat => ({
      name: cat,
      value: filtered.filter(d => d.test_category === cat).length
    }));

    return { validationData, categoryData };
  };

  const getProjectInsights = () => {
    const filtered = getFilteredDefects();
    const projects = [...new Set(filtered.map(d => d.project_name).filter(Boolean))];
    return projects.map(project => {
      const projectDefects = filtered.filter(d => d.project_name === project);
      const projectType = projectDefects[0]?.project_type || 'Unknown';
      const projectLead = projectDefects[0]?.project_lead || 'Unknown';

      return {
        name: project,
        type: projectType,
        lead: projectLead,
        total: projectDefects.length,
        critical: projectDefects.filter(d => d.priority === 'Critical').length,
        resolved: projectDefects.filter(d => d.status === 'Resolved' || d.status === 'Closed').length,
        blocked: projectDefects.filter(d => d.validation === 'Blocked').length
      };
    }).sort((a, b) => b.total - a.total).slice(0, 6);
  };

  const getDefectTrends = () => {
    const filtered = getFilteredDefects();
    const last30Days = [];
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayDefects = filtered.filter(d =>
        d.created_date && d.created_date.split('T')[0] === dateStr
      );

      last30Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        created: dayDefects.length,
        resolved: dayDefects.filter(d => d.status === 'Resolved' || d.status === 'Closed').length,
        critical: dayDefects.filter(d => d.priority === 'Critical').length
      });
    }

    return last30Days;
  };

  const kpis = getKPIMetrics();
  const priorityData = getPriorityDistribution();
  const appData = getApplicationBreakdown();
  const teamData = getTeamPerformance();
  const { validationData, categoryData } = getTestingMetrics();
  const projectData = getProjectInsights();
  const trendData = getDefectTrends();

  const COLORS = ['#e20074', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 via-pink-50/30 to-rose-50/20 min-h-screen">
      <div className="max-w-full mx-auto">
        {/* Enhanced Header with Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#e20074] via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Advanced Analytics Dashboard
            </h1>
            <p className="text-slate-600 flex items-center gap-2 text-lg">
              <Brain className="w-5 h-5 text-[#e20074]" />
              Comprehensive insights into defect patterns, team performance, and quality metrics
            </p>
          </div>

          <div className="flex gap-4">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-40 bg-white/80 border-pink-200">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={applicationFilter} onValueChange={setApplicationFilter}>
              <SelectTrigger className="w-40 bg-white/80 border-pink-200">
                <SelectValue placeholder="Application" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Apps</SelectItem>
                <SelectItem value="API">API</SelectItem>
                <SelectItem value="Portal">Portal</SelectItem>
                <SelectItem value="App1">App1</SelectItem>
                <SelectItem value="App2">App2</SelectItem>
                <SelectItem value="App3">App3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="text-3xl font-bold text-blue-700">{kpis.total}</div>
              </div>
              <div className="text-sm font-medium text-blue-600">Total Defects</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border-red-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-500 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div className="text-3xl font-bold text-red-700">{kpis.critical}</div>
              </div>
              <div className="text-sm font-medium text-red-600">Critical Issues</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-500 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div className="text-3xl font-bold text-emerald-700">{kpis.resolved}</div>
              </div>
              <div className="text-sm font-medium text-emerald-600">Resolved</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500 rounded-xl">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="text-3xl font-bold text-purple-700">{kpis.inProgress}</div>
              </div>
              <div className="text-sm font-medium text-purple-600">In Progress</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-500 rounded-xl">
                  <XCircle className="w-5 h-5 text-white" />
                </div>
                <div className="text-3xl font-bold text-orange-700">{kpis.blockers}</div>
              </div>
              <div className="text-sm font-medium text-orange-600">Blockers</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#e20074]/10 to-pink-500/10 border-pink-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#e20074] rounded-xl">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="text-3xl font-bold text-[#e20074]">{kpis.resolutionRate}%</div>
              </div>
              <div className="text-sm font-medium text-pink-600">Resolution Rate</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-teal-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-teal-500 rounded-xl">
                  <TestTube className="w-5 h-5 text-white" />
                </div>
                <div className="text-3xl font-bold text-teal-700">{kpis.validationPassRate}%</div>
              </div>
              <div className="text-sm font-medium text-teal-600">Validation Pass</div>
            </CardContent>
          </Card>
        </div>

        {/* Defect Trends Chart */}
        <Card className="mb-8 border-white/40 bg-white/80 backdrop-blur-xl shadow-2xl shadow-[#e20074]/10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#e20074]/5 via-pink-500/5 to-rose-500/5 rounded-xl" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-3 bg-gradient-to-br from-[#e20074] to-pink-600 rounded-2xl shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-[#e20074] to-pink-600 bg-clip-text text-transparent">
                Defect Trends (Last 30 Days)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(226, 0, 116, 0.2)',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px -5px rgba(226, 0, 116, 0.1)'
                  }}
                />
                <Area type="monotone" dataKey="created" fill="url(#createdGradient)" stroke="#e20074" strokeWidth={2} />
                <Bar dataKey="resolved" fill="url(#resolvedGradient)" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={3} />
                <defs>
                  <linearGradient id="createdGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e20074" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#e20074" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Distribution and Application Breakdown */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card className="border-white/40 bg-white/80 backdrop-blur-xl shadow-2xl shadow-purple-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-xl" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Priority Distribution
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-white/40 bg-white/80 backdrop-blur-xl shadow-2xl shadow-emerald-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-xl" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Application Breakdown
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={appData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="total" name="Total" fill="url(#appTotalGradient)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="critical" name="Critical" fill="url(#appCriticalGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="appTotalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.7}/>
                    </linearGradient>
                    <linearGradient id="appCriticalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Team Performance and Testing Metrics */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card className="border-white/40 bg-white/80 backdrop-blur-xl shadow-2xl shadow-blue-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-sky-500/5 rounded-xl" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-sky-600 rounded-xl shadow-lg">
                  <Users2 className="w-5 h-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                  Team Performance
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-4">
              {teamData.map((team, index) => (
                <div key={team.name} className="p-4 bg-white/60 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-800">{team.name}</h4>
                      <p className="text-sm text-slate-600">VP: {team.vp}</p>
                    </div>
                    <Badge className={`${
                      team.resolutionRate >= 80 ? 'bg-green-100 text-green-800' :
                      team.resolutionRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {team.resolutionRate}% resolved
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <div className="font-bold text-blue-700">{team.total}</div>
                      <div className="text-blue-600">Total</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <div className="font-bold text-green-700">{team.resolved}</div>
                      <div className="text-green-600">Resolved</div>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded-lg">
                      <div className="font-bold text-red-700">{team.critical}</div>
                      <div className="text-red-600">Critical</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/40 bg-white/80 backdrop-blur-xl shadow-2xl shadow-teal-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 rounded-xl" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg">
                  <TestTube className="w-5 h-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Testing & Validation
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-700 mb-3">Validation Status</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={Object.entries(validationData).map(([name, value]) => ({ name, value }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {Object.entries(validationData).map(([name], index) => (
                          <Cell key={`cell-${index}`} fill={
                            name === 'Pass' ? '#10b981' :
                            name === 'Fail' ? '#ef4444' : '#f59e0b'
                          } />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Insights */}
        <Card className="border-white/40 bg-white/80 backdrop-blur-xl shadow-2xl shadow-indigo-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-xl" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Top Projects Overview
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectData.map((project, index) => (
                <div key={project.name} className="p-5 bg-white/60 rounded-xl border border-indigo-100">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-800 text-lg">{project.name}</h4>
                      <p className="text-sm text-slate-600">{project.type} • {project.lead}</p>
                    </div>
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-300">
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-700">{project.total}</div>
                      <div className="text-sm text-blue-600">Total Issues</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-xl font-bold text-red-700">{project.critical}</div>
                      <div className="text-sm text-red-600">Critical</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-700">{project.resolved}</div>
                      <div className="text-sm text-green-600">Resolved</div>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                      <div className="text-xl font-bold text-amber-700">{project.blocked}</div>
                      <div className="text-sm text-amber-600">Blocked</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
