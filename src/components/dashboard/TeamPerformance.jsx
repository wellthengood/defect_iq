import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award, AlertTriangle, TrendingUp, CheckCircle, Target, TestTube } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function TeamPerformance({ defects, teams }) {
  const getTeamStats = () => {
    if (!teams || !defects) return [];
    
    return teams.map(team => {
      const teamDefects = defects.filter(d => d.assigned_team === team.name);
      const requestedDefects = defects.filter(d => d.requesting_team === team.name);
      const closed = teamDefects.filter(d => d.status === 'Closed' || d.status === 'Resolved').length;
      const total = teamDefects.length;
      const critical = teamDefects.filter(d => d.priority === 'Critical').length;
      const validationPass = teamDefects.filter(d => d.validation === 'Pass').length;
      const validationFail = teamDefects.filter(d => d.validation === 'Fail').length;
      const blocked = teamDefects.filter(d => d.validation === 'Blocked').length;
      const inProgress = teamDefects.filter(d => d.status === 'In Progress').length;
      const resolution_rate = total > 0 ? (closed / total) * 100 : 0;
      const validation_total = validationPass + validationFail + blocked;
      const validation_success_rate = validation_total > 0 ? (validationPass / validation_total) * 100 : 0;
      
      return {
        ...team,
        total_defects: total,
        requested_defects: requestedDefects.length,
        closed_defects: closed,
        in_progress_defects: inProgress,
        critical_defects: critical,
        validation_pass: validationPass,
        validation_fail: validationFail,
        blocked_defects: blocked,
        resolution_rate: Math.round(resolution_rate),
        validation_success_rate: Math.round(validation_success_rate),
        efficiency_score: Math.round((resolution_rate + validation_success_rate) / 2)
      };
    }).sort((a, b) => b.efficiency_score - a.efficiency_score);
  };

  const teamStats = getTeamStats();

  return (
    <Card className="border-white/40 bg-white/80 backdrop-blur-xl shadow-2xl shadow-[#e20074]/10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#e20074]/5 via-pink-500/5 to-rose-500/5 rounded-xl" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-gradient-to-br from-[#e20074] to-pink-600 rounded-xl shadow-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-[#e20074] to-pink-600 bg-clip-text text-transparent">
              Team Performance
            </span>
            <div className="text-sm font-normal text-slate-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-[#e20074]" />
              Real-time performance metrics
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-4">
        {teamStats.length > 0 ? (
          teamStats.map((team, index) => (
            <div key={team.id} className="p-6 rounded-2xl border border-white/40 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300 hover:shadow-lg hover:shadow-[#e20074]/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {index === 0 && (
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full shadow-lg">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{team.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span>Led by {team.lead}</span>
                      {team.vp && (
                        <>
                          <span>•</span>
                          <span>VP: {team.vp}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline"
                    className={`${
                      team.efficiency_score >= 80 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : team.efficiency_score >= 60
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : 'bg-red-50 text-red-700 border-red-300'
                    } font-semibold`}
                  >
                    Efficiency: {team.efficiency_score}%
                  </Badge>
                </div>
              </div>
              
              {/* Performance Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <Target className="w-5 h-5 mx-auto mb-2 text-blue-600" />
                  <div className="text-lg font-bold text-blue-900">{team.total_defects}</div>
                  <div className="text-xs text-blue-700 font-medium">Assigned</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                  <CheckCircle className="w-5 h-5 mx-auto mb-2 text-emerald-600" />
                  <div className="text-lg font-bold text-emerald-900">{team.closed_defects}</div>
                  <div className="text-xs text-emerald-700 font-medium">Resolved</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                  <Users className="w-5 h-5 mx-auto mb-2 text-purple-600" />
                  <div className="text-lg font-bold text-purple-900">{team.in_progress_defects}</div>
                  <div className="text-xs text-purple-700 font-medium">In Progress</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-200">
                  <AlertTriangle className="w-5 h-5 mx-auto mb-2 text-red-600" />
                  <div className="text-lg font-bold text-red-900">{team.critical_defects}</div>
                  <div className="text-xs text-red-700 font-medium">Critical</div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-700">Resolution Rate</span>
                    <span className="text-[#e20074]">{team.resolution_rate}%</span>
                  </div>
                  <Progress value={team.resolution_rate} className="h-3">
                    <div 
                      className="h-full bg-gradient-to-r from-[#e20074] to-pink-500 rounded-full transition-all duration-300"
                      style={{ width: `${team.resolution_rate}%` }}
                    />
                  </Progress>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-700">Validation Success</span>
                    <span className="text-emerald-600">{team.validation_success_rate}%</span>
                  </div>
                  <Progress value={team.validation_success_rate} className="h-3">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                      style={{ width: `${team.validation_success_rate}%` }}
                    />
                  </Progress>
                </div>
              </div>

              {/* Validation Breakdown */}
              <div className="mt-4 p-3 bg-slate-50/80 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <TestTube className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Test Validation Breakdown</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-sm font-bold text-emerald-600">{team.validation_pass}</div>
                    <div className="text-xs text-slate-600">Pass</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-red-600">{team.validation_fail}</div>
                    <div className="text-xs text-slate-600">Fail</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-amber-600">{team.blocked_defects}</div>
                    <div className="text-xs text-slate-600">Blocked</div>
                  </div>
                </div>
              </div>

              {/* Team Collaboration */}
              {team.requested_defects > 0 && (
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-600">Cross-team requests:</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                    {team.requested_defects} requests made
                  </Badge>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No team data available</p>
            <p className="text-sm">Team performance will appear here once data is loaded</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}