"use client"
import React from 'react'
import { AnimatedTrafficLine } from './Functions/AnimatedPercentageLine';
import { ChevronDown } from 'lucide-react';

export function TraficSourcesWidget() {
  const trafficData = [
    {
      label: 'Instagram',
      percentage: 50,
    },
    {
      label: 'Facebook',
      percentage: 25,
    },
    {
      label: 'Instagram',
      percentage: 50,
    },
    {
      label: 'Facebook',
      percentage: 25,
    },
    {
      label: 'Others',
      percentage: 25,
    },
  ];
  return (
    <section className="grow p-4 rounded-xl bg-white ring ring-gray-200">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Traffic Sources</h2>
        <button className="text-xs flex items-center gap-1 text-gray-500 border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-50 transition-colors">
          Last 7 Days <ChevronDown size={16}/>
        </button>
      </div>
      
      {/* Animated Lines Container */}
      <div className="space-y-5">
        {trafficData.map((source, index) => (
          <AnimatedTrafficLine
            key={index}
            label={source.label}
            percentage={source.percentage}
          />
        ))}
      </div>
    </section>
  )
}
