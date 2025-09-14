import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ExternalLink, 
  AlertTriangle, 
  Clock, 
  Users,
  MoreHorizontal,
  Bug,
  FileText,
  Target,
  FolderOpen,
  TestTube,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const severityColors = {
  Blocker: "bg-red-500 text-white border-red-600",
  Critical: "bg-red-100 text-red-800 border-red-200",
  Major: "bg-orange-100 text-orange-800 border-orange-200",
  Minor: "bg-blue-100 text-blue-800 border-blue-200"
};

const validationColors = {
  Pass: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Fail: "bg-red-100 text-red-800 border-red-200",
  Blocked: "bg-amber-100 text-amber-800 border-amber-200"
};

const issueTypeIcons = {
  Bug: Bug,
  Story: FileText,
  Task: Target,
  Epic: AlertTriangle
};

export default function DefectTable({ defects, isLoading, onDefectSelect, onDefectUpdate }) {
  return (
    <Card className="border-white/40 bg-white/80 backdrop-blur-xl shadow-2xl shadow-[#e20074]/10">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-pink-50/80 to-rose-50/60 border-b border-pink-200">
                <TableHead className="font-semibold text-slate-700">Issue</TableHead>
                <TableHead className="font-semibold text-slate-700">Type</TableHead>
                <TableHead className="font-semibold text-slate-700">Priority</TableHead>
                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                <TableHead className="font-semibold text-slate-700">Severity</TableHead>
                <TableHead className="font-semibold text-slate-700">Application</TableHead>
                <TableHead className="font-semibold text-slate-700">Project</TableHead>
                <TableHead className="font-semibold text-slate-700">Team</TableHead>
                <TableHead className="font-semibold text-slate-700">Assignee</TableHead>
                <TableHead className="font-semibold text-slate-700">Validation</TableHead>
                <TableHead className="font-semibold text-slate-700">Created</TableHead>
                <TableHead className="font-semibold text-slate-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(10).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : defects.length > 0 ? (
                defects.map((defect) => {
                  const IssueIcon = issueTypeIcons[defect.issue_type] || Bug;
                  return (
                    <TableRow 
                      key={defect.id} 
                      className="cursor-pointer hover:bg-pink-50/30 transition-colors border-b border-pink-100/50"
                      onClick={() => onDefectSelect(defect)}
                    >
                      <TableCell className="max-w-md">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-mono text-[#e20074] font-semibold">
                              {defect.issue_key}
                            </span>
                          </div>
                          <div className="font-medium text-slate-900 mb-1">
                            {defect.summary}
                          </div>
                          {defect.description && (
                            <div className="text-sm text-slate-600 truncate max-w-xs">
                              {defect.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <IssueIcon className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium">{defect.issue_type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={priorityColors[defect.priority]}>
                          {defect.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[defect.status]}>
                          {defect.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={severityColors[defect.severity]}>
                          {defect.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-slate-700">
                          {defect.affected_application}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FolderOpen className="w-4 h-4 text-slate-400" />
                          <div>
                            <div className="text-sm font-medium text-slate-700">{defect.project_name}</div>
                            <div className="text-xs text-slate-500">{defect.project_key}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium">{defect.assigned_team}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-slate-600">
                          {defect.assignee || "Unassigned"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {defect.validation && (
                          <Badge variant="outline" className={validationColors[defect.validation]}>
                            {defect.validation === 'Pass' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {defect.validation === 'Fail' && <XCircle className="w-3 h-3 mr-1" />}
                            {defect.validation === 'Blocked' && <TestTube className="w-3 h-3 mr-1" />}
                            {defect.validation}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {format(new Date(defect.created_date), "MMM d")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => e.stopPropagation()}
                              className="hover:bg-pink-50 hover:text-[#e20074] transition-colors"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-xl border-pink-200">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              onDefectSelect(defect);
                            }} className="hover:bg-pink-50 hover:text-[#e20074]">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8 text-slate-500">
                    No defects found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}