"use client"

import { useEffect, useRef, useState } from "react"
import { useAppStore } from "@/lib/store"
import { ChevronLeft, Phone, MapPin, AlertCircle, Share2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

export function PatientTrackScreen() {
  const { setCurrentScreen, ambulanceLocations, hospitalNotifications } = useAppStore()

  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const marker = useRef<mapboxgl.Marker | null>(null)

  const [eta, setEta] = useState(15)

  // Get the most recent location for our mock ambulance "amb_1"
  const currentLocation = ambulanceLocations.find(l => l.ambulance_id === "amb_1")

  // Get latest notification
  const latestNotif = hospitalNotifications[0]

  useEffect(() => {
    if (map.current || !mapContainer.current || !currentLocation) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [currentLocation.longitude, currentLocation.latitude],
      zoom: 14,
      pitch: 30,
    })

    const el = document.createElement("div")
    el.className = "w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-red-500 relative transition-transform duration-1000"
    const inner = document.createElement("div")
    inner.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10H6"/><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11h2"/><path d="M15 18H9"/><path d="M19 18h2a2 2 0 0 0 2-2v-3.6L20 8h-4.2l-2-2"/><path d="M2 11h20"/><circle cx="7.5" cy="18" r="1.5"/><circle cx="17.5" cy="18" r="1.5"/></svg>'
    el.appendChild(inner)

    // Add pulsing circle behind marker
    const pulse = document.createElement("div")
    pulse.className = "absolute inset-0 rounded-full bg-red-500 animate-ping opacity-40 -z-10"
    el.appendChild(pulse)

    marker.current = new mapboxgl.Marker({ element: el })
      .setLngLat([currentLocation.longitude, currentLocation.latitude])
      .addTo(map.current)

    // Patient House Pin
    const homeEl = document.createElement("div")
    homeEl.className = "w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
    new mapboxgl.Marker({ element: homeEl })
      .setLngLat([75.8950, 22.7550])
      .addTo(map.current)

    // Fit bounds roughly
    const bounds = new mapboxgl.LngLatBounds()
    bounds.extend([currentLocation.longitude, currentLocation.latitude])
    bounds.extend([75.8950, 22.7550])
    map.current.fitBounds(bounds, { padding: 50, duration: 2000 })

  }, [currentLocation])

  // Watch for location changes to trigger map movements
  useEffect(() => {
    if (!currentLocation || !marker.current || !map.current) return

    marker.current.setLngLat([currentLocation.longitude, currentLocation.latitude])

    // Decrease ETA roughly based on pseudo speed
    setEta(prev => Math.max(1, prev - 1))

    // Smoothly pan camera keeping both ambulance and destination somewhat in view
    const bounds = new mapboxgl.LngLatBounds()
    bounds.extend([currentLocation.longitude, currentLocation.latitude])
    bounds.extend([75.8950, 22.7550]) // Destination
    map.current.fitBounds(bounds, { padding: 50, maxZoom: 16, linear: false, speed: 0.5 })

  }, [currentLocation])

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div ref={mapContainer} className="w-full h-[60%]" />
      </div>

      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 pt-6 bg-gradient-to-b from-background/90 to-transparent flex justify-between items-center">
        <Button variant="secondary" size="icon" className="rounded-full shadow-lg backdrop-blur bg-background/80" onClick={() => setCurrentScreen("hospitals")}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Badge variant="outline" className="bg-background/90 backdrop-blur border-border py-1 px-3 shadow-lg flex gap-2 items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live GPS
        </Badge>
      </div>

      {/* Dynamic Notification Toast */}
      <AnimatePresence>
        {latestNotif && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            key={latestNotif.id}
            className="absolute top-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-20 bg-emerald-500 text-white p-3 rounded-lg shadow-xl shadow-emerald-500/20 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Status Update</p>
              <p className="text-sm text-emerald-50">
                Ambulance is {latestNotif.message_type.replace("_", " ")} to the location.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Interface Sheet */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-20 bg-card rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t flex flex-col pt-3 pb-8 px-5">
        <div className="self-center w-12 h-1.5 bg-muted rounded-full mb-6" />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-red-500 flex items-baseline gap-1">
              {eta} <span className="text-base font-medium text-muted-foreground mr-1">mins</span>
            </h2>
            <p className="text-sm font-semibold text-foreground mt-1">Estimated Arrival Time</p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <Badge variant="secondary" className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
              Critical Priority
            </Badge>
            <p className="text-xs text-muted-foreground">Trip ID: #TRP-8921</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 relative">
          <div className="absolute top-1.5 left-0 right-0 h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-red-500"
              initial={{ width: "30%" }}
              animate={{ width: eta < 5 ? "80%" : "50%" }}
              transition={{ duration: 1 }}
            />
          </div>
          <div className="flex justify-between relative mt-4">
            <div className="flex flex-col items-center">
              <span className="w-4 h-4 rounded-full bg-red-500 border-4 border-background -mt-[22px] shadow-sm z-10" />
              <span className="text-[10px] font-bold mt-2 text-foreground">Dispatched</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-4 h-4 rounded-full bg-red-500 border-4 border-background -mt-[22px] shadow-sm z-10" />
              <span className="text-[10px] font-bold mt-2 text-foreground">On the way</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-4 h-4 rounded-full bg-muted border-4 border-background -mt-[22px] shadow-sm z-10" />
              <span className="text-[10px] font-bold mt-2 text-muted-foreground">Arrived</span>
            </div>
          </div>
        </div>

        <Card className="bg-secondary/50 border-border/50 shadow-none mb-6">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center shrink-0">
                <span className="font-bold text-cyan-700 dark:text-cyan-400">RK</span>
              </div>
              <div>
                <p className="font-semibold text-sm">Rajesh Kumar</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-0.5 text-foreground font-medium"><Star className="w-3 h-3 fill-yellow-500 text-yellow-500 text-xs" /> 4.9</span>
                  <span>•</span>
                  <span>ALS Ambulance (MP09-TA-4321)</span>
                </div>
              </div>
            </div>
            <Button size="icon" className="rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-sm shrink-0">
              <Phone className="w-4 h-4 text-white" />
            </Button>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 w-full bg-card shadow-sm" onClick={() => alert("Sharing link...")}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Tracking
          </Button>
        </div>
      </div>
    </div>
  )
}
