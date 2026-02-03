"use client";

import { useQuery } from "@tanstack/react-query";
import { getPickupStations, getPickupStation } from "@/services/pickupstations";

export function useFetchPickupStations() {
    return useQuery({
        queryKey: ["pickupstations"],
        queryFn: () => getPickupStations(),
        enabled: true,
    });
}

export function useFetchPickupStation(reference: string) {
    return useQuery({
        queryKey: ["pickupstation", reference],
        queryFn: () => getPickupStation(reference),
        enabled: !!reference,
    });
}