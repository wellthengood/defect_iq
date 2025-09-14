import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";

const presetRanges = [
  {
    label: "Today",
    getValue: () => ({
      from: new Date(),
      to: new Date()
    })
  },
  {
    label: "Last 7 days",
    getValue: () => ({
      from: subDays(new Date(), 6),
      to: new Date()
    })
  },
  {
    label: "Last 30 days",
    getValue: () => ({
      from: subDays(new Date(), 29),
      to: new Date()
    })
  },
  {
    label: "This month",
    getValue: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date())
    })
  },
  {
    label: "Last month",
    getValue: () => {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth)
      };
    }
  },
  {
    label: "This week",
    getValue: () => ({
      from: startOfWeek(new Date()),
      to: endOfWeek(new Date())
    })
  }
];

export default function DateRangeFilter({ dateRange, onDateRangeChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDateRange = (range) => {
    if (!range?.from) return "Select date range";
    if (!range.to) return format(range.from, "MMM d, yyyy");
    if (range.from.toDateString() === range.to.toDateString()) {
      return format(range.from, "MMM d, yyyy");
    }
    return `${format(range.from, "MMM d")} - ${format(range.to, "MMM d, yyyy")}`;
  };

  const handlePresetClick = (preset) => {
    const range = preset.getValue();
    onDateRangeChange(range);
    setIsOpen(false);
  };

  const handleClear = () => {
    onDateRangeChange(null);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-white hover:bg-gray-50 border-gray-300 px-3 py-2 rounded-lg"
          >
            <CalendarIcon className="w-4 h-4 mr-2 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {formatDateRange(dateRange)}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 bg-white border border-gray-200 shadow-lg rounded-lg" 
          align="start"
        >
          <div className="flex">
            {/* Preset ranges */}
            <div className="p-4 border-r border-gray-200 bg-gray-50">
              <h4 className="font-medium text-sm text-gray-700 mb-3">
                Quick Select
              </h4>
              <div className="space-y-1">
                {presetRanges.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    className="w-full justify-start text-left hover:bg-gray-100 rounded-md px-3 py-2"
                    onClick={() => handlePresetClick(preset)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Calendar */}
            <div className="p-4">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={onDateRangeChange}
                numberOfMonths={2}
                className="rounded-lg"
              />
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="hover:bg-red-50 hover:text-red-600 rounded-md"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="bg-[#e20074] hover:bg-[#c8005d] rounded-md"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {dateRange?.from && (
        <Badge 
          variant="outline" 
          className="bg-blue-50 text-blue-700 border-blue-200 px-2 py-1 rounded-md text-xs"
        >
          {dateRange.from.toDateString() === dateRange.to?.toDateString() 
            ? "1 day selected" 
            : `${Math.ceil((dateRange.to - dateRange.from) / (1000 * 60 * 60 * 24)) + 1} days selected`
          }
        </Badge>
      )}
    </div>
  );
}