import React, { Suspense } from 'react';
import ClientUserSpacePage from './ClientUserSpacePage';
import Loading from '@/app/loading';

export default function page() {
  return (
    <Suspense
      fallback={<Loading />}
    >
      <ClientUserSpacePage />
    </Suspense>
  )
}
