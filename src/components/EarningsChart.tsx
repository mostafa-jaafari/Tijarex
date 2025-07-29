"use client";
import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer,
  Tooltip, CartesianGrid,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useTranslations } from 'next-intl';

// Define proper types for the chart data
type EarningsDataItem = {
  month: string;
  firstHalf: number;
  topGross: number;
};

// Define period types
type PeriodType = '7D' | '1M' | '3M' | '6M' | '12M';

// Define tooltip payload type
interface TooltipPayload {
  color?: string;
  dataKey?: string;
  value?: number;
  payload?: EarningsDataItem;
}

// Custom tooltip props interface
interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const earningsData: EarningsDataItem[] = [
  { month: 'Jan', firstHalf: 80, topGross: 90 },
  { month: 'Feb', firstHalf: 95, topGross: 110 },
  { month: 'Mar', firstHalf: 120, topGross: 140 },
  { month: 'Apr', firstHalf: 110, topGross: 130 },
  { month: 'May', firstHalf: 140, topGross: 160 },
  { month: 'Jun', firstHalf: 180, topGross: 200 },
  { month: 'Jul', firstHalf: 160, topGross: 180 },
  { month: 'Aug', firstHalf: 120, topGross: 140 },
  { month: 'Sep', firstHalf: 100, topGross: 120 },
  { month: 'Oct', firstHalf: 90, topGross: 110 },
  { month: 'Nov', firstHalf: 85, topGross: 105 },
  { month: 'Dec', firstHalf: 75, topGross: 95 }
];

const EarningsChart: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('12M');
  const periods: PeriodType[] = ['7D', '1M', '3M', '6M', '12M'];

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[120px]">
          <p className="text-sm font-medium text-gray-900 mb-2">{label} 2024</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: entry.color || '#000' }}
                />
                <span className="text-xs text-gray-600">
                  {entry.dataKey === 'firstHalf' ? 'Q1-Q2' : 'Q3-Q4'}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 ml-3">
                ${entry.value}K
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const t = useTranslations();

  return (
    <div className="bg-white shadow-md hover:shadow-lg rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t('earnings.title')}</h3>
            <p className="text-sm text-gray-600">{t('earnings.subtitle')}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Period Selector */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`
                  px-3 py-1 text-xs font-medium rounded-md transition-colors
                  ${selectedPeriod === period 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {t(`earnings.periods.${period}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-6">
        {/* Legend */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Q1-Q2</span>
              <span className="text-sm font-medium text-gray-900">$1,455K</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Q3-Q4</span>
              <span className="text-sm font-medium text-gray-900">$1,635K</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-green-600 font-medium">+12.4%</span>
            <span className="text-gray-500">{t('earnings.vs_last_year')}</span>
          </div>
        </div>
        
        {/* Chart Container */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={earningsData} 
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                domain={[0, 250]}
                tickFormatter={(value: number) => `$${value}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="firstHalf" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 5, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey="topGross" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 5, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EarningsChart;