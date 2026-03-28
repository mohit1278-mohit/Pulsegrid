export type SchemeCategory = "insurance" | "maternal" | "rural" | "telemedicine" | "child"

export interface HealthScheme {
  id: string
  name: string
  shortName: string
  description: string
  fullDescription: string
  categories: SchemeCategory[]
  eligibility: string[]
  benefits: string[]
  howToApply: string[]
  requiredDocuments: string[]
  officialLink: string
  coverageAmount?: string
  launchYear: number
}

export const healthSchemes: HealthScheme[] = [
  {
    id: "ayushman-bharat",
    name: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana",
    shortName: "PM-JAY",
    description: "World's largest health insurance scheme providing coverage up to Rs. 5 lakh per family per year for secondary and tertiary care hospitalization.",
    fullDescription: "Ayushman Bharat PM-JAY is a flagship scheme of Government of India launched to achieve the vision of Universal Health Coverage. It is the world's largest health insurance scheme fully financed by the government. The scheme provides a health cover of Rs. 5 lakhs per family per year for secondary and tertiary care hospitalization to over 12 crore poor and vulnerable families. The benefits cover pre-hospitalization expenses, treatment, post-hospitalization expenses and transportation allowance.",
    categories: ["insurance"],
    eligibility: [
      "Families identified based on deprivation and occupational criteria from SECC 2011 data",
      "No restriction on family size, age, or gender",
      "Pre-existing diseases covered from day one",
      "Cover for hospitalization expenses including medicines and diagnostics"
    ],
    benefits: [
      "Coverage up to Rs. 5 lakh per family per year",
      "Covers 1,929 medical procedures",
      "Cashless and paperless treatment at empaneled hospitals",
      "Pre and post hospitalization expenses covered",
      "No cap on family size or members' age",
      "Transport allowance included"
    ],
    howToApply: [
      "Visit the nearest Common Service Centre (CSC) or empaneled hospital",
      "Check eligibility on pmjay.gov.in or mera.pmjay.gov.in",
      "Provide Aadhaar card or family member's Aadhaar for verification",
      "Get e-card generated after verification",
      "Use e-card at any empaneled hospital for cashless treatment"
    ],
    requiredDocuments: [
      "Aadhaar Card (any family member)",
      "Ration Card",
      "Mobile Number",
      "SECC 2011 data for verification",
      "Address Proof"
    ],
    officialLink: "https://pmjay.gov.in",
    coverageAmount: "Rs. 5 Lakh per family/year",
    launchYear: 2018
  },
  {
    id: "rsby",
    name: "Rashtriya Swasthya Bima Yojana",
    shortName: "RSBY",
    description: "Health insurance scheme for Below Poverty Line families providing cashless health insurance coverage.",
    fullDescription: "Rashtriya Swasthya Bima Yojana is a health insurance scheme for Indian citizens below the poverty line. The scheme provides smart card-based cashless health insurance cover of Rs.30,000 per family per annum on a family floater basis. This scheme has been merged with Ayushman Bharat but continues in some states as a complementary program.",
    categories: ["insurance"],
    eligibility: [
      "BPL families as per state government records",
      "Unorganized sector workers",
      "Domestic workers, street vendors, and construction workers",
      "Maximum 5 members per family"
    ],
    benefits: [
      "Hospitalization coverage up to Rs. 30,000 per family per year",
      "Pre-existing conditions covered",
      "Cashless treatment at empaneled hospitals",
      "Smart card for easy identification",
      "Transportation allowance of Rs. 100 per visit (max Rs. 1,000 per year)"
    ],
    howToApply: [
      "Visit nearest enrollment station with required documents",
      "Biometric data of family members will be captured",
      "Smart card will be issued on the spot",
      "Pay registration fee of Rs. 30"
    ],
    requiredDocuments: [
      "BPL Certificate or Card",
      "Address Proof",
      "Identity Proof",
      "Photographs of family members"
    ],
    officialLink: "https://www.india.gov.in/spotlight/rashtriya-swasthya-bima-yojana",
    coverageAmount: "Rs. 30,000 per family/year",
    launchYear: 2008
  },
  {
    id: "jsy",
    name: "Janani Suraksha Yojana",
    shortName: "JSY",
    description: "Safe motherhood intervention promoting institutional delivery among pregnant women from poor households.",
    fullDescription: "Janani Suraksha Yojana is a safe motherhood intervention under the National Health Mission. It aims to reduce maternal and neo-natal mortality by promoting institutional delivery among pregnant women, especially from Below Poverty Line households. The scheme provides cash assistance to eligible pregnant women for delivery and post-delivery care.",
    categories: ["maternal", "rural"],
    eligibility: [
      "All pregnant women in Low Performing States (LPS)",
      "BPL/SC/ST pregnant women in High Performing States (HPS)",
      "Women above 19 years of age",
      "Up to two live births"
    ],
    benefits: [
      "Cash assistance of Rs. 1,400 in rural areas (LPS)",
      "Cash assistance of Rs. 1,000 in urban areas (LPS)",
      "Cash assistance of Rs. 700 in rural areas (HPS for BPL/SC/ST)",
      "ASHA sahyogini receives Rs. 600 for facilitating delivery",
      "Free delivery services at government facilities"
    ],
    howToApply: [
      "Register at nearest government health facility or with ASHA worker",
      "Complete at least 3 antenatal check-ups",
      "Deliver at government or accredited private institution",
      "Submit required documents post-delivery for cash benefit"
    ],
    requiredDocuments: [
      "JSY Card (issued during registration)",
      "Aadhaar Card",
      "BPL Card (for HPS)",
      "Bank Account Details",
      "Discharge Summary from hospital"
    ],
    officialLink: "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=309",
    coverageAmount: "Rs. 700 - Rs. 1,400",
    launchYear: 2005
  },
  {
    id: "pmsma",
    name: "Pradhan Mantri Surakshit Matritva Abhiyan",
    shortName: "PMSMA",
    description: "Free antenatal care for pregnant women on the 9th of every month at government facilities.",
    fullDescription: "Pradhan Mantri Surakshit Matritva Abhiyan provides free quality antenatal care to pregnant women on a fixed day (9th of every month) at government health facilities. The program aims to improve quality and coverage of antenatal care, including investigations and drugs, to detect high-risk pregnancies and provide appropriate referral and treatment.",
    categories: ["maternal"],
    eligibility: [
      "All pregnant women",
      "Women in their 2nd/3rd trimester (4-9 months pregnant)",
      "No income or BPL restriction"
    ],
    benefits: [
      "Free comprehensive antenatal checkup",
      "Free ultrasound/sonography if required",
      "Free blood and urine tests",
      "Detection and management of high-risk pregnancies",
      "Iron, folic acid, and calcium supplements",
      "Counseling services"
    ],
    howToApply: [
      "Visit nearest government health facility on 9th of any month",
      "Carry pregnancy card if available",
      "No prior registration required",
      "Walk-in service available"
    ],
    requiredDocuments: [
      "Any ID proof (optional)",
      "Previous antenatal records if any",
      "No mandatory documents required"
    ],
    officialLink: "https://pmsma.nhp.gov.in",
    launchYear: 2016
  },
  {
    id: "nhm",
    name: "National Health Mission",
    shortName: "NHM",
    description: "Umbrella program providing accessible, affordable, and quality healthcare to rural and urban populations.",
    fullDescription: "The National Health Mission encompasses the National Rural Health Mission and National Urban Health Mission. It aims to provide accessible, affordable, and quality healthcare to the rural and urban population, especially the vulnerable groups. The mission focuses on strengthening health systems, infrastructure, and human resources while addressing social determinants of health.",
    categories: ["rural", "child"],
    eligibility: [
      "All citizens of India",
      "Focus on rural and urban poor",
      "Emphasis on women and children",
      "Special focus on underserved areas"
    ],
    benefits: [
      "Free treatment at public health facilities",
      "Free medicines and diagnostics",
      "Ambulance services (108/102)",
      "ASHA worker support at village level",
      "Immunization programs",
      "Maternal and child health services",
      "Disease control programs"
    ],
    howToApply: [
      "Visit nearest Primary Health Centre (PHC) or Community Health Centre (CHC)",
      "Avail services directly at government health facilities",
      "Contact ASHA worker in your area for guidance",
      "Call toll-free helpline 104"
    ],
    requiredDocuments: [
      "Any government ID (recommended)",
      "No mandatory documents for emergency services"
    ],
    officialLink: "https://nhm.gov.in",
    launchYear: 2013
  },
  {
    id: "esanjeevani",
    name: "eSanjeevani Telemedicine Service",
    shortName: "eSanjeevani",
    description: "Free telemedicine service enabling patients to consult doctors remotely via video conferencing.",
    fullDescription: "eSanjeevani is the national telemedicine service of India, enabling free online medical consultations. It operates in two modes: eSanjeevani AB-HWC for Health and Wellness Centres to connect with specialists, and eSanjeevani OPD for direct patient-to-doctor teleconsultations. This service has been crucial in providing healthcare access during the COVID-19 pandemic and continues to bridge the healthcare gap in remote areas.",
    categories: ["telemedicine", "rural"],
    eligibility: [
      "All citizens of India",
      "Anyone with internet access and a smartphone/computer",
      "Available across all states and union territories"
    ],
    benefits: [
      "Free doctor consultations",
      "No travel required",
      "Specialist consultations available",
      "E-prescription provided",
      "Follow-up consultations possible",
      "Available in multiple languages",
      "Secure and confidential"
    ],
    howToApply: [
      "Visit esanjeevaniopd.in",
      "Register with mobile number and basic details",
      "Book appointment with preferred doctor",
      "Join video consultation at scheduled time",
      "Receive e-prescription via SMS/email"
    ],
    requiredDocuments: [
      "Mobile number for registration",
      "Basic personal information",
      "Previous medical records (if any, optional)"
    ],
    officialLink: "https://esanjeevaniopd.in",
    launchYear: 2019
  }
]

export const categoryLabels: Record<SchemeCategory, string> = {
  insurance: "Insurance Schemes",
  maternal: "Maternal Health",
  rural: "Rural Healthcare",
  telemedicine: "Telemedicine",
  child: "Child Healthcare"
}

export const categoryColors: Record<SchemeCategory, { bg: string; text: string }> = {
  insurance: { bg: "bg-blue-100", text: "text-blue-700" },
  maternal: { bg: "bg-pink-100", text: "text-pink-700" },
  rural: { bg: "bg-green-100", text: "text-green-700" },
  telemedicine: { bg: "bg-purple-100", text: "text-purple-700" },
  child: { bg: "bg-amber-100", text: "text-amber-700" }
}
