"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, MapPin, Bed, Wind, Stethoscope, Phone, Star, Droplet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { useHospitalRealtime } from "@/hooks/useHospitalRealtime"
import { AnimatedNumber } from "@/components/ui/animated-number"

import { HospitalDescriptionSection } from "./hospital/HospitalDescriptionSection"
import { DoctorProfilesSection } from "./hospital/DoctorProfilesSection"
import { GovernmentSchemesSection } from "./hospital/GovernmentSchemesSection"
import { InsuranceSection } from "./hospital/InsuranceSection"

export function HospitalDetailScreen() {
  const { selectedHospital, setCurrentScreen } = useAppStore()
  
  // Connect to realtime store updates
  useHospitalRealtime(selectedHospital?.id || "")

  const [lastUpdated, setLastUpdated] = useState("Just now")

  useEffect(() => {
    // Basic "Last updated" simulation timer
    const interval = setInterval(() => {
      setLastUpdated(prev => {
        if (prev === "Just now") return "1 min ago"
        const mins = parseInt(prev.split(" ")[0])
        return isNaN(mins) ? "1 min ago" : `${mins + 1} mins ago`
      })
    }, 60000)
    
    // Reset timer when real data changes
    setLastUpdated("Just now")
    
    return () => clearInterval(interval)
  }, [selectedHospital]) // Dependency on the object triggering re-renders

  if (!selectedHospital) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>No hospital selected.</p>
        <Button onClick={() => setCurrentScreen("hospitals")} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  const statusConfig = {
    stable: { label: "Stable", className: "bg-success text-success-foreground" },
    moderate: { label: "Moderate", className: "bg-warning text-warning-foreground" },
    critical: { label: "Critical", className: "bg-emergency text-emergency-foreground" },
  }
  const status = statusConfig[selectedHospital.loadStatus]

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.location.lat},${selectedHospital.location.lng}`
    window.open(url, "_blank")
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="flex items-center gap-3 px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => setCurrentScreen("hospitals")}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground truncate">
              {selectedHospital.name}
            </h1>
          </div>
          <Badge className={cn("shrink-0 ml-2", status.className)}>
            {status.label}
          </Badge>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6 max-w-4xl mx-auto w-full">
        {/* Info Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-muted-foreground w-full">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="text-sm truncate">
                {selectedHospital.distance} km away • {selectedHospital.address}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{selectedHospital.rating ?? "N/A"}</span>
              <span className="text-sm text-muted-foreground"> Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => window.open(`tel:${selectedHospital.phone}`)}>
                <Phone className="w-3.5 h-3.5 mr-2" />
                Call Hospital
              </Button>
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">Medical Resources</h2>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse relative">
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
              </span>
              <span className="text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">Live Updates</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-secondary/50 border-none shadow-none">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bed className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">ICU Beds</p>
                  <p className="font-semibold text-foreground flex items-baseline gap-1">
                    <AnimatedNumber value={selectedHospital.icuBeds} className="text-lg" /> 
                    <span className="text-sm text-muted-foreground">/ {selectedHospital.icuBedsTotal}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{lastUpdated}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-secondary/50 border-none shadow-none">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Wind className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">Ventilators</p>
                  <p className="font-semibold text-foreground flex items-baseline gap-1">
                    <AnimatedNumber value={selectedHospital.ventilators} className="text-lg" /> 
                    <span className="text-sm text-muted-foreground">/ {selectedHospital.ventilatorsTotal}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{lastUpdated}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-secondary/50 border-none shadow-none">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">Specialists</p>
                  <p className="font-semibold text-foreground flex items-baseline gap-1">
                    <AnimatedNumber value={selectedHospital.specialists} className="text-lg" />
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{lastUpdated}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Blood Availability Grid */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Droplet className="w-5 h-5 text-red-500" />
            <h2 className="text-base font-semibold">Blood Availability</h2>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {selectedHospital.bloodAvailability ? Object.entries(selectedHospital.bloodAvailability).map(([group, units]) => (
              <div key={group} className="flex flex-col items-center justify-center p-3 rounded-lg border bg-card transition-all duration-300">
                <span className="text-sm font-bold shadow-sm px-2 py-0.5 rounded-md bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 mb-1">{group}</span>
                <span className="text-xs font-semibold text-foreground flex items-baseline gap-1">
                  <AnimatedNumber value={units} /> units
                </span>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground col-span-4 pl-1">Data not available</p>
            )}
          </div>
        </section>

        {/* New Sections */}
        <HospitalDescriptionSection hospital={selectedHospital} />
        
        <DoctorProfilesSection hospitalId={selectedHospital.id} />
        
        <div className="space-y-6">
          <GovernmentSchemesSection hospitalId={selectedHospital.id} />
          <InsuranceSection hospitalId={selectedHospital.id} />
        </div>

        {/* Action Bottom */}
        <section className="pt-4">
          <Button className="w-full h-12" onClick={handleNavigate}>
            <MapPin className="w-4 h-4 mr-2" />
            Get Directions
          </Button>
        </section>
      </main>
    </div>
  )
}
