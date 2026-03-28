"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { HomeScreen } from "./home-screen"
import { PatientDashboard } from "./patient-dashboard"
import { HospitalLogin } from "./hospital-login"
import { HospitalDashboard } from "./hospital-dashboard"
import { ResourceRequests } from "./resource-requests"
import { NotificationsScreen } from "./notifications-screen"
import { SettingsScreen } from "./settings-screen"
import { TopNavigation } from "./top-navigation"
import { SOSButton } from "./sos-button"
import { GovernmentSchemesScreen } from "./government-schemes-screen"
import { SchemeDetailsScreen } from "./scheme-details-screen"
import { HospitalDetailScreen } from "./hospital-detail-screen"
import { AmbulanceDriverScreen } from "./ambulance-driver-screen"
import { PatientTrackScreen } from "./patient-track-screen"
import { type HealthScheme } from "@/lib/schemes-data"

export function PulseGridApp() {
  const { currentScreen, setCurrentScreen, userRole } = useAppStore()
  const [selectedScheme, setSelectedScheme] = useState<HealthScheme | null>(null)

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomeScreen />
      
      // Patient screens
      case "dashboard":
        return <PatientDashboard />
      case "hospitals":
        return <PatientDashboard />
      case "hospital-detail":
        return <HospitalDetailScreen />
      case "ambulance-driver":
        return <AmbulanceDriverScreen />
      case "patient-track":
        return <PatientTrackScreen />
      
      // Hospital screens
      case "hospital-login":
        return <HospitalLogin />
      case "hospital-dashboard":
        return <HospitalDashboard />
      case "resource-requests":
        return <ResourceRequests />
      
      // Government Schemes
      case "schemes":
        return (
          <GovernmentSchemesScreen 
            onViewSchemeDetails={(scheme) => {
              setSelectedScheme(scheme)
              setCurrentScreen("scheme-details")
            }}
          />
        )
      case "scheme-details":
        return selectedScheme ? (
          <SchemeDetailsScreen 
            scheme={selectedScheme} 
            onBack={() => setCurrentScreen("schemes")} 
          />
        ) : (
          <GovernmentSchemesScreen 
            onViewSchemeDetails={(scheme) => {
              setSelectedScheme(scheme)
              setCurrentScreen("scheme-details")
            }}
          />
        )
      
      // Shared screens
      case "notifications":
        return <NotificationsScreen />
      case "settings":
        return <SettingsScreen />
      
      default:
        return <HomeScreen />
    }
  }

  const showNavigation = userRole !== null && currentScreen !== "home" && currentScreen !== "hospital-login"

  return (
    <div className="min-h-screen bg-background relative w-full pt-16">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, scale: 0.98, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.02, y: -5 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="h-full w-full max-w-7xl mx-auto"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
      
      {showNavigation && <TopNavigation />}
      {userRole === "patient" && currentScreen !== "home" && <SOSButton />}
    </div>
  )
}
