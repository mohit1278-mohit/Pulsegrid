"use client"

import { MapPin, Bed, Wind, Stethoscope, Package, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Hospital } from "@/lib/store"
import { cn } from "@/lib/utils"

interface HospitalCardProps {
  hospital: Hospital & { calculatedDistance?: number }
  onViewDetails: () => void
  onNavigate: () => void
}

export function HospitalCard({ hospital, onViewDetails, onNavigate }: HospitalCardProps) {
  const displayDistance = hospital.calculatedDistance ?? hospital.distance
  const statusConfig = {
    stable: { label: "Stable", className: "bg-success text-success-foreground" },
    moderate: { label: "Moderate", className: "bg-warning text-warning-foreground" },
    critical: { label: "Critical", className: "bg-emergency text-emergency-foreground" },
  }

  const status = statusConfig[hospital.loadStatus]

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {hospital.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{hospital.distance} km away</span>
            </div>
          </div>
          <Badge className={cn("shrink-0 ml-2", status.className)}>
            {status.label}
          </Badge>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary">
            <Bed className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">ICU Beds</p>
              <p className="font-semibold text-sm">
                {hospital.icuBeds}/{hospital.icuBedsTotal}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary">
            <Wind className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Ventilators</p>
              <p className="font-semibold text-sm">
                {hospital.ventilators}/{hospital.ventilatorsTotal}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary">
            <Stethoscope className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Specialists</p>
              <p className="font-semibold text-sm">{hospital.specialists}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary">
            <Package className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Equipment</p>
              <p className="font-semibold text-sm">{hospital.equipment}%</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 h-11"
            onClick={onViewDetails}
          >
            View Details
          </Button>
          <Button 
            className="flex-1 h-11 gap-2"
            onClick={onNavigate}
          >
            <Navigation className="w-4 h-4" />
            Navigate
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
