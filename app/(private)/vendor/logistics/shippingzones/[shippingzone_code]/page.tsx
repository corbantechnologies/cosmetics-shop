"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFetchShippingZone } from "@/hooks/shippingzones/actions";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { Truck, ArrowLeft, Edit, ShieldCheck, Clock, FileText, Globe } from "lucide-react";
import UpdateShippingZone from "@/forms/shippingzones/UpdateShippingZone";
import VendorModal from "@/components/vendor/Modal";

export default function ShippingZoneDetailPage() {
  const params = useParams();
  const router = useRouter();
  const zone_code = params.shippingzone_code as string;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: vendor } = useFetchAccount();
  const { data: zone, isLoading, isError } = useFetchShippingZone(zone_code);

  if (isLoading) return <div className="p-20 text-center text-muted-foreground">Loading zone details...</div>;
  if (isError || !zone) return (
    <div className="p-20 text-center">
      <p className="text-red-500 font-bold mb-4">Shipping zone not found.</p>
      <button onClick={() => router.back()} className="text-primary hover:underline flex items-center gap-1 mx-auto">
        <ArrowLeft className="w-4 h-4" /> Go back
      </button>
    </div>
  );

  const details = [
    { label: "Zone Name", value: zone.name, icon: Globe },
    { label: "Zone Code", value: zone.zone_code, icon: FileText },
    { label: "Delivery Cost", value: `${vendor?.shop?.currency || "$"} ${zone.delivery_cost}`, icon: ShieldCheck },
    { label: "Estimated Delivery", value: `${zone.estimated_delivery_days} Days`, icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-secondary/10 py-8 md:py-12">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <button 
          onClick={() => router.push("/vendor/logistics")}
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Logistics
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Info Card */}
          <div className="flex-1 space-y-8">
            <div className="bg-white border border-secondary/30 rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2.5 py-1 rounded-full mb-3 inline-block">
                    Shipping Zone
                  </span>
                  <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">{zone.name}</h1>
                  <p className="text-muted-foreground text-sm mt-1">Regional delivery settings</p>
                </div>
                {vendor?.is_superuser && (
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary/10 text-foreground rounded-xl text-sm font-bold hover:bg-[#E5E5E7] transition-all"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Details
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-secondary/10 pt-8">
                {details.map((detail, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 text-primary">
                      <detail.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">{detail.label}</p>
                      <p className="font-bold text-foreground text-lg">{detail.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-secondary/30 rounded-3xl p-8 shadow-sm">
              <h3 className="text-lg font-serif font-bold text-foreground mb-4">Zone Description</h3>
              <p className="text-foreground/70 leading-relaxed">
                {zone.description || "No specific description provided for this shipping zone."}
              </p>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="bg-white border border-secondary/30 rounded-3xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-foreground mb-4">Operational Status</h4>
              <div className={`p-4 rounded-2xl flex items-center justify-between ${zone.is_active ? "bg-green-50" : "bg-red-50"}`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${zone.is_active ? "text-green-700" : "text-red-700"}`}>
                  {zone.is_active ? "Active Zone" : "Inactive Zone"}
                </span>
                <div className={`w-3 h-3 rounded-full ${zone.is_active ? "bg-green-500" : "bg-red-500"} shadow-sm animate-pulse`} />
              </div>
            </div>

            <div className="bg-[#1D1D1F] p-6 rounded-3xl shadow-xl">
              <h4 className="text-sm font-bold text-white/50 mb-4 uppercase tracking-widest">History</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Created On</p>
                  <p className="text-white text-sm font-semibold">{new Date(zone.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Last Modified</p>
                  <p className="text-white text-sm font-semibold">{new Date(zone.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <VendorModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          title="Update Shipping Zone"
        >
          <UpdateShippingZone 
            zone_code={zone.zone_code} 
            currency={vendor?.shop?.currency || "$"}
            onSuccess={() => setIsEditModalOpen(false)}
          />
        </VendorModal>
      </div>
    </div>
  );
}
