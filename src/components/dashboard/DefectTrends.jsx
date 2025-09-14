
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, Sparkles } from "lucide-react";
import { format, subDays, eachDayOfInterval } from "date-fns";

export default function DefectTrends({ defects }) {
  const getLast7DaysData = () => {
    const end = new Date();
    const start = subDays(end, 6);
    const dates = eachDayOfInterval({ start, end });
    
    return dates.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayDefects = defects.filter(d => 
        format(new Date(d.created_date), 'yyyy-MM-dd') === dateStr
      );
      
      return {
        date: format(date, 'MMM dd'),
        created: dayDefects.length,
        closed: dayDefects.filter(d => d.status === 'closed').length,
        critical: dayDefects.filter(d => d.priority === 'critical').length
      };
    });
  };

  const data = getLast7DaysData();

  return (
    <Card className="border-white/40 bg-white/80 backdrop-blur-xl shadow-2xl shadow-[#e20074]/10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#e20074]/5 via-pink-500/5 to-rose-500/5 rounded-xl" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-gradient-to-br from-[#e20074] to-pink-600 rounded-xl shadow-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-[#e20074] to-pink-600 bg-clip-text text-transparent">
              Defect Trends
            </span>
            <div className="text-sm font-normal text-slate-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#e20074]" />
              Last 7 Days Analytics
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              fontSize={12}
              fontWeight={500}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              fontWeight={500}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(226, 0, 116, 0.2)',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(226, 0, 116, 0.1)',
                backdropFilter: 'blur(16px)',
                fontWeight: '500'
              }}
            />
            <Bar 
              dataKey="created" 
              fill="url(#createdGradient)"
              name="Created"
              radius={[6, 6, 0, 0]}
            />
            <Bar 
              dataKey="closed" 
              fill="url(#closedGradient)"
              name="Closed"
              radius={[6, 6, 0, 0]}
            />
            <Bar 
              dataKey="critical" 
              fill="url(#criticalGradient)"
              name="Critical"
              radius={[6, 6, 0, 0]}
            />
            <defs>
              <linearGradient id="createdGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e20074" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0.7}/>
              </linearGradient>
              <linearGradient id="closedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#059669" stopOpacity={0.7}/>
              </linearGradient>
              <linearGradient id="criticalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.7}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
