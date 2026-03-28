"use client"

import { useState } from "react"
import { Search, ExternalLink, ChevronRight, Shield, Heart, Leaf, Video, Baby } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import {
  healthSchemes,
  categoryLabels,
  categoryColors,
  type HealthScheme,
  type SchemeCategory
} from "@/lib/schemes-data"
import { cn } from "@/lib/utils"

const categoryIcons: Record<SchemeCategory, typeof Shield> = {
  insurance: Shield,
  maternal: Heart,
  rural: Leaf,
  telemedicine: Video,
  child: Baby
}

const allFilters: SchemeCategory[] = ["insurance", "maternal", "rural", "telemedicine", "child"]

interface GovernmentSchemesScreenProps {
  onViewSchemeDetails: (scheme: HealthScheme) => void
}

export function GovernmentSchemesScreen({ onViewSchemeDetails }: GovernmentSchemesScreenProps) {
  const { setCurrentScreen } = useAppStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<SchemeCategory[]>([])

  const toggleFilter = (filter: SchemeCategory) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    )
  }

  const filteredSchemes = healthSchemes.filter((scheme) => {
    const matchesSearch =
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      activeFilters.length === 0 ||
      scheme.categories.some((cat) => activeFilters.includes(cat))

    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="px-4 py-4">
          <h1 className="text-xl font-semibold text-foreground">Government Health Schemes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Explore healthcare programs available for you
          </p>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search schemes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-secondary/50"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="px-4 pb-4 flex gap-2 overflow-x-auto no-scrollbar">
          {allFilters.map((filter) => {
            const Icon = categoryIcons[filter]
            const isActive = activeFilters.includes(filter)
            return (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {categoryLabels[filter]}
              </button>
            )
          })}
        </div>
      </header>

      {/* Results */}
      <main className="px-4 py-4">
        <p className="text-sm text-muted-foreground mb-4">
          {filteredSchemes.length} scheme{filteredSchemes.length !== 1 ? "s" : ""} found
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              onViewDetails={() => onViewSchemeDetails(scheme)}
            />
          ))}
        </div>

        {filteredSchemes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No schemes found matching your criteria</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("")
                setActiveFilters([])
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

interface SchemeCardProps {
  scheme: HealthScheme
  onViewDetails: () => void
}

function SchemeCard({ scheme, onViewDetails }: SchemeCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {/* Categories */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {scheme.categories.map((cat) => {
            const colors = categoryColors[cat]
            return (
              <Badge
                key={cat}
                variant="secondary"
                className={cn("text-xs", colors.bg, colors.text)}
              >
                {categoryLabels[cat]}
              </Badge>
            )
          })}
        </div>

        {/* Title and Year */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-foreground leading-tight">
              {scheme.shortName}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {scheme.name}
            </p>
          </div>
          <Badge variant="outline" className="shrink-0 text-xs">
            Since {scheme.launchYear}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {scheme.description}
        </p>

        {/* Coverage Amount */}
        {scheme.coverageAmount && (
          <div className="bg-success/10 rounded-lg px-3 py-2 mb-3">
            <p className="text-xs text-muted-foreground">Coverage</p>
            <p className="text-sm font-semibold text-success">{scheme.coverageAmount}</p>
          </div>
        )}

        {/* Key Benefits Preview */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-1.5">Key Benefits:</p>
          <ul className="space-y-1">
            {scheme.benefits.slice(0, 2).map((benefit, i) => (
              <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                <span className="text-primary mt-0.5">•</span>
                <span className="line-clamp-1">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1 h-9"
            onClick={onViewDetails}
          >
            View Details
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => window.open(scheme.officialLink, "_blank")}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
