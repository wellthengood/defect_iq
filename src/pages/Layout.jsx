

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  BarChart3, 
  Bug, 
  Users, 
  Settings, 
  Home,
  Bell,
  User,
  Sparkles,
  Brain
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import DateRangeFilter from "../components/dashboard/DateRangeFilter";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Home,
  },
  {
    title: "Defects",
    url: createPageUrl("Defects"),
    icon: Bug,
  },
  {
    title: "Analytics",
    url: createPageUrl("Analytics"),
    icon: BarChart3,
  },
  {
    title: "Teams",
    url: createPageUrl("Teams"),
    icon: Users,
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [dateRange, setDateRange] = useState(null);

  // Clone children and pass dateRange as props
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { dateRange, setDateRange });
    }
    return child;
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Clean Modern Sidebar */}
        <Sidebar className="border-r border-gray-200 bg-white">
          {/* Header */}
          <SidebarHeader className="border-b border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c47829ba62e067545d2cf0/ad1282a12_logo.png" 
                alt="DefectIQ Logo" 
                className="w-10 h-10"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-900">DefectIQ</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Brain className="w-3 h-3" />
                  AI-Powered
                </p>
              </div>
            </div>
          </SidebarHeader>
          
          {/* Navigation */}
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`w-full justify-start px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          location.pathname === item.url 
                            ? 'bg-[#e20074] text-white shadow-sm' 
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* Footer */}
          <SidebarFooter className="border-t border-gray-100 p-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-[#e20074] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Quality Team</p>
                <p className="text-xs text-gray-500 truncate">Admin</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          {/* Clean Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    EX2 Quality Engineer
                  </h1>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                    <Sparkles className="w-4 h-4 text-[#e20074]" />
                    AI-powered defect intelligence
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Global Date Range Filter */}
                <DateRangeFilter 
                  dateRange={dateRange} 
                  onDateRangeChange={setDateRange}
                />
                
                <Button variant="ghost" size="icon" className="w-10 h-10 hover:bg-gray-100 rounded-lg">
                  <Bell className="w-5 h-5 text-gray-600" />
                </Button>
                <Button variant="ghost" size="icon" className="w-10 h-10 hover:bg-gray-100 rounded-lg">
                  <Settings className="w-5 h-5 text-gray-600" />
                </Button>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <div className="flex-1 overflow-auto bg-gray-50">
            {childrenWithProps}
          </div>

          {/* Clean Footer */}
          <footer className="bg-white border-t border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <span>© 2024 DefectIQ Portal</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Brain className="w-4 h-4 text-[#e20074]" />
                  Powered by AI
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Live • {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </SidebarProvider>
  );
}

