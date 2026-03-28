"use client"

import { useState, useEffect } from "react"
import { 
  Bed, 
  Wind, 
  Stethoscope, 
  Package, 
  TrendingUp,
  Activity,
  AlertCircle,
  Droplet
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function HospitalDashboard() {
  const { hospitalData, updateHospitalData, hospitalName, addNotification } = useAppStore()
  const [localData, setLocalData] = useState(hospitalData)
  const [hasChanges, setHasChanges] = useState(false)

  // Calculate load status
  const getLoadStatus = () => {
    const icuUsage = (15 - localData.icuBeds) / 15
    const ventUsage = (10 - localData.ventilators) / 10
    const avgUsage = (icuUsage + ventUsage) / 2

    if (avgUsage < 0.5) return { status: "stable", label: "Stable", color: "bg-success" }
    if (avgUsage < 0.8) return { status: "moderate", label: "Moderate", color: "bg-warning" }
    return { status: "critical", label: "Critical", color: "bg-emergency" }
  }

  const loadStatus = getLoadStatus()
  const loadPercentage = Math.round(((15 - localData.icuBeds) / 15 + (10 - localData.ventilators) / 10) / 2 * 100)

  const handleSliderChange = (key: keyof typeof localData, value: number[]) => {
    setLocalData({ ...localData, [key]: value[0] })
    setHasChanges(true)
  }

  const handleBloodChange = (group: keyof typeof localData.bloodAvailability, value: string) => {
    const numValue = parseInt(value) || 0;
    setLocalData({
      ...localData,
      bloodAvailability: {
        ...localData.bloodAvailability,
        [group]: Math.max(0, numValue)
      }
    })
    setHasChanges(true)
  }

  const handleSaveChanges = () => {
    updateHospitalData(localData)
    setHasChanges(false)
    
    // Simulate WebSocket update notification
    addNotification({
      type: "alert",
      title: "Resources Updated",
      message: "Hospital resource data has been synchronized",
      read: false,
    })
  }

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate minor fluctuations occasionally
      if (Math.random() > 0.9) {
        const keys = ["icuBeds", "ventilators", "specialists"] as const
        const randomKey = keys[Math.floor(Math.random() * keys.length)]
        const currentVal = localData[randomKey]
        const change = Math.random() > 0.5 ? 1 : -1
        const newVal = Math.max(0, Math.min(randomKey === "icuBeds" ? 15 : randomKey === "ventilators" ? 10 : 30, currentVal + change))
        
        if (newVal !== currentVal && !hasChanges) {
          setLocalData(prev => ({ ...prev, [randomKey]: newVal }))
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [localData, hasChanges])

  const resources = [
    {
      icon: Bed,
      label: "ICU Beds Available",
      value: localData.icuBeds,
      max: 15,
      key: "icuBeds" as const,
    },
    {
      icon: Wind,
      label: "Ventilators Available",
      value: localData.ventilators,
      max: 10,
      key: "ventilators" as const,
    },
    {
      icon: Stethoscope,
      label: "Specialist Doctors",
      value: localData.specialists,
      max: 30,
      key: "specialists" as const,
    },
    {
      icon: Package,
      label: "Equipment Status",
      value: localData.equipment,
      max: 100,
      key: "equipment" as const,
      isPercentage: true,
    },
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">{hospitalName || "Hospital Name"}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full animate-pulse", loadStatus.color)} />
              <span className="text-sm font-medium">{loadStatus.label}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-6 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {/* Load Status Card */}
            <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Hospital Load Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Capacity</span>
                <Badge 
                  className={cn(
                    loadStatus.status === "stable" && "bg-success text-success-foreground",
                    loadStatus.status === "moderate" && "bg-warning text-warning-foreground",
                    loadStatus.status === "critical" && "bg-emergency text-emergency-foreground"
                  )}
                >
                  {loadPercentage}% Used
                </Badge>
              </div>
              <Progress 
                value={loadPercentage} 
                className={cn(
                  "h-3",
                  loadStatus.status === "stable" && "[&>div]:bg-success",
                  loadStatus.status === "moderate" && "[&>div]:bg-warning",
                  loadStatus.status === "critical" && "[&>div]:bg-emergency"
                )}
              />
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  <span>Stable (0-50%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-warning" />
                  <span>Moderate (50-80%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emergency" />
                  <span>Critical (80%+)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs">Today</span>
              </div>
              <p className="text-2xl font-bold">24</p>
              <p className="text-xs text-muted-foreground">Patients Admitted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs">Pending</span>
              </div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-muted-foreground">Resource Requests</p>
            </CardContent>
          </Card>
        </div>
        </div>

        <div className="lg:col-span-2">
        {/* Resource Management */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Resource Management</CardTitle>
              {hasChanges && (
                <Badge variant="outline" className="text-xs">
                  Unsaved Changes
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {resources.map((resource) => {
              const Icon = resource.icon
              const percentage = (resource.value / resource.max) * 100
              
              return (
                <div key={resource.key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium text-sm">{resource.label}</span>
                    </div>
                    <span className="font-semibold">
                      {resource.value}
                      {resource.isPercentage ? "%" : `/${resource.max}`}
                    </span>
                  </div>
                  <Slider
                    value={[resource.value]}
                    max={resource.max}
                    step={1}
                    onValueChange={(value) => handleSliderChange(resource.key, value)}
                    className="py-2"
                  />
                </div>
              )
            })}

            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Droplet className="w-4 h-4 text-red-500" />
                </div>
                <span className="font-semibold text-sm">Blood Availability (Units)</span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(localData.bloodAvailability).map(([group, units]) => (
                  <div key={group} className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">{group}</Label>
                    <Input
                      type="number"
                      min="0"
                      className="h-9"
                      value={units}
                      onChange={(e) => handleBloodChange(group as keyof typeof localData.bloodAvailability, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleSaveChanges} 
              className="w-full h-12"
              disabled={!hasChanges}
            >
              {hasChanges ? "Save Changes" : "Resources Up to Date"}
            </Button>
          </CardContent>
        </Card>
        </div>
        </div>
      </main>
    </div>
  )
}
