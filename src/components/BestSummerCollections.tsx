import React from 'react'
import { HeadlineSection } from './HeadlineSection'
import SummerCollectionProductUI from './UI/SummerCollectionProductUI'

export default function BestSummerCollections() {
  return (
    <section
        className='w-full'
    >
        <HeadlineSection
            TITLE='Discover our best of summer 2025'
        />
        <SummerCollectionProductUI />
    </section>
  )
}
