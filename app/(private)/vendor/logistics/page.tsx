"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFetchPickupStationsVendor } from "@/hooks/pickupstations/actions";
import { useFetchShippingZonesVendor } from "@/hooks/shippingzones/actions";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { MapPin, Truck, Plus, ChevronRight, Search, Filter } from "lucide-react";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { SkeletonRow } from "@/components/dashboard/DashboardSkeletons";
import VendorModal from "@/components/vendor/Modal";
import CreatePickupStation from "@/forms/pickupstations/CreatePickupStation";
import CreateShippingZone from "@/forms/shippingzones/CreateShippingZone";

export default function LogisticsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"pickup" | "shipping">("pickup");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);

  const { data: vendor } = useFetchAccount();
  const { data: pickupStations, isLoading: isLoadingPickup } = useFetchPickupStationsVendor();
  const { data: shippingZones, isLoading: isLoadingShipping } = useFetchShippingZonesVendor();

  const filteredPickup = pickupStations?.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredShipping = shippingZones?.filter(z => 
    z.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    z.zone_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-secondary/10 py-8 md:py-12">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <SectionHeader 
            title="Logistics Management" 
            description="Configure your delivery network, including physical pickup points and regional shipping zones."
          />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search logistics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-secondary/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              />
            </div>
            {vendor?.is_superuser && (
              <button 
                onClick={() => activeTab === "pickup" ? setIsPickupModalOpen(true) : setIsShippingModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
              >
                <Plus className="w-4 h-4" />
                Add {activeTab === "pickup" ? "Station" : "Zone"}
              </button>
            )}
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex p-1 bg-[#E5E5E7] rounded-xl w-fit mb-8">
          <button 
            onClick={() => setActiveTab("pickup")}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "pickup" ? "bg-white text-foreground shadow-sm" : "text-foreground/70 hover:text-foreground"}`}
          >
            <MapPin className="w-4 h-4" />
            Pickup Stations
          </button>
          <button 
            onClick={() => setActiveTab("shipping")}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "shipping" ? "bg-white text-foreground shadow-sm" : "text-foreground/70 hover:text-foreground"}`}
          >
            <Truck className="w-4 h-4" />
            Shipping Zones
          </button>
        </div>

        <div className="bg-white border border-secondary/30 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/10 border-b border-secondary/30">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Name & Details</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Location / Code</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Cost</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Delivery ETA</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/10">
              {activeTab === "pickup" ? (
                isLoadingPickup ? <SkeletonRow /> : filteredPickup?.map(station => (
                  <tr 
                    key={station.station_code} 
                    className="hover:bg-secondary/10/50 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/vendor/logistics/pickupstations/${station.station_code}`)}
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{station.name}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{station.station_code}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground">{station.city}</p>
                      <p className="text-[11px] text-muted-foreground">{station.location}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      {vendor?.shop?.currency || "$"}{station.cost_to_customer}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">{station.estimated_delivery_days} days</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${station.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {station.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight className="w-4 h-4 text-secondary group-hover:text-primary transition-colors inline" />
                    </td>
                  </tr>
                ))
              ) : (
                isLoadingShipping ? <SkeletonRow /> : filteredShipping?.map(zone => (
                  <tr 
                    key={zone.zone_code} 
                    className="hover:bg-secondary/10/50 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/vendor/logistics/shippingzones/${zone.zone_code}`)}
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{zone.name}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-xs">{zone.description || "No description provided"}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{zone.zone_code}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      {vendor?.shop?.currency || "$"}{zone.delivery_cost}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">{zone.estimated_delivery_days} days</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${zone.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {zone.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight className="w-4 h-4 text-secondary group-hover:text-primary transition-colors inline" />
                    </td>
                  </tr>
                ))
              )}
              {((activeTab === "pickup" && !filteredPickup?.length) || (activeTab === "shipping" && !filteredShipping?.length)) && !isLoadingPickup && !isLoadingShipping && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <p className="text-sm text-muted-foreground">No results found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modals */}
        <VendorModal 
          isOpen={isPickupModalOpen} 
          onClose={() => setIsPickupModalOpen(false)} 
          title="Add Pickup Station"
        >
          <CreatePickupStation 
            currency={vendor?.shop?.currency || "$"} 
            onSuccess={() => setIsPickupModalOpen(false)} 
          />
        </VendorModal>

        <VendorModal 
          isOpen={isShippingModalOpen} 
          onClose={() => setIsShippingModalOpen(false)} 
          title="Add Shipping Zone"
        >
          <CreateShippingZone 
            currency={vendor?.shop?.currency || "$"} 
            onSuccess={() => setIsShippingModalOpen(false)} 
          />
        </VendorModal>
      </div>
    </div>
  );
}
