"use client"

import { useAppStore } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, ChevronDown, CheckCircle2, Info, Phone, ExternalLink, IndianRupee } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Props {
  hospitalId: string
}

export function GovernmentSchemesSection({ hospitalId }: Props) {
  const { hospitalSchemes } = useAppStore()
  const hs = hospitalSchemes.filter(s => s.hospital_id === hospitalId && s.accepted)
  
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (hs.length === 0) return null

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5 text-indigo-500" />
        <h2 className="text-lg font-bold">Government Schemes</h2>
        <Badge variant="outline" className="ml-auto bg-indigo-50/50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">
          {hs.length} Accepted
        </Badge>
      </div>

      <div className="space-y-3">
        {hs.map((scheme, idx) => {
          const isExpanded = expandedId === scheme.id

          return (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`border rounded-xl bg-card overflow-hidden transition-all duration-300 ${
                isExpanded ? "ring-1 ring-indigo-500 shadow-md" : "hover:border-border/80 shadow-sm"
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : scheme.id)}
                className="w-full text-left p-4 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="font-bold text-base truncate">{scheme.scheme_name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {scheme.scheme_full_name}
                  </p>
                </div>
                
                <div className="shrink-0 flex items-center justify-center h-10 w-8">
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isExpanded ? "rotate-180 text-foreground" : ""}`} />
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-2 border-t border-border/50 bg-secondary/20 space-y-4">
                      {/* Coverage Box */}
                      <div className="bg-background rounded-lg p-3 border border-border/50">
                        <div className="flex items-center gap-2 mb-1">
                          <IndianRupee className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold text-sm">Coverage Details</span>
                        </div>
                        <p className="text-sm text-muted-foreground pl-6">
                          {scheme.coverage_description}
                        </p>
                      </div>

                      {/* Eligibility Box */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="w-4 h-4 text-cyan-600" />
                          <span className="font-semibold text-sm">Eligibility</span>
                        </div>
                        <p className="text-sm text-foreground/80 pl-6 leading-relaxed">
                          {scheme.eligibility_details}
                        </p>
                      </div>

                      {/* Procedures */}
                      <div>
                        <span className="font-semibold text-sm block mb-2">Covered Categories:</span>
                        <div className="flex flex-wrap gap-2">
                          {scheme.procedure_categories.map((cat) => (
                            <Badge key={cat} variant="secondary" className="bg-secondary">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-2">
                        <Button 
                          variant="outline" 
                          className="flex-1 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-indigo-800 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-300"
                          onClick={() => window.open(`tel:${scheme.helpline}`)}
                        >
                          <Phone className="w-4 h-4 mr-2" /> Call Helpline
                        </Button>
                        <Button 
                          variant="secondary" 
                          className="flex-1"
                          onClick={() => window.open(scheme.website_url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" /> Official Site
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
