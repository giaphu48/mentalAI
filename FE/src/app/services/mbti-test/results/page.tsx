import { Suspense } from 'react';
import MBTIResultsClient from './MBTIResultsClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MBTIResultsClient />
    </Suspense>
  );
}