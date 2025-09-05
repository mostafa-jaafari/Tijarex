"use client"
import React from 'react'
import { AnimatedTrafficLine } from './Functions/AnimatedPercentageLine';
import { ChevronDown } from 'lucide-react';
import { type UserInfosType } from '@/types/userinfos';

type TraficSourcesWidgetProps = { 
  userInfos: UserInfosType | null;
}
export function TraficSourcesWidget({ userInfos }: TraficSourcesWidgetProps) {
  
  if(!userInfos) return null;
  const trafficData = userInfos.TrafficSources && userInfos.TrafficSources.length > 0 ? userInfos.TrafficSources : [];
  return (
    <section 
      className="grow h-full border-b border-neutral-400 
        ring ring-neutral-200 bg-white 
        rounded-xl p-4"
    >
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Traffic Sources</h2>
        <button className="text-xs flex items-center gap-1 text-gray-500 border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-50 transition-colors">
          Last 7 Days <ChevronDown size={16}/>
        </button>
      </div>
      
      {/* Animated Lines Container */}
      <div className="space-y-5">
        {trafficData.length > 0 ? trafficData.map((source, index) => (
          <AnimatedTrafficLine
            key={index}
            label={source.source}
            percentage={source.value}
          />
        )) : (
            <div
              className='w-full flex justify-center mt-32'
            >
              <p className="text-sm text-gray-500">
                No traffic source data available yet.
              </p>
            </div>
          )}
      </div>
    </section>
  )
}
