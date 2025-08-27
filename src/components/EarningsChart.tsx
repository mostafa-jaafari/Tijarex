"use client";
import React, { useState, useEffect, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer,
  Tooltip, CartesianGrid,
} from 'recharts';
import { BarChart3, TrendingUp, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { format, subDays, subMonths } from 'date-fns';

// ============================================================================
// Types & Configuration
// ============================================================================

type PeriodType = '7D' | '1M' | '3M' | '6M' | '12M';

type ChartDataItem = {
  label: string;
  firstHalf: number;
  topGross: number;
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

const CHART_LINES = {
  firstHalf: { name: "Q1-Q2", color: "#3B82F6" },
  topGross: { name: "Q3-Q4", color: "#10B981" },
};

// ============================================================================
// Helper Function: Dynamic Data Generation
// ============================================================================

const generateChartData = (period: PeriodType): ChartDataItem[] => {
  const data: ChartDataItem[] = [];
  const now = new Date();
  let startDate: Date;
  let pointCount: number;
  let labelFormat: string;

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
      pointCount = 90; // Approx 3 months of daily data
      labelFormat = 'MMM d';
      break;
    case '6M':
      startDate = subMonths(now, 5);
      pointCount = 6; // Monthly data
      labelFormat = 'MMM';
      break;
    case '12M':
    default:
      startDate = subMonths(now, 11);
      pointCount = 12; // Monthly data
      labelFormat = 'MMM';
  }

  for (let i = 0; i < pointCount; i++) {
    const currentDate = new Date(startDate);
    if (period === '12M' || period === '6M') {
      currentDate.setMonth(startDate.getMonth() + i);
    } else {
      currentDate.setDate(startDate.getDate() + i);
    }
    
    data.push({
      label: format(currentDate, labelFormat),
      firstHalf: Math.floor(Math.random() * (120 - 80 + 1)) + 80,
      topGross: Math.floor(Math.random() * (180 - 100 + 1)) + 100,
    });
  }

  // To make the chart look more dynamic, we only show ticks for some labels on larger datasets
  return data.map((item, index) => {
    if (pointCount > 12 && index % Math.floor(pointCount / 6) !== 0) {
      return { ...item, label: '' };
    }
    return item;
  });
};

// ============================================================================
// Main Chart Component
// ============================================================================

const EarningsChart: React.FC = () => {
  const t = useTranslations();
  const [period, setPeriod] = useState<PeriodType>('12M');
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleLines, setVisibleLines] = useState({ firstHalf: true, topGross: true });

  useEffect(() => {
    setLoading(true);
    // Simulate fetching data
    const timer = setTimeout(() => {
      setChartData(generateChartData(period));
      setLoading(false);
    }, 700); // Simulate network delay

    return () => clearTimeout(timer);
  }, [period]);

  const toggleLineVisibility = (dataKey: 'firstHalf' | 'topGross') => {
    setVisibleLines(prev => ({ ...prev, [dataKey]: !prev[dataKey] }));
  };

  const totals = useMemo(() => {
    return chartData.reduce(
      (acc, item) => {
        acc.firstHalf += item.firstHalf;
        acc.topGross += item.topGross;
        return acc;
      },
      { firstHalf: 0, topGross: 0 }
    );
  }, [chartData]);
  
  if (loading) {
    return <ChartSkeleton />;
  }

  return (
    <div className="bg-white w-full border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t('earnings.title')}</h3>
            <p className="text-sm text-gray-500">{t('earnings.subtitle')}</p>
          </div>
        </div>
        
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          {(['7D', '1M', '3M', '6M', '12M'] as PeriodType[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                period === p ? 'bg-white text-gray-900' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {t(`earnings.periods.${p}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-4 sm:p-6">
        {/* Interactive Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 sm:gap-6">
            {Object.entries(CHART_LINES).map(([key, { name, color }]) => (
              <div
                key={key}
                onClick={() => toggleLineVisibility(key as 'firstHalf' | 'topGross')}
                className={`flex items-center space-x-2 cursor-pointer transition-opacity ${
                  !visibleLines[key as 'firstHalf' | 'topGross'] && 'opacity-40'
                }`}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                <span className="text-sm text-gray-600">{name}</span>
                <span className="text-sm font-medium text-gray-900">
                  ${(totals[key as 'firstHalf' | 'topGross'] / 1000).toFixed(1)}K
                </span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-green-600 font-medium">
            <TrendingUp size={16} />
            <span>+12.4%</span>
            <span className="text-gray-500 font-normal hidden sm:inline">{t('earnings.vs_last_year')}</span>
          </div>
        </div>
        
        {/* Chart Container */}
        <div className="h-80">
          {chartData.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorFirstHalf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_LINES.firstHalf.color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={CHART_LINES.firstHalf.color} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTopGross" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_LINES.topGross.color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={CHART_LINES.topGross.color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(value: number) => `$${value}K`} />
                <Tooltip content={<CustomTooltip />} />
                
                <Area 
                  type="monotone" 
                  dataKey="firstHalf" 
                  stroke={CHART_LINES.firstHalf.color}
                  fillOpacity={visibleLines.firstHalf ? 1 : 0}
                  strokeOpacity={visibleLines.firstHalf ? 1 : 0}
                  fill="url(#colorFirstHalf)" 
                  strokeWidth={2}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  dot={false}
                />
                <Area 
                  type="monotone" 
                  dataKey="topGross" 
                  stroke={CHART_LINES.topGross.color}
                  fillOpacity={visibleLines.topGross ? 1 : 0}
                  strokeOpacity={visibleLines.topGross ? 1 : 0}
                  fill="url(#colorTopGross)" 
                  strokeWidth={2}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
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
// Helper Components
// ============================================================================

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white border border-gray-700 rounded-lg p-3 min-w-[140px]">
        <p className="text-sm font-bold mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-xs text-gray-300">
                {CHART_LINES[entry.dataKey as keyof typeof CHART_LINES]?.name}
              </span>
            </div>
            <span className="text-sm font-medium ml-3">${entry.value}K</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ChartSkeleton: React.FC = () => (
  <div className="bg-white w-full border border-gray-200 rounded-xl overflow-hidden animate-pulse">
    <div className="flex items-center justify-between p-6 border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="p-2 h-9 w-9 bg-gray-200 rounded-lg" />
        <div>
          <div className="h-5 w-32 bg-gray-200 rounded-md mb-1.5" />
          <div className="h-4 w-40 bg-gray-200 rounded-md" />
        </div>
      </div>
      <div className="h-8 w-64 bg-gray-200 rounded-lg" />
    </div>
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-6">
          <div className="h-5 w-32 bg-gray-200 rounded-md" />
          <div className="h-5 w-32 bg-gray-200 rounded-md" />
        </div>
        <div className="h-5 w-24 bg-gray-200 rounded-md" />
      </div>
      <div className="h-80 bg-gray-100 rounded-lg" />
    </div>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
      <AlertCircle className="w-12 h-12 mb-4 text-gray-400" />
      <h4 className="font-semibold text-gray-700">No Data Available</h4>
      <p className="text-sm">There is no earnings data for the selected period.</p>
  </div>
);

export default EarningsChart;