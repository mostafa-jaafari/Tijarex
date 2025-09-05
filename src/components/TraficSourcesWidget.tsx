"use client"
import React, { useState } from 'react'
import { AnimatedTrafficLine } from './Functions/AnimatedPercentageLine';
import { type UserInfosType } from '@/types/userinfos';
import { CustomDropdown } from './UI/CustomDropdown';

type TraficSourcesWidgetProps = { 
  userInfos: UserInfosType | null;
}
export function TraficSourcesWidget({ userInfos }: TraficSourcesWidgetProps) {
  const timesAvailable = ["last 7 days", "last month", "last year"];
  const [selectedTime, setSelectedTime] = useState(timesAvailable[0]);
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
        <CustomDropdown 
          options={timesAvailable} 
          selectedValue={selectedTime} 
          onSelect={setSelectedTime}
        />
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
