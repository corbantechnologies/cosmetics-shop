"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";
import { CartItem } from "./cartitems";

export interface Cart {
  customer: string;
  customer_name: string;
  customer_email: string;
  reference: string;
  items: CartItem[];
  grand_total: number;
  created_at: string;
  updated_at: string;
}

interface checkoutCart {
  pickup_station: string; // station code
  phone_number: string; // pick the customer's number if available, else ask for it
}

export const getCart = async (headers: {
  headers: { Authorization: string };
}): Promise<Cart> => {
  const response: AxiosResponse<Cart> = await apiActions.get(
    `/api/v1/cart/`,
    headers,
  );
  return response.data;
};

import { Order } from "./orders";

export const checkoutCart = async (
  data: checkoutCart,
  headers: { headers: { Authorization: string } },
): Promise<Order> => {
  const response: AxiosResponse<Order> = await apiActions.post(
    `/api/v1/orders/checkout/`,
    data,
    headers,
  );
  return response.data;
};
