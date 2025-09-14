import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, Bug, Users, ExternalLink, CheckCircle2, XCircle, TestTube, FolderOpen } from "lucide-react";
import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const priorityColors = {
  Critical: "bg-red-100 text-red-800 border-red-200",
  High: "bg-orange-100 text-orange-800 border-orange-200",
  Medium: "bg-amber-100 text-amber-800 border-amber-200",
  Low: "bg-blue-100 text-blue-800 border-blue-200"
};

const statusColors = {
  Open: "bg-blue-100 text-blue-800 border-blue-200",
  "In Progress": "bg-purple-100 text-purple-800 border-purple-200",
  Resolved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Closed: "bg-gray-100 text-gray-800 border-gray-200",
  Reopened: "bg-red-100 text-red-800 border-red-200"
};

const validationColors = {
  Pass: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Fail: "bg-red-100 text-red-800 border-red-200",
  Blocked: "bg-amber-100 text-amber-800 border-amber-200"
};

export default function RecentDefects({ defects, isLoading, onDefectSelect }) {
  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return `Today, ${format(date, "HH:mm")}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, "HH:mm")}`;
    } else {
      return formatDistanceToNow(date, { addSuffix: true });
    }
  };

  const getRecentDefects = () => {
    if (!defects || defects.length === 0) return [];
    
    return defects
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
      .slice(0, 8);
  };

  const recentDefects = getRecentDefects();

  return (
    <Card className="border-white/40 bg-white/80 backdrop-blur-xl shadow-2xl shadow-slate-500/10">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-gray-500/5 to-slate-500/5 rounded-xl" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-gradient-to-br from-slate-600 to-gray-700 rounded-xl shadow-lg">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-slate-700 to-gray-600 bg-clip-text text-transparent">
              Recent Activity
            </span>
            <div className="text-sm font-normal text-slate-600 flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3 text-slate-500" />
              Latest defects and updates
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        {isLoading ? (
          <div className="space-y-4">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-white/50">
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : recentDefects.length > 0 ? (
          <div className="space-y-3">
            {recentDefects.map((defect, index) => (
              <div 
                key={defect.id} 
                className="group flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-white/70 hover:border-[#e20074]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#e20074]/5 cursor-pointer bg-white/50 backdrop-blur-sm"
                onClick={() => onDefectSelect && onDefectSelect(defect)}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Issue Icon & Priority Indicator */}
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                      defect.priority === 'Critical' ? 'bg-gradient-to-br from-red-500 to-rose-600' :
                      defect.priority === 'High' ? 'bg-gradient-to-br from-orange-500 to-red-500' :
                      defect.priority === 'Medium' ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                      'bg-gradient-to-br from-blue-500 to-indigo-600'
                    }`}>
                      <Bug className="w-5 h-5 text-white" />
                    </div>
                    {defect.priority === 'Critical' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">!</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Defect Information */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-mono text-[#e20074] font-bold">
                        {defect.issue_key}
                      </span>
                      <div className="w-1 h-1 bg-slate-400 rounded-full" />
                      <span className="text-xs text-slate-500 font-medium">
                        {defect.issue_type}
                      </span>
                    </div>
                    <h4 className="font-semibold text-slate-900 truncate mb-1 group-hover:text-[#e20074] transition-colors">
                      {defect.summary || "Untitled Defect"}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span className="font-medium">{defect.assigned_team || "Unassigned"}</span>
                      </div>
                      <div className="w-1 h-1 bg-slate-300 rounded-full" />
                      <div className="flex items-center gap-1">
                        <FolderOpen className="w-3 h-3 text-slate-400" />
                        <span>{defect.project_name || "No Project"}</span>
                      </div>
                      <div className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span className="text-slate-500">
                        {getFormattedDate(defect.created_date)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Status Badges */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="outline" className={priorityColors[defect.priority]}>
                    {defect.priority}
                  </Badge>
                  <Badge variant="outline" className={statusColors[defect.status]}>
                    {defect.status}
                  </Badge>
                  {defect.validation && (
                    <Badge variant="outline" className={validationColors[defect.validation]}>
                      {defect.validation === 'Pass' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {defect.validation === 'Fail' && <XCircle className="w-3 h-3 mr-1" />}
                      {defect.validation === 'Blocked' && <TestTube className="w-3 h-3 mr-1" />}
                      {defect.validation}
                    </Badge>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#e20074]/10 hover:text-[#e20074]"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDefectSelect && onDefectSelect(defect);
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {/* Activity Summary */}
            <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-slate-700">
                    {recentDefects.filter(d => d.priority === 'Critical').length}
                  </div>
                  <div className="text-xs text-red-600 font-medium">Critical Today</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-700">
                    {recentDefects.filter(d => d.status === 'In Progress').length}
                  </div>
                  <div className="text-xs text-purple-600 font-medium">In Progress</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-700">
                    {recentDefects.filter(d => d.validation === 'Pass').length}
                  </div>
                  <div className="text-xs text-emerald-600 font-medium">Validated</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-700">
                    {new Set(recentDefects.map(d => d.assigned_team)).size}
                  </div>
                  <div className="text-xs text-blue-600 font-medium">Teams Active</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <div className="relative mb-4">
              <Clock className="w-16 h-16 mx-auto opacity-30" />
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-slate-200/20 to-gray-300/20 rounded-full blur-xl" />
            </div>
            <p className="text-lg font-medium">No recent activity</p>
            <p className="text-sm">Recent defects and updates will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}