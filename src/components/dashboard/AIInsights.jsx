
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, TrendingUp, AlertTriangle, CheckCircle, Brain, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AIInsights({ insights, isLoading, onRefresh }) {
  return (
    <Card className="mb-8 border-white/40 bg-gradient-to-br from-pink-50/90 via-rose-50/80 to-white/70 backdrop-blur-xl shadow-2xl shadow-[#e20074]/10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#e20074]/5 via-pink-500/5 to-rose-500/5 rounded-xl" />
      <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-[#e20074]/10 to-pink-500/10 rounded-full blur-2xl" />
      
      <CardHeader className="pb-4 relative">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-4 text-2xl">
            <div className="relative p-4 bg-gradient-to-br from-[#e20074] to-pink-600 rounded-3xl shadow-2xl shadow-[#e20074]/30">
              <Brain className="w-7 h-7 text-white" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <div className="absolute inset-0 bg-[#e20074]/30 rounded-3xl animate-ping" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-[#e20074] to-pink-600 bg-clip-text text-transparent">
                AI Executive Summary
              </span>
              <div className="text-sm font-normal text-slate-600 mt-1 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-[#e20074]" />
                Intelligent insights powered by advanced AI
              </div>
            </div>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="border-pink-200 hover:bg-pink-50 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3"
          >
            <RefreshCw className={`w-4 h-4 mr-2 text-[#e20074] ${isLoading ? 'animate-spin' : ''}`} />
            <span className="text-[#e20074] font-semibold">Refresh AI</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 relative">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : insights ? (
          <>
            {/* Executive Summary */}
            {insights.executive_summary && (
              <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-xl">
                <p className="text-slate-700 leading-relaxed text-base">
                  {insights.executive_summary}
                </p>
              </div>
            )}

            {/* Key Sections */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Trends */}
              {insights.key_trends && insights.key_trends.length > 0 && (
                <div className="space-y-4 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <h4 className="flex items-center gap-3 font-bold text-slate-800 text-lg">
                    <div className="p-2 bg-gradient-to-br from-[#e20074] to-pink-600 rounded-xl shadow-lg">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    Key Trends
                  </h4>
                  <ul className="space-y-3">
                    {insights.key_trends.map((trend, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-slate-600 p-3 bg-pink-50/50 rounded-xl">
                        <div className="w-2 h-2 bg-gradient-to-r from-[#e20074] to-pink-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="font-medium">{trend}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Risk Areas */}
              {insights.risk_areas && insights.risk_areas.length > 0 && (
                <div className="space-y-4 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <h4 className="flex items-center gap-3 font-bold text-slate-800 text-lg">
                    <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    Risk Areas
                  </h4>
                  <ul className="space-y-3">
                    {insights.risk_areas.map((risk, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-slate-600 p-3 bg-amber-50/50 rounded-xl">
                        <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="font-medium">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {insights.recommendations && insights.recommendations.length > 0 && (
                <div className="space-y-4 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <h4 className="flex items-center gap-3 font-bold text-slate-800 text-lg">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    AI Recommendations
                  </h4>
                  <ul className="space-y-3">
                    {insights.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-slate-600 p-3 bg-emerald-50/50 rounded-xl">
                        <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="font-medium">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <div className="relative mb-4">
              <Brain className="w-16 h-16 mx-auto opacity-30" />
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-[#e20074]/20 to-pink-500/20 rounded-full blur-xl" />
            </div>
            <p className="text-lg font-medium">AI insights ready to generate</p>
            <p className="text-sm">Click refresh to get intelligent analysis</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
