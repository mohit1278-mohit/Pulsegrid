"use client"

import { useState } from "react"
import { Building, Award, CheckCircle2, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import type { Hospital } from "@/lib/store"
import { Badge } from "@/components/ui/badge"

interface Props {
  hospital: Hospital
}

export function HospitalDescriptionSection({ hospital }: Props) {
  const [expanded, setExpanded] = useState(false)

  // Fallback defaults if not provided to avoid breaking UI on generic hospitals
  const description = hospital.description || "A premier healthcare facility dedicated to comprehensive medical care."
  const paragraphs = description.split("\n\n")
  const PreviewText = paragraphs.slice(0, 2).join("\n\n")
  const RestText = paragraphs.slice(2).join("\n\n")

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 overflow-hidden border-border/50">
      <CardContent className="p-5 space-y-5">
        <div>
          <h2 className="text-2xl font-bold font-heading tracking-tight mb-3">
            About {hospital.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {hospital.founded_year && (
              <Badge variant="secondary" className="bg-secondary/50 flex gap-1 items-center">
                <Building className="w-3.5 h-3.5" /> Est. {hospital.founded_year}
              </Badge>
            )}
            {hospital.total_beds && (
              <Badge variant="secondary" className="bg-secondary/50 flex gap-1 items-center">
                <BedIcon className="w-3.5 h-3.5" /> {hospital.total_beds} Beds
              </Badge>
            )}
            <Badge variant="secondary" className="bg-secondary/50 flex gap-1 items-center">
              <Award className="w-3.5 h-3.5" /> NABH Accredited
            </Badge>
          </div>
        </div>

        <div className="relative text-sm text-foreground/80 leading-relaxed font-medium">
          <p className="whitespace-pre-wrap">{PreviewText}</p>
          
          <AnimatePresence>
            {expanded && RestText && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="whitespace-pre-wrap mt-4">{RestText}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {RestText && (
            <button 
              onClick={() => setExpanded(!expanded)}
              className="group mt-2 text-cyan-500 font-semibold flex items-center gap-1 hover:text-cyan-400 transition-colors"
            >
              {expanded ? "Read less" : "Read more"}
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>

        {hospital.specialties_list && hospital.specialties_list.length > 0 && (
          <div className="pt-2">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-3">Key Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {hospital.specialties_list.map((spec) => (
                <div key={spec} className="px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold border border-cyan-500/20">
                  {spec}
                </div>
              ))}
            </div>
          </div>
        )}

        {hospital.accreditations && hospital.accreditations.length > 0 && (
          <div className="pt-2">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-3">Accreditations</h3>
            <div className="flex flex-wrap gap-2">
              {hospital.accreditations.map((acc) => (
                <div key={acc} className="flex items-center gap-1.5 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {acc}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function BedIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>
    </svg>
  )
}
