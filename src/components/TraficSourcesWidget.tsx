"use client"
import React from 'react'
import { AnimatedTrafficLine } from './Functions/AnimatedPercentageLine';
import { ChevronDown } from 'lucide-react';
import { type UserInfosType } from '@/types/userinfos';

type TraficSourcesWidgetProps = { 
  isFinishSetup: boolean; 
  isLoadingUserInfos: boolean; 
  userInfos: UserInfosType | null;
}
export function TraficSourcesWidget({ isFinishSetup, isLoadingUserInfos, userInfos }: TraficSourcesWidgetProps) {
  
  if(!userInfos) return null;
  const trafficData = userInfos.TrafficSources && userInfos.TrafficSources.length > 0 ? userInfos.TrafficSources : [];
  return (
    <section 
      className={`border-b border-neutral-400/50 ring ring-neutral-200 bg-white 
        rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] p-4
        ${isFinishSetup ? "h-87 min-w-1/2" : "grow"}`}
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
          isLoadingUserInfos ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, idx) => (
                <div key={idx} className="w-full">
                  <div className="flex justify-between items-center mb-1">
                    <span className="flex w-20 h-4 rounded-lg bg-neutral-200 animate-pulse"/>
                    <span className="flex w-10 h-4 rounded-lg bg-neutral-200 animate-pulse"/>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-purple-600 h-1.5 rounded-full transition-all duration-1000 ease-out" style={{ width: '0%' }}>
                      <span className='absolute -right-1 -top-1 bg-purple-600 rounded-full w-3 h-3'/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className='w-full flex justify-center py-12'
            >
              <p className="text-sm text-gray-500">
                No traffic source data available yet.
              </p>
            </div>
          )
        )}
      </div>
    </section>
  )
}
