'use client';

import { useQuery } from '@tanstack/react-query';

import { useSessionStore } from '@/modules/auth/stores/session-store';
import { Skeleton } from '@/components/ui/skeleton';
import { Sample } from '@/types';
import { getSamples } from '../utils/sample-api';
import { SampleCard } from './sample-card';

export function SampleList() {
  const { session } = useSessionStore();

  const { data: samples=[], isLoading, refetch } = useQuery<Sample[]>({
    queryKey: ['samples'],
    queryFn: () => getSamples(session!.accessToken),
    enabled: !!session?.accessToken,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-36 w-full rounded-lg bg-white-50" />
        ))}
      </div>
    );
  }

    if (samples.length === 0) {
    return <p className="text-muted-foreground text-center mt-10">Nenhuma amostra encontrada.</p>;
    }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
      {samples.map((sample) => (
        <SampleCard key={sample.id} sample={sample} onRefetch={refetch} />
      ))}
    </div>

  );
}
