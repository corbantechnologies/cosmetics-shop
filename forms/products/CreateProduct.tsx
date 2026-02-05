"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { createProduct } from "@/services/products";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useFetchSubCategories } from "@/hooks/subcategories/actions";

interface CreateProductProps {
  onSuccess?: () => void;
}

export function CreateProduct({ onSuccess }: CreateProductProps) {
  const router = useRouter();
  const authHeaders = useAxiosAuth();
  const { data: subcategories } = useFetchSubCategories();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      sub_categories: [] as string[],
      tags: "", // Comma separated string for input
      is_active: false,
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Convert tags string to array
        const tagsArray = values.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== "");

        // Ensure sub_categories is an array (select returns string)

        const payload = {
          ...values,
          tags: tagsArray,
        };

        const response = await createProduct(payload, authHeaders);

        toast.success("Product draft created successfully");

        if (onSuccess) onSuccess();

        // Navigate to product details page for further updates
        router.push(`/vendor/products/${response.reference}`);
      } catch (error) {
        toast.error("Failed to create product");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Product Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          placeholder="e.g. Leather Jacket"
          className="w-full px-4 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
          placeholder="High quality material..."
          className="w-full px-4 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors resize-none"
        />
      </div>

      <div>
        <label
          htmlFor="sub_categories"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Subcategory
        </label>
        <select
          id="sub_categories"
          name="sub_categories"
          onChange={(e) => {
            const val = e.target.value;
            formik.setFieldValue("sub_categories", val ? [val] : []);
          }}
          onBlur={formik.handleBlur}
          value={formik.values.sub_categories[0] || ""}
          className="w-full px-4 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors bg-white"
        >
          <option value="">Select Subcategory</option>
          {subcategories?.map((sub) => (
            <option key={sub.reference} value={sub.name}>
              {sub.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground mt-1">
          Select the primary subcategory for this product.
        </p>
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Tags
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.tags}
          placeholder="Men, Unisex (comma separated)"
          className="w-full px-4 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Creating Draft..." : "Create Draft Product"}
      </button>
    </form>
  );
}
