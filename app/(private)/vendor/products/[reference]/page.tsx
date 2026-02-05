"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFetchProductVendor } from "@/hooks/products/actions";
import { useFetchAccount } from "@/hooks/accounts/actions";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { SkeletonRow } from "@/components/dashboard/DashboardSkeletons";
import { formatDate } from "@/components/dashboard/utils";
import VendorModal from "@/components/vendor/Modal";
import UploadProductImages from "@/forms/products/UploadProductImages";
import {
  Edit,
  Package,
  Tag,
  Layers,
  ArrowLeft,
  ImageIcon,
  Plus,
} from "lucide-react";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const reference = params.reference as string;
  const { data: vendor } = useFetchAccount();
  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useFetchProductVendor(reference);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-32 bg-secondary/20 rounded mb-4"></div>
          <div className="h-8 w-48 bg-secondary/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-background p-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The product you are looking for does not exist or you do not have
          permission to view it.
        </p>
        <button
          onClick={() => router.back()}
          className="flex items-center text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Products
        </button>
      </div>
    );
  }

  const currency =
    product.shop_details?.currency || vendor?.shop?.currency || "KES";

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Products
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-medium">
                Product Details
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-tighter ${
                  product.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground leading-tight mb-2">
              {product.name}
            </h1>
            <p className="text-sm font-mono text-muted-foreground">
              Code: {product.product_code}
            </p>
          </div>
          <button className="inline-flex items-center justify-center rounded-sm border border-secondary bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary/5">
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Images & Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images */}
            <div className="bg-white border border-secondary/30 rounded-sm p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg flex items-center text-foreground">
                  <ImageIcon className="w-4 h-4 mr-2 text-primary" />
                  Product Images
                </h3>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="text-xs flex items-center bg-primary/10 text-primary px-2 py-1 rounded-sm hover:bg-primary/20 transition-colors"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Images
                </button>
              </div>

              {product.images && product.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {product.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-sm overflow-hidden border border-secondary/20 relative group"
                    >
                      <img
                        src={img.image}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-secondary/5 rounded-sm border border-dashed border-secondary/20 text-muted-foreground">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm mb-2">No images uploaded</p>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="text-primary hover:underline"
                  >
                    Upload Images
                  </button>
                </div>
              )}
            </div>

            {/* Variants Table */}
            <div className="bg-white border border-secondary/30 rounded-sm overflow-hidden shadow-sm">
              <div className="p-6 border-b border-secondary/10 flex justify-between items-center">
                <h3 className="font-serif text-lg text-foreground flex items-center">
                  <Package className="w-4 h-4 mr-2 text-primary" />
                  Variants & Pricing
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-secondary/5 border-b border-secondary/20">
                      <th className="px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground w-1/3">
                        Attributes
                      </th>
                      <th className="px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground text-right">
                        Price ({currency})
                      </th>
                      <th className="px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground text-right">
                        Stock
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary/10">
                    {product.variants && product.variants.length > 0 ? (
                      product.variants.map((variant) => (
                        <tr
                          key={variant.id}
                          className="hover:bg-secondary/5 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-foreground">
                            {Object.entries(variant.attributes).map(
                              ([key, value]) => (
                                <span
                                  key={key}
                                  className="inline-block mr-2 bg-secondary/10 px-2 py-1 rounded text-xs text-foreground/80"
                                >
                                  {key}:{" "}
                                  <span className="font-semibold">
                                    {String(value)}
                                  </span>
                                </span>
                              ),
                            )}
                            {Object.keys(variant.attributes).length === 0 && (
                              <span className="text-muted-foreground text-xs italic">
                                Default Variant
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                            {variant.sku}
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground text-right font-medium">
                            {Number(variant.price).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground text-right">
                            {variant.stock}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-8 text-center text-sm text-muted-foreground"
                        >
                          No variants found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Taxonomy */}
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-white border border-secondary/30 rounded-sm p-6 shadow-sm">
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">
                Description
              </h4>
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {product.description || "No description provided."}
              </p>
            </div>

            {/* Taxonomy */}
            <div className="bg-white border border-secondary/30 rounded-sm p-6 shadow-sm space-y-6">
              {/* Subcategories */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center font-medium">
                  <Layers className="w-3 h-3 mr-2" />
                  Subcategories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.sub_category && product.sub_category.length > 0 ? (
                    product.sub_category.map((sub, idx) => (
                      <span
                        key={idx}
                        className="bg-primary/5 text-primary border border-primary/20 px-2 py-1 rounded text-xs font-medium"
                      >
                        {sub.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground italic">
                      None
                    </span>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center font-medium">
                  <Tag className="w-3 h-3 mr-2" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.tags && product.tags.length > 0 ? (
                    product.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-secondary/10 text-foreground/70 px-2 py-1 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground italic">
                      None
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-secondary/10">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Created</span>
                  <span>{formatDate(product.created_at)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Last Updated</span>
                  <span>{formatDate(product.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <VendorModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          title="Upload Product Images"
        >
          <UploadProductImages
            productReference={reference}
            onSuccess={() => {
              setIsUploadModalOpen(false);
              if (refetch) refetch();
            }}
          />
        </VendorModal>
      </div>
    </div>
  );
}
