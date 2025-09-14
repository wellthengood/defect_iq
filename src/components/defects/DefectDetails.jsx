import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  X, Calendar, Users, AlertTriangle, Tag, FileText, 
  Target, Bug, User, MessageSquare, TestTube, 
  CheckCircle, XCircle, Clock
} from "lucide-react";
import { format } from "date-fns";

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

const issueTypeIcons = {
  Bug: Bug,
  Story: FileText,
  Task: Target,
  Epic: AlertTriangle
};

const validationColors = {
  Pass: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Fail: "bg-red-100 text-red-800 border-red-200",
  Blocked: "bg-amber-100 text-amber-800 border-amber-200"
};

export default function DefectDetails({ defect, onClose, onUpdate }) {
  const IssueIcon = issueTypeIcons[defect.issue_type] || Bug;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-auto bg-white/95 backdrop-blur-xl border-pink-200 shadow-2xl shadow-[#e20074]/20">
        <CardHeader className="flex flex-row items-start justify-between border-b border-pink-200/50 bg-gradient-to-r from-pink-50/50 to-rose-50/30">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <IssueIcon className="w-6 h-6 text-[#e20074]" />
              <span className="text-lg font-mono text-[#e20074] font-bold">
                {defect.issue_key}
              </span>
            </div>
            <CardTitle className="text-xl mb-3">{defect.summary}</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={priorityColors[defect.priority]}>
                {defect.priority} Priority
              </Badge>
              <Badge variant="outline" className={statusColors[defect.status]}>
                {defect.status}
              </Badge>
              <Badge variant="outline" className={severityColors[defect.severity]}>
                {defect.severity}
              </Badge>
              {defect.validation && (
                <Badge variant="outline" className={validationColors[defect.validation]}>
                  {defect.validation === 'Pass' ? <CheckCircle className="w-3 h-3 mr-1" /> : 
                   defect.validation === 'Fail' ? <XCircle className="w-3 h-3 mr-1" /> :
                   <Clock className="w-3 h-3 mr-1" />}
                  {defect.validation}
                </Badge>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-pink-50">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6 p-8">
          {/* Project & Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-2 block flex items-center gap-1">
                <FileText className="w-4 h-4" />
                Project
              </label>
              <div className="space-y-1">
                <p className="font-medium text-slate-900">{defect.project_name}</p>
                <p className="text-sm text-slate-600">{defect.project_key} • {defect.project_type}</p>
                <p className="text-sm text-slate-600">Lead: {defect.project_lead}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-2 block flex items-center gap-1">
                <Users className="w-4 h-4" />
                Application & Team
              </label>
              <div className="space-y-1">
                <p className="font-medium text-slate-900">{defect.affected_application}</p>
                <p className="text-sm text-slate-600">Assigned: {defect.assigned_team}</p>
                {defect.requesting_team && (
                  <p className="text-sm text-slate-600">Requested by: {defect.requesting_team}</p>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-2 block flex items-center gap-1">
                <User className="w-4 h-4" />
                People
              </label>
              <div className="space-y-1">
                <p className="text-sm text-slate-600">Assignee: {defect.assignee || "Unassigned"}</p>
                <p className="text-sm text-slate-600">Reporter: {defect.reporter}</p>
                <p className="text-sm text-slate-600">Creator: {defect.creator}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {defect.description && (
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-2 block">Description</label>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-900 whitespace-pre-wrap">{defect.description}</p>
              </div>
            </div>
          )}

          {/* Comment */}
          {defect.comment && (
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-2 block flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                Latest Comment
              </label>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-slate-900 whitespace-pre-wrap">{defect.comment}</p>
              </div>
            </div>
          )}

          {/* Root Cause Analysis */}
          {defect.root_cause_analysis && (
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-2 block">Root Cause Analysis</label>
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-slate-900 whitespace-pre-wrap">{defect.root_cause_analysis}</p>
              </div>
            </div>
          )}

          {/* Testing Information */}
          {(defect.test_category || defect.test_levels || defect.test_type) && (
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-2 block flex items-center gap-1">
                <TestTube className="w-4 h-4" />
                Testing Details
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {defect.test_category && (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-sm font-medium text-purple-900">Category</div>
                    <div className="text-sm text-purple-700">{defect.test_category}</div>
                  </div>
                )}
                {defect.test_levels && (
                  <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div className="text-sm font-medium text-indigo-900">Level</div>
                    <div className="text-sm text-indigo-700">{defect.test_levels}</div>
                  </div>
                )}
                {defect.test_type && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm font-medium text-green-900">Type</div>
                    <div className="text-sm text-green-700">{defect.test_type}</div>
                  </div>
                )}
              </div>
              {defect.test_attachment && (
                <div className="mt-2 text-sm text-slate-600">
                  <strong>Attachment:</strong> {defect.test_attachment}
                </div>
              )}
            </div>
          )}

          {/* Additional Technical Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(defect.automation_rca_type || defect.return_reason_subtype) && (
              <div>
                <label className="text-sm font-semibold text-slate-600 mb-2 block">Technical Details</label>
                <div className="space-y-2">
                  {defect.automation_rca_type && (
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="text-sm font-medium text-orange-900">RCA Type</div>
                      <div className="text-sm text-orange-700">{defect.automation_rca_type}</div>
                    </div>
                  )}
                  {defect.return_reason_subtype && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-sm font-medium text-red-900">Return Reason</div>
                      <div className="text-sm text-red-700">{defect.return_reason_subtype}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dates */}
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-2 block flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Timeline
              </label>
              <div className="space-y-2">
                <div className="text-sm">
                  <strong>Created:</strong> {format(new Date(defect.created_date), "MMM d, yyyy 'at' HH:mm")}
                </div>
                <div className="text-sm">
                  <strong>Updated:</strong> {format(new Date(defect.updated_date), "MMM d, yyyy 'at' HH:mm")}
                </div>
                {defect.last_viewed && (
                  <div className="text-sm">
                    <strong>Last Viewed:</strong> {format(new Date(defect.last_viewed), "MMM d, yyyy 'at' HH:mm")}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Labels */}
          {defect.labels && defect.labels.length > 0 && (
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-2 block flex items-center gap-1">
                <Tag className="w-4 h-4" />
                Labels
              </label>
              <div className="flex flex-wrap gap-2">
                {defect.labels.map((label, index) => (
                  <Badge key={index} variant="secondary" className="bg-pink-100 text-pink-800 border-pink-300">
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Parent Issue */}
          {defect.parent_key && (
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-2 block">Parent Issue</label>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="font-medium text-gray-900">{defect.parent_key}</div>
                {defect.parent_summary && (
                  <div className="text-sm text-gray-600 mt-1">{defect.parent_summary}</div>
                )}
              </div>
            </div>
          )}

          {/* Resolution */}
          {defect.resolution && (
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-2 block">Resolution</label>
              <Badge variant="outline" className="text-sm">
                {defect.resolution}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}