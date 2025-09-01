import React from 'react';
import ClientUserSpacePage from './ClientUserSpacePage';

export default function page({ params }: { params: { locale: string; userspace: string } }) {
  return <ClientUserSpacePage 
    UserSpaceParamsId={params.userspace}
  />
}
