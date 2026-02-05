"use client"

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface Product {
    shop: string;
    shop_details: {
        shop_code: string;
        name: string;
        logo: string | null;
    };
    product_code: string;
    name: string;
    description: string;
    is_active: boolean;
    features: {};
    images: {
        image: string;
        created_at: string;
        updated_at: string;
    }[];
    created_at: string;
    updated_at: string;
    tags: string[];
    reference: string;
    sub_category: {
        name: string;
        category: string;
        shop: string;
        is_active: boolean;
        reference: string;
        created_at: string;
        updated_at: string;
    }[];
    variants: {
        id: string;
        product: string;
        product_name: string;
        attributes: {};
        price: string;
        discounted_price: string | null;
        stock: number;
        sku: string;
        image: string | null;
        created_at: string;
        updated_at: string;
        reference: string;
    }[];
    available_options: string[];
    total_stock: number;
}

