"use client"

import { useEffect, useRef, useState } from "react"
import { useAppStore } from "@/lib/store"
import { MapPin, Navigation, Ambulance, Bell, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Fallback public token for local dev test ONLY. In production, use NEXT_PUBLIC_MAPBOX_TOKEN
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

export function AmbulanceDriverScreen() {
  const { setCurrentScreen, upsertAmbulanceLocation, addHospitalNotification } = useAppStore()

  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const marker = useRef<mapboxgl.Marker | null>(null)

  // Starting point: Somewhere in Indore near Bombay Hospital
  const [position, setPosition] = useState({ lat: 22.7533, lng: 75.8937 })
  const [heading, setHeading] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)
  const [eta, setEta] = useState(15)

  // Initialize Map
  useEffect(() => {
    if (map.current || !mapContainer.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [position.lng, position.lat],
      zoom: 15,
      pitch: 45,
    })

    // Create custom ambulance marker element
    const el = document.createElement("div")
    el.className = "w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-red-500 overflow-hidden relative"
    const inner = document.createElement("div")
    inner.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10H6"/><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11h2"/><path d="M15 18H9"/><path d="M19 18h2a2 2 0 0 0 2-2v-3.6L20 8h-4.2l-2-2"/><path d="M2 11h20"/><circle cx="7.5" cy="18" r="1.5"/><circle cx="17.5" cy="18" r="1.5"/></svg>'
    el.appendChild(inner)

    marker.current = new mapboxgl.Marker({ element: el })
      .setLngLat([position.lng, position.lat])
      .addTo(map.current)

    // Add destination marker (Hospital)
    const destEl = document.createElement("div")
    destEl.className = "w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
    new mapboxgl.Marker({ element: destEl })
      .setLngLat([75.8997, 22.7600]) // Simulated destination slightly north-east
      .addTo(map.current)

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  // Simulate GPS progression logic
  useEffect(() => {
    if (!isNavigating) return

    const interval = setInterval(() => {
      setPosition(prev => {
        const newLat = prev.lat + 0.0001
        const newLng = prev.lng + 0.0001

        // Update Marker on map
        if (marker.current) {
          marker.current.setLngLat([newLng, newLat])
        }

        // Pan Map slightly
        if (map.current) {
          map.current.panTo([newLng, newLat], { duration: 1000 })
        }

        // Write pseudo-realtime update to store for Patient Tracking screen to pick up
        upsertAmbulanceLocation({
          id: "loc_1",
          ambulance_id: "amb_1",
          driver_id: "drv_1",
          latitude: newLat,
          longitude: newLng,
          speed_kmh: 40,
          heading_degrees: 45,
          accuracy_meters: 5,
          timestamp: new Date(),
          trip_id: "trip_1"
        })

        return { lat: newLat, lng: newLng }
      })

      setEta(prev => Math.max(0, prev - 1))

    }, 2000)

    return () => clearInterval(interval)
  }, [isNavigating, upsertAmbulanceLocation])

  const notifyHospital = (type: "arriving_5min" | "arriving_2min" | "arrived") => {
    addHospitalNotification({
      id: "notif_" + Date.now(),
      hospital_id: "1",
      trip_id: "trip_1",
      ambulance_id: "amb_1",
      driver_name: "Rajesh Kumar",
      message_type: type,
      patient_name: "Unknown Patient",
      patient_condition: "Critical",
      eta_minutes: type === "arriving_5min" ? 5 : type === "arriving_2min" ? 2 : 0,
      is_read: false,
      created_at: new Date()
    })

    // Simulate UI feedback toast logic directly here for scope simplicity
    alert(`Hospital notified: ${type.replace("_", " ")}`)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Map Container - fills remaining space above bottom sheet */}
      <div className="absolute inset-0 z-0">
        <div ref={mapContainer} className="w-full h-[65%]" />

        {/* Navigation Overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start">
          <Button variant="secondary" size="icon" className="rounded-full shadow-lg" onClick={() => setCurrentScreen("hospitals")}>
            <MapPin className="w-5 h-5" />
          </Button>

          {isNavigating && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              ETA: {eta} mins
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Interface Sheet */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-20 bg-card rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-muted rounded-full" />
        </div>

        <div className="p-5 overflow-y-auto max-h-[45vh] pb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Current Trip</h2>
              <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                Live Tracking Active
              </p>
            </div>
            <Button
              size="lg"
              className={`rounded-full shadow-lg ${isNavigating ? "bg-rose-500 hover:bg-rose-600 text-white" : "bg-emerald-500 hover:bg-emerald-600 text-white"}`}
              onClick={() => setIsNavigating(!isNavigating)}
            >
              {isNavigating ? "Stop" : "Start Navigation"}
            </Button>
          </div>

          <Card className="bg-secondary/50 border-border/50 mb-6">
            <CardContent className="p-4 py-3 pb-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-sm">Destination</p>
                  <p className="text-base font-bold text-foreground">Bombay Hospital Indore</p>
                </div>
                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Critical</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mt-2 pt-3 border-t">
                <div>
                  <p className="text-muted-foreground text-xs">Patient Type</p>
                  <p className="font-semibold mt-0.5">Cardiac Emergency</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Required Setup</p>
                  <p className="font-semibold mt-0.5">ICU + Cath Lab</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-3">Hospital Communications</h3>

          <div className="grid grid-cols-2 gap-3 space-y-0">
            <Button
              variant="outline"
              className="h-auto py-3 px-4 flex flex-col items-center justify-center gap-2 bg-card hover:bg-secondary/50 border-dashed border-2 hover:border-solid hover:border-emerald-500 transition-all"
              onClick={() => notifyHospital("arriving_5min")}
            >
              <Bell className="w-6 h-6 text-emerald-500" />
              <span className="text-xs font-semibold">5 Min Alert</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-3 px-4 flex flex-col items-center justify-center gap-2 bg-card hover:bg-secondary/50 border-dashed border-2 hover:border-solid hover:border-amber-500 transition-all"
              onClick={() => notifyHospital("arriving_2min")}
            >
              <Bell className="w-6 h-6 text-amber-500" />
              <span className="text-xs font-semibold">2 Min Final</span>
            </Button>

            <Button
              className="h-auto py-3 px-4 flex flex-col items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white col-span-2 shadow-sm"
              onClick={() => notifyHospital("arrived")}
            >
              <CheckCircle2 className="w-6 h-6" />
              <span className="text-sm font-bold">Mark Arrived at ER</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
