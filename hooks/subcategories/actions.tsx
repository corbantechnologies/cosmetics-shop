"use client";

import { useQuery } from "@tanstack/react-query";
import { getSubCategories, getSubCategory } from "@/services/subcategories";

export function useFetchSubCategories() {
    return useQuery({
        queryKey: ["subcategories"],
        queryFn: () => getSubCategories(),
        enabled: true,
    });
}

export function useFetchSubCategory(reference: string) {
    return useQuery({
        queryKey: ["subcategory", reference],
        queryFn: () => getSubCategory(reference),
        enabled: !!reference,
    });
}
