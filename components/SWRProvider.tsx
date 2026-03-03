'use client';

import { PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';

export default function SWRProvider({ children }: PropsWithChildren) {
    return (
        <SWRConfig
            value={{
                // Keep results in cache between page navigations
                keepPreviousData: true,

                // Avoid refetching just because you tab away/back
                revalidateOnFocus: false,

                // Avoid refetching just because connection state changes
                revalidateOnReconnect: false,

                // If multiple components request the same key within this window,
                // only one network request is made.
                dedupingInterval: 60_000,

                // Polling disabled by default
                refreshInterval: 0,

                // Retry a couple times (network hiccups)
                errorRetryCount: 2,

                // Cache results for a while before considering them stale
                // (SWR still returns cached immediately; this affects revalidation logic)
                focusThrottleInterval: 60_000,
            }}
        >
            {children}
        </SWRConfig>
    );
}
