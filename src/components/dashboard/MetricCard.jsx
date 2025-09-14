
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

const colorSchemes = {
  slate: {
    bg: "bg-slate-50/80",
    iconBg: "bg-gradient-to-br from-slate-100 to-slate-200",
    iconColor: "text-slate-600",
    accent: "text-slate-700",
    glow: "shadow-slate-500/10"
  },
  magenta: {
    bg: "bg-gradient-to-br from-pink-50/80 to-rose-50/60",
    iconBg: "bg-gradient-to-br from-[#e20074] to-pink-600",
    iconColor: "text-white",
    accent: "text-[#e20074]",
    glow: "shadow-[#e20074]/20"
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-50/80 to-indigo-50/60",
    iconBg: "bg-gradient-to-br from-purple-500 to-indigo-600",
    iconColor: "text-white",
    accent: "text-purple-700",
    glow: "shadow-purple-500/20"
  },
  emerald: {
    bg: "bg-gradient-to-br from-emerald-50/80 to-teal-50/60",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
    iconColor: "text-white",
    accent: "text-emerald-700",
    glow: "shadow-emerald-500/20"
  },
  amber: {
    bg: "bg-gradient-to-br from-amber-50/80 to-orange-50/60",
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
    iconColor: "text-white",
    accent: "text-amber-700",
    glow: "shadow-amber-500/20"
  },
  red: {
    bg: "bg-gradient-to-br from-red-50/80 to-rose-50/60",
    iconBg: "bg-gradient-to-br from-red-500 to-rose-600",
    iconColor: "text-white",
    accent: "text-red-700",
    glow: "shadow-red-500/20"
  },
  pink: {
    bg: "bg-gradient-to-br from-pink-50/80 to-rose-50/60",
    iconBg: "bg-gradient-to-br from-pink-500 to-rose-600",
    iconColor: "text-white",
    accent: "text-pink-700",
    glow: "shadow-pink-500/20"
  }
};

export default function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = "slate",
  description 
}) {
  const scheme = colorSchemes[color];

  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case "up":
        return <ArrowUp className="w-3 h-3 text-emerald-500" />;
      case "down":
        return <ArrowDown className="w-3 h-3 text-red-500" />;
      default:
        return <Minus className="w-3 h-3 text-slate-400" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return "text-slate-500";
    
    switch (trend.direction) {
      case "up":
        return "text-emerald-600";
      case "down":
        return "text-red-600";
      default:
        return "text-slate-500";
    }
  };

  return (
    <Card className={`relative overflow-hidden border-white/40 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 ${scheme.glow} ${scheme.bg}`}>
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 bg-gradient-to-br from-white/20 to-white/5 rounded-full" />
      <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-[#e20074]/10 to-pink-500/10 rounded-full blur-xl" />
      
      <CardContent className="p-6 relative">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-2xl shadow-lg ${scheme.iconBg}`}>
            <Icon className={`w-5 h-5 ${scheme.iconColor}`} />
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-sm bg-white/50 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
              {getTrendIcon()}
              <span className={`font-semibold ${getTrendColor()}`}>
                {trend.value || "—"}
              </span>
            </div>
          )}
        </div>
        <div>
          <div className="text-3xl font-bold text-slate-900 mb-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {value?.toLocaleString() ?? 0}
          </div>
          <div className="text-sm font-semibold text-slate-700 mb-1">
            {title}
          </div>
          {description && (
            <div className="text-xs text-slate-500 font-medium">
              {description}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
