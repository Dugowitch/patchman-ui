import React, { JSX } from 'react';
import { Navigate, useParams } from 'react-router-dom';

export const NavigateToSystem = (): JSX.Element => {
  const { inventoryId } = useParams();
  return <Navigate to={`../systems/${inventoryId}`} />;
};
