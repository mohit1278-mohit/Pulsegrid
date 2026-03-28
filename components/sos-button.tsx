"use client"

import { useState, useEffect, useCallback } from "react"
import { Phone, MapPin, Ambulance, CheckCircle2, Navigation, AlertTriangle, Locate, Clock, Hospital } from "lucide-react"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
  address?: string
}

type TrackingStatus = "locating" | "location-found" | "finding-ambulance" | "dispatched" | "enroute" | "arriving" | "arrived"

export function SOSButton() {
  const { 
    sosConfirmationEnabled, 
    addEmergencyToHistory, 
    addNotification,
    userRole,
    hospitals,
    locationEnabled
  } = useAppStore()
  
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showTrackingDialog, setShowTrackingDialog] = useState(false)
  const [trackingStatus, setTrackingStatus] = useState<TrackingStatus>("locating")
  const [location, setLocation] = useState<LocationData | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [ambulanceDistance, setAmbulanceDistance] = useState(5.2)
  const [eta, setEta] = useState(12)
  const [nearestHospital, setNearestHospital] = useState<string>("Metro General Hospital")
  const [ambulanceId, setAmbulanceId] = useState("")

  // Don't show SOS for hospital users
  if (userRole === "hospital") return null

  const getLocation = useCallback((): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          }
          
          // Reverse geocode to get address (simulated)
          try {
            locationData.address = await reverseGeocode(
              position.coords.latitude,
              position.coords.longitude
            )
          } catch {
            locationData.address = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
          }
          
          resolve(locationData)
        },
        (error) => {
          let errorMessage = "Unable to get your location"
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied. Please enable location access."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable"
              break
            case error.TIMEOUT:
              errorMessage = "Location request timed out"
              break
          }
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      )
    })
  }, [])

  // Simulated reverse geocoding
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    // In production, use a real geocoding API
    await new Promise((resolve) => setTimeout(resolve, 500))
    return `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lng).toFixed(2)}° ${lng >= 0 ? "E" : "W"}`
  }

  const findNearestHospital = (lat: number, lng: number) => {
    // Find nearest hospital with available resources
    let nearestDistance = Infinity
    let nearest = hospitals[0]
    
    hospitals.forEach((hospital) => {
      const distance = Math.sqrt(
        Math.pow(hospital.location.lat - lat, 2) +
        Math.pow(hospital.location.lng - lng, 2)
      ) * 111 // Convert to approximate km
      
      if (distance < nearestDistance && hospital.loadStatus !== "critical") {
        nearestDistance = distance
        nearest = hospital
      }
    })
    
    return nearest
  }

  const handleSOSPress = () => {
    setLocationError(null)
    if (sosConfirmationEnabled) {
      setShowConfirmDialog(true)
    } else {
      triggerEmergency()
    }
  }

  const triggerEmergency = async () => {
    setShowConfirmDialog(false)
    setShowTrackingDialog(true)
    setTrackingStatus("locating")
    setLocation(null)
    setLocationError(null)

    // Step 1: Get GPS location
    try {
      const loc = await getLocation()
      setLocation(loc)
      setTrackingStatus("location-found")
      
      // Find nearest hospital
      const nearest = findNearestHospital(loc.latitude, loc.longitude)
      setNearestHospital(nearest.name)
      
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Step 2: Finding available ambulance
      setTrackingStatus("finding-ambulance")
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // Generate ambulance ID
      const id = `AMB-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      setAmbulanceId(id)
      
      // Step 3: Ambulance dispatched
      setTrackingStatus("dispatched")
      setAmbulanceDistance(5.2)
      setEta(12)
      
      addNotification({
        type: "ambulance",
        title: "Ambulance Dispatched",
        message: `Ambulance ${id} is on the way from ${nearest.name}`,
        read: false,
      })
      
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      // Step 4: Ambulance en route - start simulation
      setTrackingStatus("enroute")
      addEmergencyToHistory(`Ambulance ${id} dispatched from ${nearest.name}`)
      
    } catch (error) {
      setLocationError(error instanceof Error ? error.message : "Failed to get location")
      
      // Fallback: Use approximate location based on IP (simulated)
      setTrackingStatus("location-found")
      setLocation({
        latitude: 40.7128,
        longitude: -74.0060,
        accuracy: 5000,
        address: "Approximate location (GPS unavailable)"
      })
      
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setTrackingStatus("finding-ambulance")
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      const id = `AMB-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      setAmbulanceId(id)
      setTrackingStatus("dispatched")
      
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setTrackingStatus("enroute")
      
      addEmergencyToHistory(`Ambulance ${id} dispatched (approximate location)`)
      addNotification({
        type: "ambulance",
        title: "Ambulance Dispatched",
        message: `Using approximate location. Ambulance ${id} is on the way.`,
        read: false,
      })
    }
  }

  // Simulate ambulance movement
  useEffect(() => {
    if (trackingStatus !== "enroute") return

    const interval = setInterval(() => {
      setAmbulanceDistance((prev) => {
        const newDistance = Math.max(0, prev - 0.3)
        if (newDistance <= 0.5 && newDistance > 0.1) {
          setTrackingStatus("arriving")
        } else if (newDistance <= 0.1) {
          setTrackingStatus("arrived")
          clearInterval(interval)
          addNotification({
            type: "arrival",
            title: "Ambulance Arrived",
            message: `Ambulance ${ambulanceId} has arrived at your location`,
            read: false,
          })
        }
        return newDistance
      })
      
      setEta((prev) => Math.max(0, prev - 1))
    }, 3000)

    return () => clearInterval(interval)
  }, [trackingStatus, ambulanceId, addNotification])

  const getStatusConfig = () => {
    switch (trackingStatus) {
      case "locating":
        return {
          icon: Locate,
          title: "Getting Your Location",
          message: "Using GPS to pinpoint your exact location...",
          color: "text-primary",
          bgColor: "bg-primary/10",
        }
      case "location-found":
        return {
          icon: MapPin,
          title: "Location Found",
          message: location?.address || "Location acquired",
          color: "text-success",
          bgColor: "bg-success/10",
        }
      case "finding-ambulance":
        return {
          icon: Hospital,
          title: "Finding Ambulance",
          message: `Contacting ${nearestHospital}...`,
          color: "text-primary",
          bgColor: "bg-primary/10",
        }
      case "dispatched":
        return {
          icon: Ambulance,
          title: "Ambulance Dispatched",
          message: `${ambulanceId} is preparing to leave`,
          color: "text-primary",
          bgColor: "bg-primary/10",
        }
      case "enroute":
        return {
          icon: Navigation,
          title: "Ambulance En Route",
          message: `ETA: ${eta} minutes`,
          color: "text-primary",
          bgColor: "bg-primary/10",
        }
      case "arriving":
        return {
          icon: Ambulance,
          title: "Ambulance Arriving",
          message: "Almost at your location!",
          color: "text-warning",
          bgColor: "bg-warning/10",
        }
      case "arrived":
        return {
          icon: CheckCircle2,
          title: "Ambulance Arrived",
          message: "Medical help is here",
          color: "text-success",
          bgColor: "bg-success/10",
        }
    }
  }

  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon
  const isActiveTracking = ["enroute", "arriving"].includes(trackingStatus)
  const progressPercentage = Math.max(0, 100 - (ambulanceDistance / 5.2) * 100)

  return (
    <>
      {/* Floating SOS Button */}
      <button
        onClick={handleSOSPress}
        className={cn(
          "fixed bottom-24 right-4 z-50",
          "w-16 h-16 rounded-full",
          "bg-emergency text-emergency-foreground",
          "flex items-center justify-center",
          "shadow-lg shadow-emergency/30",
          "active:scale-95 transition-transform",
          "animate-pulse"
        )}
        style={{ animationDuration: "2s" }}
      >
        <span className="font-bold text-lg">SOS</span>
      </button>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-[340px] rounded-2xl">
          <DialogHeader>
            <div className="mx-auto w-14 h-14 rounded-full bg-emergency/10 flex items-center justify-center mb-2">
              <Phone className="w-7 h-7 text-emergency" />
            </div>
            <DialogTitle className="text-center">Emergency Alert</DialogTitle>
            <DialogDescription className="text-center">
              {locationEnabled 
                ? "We will use your GPS location to send the nearest ambulance."
                : "Location access is disabled. We'll use approximate location."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              onClick={triggerEmergency}
              className="w-full h-12 bg-emergency hover:bg-emergency/90 text-emergency-foreground"
            >
              Yes, Send Emergency Alert
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="w-full h-12"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tracking Dialog */}
      <Dialog open={showTrackingDialog} onOpenChange={setShowTrackingDialog}>
        <DialogContent className="max-w-[360px] rounded-2xl p-0 overflow-hidden">
          <VisuallyHidden.Root>
            <DialogTitle>Emergency Tracking Status</DialogTitle>
            <DialogDescription>Live updates on your emergency request</DialogDescription>
          </VisuallyHidden.Root>

          {/* Status Header */}
          <div className={cn("p-6 text-center", statusConfig.bgColor)}>
            <div 
              className={cn(
                "mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3 bg-background"
              )}
            >
              <StatusIcon 
                className={cn(
                  "w-8 h-8",
                  statusConfig.color,
                  ["locating", "finding-ambulance"].includes(trackingStatus) && "animate-pulse"
                )} 
              />
            </div>
            <h3 className="font-semibold text-lg text-foreground">{statusConfig.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{statusConfig.message}</p>
          </div>

          {/* Location Error Warning */}
          {locationError && (
            <div className="mx-4 mt-4 p-3 bg-warning/10 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <p className="text-xs text-warning-foreground">{locationError}</p>
            </div>
          )}

          {/* Location Info */}
          {location && trackingStatus !== "locating" && (
            <div className="px-4 pt-4">
              <div className="p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-foreground">Your Location</span>
                </div>
                <p className="text-xs text-muted-foreground ml-6">{location.address}</p>
                {location.accuracy && (
                  <p className="text-xs text-muted-foreground ml-6 mt-0.5">
                    Accuracy: {location.accuracy < 100 ? `${Math.round(location.accuracy)}m` : `~${(location.accuracy / 1000).toFixed(1)}km`}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Ambulance Tracking */}
          {isActiveTracking && (
            <div className="px-4 pt-4 space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Ambulance Progress</span>
                  <span className={cn("font-medium", statusConfig.color)}>
                    {ambulanceDistance.toFixed(1)} km away
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">ETA</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground mt-1">{eta} min</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Ambulance className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Unit</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground mt-1">{ambulanceId}</p>
                </div>
              </div>

              {/* Hospital Info */}
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex items-center gap-2">
                  <Hospital className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Dispatched from</span>
                </div>
                <p className="text-sm font-medium text-foreground mt-1">{nearestHospital}</p>
              </div>
            </div>
          )}

          {/* Arrived State */}
          {trackingStatus === "arrived" && (
            <div className="px-4 pt-4">
              <div className="p-4 bg-success/10 rounded-lg text-center">
                <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">
                  Ambulance {ambulanceId} has arrived
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Medical personnel are ready to assist you
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-4 mt-2">
            <Button
              variant={trackingStatus === "arrived" ? "default" : "outline"}
              onClick={() => {
                setShowTrackingDialog(false)
                if (trackingStatus === "arrived") {
                  setTrackingStatus("locating")
                  setLocation(null)
                  setAmbulanceDistance(5.2)
                  setEta(12)
                }
              }}
              className="w-full h-12"
            >
              {trackingStatus === "arrived" ? "Close" : "Cancel Request"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
