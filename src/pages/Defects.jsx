import React, { useState, useEffect } from "react";
import { Defect, Team, Category } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter,
  Bug,
  AlertTriangle,
  Clock,
  CheckCircle,
  FolderOpen,
  Users2,
  TestTube
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import DefectFilters from "../components/defects/DefectFilters";
import DefectTable from "../components/defects/DefectTable";
import DefectDetails from "../components/defects/DefectDetails";
import CreateDefectDialog from "../components/defects/CreateDefectDialog";

export default function DefectsPage() {
  const [defects, setDefects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [validationFilter, setValidationFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [defectsData, teamsData, categoriesData] = await Promise.all([
        Defect.list('-created_date'),
        Team.list(),
        Category.list()
      ]);
      setDefects(defectsData);
      setTeams(teamsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  const handleDefectCreate = async (defectData) => {
    try {
      await Defect.create(defectData);
      await loadData();
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Error creating defect:', error);
    }
  };

  const handleDefectUpdate = async (id, updates) => {
    try {
      await Defect.update(id, updates);
      await loadData();
    } catch (error) {
      console.error('Error updating defect:', error);
    }
  };

  const getFilteredDefects = () => {
    return defects.filter(defect => {
      const matchesSearch = (defect.summary || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (defect.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (defect.issue_key || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || defect.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || defect.priority === priorityFilter;
      const matchesTeam = teamFilter === "all" || defect.assigned_team === teamFilter;
      const matchesProject = projectFilter === "all" || defect.project_name === projectFilter;
      const matchesSeverity = severityFilter === "all" || defect.severity === severityFilter;
      const matchesValidation = validationFilter === "all" || defect.validation === validationFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesTeam && matchesProject && matchesSeverity && matchesValidation;
    });
  };

  const getStatusCounts = () => {
    const counts = {
      all: defects.length,
      Open: defects.filter(d => d.status === 'Open').length,
      "In Progress": defects.filter(d => d.status === 'In Progress').length,
      Resolved: defects.filter(d => d.status === 'Resolved').length,
      Closed: defects.filter(d => d.status === 'Closed').length,
      Reopened: defects.filter(d => d.status === 'Reopened').length
    };
    return counts;
  };

  const getUniqueProjects = () => {
    return [...new Set(defects.map(d => d.project_name).filter(Boolean))];
  };

  const statusCounts = getStatusCounts();
  const filteredDefects = getFilteredDefects();
  const uniqueProjects = getUniqueProjects();

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-pink-50/30 to-rose-50/20 min-h-screen">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#e20074] to-pink-600 bg-clip-text text-transparent">
              Defect Management
            </h1>
            <p className="text-slate-600 mt-1">Track, analyze, and resolve defects with AI intelligence</p>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/40 p-6 mb-6 shadow-xl shadow-[#e20074]/10">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#e20074] w-5 h-5" />
                <Input
                  placeholder="Search by issue key, summary, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 bg-white/80 border-pink-200 focus:border-[#e20074] focus:ring-[#e20074]/20 rounded-2xl h-12 text-lg"
                />
              </div>
            </div>
            
            {/* Filter Row 1 */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-32 bg-white/80">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-32 bg-white/80">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="Blocker">Blocker</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="Major">Major</SelectItem>
                  <SelectItem value="Minor">Minor</SelectItem>
                </SelectContent>
              </Select>

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

              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="w-40 bg-white/80">
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {uniqueProjects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={validationFilter} onValueChange={setValidationFilter}>
                <SelectTrigger className="w-32 bg-white/80">
                  <SelectValue placeholder="Validation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pass">Pass</SelectItem>
                  <SelectItem value="Fail">Fail</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Status Tabs with Icons */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mb-6">
          <TabsList className="bg-white/80 border border-white/40 backdrop-blur-xl rounded-2xl p-2 shadow-lg">
            <TabsTrigger value="all" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#e20074] data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300">
              <Bug className="w-4 h-4" />
              All ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger value="Open" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#e20074] data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300">
              <FolderOpen className="w-4 h-4" />
              Open ({statusCounts.Open})
            </TabsTrigger>
            <TabsTrigger value="In Progress" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#e20074] data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300">
              <Clock className="w-4 h-4" />
              In Progress ({statusCounts["In Progress"]})
            </TabsTrigger>
            <TabsTrigger value="Resolved" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#e20074] data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300">
              <TestTube className="w-4 h-4" />
              Resolved ({statusCounts.Resolved})
            </TabsTrigger>
            <TabsTrigger value="Closed" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#e20074] data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300">
              <CheckCircle className="w-4 h-4" />
              Closed ({statusCounts.Closed})
            </TabsTrigger>
            <TabsTrigger value="Reopened" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#e20074] data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300">
              <AlertTriangle className="w-4 h-4" />
              Reopened ({statusCounts.Reopened})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Enhanced Defects Table */}
        <DefectTable
          defects={filteredDefects}
          isLoading={isLoading}
          onDefectSelect={setSelectedDefect}
          onDefectUpdate={handleDefectUpdate}
        />

        {/* Enhanced Defect Details Panel */}
        {selectedDefect && (
          <DefectDetails
            defect={selectedDefect}
            onClose={() => setSelectedDefect(null)}
            onUpdate={handleDefectUpdate}
          />
        )}

        {/* Create Defect Dialog */}
        <CreateDefectDialog
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleDefectCreate}
          teams={teams}
          categories={categories}
        />
      </div>
    </div>
  );
}