import React, { useState, useEffect } from "react";
import { Team, Defect } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award, TrendingUp, Bug, TestTube, AlertTriangle, CheckCircle, UserCheck, Target, Zap, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [defects, setDefects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [teamsData, defectsData] = await Promise.all([
        Team.list(),
        Defect.list()
      ]);
      setTeams(teamsData);
      setDefects(defectsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  const getTeamStats = (team) => {
    const teamDefects = defects.filter(d => d.assigned_team === team.name);
    const requestedDefects = defects.filter(d => d.requesting_team === team.name);
    const closed = teamDefects.filter(d => d.status === 'Closed' || d.status === 'Resolved').length;
    const total = teamDefects.length;
    const critical = teamDefects.filter(d => d.priority === 'Critical').length;
    const validationPass = teamDefects.filter(d => d.validation === 'Pass').length;
    const validationFail = teamDefects.filter(d => d.validation === 'Fail').length;
    const blocked = teamDefects.filter(d => d.validation === 'Blocked').length;
    const resolution_rate = total > 0 ? (closed / total) * 100 : 0;
    const validation_pass_rate = (validationPass + validationFail + blocked) > 0 ? (validationPass / (validationPass + validationFail + blocked)) * 100 : 0;
    
    return {
      total_defects: total,
      requested_defects: requestedDefects.length,
      closed_defects: closed,
      critical_defects: critical,
      validation_pass: validationPass,
      validation_fail: validationFail,
      blocked_defects: blocked,
      resolution_rate: Math.round(resolution_rate),
      validation_pass_rate: Math.round(validation_pass_rate)
    };
  };

  const getTeamCollaborationData = () => {
    const collaborationMap = {};
    
    defects.forEach(defect => {
      if (defect.assigned_team && defect.requesting_team && defect.assigned_team !== defect.requesting_team) {
        const key = `${defect.requesting_team} → ${defect.assigned_team}`;
        collaborationMap[key] = (collaborationMap[key] || 0) + 1;
      }
    });
    
    return Object.entries(collaborationMap)
      .map(([teams, count]) => ({ teams, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  const getTeamWorkloadData = () => {
    const workloadMap = {};
    
    teams.forEach(team => {
      const stats = getTeamStats(team);
      workloadMap[team.name] = {
        name: team.name,
        assigned: stats.total_defects,
        requested: stats.requested_defects,
        resolved: stats.closed_defects
      };
    });
    
    return Object.values(workloadMap).sort((a, b) => b.assigned - a.assigned);
  };

  const collaborationData = getTeamCollaborationData();
  const workloadData = getTeamWorkloadData();

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-pink-50/30 to-rose-50/20 min-h-screen">
      <div className="max-w-full mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#e20074] to-pink-600 bg-clip-text text-transparent mb-2">
            Team Management & Analytics
          </h1>
          <p className="text-slate-600 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#e20074]" />
            Comprehensive team performance, collaboration, and workload insights
          </p>
        </div>

        {/* Team Analytics Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Team Workload Chart */}
          <Card className="border-white/40 bg-white/80 backdrop-blur-xl shadow-2xl shadow-[#e20074]/10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#e20074]/5 to-pink-500/5 rounded-xl" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-[#e20074] to-pink-600 rounded-xl shadow-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-[#e20074] to-pink-600 bg-clip-text text-transparent">
                  Team Workload Distribution
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workloadData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} fontWeight={500} />
                  <YAxis stroke="#64748b" fontSize={12} fontWeight={500} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(226, 0, 116, 0.2)',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(226, 0, 116, 0.1)'
                    }}
                  />
                  <Bar dataKey="assigned" name="Assigned" fill="url(#assignedGradient)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" name="Resolved" fill="url(#resolvedGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="assignedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e20074" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0.7}/>
                    </linearGradient>
                    <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Team Collaboration Chart */}
          <Card className="border-white/40 bg-white/80 backdrop-blur-xl shadow-2xl shadow-[#e20074]/10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#e20074]/5 to-pink-500/5 rounded-xl" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-[#e20074] to-pink-600 rounded-xl shadow-lg">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-[#e20074] to-pink-600 bg-clip-text text-transparent">
                  Cross-Team Collaboration
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={collaborationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis type="number" stroke="#64748b" fontSize={12} fontWeight={500} />
                  <YAxis type="category" dataKey="teams" stroke="#64748b" fontSize={10} fontWeight={500} width={120} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(226, 0, 116, 0.2)',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(226, 0, 116, 0.1)'
                    }}
                  />
                  <Bar dataKey="count" name="Collaborations" fill="url(#collabGradient)" radius={[0, 4, 4, 0]} />
                  <defs>
                    <linearGradient id="collabGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#e20074" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Team Cards */}
        {isLoading ? (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="border-white/40 bg-white/80 backdrop-blur-xl shadow-xl">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-2 w-full" />
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {teams.map((team) => {
              const stats = getTeamStats(team);
              
              return (
                <Card 
                  key={team.id} 
                  className="relative border-white/40 bg-white/80 backdrop-blur-xl hover:shadow-2xl shadow-xl hover:shadow-[#e20074]/20 transition-all duration-500 hover:scale-105 group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#e20074]/5 via-pink-500/5 to-rose-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  
                  <CardHeader className="relative z-10 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: team.color + '20' || '#e20074' + '20' }}
                        >
                          <Users className="w-6 h-6" style={{ color: team.color || '#e20074' }} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#e20074] transition-colors">{team.name}</h3>
                          <p className="text-sm text-slate-600 group-hover:text-pink-600 transition-colors">Led by {team.lead}</p>
                          {team.vp && (
                            <p className="text-xs text-slate-500">VP: {team.vp}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1">
                        <Badge 
                          variant="outline"
                          className={`${
                            stats.resolution_rate >= 80 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : stats.resolution_rate >= 60
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {stats.resolution_rate}% resolved
                        </Badge>
                        <Badge 
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {stats.validation_pass_rate}% validated
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 space-y-6">
                    {team.description && (
                      <p className="text-slate-600 text-sm">{team.description}</p>
                    )}
                    
                    {/* Enhanced Progress Bars */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Resolution Rate</span>
                          <span className="font-medium">{stats.closed_defects}/{stats.total_defects}</span>
                        </div>
                        <Progress value={stats.resolution_rate} className="h-3 [&>div]:bg-[#e20074]" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Validation Success</span>
                          <span className="font-medium">{stats.validation_pass}/{stats.validation_pass + stats.validation_fail + stats.blocked_defects}</span>
                        </div>
                        <Progress value={stats.validation_pass_rate} className="h-3 [&>div]:bg-emerald-500" />
                      </div>
                    </div>
                    
                    {/* Enhanced Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-pink-50 rounded-lg">
                        <Target className="w-4 h-4 mx-auto mb-1 text-[#e20074]" />
                        <div className="text-lg font-bold text-pink-900">{stats.total_defects}</div>
                        <div className="text-xs text-pink-700">Assigned</div>
                      </div>
                      <div className="text-center p-3 bg-rose-50 rounded-lg">
                        <TrendingUp className="w-4 h-4 mx-auto mb-1 text-rose-600" />
                        <div className="text-lg font-bold text-rose-900">{stats.requested_defects}</div>
                        <div className="text-xs text-rose-700">Requested</div>
                      </div>
                      <div className="text-center p-3 bg-emerald-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                        <div className="text-lg font-bold text-emerald-900">{stats.closed_defects}</div>
                        <div className="text-xs text-emerald-700">Resolved</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <AlertTriangle className="w-4 h-4 mx-auto mb-1 text-red-600" />
                        <div className="text-lg font-bold text-red-900">{stats.critical_defects}</div>
                        <div className="text-xs text-red-700">Critical</div>
                      </div>
                    </div>

                    {/* Validation Breakdown */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <TestTube className="w-4 h-4" />
                        Test Validation
                      </h4>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-sm font-bold text-emerald-600">{stats.validation_pass}</div>
                          <div className="text-xs text-slate-600">Pass</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-red-600">{stats.validation_fail}</div>
                          <div className="text-xs text-slate-600">Fail</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-amber-600">{stats.blocked_defects}</div>
                          <div className="text-xs text-slate-600">Blocked</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Team Members */}
                    {team.members && team.members.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-2 group-hover:text-[#e20074] transition-colors flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Team Members ({team.members.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {team.members.slice(0, 3).map((member, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-pink-100 text-pink-800 border-pink-300">
                              {member}
                            </Badge>
                          ))}
                          {team.members.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600 border-slate-300">
                              +{team.members.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Focus Areas */}
                    {team.focus_areas && team.focus_areas.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-2 group-hover:text-[#e20074] transition-colors flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Focus Areas
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {team.focus_areas.map((area, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-pink-300 text-pink-700 bg-white group-hover:bg-pink-50 transition-colors">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}