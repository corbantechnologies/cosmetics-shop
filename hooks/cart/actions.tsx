"use client";

import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/services/cart";
import useAxiosAuth from "../authentication/useAxiosAuth";

export function useFetchCart() {
    const header = useAxiosAuth();
    return useQuery({
        queryKey: ["cart"],
        queryFn: () => getCart(header),
        enabled: true,
    });
}
