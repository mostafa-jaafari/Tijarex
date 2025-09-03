import React from 'react';
import ClientUserSpacePage from './ClientUserSpacePage';

export default async function page({ params }: { params: Promise<{ locale: string; userspace: string }> }) {
  const resolvedParams = await params;
  return <ClientUserSpacePage 
    UserSpaceParamsId={resolvedParams.userspace}
  />
}
