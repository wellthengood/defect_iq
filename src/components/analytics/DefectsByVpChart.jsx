import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { UserCheck, Sparkles } from "lucide-react";

export default function DefectsByVpChart({ defects, teams }) {
  const getVpData = () => {
    if (!teams || !defects) return [];

    const teamToVpMap = teams.reduce((acc, team) => {
      if (team.name && team.vp) {
        acc[team.name] = team.vp;
      }
      return acc;
    }, {});

    const vpDefectCounts = defects.reduce((acc, defect) => {
      const vp = teamToVpMap[defect.team_assigned];
      if (vp) {
        acc[vp] = (acc[vp] || 0) + 1;
      }
      return acc;
    }, {});
    
    return Object.entries(vpDefectCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const vpData = getVpData();

  return (
    <Card className="border-white/40 bg-white/80 backdrop-blur-xl shadow-2xl shadow-sky-500/10">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-cyan-500/5 rounded-xl" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-xl shadow-lg">
            <UserCheck className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
            Defects by VP
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={vpData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
            <XAxis type="number" stroke="#64748b" fontSize={12} fontWeight={500} />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="#64748b" 
              fontSize={12} 
              fontWeight={500} 
              width={80} 
              tick={{ textAnchor: 'end' }} 
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(14, 165, 233, 0.2)',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(14, 165, 233, 0.1)'
              }}
            />
            <Bar dataKey="value" name="Defects" fill="url(#vpGradient)" radius={[0, 6, 6, 0]} barSize={20} />
            <defs>
              <linearGradient id="vpGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.7}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}