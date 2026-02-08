"use client";

// gets the orders data of the logged in user from the server
import { useQuery } from "@tanstack/react-query";
import { getOrders, getOrder } from "@/services/orders";
import useAxiosAuth from "../authentication/useAxiosAuth";

export function useFetchOrders() {
  const header = useAxiosAuth();
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(header),
    enabled: true,
  });
}

export function useFetchOrder(reference: string) {
  const header = useAxiosAuth();
  return useQuery({
    queryKey: ["order", reference],
    queryFn: () => getOrder(reference, header),
    enabled: !!reference,
  });
}
