"use client"

import { useAppStore } from "@/lib/store"
import { motion } from "framer-motion"
import { Star, Clock, CheckCircle2, UserRound, UsersRound } from "lucide-react"

interface Props {
  hospitalId: string
}

export function DoctorProfilesSection({ hospitalId }: Props) {
  const { doctors } = useAppStore()
  
  // Simulated relational fetch
  const hospitalDoctors = doctors.filter(d => d.hospital_id === hospitalId)

  if (hospitalDoctors.length === 0) return null

  const availabilityColors = {
    available: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    on_call: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    off: "text-rose-500 bg-rose-500/10 border-rose-500/20"
  }

  const availabilityText = {
    available: "Available Now",
    on_call: "On Call",
    off: "Off Duty"
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold">Medical Team</h2>
          <p className="text-sm text-muted-foreground">{hospitalDoctors.length} Specialists</p>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory hide-scrollbar">
        <div className="flex gap-4">
          {hospitalDoctors.map((doc, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="snap-start shrink-0 w-[280px] bg-card border rounded-xl overflow-hidden shadow-sm flex flex-col"
            >
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shrink-0">
                    <UserRound className="w-6 h-6" />
                  </div>
                  <div className={`px-2 py-1 flex items-center gap-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${availabilityColors[doc.availability]}`}>
                    {doc.availability === "available" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse relative"><span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" /></span>}
                    {doc.availability === "on_call" && <Clock className="w-3 h-3" />}
                    {doc.availability === "off" && <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                    {availabilityText[doc.availability]}
                  </div>
                </div>
                
                <h3 className="font-bold text-base line-clamp-1">{doc.name}</h3>
                <p className="text-cyan-600 dark:text-cyan-400 text-sm font-medium mb-1">{doc.specialty}</p>
                
                <p className="text-xs text-muted-foreground line-clamp-1 mb-3">
                  {doc.qualifications.join(", ")}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-foreground">{doc.rating}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <UsersRound className="w-3.5 h-3.5" />
                    <span>{(doc.patients_treated / 1000).toFixed(1)}k+ patients</span>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-3 bg-secondary/50 border-t flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">{doc.experience_years} Yrs Exp.</span>
                <button className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">View Profile</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  )
}
