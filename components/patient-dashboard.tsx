"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Filter, Bed, Wind, Stethoscope, MapPin, Loader2, Star, Droplet } from "lucide-react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useAppStore, type Hospital } from "@/lib/store"
import { HospitalCard } from "./hospital-card"
import { cn } from "@/lib/utils"

type FilterType = "all" | "icu" | "ventilators" | "specialists"

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export function PatientDashboard() {
  const { hospitals, setCurrentScreen, userLocation, setUserLocation, setSelectedHospital } = useAppStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeType, setActiveType] = useState<"All" | "Emergency" | "Specialized" | "Maternity">("All")

  useEffect(() => {
    // Simulate initial data fetch load time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  // Get user's GPS location on mount
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported")
      return
    }

    setIsLoadingLocation(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date()
        })
        setIsLoadingLocation(false)
      },
      (error) => {
        setIsLoadingLocation(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access denied")
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location unavailable")
            break
          case error.TIMEOUT:
            setLocationError("Location request timed out")
            break
          default:
            setLocationError("Unknown location error")
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }, [setUserLocation])

  useEffect(() => {
    if (!userLocation) {
      requestLocation()
    }
  }, [userLocation, requestLocation])

  const filters: { id: FilterType; label: string; icon: React.ElementType }[] = [
    { id: "all", label: "All", icon: Filter },
    { id: "icu", label: "ICU Beds", icon: Bed },
    { id: "ventilators", label: "Ventilators", icon: Wind },
    { id: "specialists", label: "Specialists", icon: Stethoscope },
  ]

  // Calculate distances and sort hospitals
  const hospitalsWithDistance = hospitals.map((hospital) => {
    let distance = hospital.distance // Default distance
    if (userLocation) {
      distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        hospital.location.lat,
        hospital.location.lng
      )
    }
    return { ...hospital, calculatedDistance: distance }
  }).sort((a, b) => a.calculatedDistance - b.calculatedDistance)

  const filteredHospitals = hospitalsWithDistance.filter((hospital) => {
    const matchesSearch = hospital.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    
    if (!matchesSearch) return false

    switch (activeFilter) {
      case "icu":
        return hospital.icuBeds > 0
      case "ventilators":
        return hospital.ventilators > 0
      case "specialists":
        return hospital.specialists > 5
      default:
        return true
    }
  })

  const handleViewDetails = (hospital: Hospital) => {
    setSelectedHospital(hospital)
    setCurrentScreen("hospital-detail")
  }

  const handleNavigate = (hospital: Hospital) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.location.lat},${hospital.location.lng}`
    window.open(url, "_blank")
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-foreground mb-1">
            Find Hospitals
          </h1>
          <p className="text-sm text-muted-foreground">
            Nearby facilities with available resources
          </p>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search hospitals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-11"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 pb-4 flex gap-2 overflow-x-auto no-scrollbar">
          {filters.map((filter) => {
            const Icon = filter.icon
            return (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "shrink-0 gap-1.5 h-9 rounded-full",
                  activeFilter === filter.id && "shadow-sm"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {filter.label}
              </Button>
            )
          })}
        </div>
      </header>

      {/* Results */}
      <main className="px-4 py-4">
        {/* Location Status */}
        <div className="mb-4 p-3 rounded-lg bg-secondary/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isLoadingLocation ? (
              <>
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-sm text-muted-foreground">Getting your location...</span>
              </>
            ) : userLocation ? (
              <>
                <MapPin className="w-4 h-4 text-success" />
                <span className="text-sm text-foreground">
                  Location active
                  {userLocation.accuracy < 100 && (
                    <span className="text-muted-foreground ml-1">
                      ({Math.round(userLocation.accuracy)}m accuracy)
                    </span>
                  )}
                </span>
              </>
            ) : locationError ? (
              <>
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{locationError}</span>
              </>
            ) : null}
          </div>
          {(locationError || !userLocation) && !isLoadingLocation && (
            <Button
              variant="ghost"
              size="sm"
              onClick={requestLocation}
              className="h-7 text-xs"
            >
              Enable
            </Button>
          )}
          {userLocation && (
            <Button
              variant="ghost"
              size="sm"
              onClick={requestLocation}
              className="h-7 text-xs"
            >
              Refresh
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredHospitals.length} hospitals found
          </p>
          <Badge variant="outline" className="text-xs gap-1">
            {userLocation ? (
              <>
                <MapPin className="w-3 h-3" />
                Sorted by GPS distance
              </>
            ) : (
              "Sorted by distance"
            )}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital) => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              onViewDetails={() => handleViewDetails(hospital)}
              onNavigate={() => handleNavigate(hospital)}
            />
          ))}
        </div>

        {filteredHospitals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hospitals match your criteria</p>
          </div>
        )}
      </main>
    </div>
  )
}
