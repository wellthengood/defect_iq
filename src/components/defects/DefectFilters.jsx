import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function DefectFilters({ 
  teams, 
  statusFilter, 
  setStatusFilter,
  priorityFilter, 
  setPriorityFilter,
  teamFilter, 
  setTeamFilter 
}) {
  return (
    <div className="flex gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-32 bg-white/80">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Select value={teamFilter} onValueChange={setTeamFilter}>
        <SelectTrigger className="w-36 bg-white/80">
          <SelectValue placeholder="Team" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Teams</SelectItem>
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.name}>
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}