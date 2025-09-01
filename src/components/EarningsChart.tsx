"use client";
import React, { useState, useEffect, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer,
  Tooltip, CartesianGrid,
} from 'recharts';
import { TrendingUp, BarChart3, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { format, subDays, subMonths } from 'date-fns';
import { useUserInfos } from '@/context/UserInfosContext';

// ============================================================================
// Types & Configuration (Modernized with Purple Theme)
// ============================================================================

type PeriodType = '7D' | '1M' | '3M' | '6M' | '12M';

type ChartDataItem = {
  label: string;
  primary: number;   // Renamed for clarity
  secondary: number; // Renamed for clarity
};

interface TooltipPayload {
  color?: string;
  dataKey?: string;
  value?: number;
  payload?: ChartDataItem;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

// Enhanced color configuration with a purple theme
const CHART_LINES = {
  primary: { name: "Q3-Q4", color: "#7C3AED" }, // purple-600
  secondary: { name: "Q1-Q2", color: "#A78BFA" }, // purple-400
};

// ============================================================================
// Helper Function: Dynamic Data Generation (Updated Keys)
// ============================================================================

const generateChartData = (period: PeriodType): ChartDataItem[] => {
  const data: ChartDataItem[] = [];
  const now = new Date();
  let startDate: Date;
  let pointCount: number;
  let labelFormat: string;

  // ... (switch case logic remains the same)
  switch (period) {
    case '7D':
      startDate = subDays(now, 6);
      pointCount = 7;
      labelFormat = 'MMM d';
      break;
    case '1M':
      startDate = subDays(now, 29);
      pointCount = 30;
      labelFormat = 'MMM d';
      break;
    case '3M':
      startDate = subMonths(now, 2);
      pointCount = 90;
      labelFormat = 'MMM d';
      break;
    case '6M':
      startDate = subMonths(now, 5);
      pointCount = 6;
      labelFormat = 'MMM';
      break;
    case '12M':
    default:
      startDate = subMonths(now, 11);
      pointCount = 12;
      labelFormat = 'MMM';
  }

  for (let i = 0; i < pointCount; i++) {
    const currentDate = new Date(startDate);
    if (['12M', '6M'].includes(period)) {
      currentDate.setMonth(startDate.getMonth() + i);
    } else {
      currentDate.setDate(startDate.getDate() + i);
    }
    
    data.push({
      label: format(currentDate, labelFormat),
      secondary: Math.floor(Math.random() * (120 - 80 + 1)) + 80, // Q1-Q2 data
      primary: Math.floor(Math.random() * (180 - 100 + 1)) + 100,  // Q3-Q4 data (higher values)
    });
  }

  // Optimize label rendering for dense charts
  return data.map((item, index) => {
    if (pointCount > 12 && index % Math.floor(pointCount / 6) !== 0) {
      return { ...item, label: '' };
    }
    return item;
  });
};

// ============================================================================
// Main Chart Component (UI/UX Enhanced)
// ============================================================================

export const EarningsChart = ({ isFinishSetup }: { isFinishSetup: boolean; }) => {
  // const t = useTranslations(); // Assuming 't' is your translation function
  const [period, setPeriod] = useState<PeriodType>('12M');
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleLines, setVisibleLines] = useState({ primary: true, secondary: true });

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setChartData(generateChartData(period));
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [period]);

  const toggleLineVisibility = (dataKey: 'primary' | 'secondary') => {
    setVisibleLines(prev => ({ ...prev, [dataKey]: !prev[dataKey] }));
  };

  const totals = useMemo(() => {
    return chartData.reduce(
      (acc, item) => {
        acc.primary += item.primary;
        acc.secondary += item.secondary;
        return acc;
      },
      { primary: 0, secondary: 0 }
    );
  }, [chartData]);
  
  if (loading) {
    return <ChartSkeleton />;
  }

  return (
    <div 
      className={`${isFinishSetup ? "w-full" : "max-w-[650px]"} p-4 rounded-xl 
        bg-white ring ring-gray-200`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="grid place-items-center w-10 h-10 bg-purple-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">Earnings Overview</h3>
            <p className="text-sm text-gray-500">Revenue comparison by quarters</p>
          </div>
        </div>
        
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          {(['7D', '1M', '3M', '6M', '12M'] as PeriodType[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-300 ${
                period === p 
                  ? 'bg-purple-600 text-white shadow' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-4 sm:p-5">
        {/* Interactive Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4 sm:gap-6">
            {Object.entries(CHART_LINES).map(([key, { name, color }]) => (
              <div
                key={key}
                onClick={() => toggleLineVisibility(key as 'primary' | 'secondary')}
                className={`flex items-center gap-2 cursor-pointer transition-opacity ${
                  !visibleLines[key as 'primary' | 'secondary'] && 'opacity-30'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></div>
                <span className="text-sm text-gray-600">{name}</span>
                <span className="text-sm font-semibold text-gray-900">
                  ${(totals[key as 'primary' | 'secondary'] / 1000).toFixed(1)}K
                </span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
            <TrendingUp size={16} />
            <span>+12.4% vs last year</span>
          </div>
        </div>
        
        {/* Chart Container */}
        <div className="h-80 w-full">
          {chartData.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_LINES.primary.color} stopOpacity={0.7}/>
                    <stop offset="95%" stopColor={CHART_LINES.primary.color} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_LINES.secondary.color} stopOpacity={0.6}/>
                    <stop offset="95%" stopColor={CHART_LINES.secondary.color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(value: number) => `$${value}K`} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#d1d5db', strokeWidth: 1, strokeDasharray: '3 3' }} />
                
                <Area 
                  type="monotone" 
                  dataKey="secondary" 
                  stroke={CHART_LINES.secondary.color}
                  fillOpacity={visibleLines.secondary ? 1 : 0}
                  strokeOpacity={visibleLines.secondary ? 1 : 0}
                  fill="url(#colorSecondary)" 
                  strokeWidth={2.5}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: 'white' }}
                  dot={false}
                />
                <Area 
                  type="monotone" 
                  dataKey="primary" 
                  stroke={CHART_LINES.primary.color}
                  fillOpacity={visibleLines.primary ? 1 : 0}
                  strokeOpacity={visibleLines.primary ? 1 : 0}
                  fill="url(#colorPrimary)" 
                  strokeWidth={2.5}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: 'white', className: 'drop-shadow-md' }}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Helper Components (UI/UX Enhanced)
// ============================================================================

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/70 backdrop-blur-sm shadow-lg rounded-lg p-3 min-w-[150px] border border-gray-200">
        <p className="text-sm font-semibold text-gray-800 mb-2">{label}</p>
        {/* Sort payload to show primary value first */}
        {payload.sort((a,b) => (a.dataKey === 'primary' ? -1 : 1)).map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between my-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-xs text-gray-600">
                {CHART_LINES[entry.dataKey as keyof typeof CHART_LINES]?.name}
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-900 ml-3">${entry.value}K</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ChartSkeleton: React.FC = () => (
    <div className="w-full max-w-[650px] p-4 rounded-xl bg-white ring ring-gray-200 animate-pulse">
    <div className="flex items-center justify-between p-5 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-gray-200 rounded-lg" />
        <div>
          <div className="h-5 w-36 bg-gray-200 rounded-md mb-1.5" />
          <div className="h-4 w-48 bg-gray-200 rounded-md" />
        </div>
      </div>
      <div className="h-8 w-64 bg-gray-200 rounded-lg" />
    </div>
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-6">
          <div className="h-5 w-32 bg-gray-200 rounded-md" />
          <div className="h-5 w-32 bg-gray-200 rounded-md" />
        </div>
        <div className="h-5 w-36 bg-gray-200 rounded-md" />
      </div>
      <div className="h-80 bg-gray-100 rounded-lg" />
    </div>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 bg-gray-50/50 rounded-lg">
      <AlertCircle className="w-10 h-10 mb-3 text-gray-400" />
      <h4 className="font-semibold text-gray-700">No Data Available</h4>
      <p className="text-sm">There is no earnings data for the selected period.</p>
  </div>
);