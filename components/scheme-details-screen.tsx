"use client"

import { ArrowLeft, ExternalLink, CheckCircle2, FileText, ClipboardList, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  type HealthScheme,
  categoryLabels,
  categoryColors
} from "@/lib/schemes-data"
import { cn } from "@/lib/utils"

interface SchemeDetailsScreenProps {
  scheme: HealthScheme
  onBack: () => void
}

export function SchemeDetailsScreen({ scheme, onBack }: SchemeDetailsScreenProps) {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="flex items-center gap-3 px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-foreground truncate">
              {scheme.shortName}
            </h1>
            <p className="text-xs text-muted-foreground truncate">
              {scheme.name}
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 space-y-6 max-w-4xl mx-auto w-full">
        {/* Categories and Year */}
        <div className="flex flex-wrap items-center gap-2">
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
          <Badge variant="outline" className="text-xs">
            Launched {scheme.launchYear}
          </Badge>
        </div>

        {/* Coverage Amount Banner */}
        {scheme.coverageAmount && (
          <div className="bg-gradient-to-r from-success/20 to-success/5 rounded-xl p-4 border border-success/20">
            <p className="text-sm text-muted-foreground">Coverage Amount</p>
            <p className="text-2xl font-bold text-success">{scheme.coverageAmount}</p>
          </div>
        )}

        {/* Full Description */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">About This Scheme</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {scheme.fullDescription}
            </p>
          </CardContent>
        </Card>

        {/* Eligibility */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Eligibility Criteria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {scheme.eligibility.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {scheme.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* How to Apply */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-primary" />
              How to Apply
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {scheme.howToApply.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Required Documents */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Required Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {scheme.requiredDocuments.map((doc, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-muted-foreground">{doc}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            className="w-full h-12"
            onClick={() => window.open(scheme.officialLink, "_blank")}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Visit Official Website
          </Button>

          <Button
            variant="outline"
            className="w-full h-12"
            onClick={() => window.open("tel:104", "_self")}
          >
            <Phone className="w-4 h-4 mr-2" />
            Call Health Helpline (104)
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center px-4">
          Information provided is for reference only. Please verify details on the official government portal.
        </p>
      </main>
    </div>
  )
}
