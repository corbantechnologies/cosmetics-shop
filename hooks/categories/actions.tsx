"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories, getCategory } from "@/services/categories";

export function useFetchCategories() {
    return useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories(),
        enabled: true,
    });
}

export function useFetchCategory(reference: string) {
    return useQuery({
        queryKey: ["category", reference],
        queryFn: () => getCategory(reference),
        enabled: !!reference,
    });
}
