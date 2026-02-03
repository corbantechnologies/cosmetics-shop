"use client"

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface PickupStation {
    name: string;
    location: string;
    city: string;
    map_link: string;
    is_active: boolean;
    cost_to_customer: string;
    station_code: string;
    created_at: string;
    updated_at: string;
    reference: string;
}

interface createPickupStation {
    name: string;
    location: string;
    city: string;
    map_link: string;
    is_active: boolean;
    cost_to_customer: string;
}

interface updatePickupStation {
    name: string;
    location: string;
    city: string;
    map_link: string;
    is_active: boolean;
    cost_to_customer: string;
}

export const getPickupStations = async (headers: {
    headers: { Authorization: string };
}): Promise<PickupStation[]> => {
    const response: AxiosResponse<PaginatedResponse<PickupStation>> =
        await apiActions.get(`/api/v1/pickupstations/`, headers);
    return response.data.results || [];
};

export const getPickupStation = async (
    reference: string,
    headers: { headers: { Authorization: string } }
): Promise<PickupStation> => {
    const response: AxiosResponse<PickupStation> = await apiActions.get(
        `/api/v1/pickupstations/${reference}/`,
        headers
    );
    return response.data;
};

export const createPickupStation = async (
    data: createPickupStation,
    headers: { headers: { Authorization: string } }
): Promise<PickupStation> => {
    const response: AxiosResponse<PickupStation> = await apiActions.post(
        `/api/v1/pickupstations/`,
        data,
        headers
    );
    return response.data;
};

export const updatePickupStation = async (
    reference: string,
    data: updatePickupStation,
    headers: { headers: { Authorization: string } }
): Promise<PickupStation> => {
    const response: AxiosResponse<PickupStation> = await apiActions.patch(
        `/api/v1/pickupstations/${reference}/`,
        data,
        headers
    );
    return response.data;
};

export const deletePickupStation = async (
    reference: string,
    headers: { headers: { Authorization: string } }
): Promise<PickupStation> => {
    const response: AxiosResponse<PickupStation> = await apiActions.delete(
        `/api/v1/pickupstations/${reference}/`,
        headers
    );
    return response.data;
};
