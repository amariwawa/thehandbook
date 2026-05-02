import { 
  Calculator, 
  Atom, 
  Microscope, 
  Languages, 
  Gavel, 
  FlaskConical,
  BookText,
  Palette,
  Briefcase,
  Cpu,
  Globe,
  Music,
  Zap,
  GraduationCap,
  Users,
  BookOpen,
  Sprout,
  PenTool,
  ChefHat,
  History,
  Flag,
  BarChart3,
  Layout,
  Megaphone,
  Keyboard,
  Construction,
  Wrench,
  Hammer,
  Drill,
  Book
} from "lucide-react";

export const categories = [
  { id: 'science', name: 'Science', icon: Zap, color: 'bg-blue-50 text-blue-600' },
  { id: 'arts', name: 'Arts', icon: GraduationCap, color: 'bg-purple-50 text-purple-600' },
  { id: 'commercial', name: 'Commercial', icon: Users, color: 'bg-emerald-50 text-emerald-600' },
  { id: 'technical', name: 'Technical', icon: BookOpen, color: 'bg-orange-50 text-orange-600' },
];

export const exams = {
  waec: {
    title: "WAEC",
    subtitle: "West African Senior School Certificate Examination",
    description: "Access curated past questions from 2010 to 2024 for all senior secondary subjects.",
  },
  jamb: {
    title: "JAMB",
    subtitle: "Unified Tertiary Matriculation Examination",
    description: "Prepare with full CBT simulations and AI-driven performance analytics.",
  },
  bece: {
    title: "BECE",
    subtitle: "Basic Education Certification Examination",
    description: "Junior Secondary preparation focusing on core foundational knowledge.",
  }
};

export const subjects = {
  "waec": {
    "science": [
      { "id": "biology", "name": "Biology", "image": "/subjects/biology_v2.png" },
      { "id": "chemistry", "name": "Chemistry", "image": "/subjects/chemistry_v2.png" },
      { "id": "physics", "name": "Physics", "image": "/subjects/physics_v2.png" },
      { "id": "mathematics", "name": "Mathematics", "image": "/subjects/mathematics_v2.png" },
      { "id": "english", "name": "English Language", "image": "/subjects/english_v2.png" },
      { "id": "literature", "name": "Literature in English", "image": "/subjects/literature_v2.png" },
      { "id": "agric-science", "name": "Agricultural Science", "image": "/subjects/agric_v2.png" },
      { "id": "further-maths", "name": "Further Mathematics", "image": "/subjects/further_maths_v2.png" },
      { "id": "computer-science", "name": "Computer Science", "image": "/subjects/computer_science_v2.png" },
      { "id": "technical-drawing", "name": "Technical Drawing", "image": "https://images.unsplash.com/photo-1503387762-592dea58ef21?auto=format&fit=crop&w=400&q=80" },
      { "id": "geography", "name": "Geography", "image": "/subjects/geography_v2.png" },
      { "id": "food-nutrition", "name": "Food & Nutrition", "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" },
      { "id": "agricultural-science", "name": "AGRICULTURAL SCIENCE", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "animal-husbandry-alt-a", "name": "ANIMAL HUSBANDRY (ALT A)", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "animal-husbandry-alt-b", "name": "ANIMAL HUSBANDRY (ALT B)", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "crop-husbandry-and-horticulture", "name": "CROP HUSBANDRY AND HORTICULTURE", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "fisheries-alt-a", "name": "FISHERIES (ALT A)", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "fisheries-alt-b", "name": "FISHERIES (ALT B)", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "forestry", "name": "FORESTRY", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "further-mathematics-or-mathematics-elective", "name": "FURTHER MATHEMATICS OR MATHEMATICS (ELECTIVE)", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "general-agriculture", "name": "GENERAL AGRICULTURE", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "general-mathematics-or-mathematics-core", "name": "GENERAL MATHEMATICS OR MATHEMATICS (CORE)", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "health-education-or-health-science", "name": "HEALTH EDUCATION OR HEALTH SCIENCE", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "integrated-science", "name": "INTEGRATED SCIENCE", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "mining", "name": "MINING", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "physical-education", "name": "PHYSICAL EDUCATION", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" }
    ],
    "commercial": [
      { "id": "economics", "name": "Economics", "image": "/subjects/economics_v2.png" },
      { "id": "commerce", "name": "Commerce", "image": "/subjects/commerce_v2.png" },
      { "id": "accounting", "name": "Accounting", "image": "/subjects/accounting_v2.png" },
      { "id": "auto-parts-merchandising", "name": "AUTO PARTS MERCHANDISING", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "book-keeping", "name": "BOOK KEEPING", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "business-management", "name": "BUSINESS MANAGEMENT", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "clerical-office-duties", "name": "CLERICAL OFFICE DUTIES", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "data-processing", "name": "DATA PROCESSING", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "financial-accounting", "name": "FINANCIAL ACCOUNTING", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "financial-accounts", "name": "FINANCIAL ACCOUNTS", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "insurance", "name": "INSURANCE", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "marketing", "name": "MARKETING", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "office-practice", "name": "OFFICE PRACTICE", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "principles-of-cost-accounting", "name": "PRINCIPLES OF COST ACCOUNTING", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "salesmanship", "name": "SALESMANSHIP", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "shorthand", "name": "SHORTHAND", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "store-keeping", "name": "STORE KEEPING", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "store-management", "name": "STORE MANAGEMENT", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "tourism", "name": "TOURISM", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "typewriting", "name": "TYPEWRITING", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" }
    ],
    "arts": [
      { "id": "government", "name": "Government", "image": "/subjects/government_v2.png" },
      { "id": "history", "name": "History", "image": "/subjects/history_v2.png" },
      { "id": "crs", "name": "Christian Religious Studies (CRS)", "image": "https://images.unsplash.com/photo-1510480683064-1c6bd2069502?auto=format&fit=crop&w=400&q=80" },
      { "id": "basketry", "name": "BASKETRY", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "ceramics", "name": "CERAMICS", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "christian-religious-studies-new", "name": "CHRISTIAN RELIGIOUS STUDIES (NEW)", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "civic-education", "name": "CIVIC EDUCATION", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "clothing-and-textiles", "name": "CLOTHING AND TEXTILES", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "dyeing-bleaching", "name": "DYEING & BLEACHING", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "edo", "name": "EDO", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "efik", "name": "EFIK", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "english-language", "name": "ENGLISH LANGUAGE", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "french", "name": "FRENCH", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "general-knowledge-in-art", "name": "GENERAL KNOWLEDGE IN ART", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "ghanaian-languages", "name": "GHANAIAN LANGUAGES", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "graphic-design", "name": "GRAPHIC DESIGN", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "hausa", "name": "HAUSA", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "home-management", "name": "HOME MANAGEMENT", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "ibibio", "name": "IBIBIO", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "igbo", "name": "IGBO", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "islamic-religious-studies", "name": "ISLAMIC RELIGIOUS STUDIES", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "jewellery", "name": "JEWELLERY", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "leather-goods", "name": "LEATHER GOODS", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "leatherwork", "name": "LEATHERWORK", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "literature-in-english", "name": "LITERATURE IN ENGLISH", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "music", "name": "MUSIC", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "photography", "name": "PHOTOGRAPHY", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "picture-making", "name": "PICTURE MAKING", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "sculpture", "name": "SCULPTURE", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "social-studies-new", "name": "SOCIAL STUDIES (NEW)", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "textiles", "name": "TEXTILES", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "visual-art", "name": "VISUAL ART", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "west-african-traditional-religion", "name": "WEST AFRICAN TRADITIONAL RELIGION", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "arabic", "name": "ARABIC", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "yoruba", "name": "YORUBA", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" }
    ],
    "technical": [
      { "id": "basic-electronics", "name": "Basic Electronics", "image": "https://images.unsplash.com/photo-1517420812314-8b17179f59f9?auto=format&fit=crop&w=400&q=80" },
      { "id": "building-construction", "name": "Building Construction", "image": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80" },
      { "id": "auto-mechanics", "name": "Auto Mechanics", "image": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=400&q=80" },
      { "id": "woodwork", "name": "Woodwork", "image": "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=400&q=80" },
      { "id": "metalwork", "name": "Metalwork", "image": "https://images.unsplash.com/photo-1504917595217-d4dc5f669741?auto=format&fit=crop&w=400&q=80" },
      { "id": "electrical-installation", "name": "Electrical Installation", "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80" },
      { "id": "welding-fabrication", "name": "Welding & Fabrication", "image": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=400&q=80" },
      { "id": "computer-craft", "name": "Computer Craft Studies", "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80" },
      { "id": "applied-electricity", "name": "APPLIED ELECTRICITY", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "auto-body-repairs-and-spray-painting", "name": "AUTO BODY REPAIRS AND SPRAY PAINTING", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "auto-electrical-work", "name": "AUTO ELECTRICAL WORK", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "auto-mechanical-work", "name": "AUTO MECHANICAL WORK", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "blocklaying-bricklaying-and-concreting", "name": "BLOCKLAYING BRICKLAYING AND CONCRETING", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "capentry-and-joinery", "name": "CAPENTRY AND JOINERY", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "catering-craft-practice", "name": "CATERING CRAFT PRACTICE", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "cosmetology", "name": "COSMETOLOGY", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "electrical-installation-and-maintenance-work", "name": "ELECTRICAL INSTALLATION AND MAINTENANCE WORK", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "electronics-or-basic-electronics", "name": "ELECTRONICS OR BASIC ELECTRONICS", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "foods-and-nutrition", "name": "FOODS AND NUTRITION", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "furniture-making", "name": "FURNITURE MAKING", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "garment-making", "name": "GARMENT MAKING", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "gsm-phones-maintenance-and-repairs", "name": "GSM PHONES MAINTENANCE AND REPAIRS", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "information-and-communication-technology-core", "name": "INFORMATION AND COMMUNICATION TECHNOLOGY (CORE)", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "information-and-communication-technology-elective", "name": "INFORMATION AND COMMUNICATION TECHNOLOGY (ELECTIVE)", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "machine-woodworking", "name": "MACHINE WOODWORKING", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "painting-and-decorating", "name": "PAINTING AND DECORATING", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "plumbing-and-pipe-fitting", "name": "PLUMBING AND PIPE FITTING", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "printing-craft-practice", "name": "PRINTING CRAFT PRACTICE", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "radio-television-and-electronics-works", "name": "RADIO TELEVISION AND ELECTRONICS WORKS", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "refrigeration-and-air-conditioning", "name": "REFRIGERATION AND AIR CONDITIONING", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "technical-drawing", "name": "TECHNICAL DRAWING", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "upholstery", "name": "UPHOLSTERY", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
      { "id": "welding-and-fabrication-engineering-craft-practice", "name": "WELDING AND FABRICATION ENGINEERING CRAFT PRACTICE", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" }
    ]
  },
  "jamb": [
    { "id": "agriculture", "name": "Agriculture", "image": "/subjects/agric_v2.png" },
    { "id": "art", "name": "Art", "image": "/subjects/visual_art_v2.png" },
    { "id": "arabic", "name": "Arabic", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
    { "id": "biology", "name": "Biology", "image": "/subjects/biology_v2.png" },
    { "id": "chemistry", "name": "Chemistry", "image": "/subjects/chemistry_v2.png" },
    { "id": "computer-studies", "name": "Computer Studies", "image": "/subjects/computer_science_v2.png" },
    { "id": "commerce", "name": "Commerce", "image": "/subjects/commerce_v2.png" },
    { "id": "crs", "name": "CRS", "image": "https://images.unsplash.com/photo-1510480683064-1c6bd2069502?auto=format&fit=crop&w=400&q=80" },
    { "id": "economics", "name": "Economics", "image": "/subjects/economics_v2.png" },
    { "id": "french", "name": "French", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
    { "id": "geography", "name": "Geography", "image": "/subjects/geography_v2.png" },
    { "id": "government", "name": "Government", "image": "/subjects/government_v2.png" },
    { "id": "hausa", "name": "Hausa", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
    { "id": "history", "name": "History", "image": "/subjects/history_v2.png" },
    { "id": "home-economics", "name": "Home Economics", "image": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80" },
    { "id": "igbo", "name": "IGBO", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
    { "id": "islamic-studies", "name": "Islamic Studies", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
    { "id": "literature", "name": "Literature", "image": "/subjects/literature_v2.png" },
    { "id": "mathematics", "name": "Mathematics", "image": "/subjects/mathematics_v2.png" },
    { "id": "music", "name": "Music", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" },
    { "id": "physical-health-education-phe", "name": "Physical & Health Education (PHE)", "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80" },
    { "id": "physics", "name": "Physics", "image": "/subjects/physics_v2.png" },
    { "id": "principles-of-account", "name": "Principles of Account", "image": "/subjects/accounting_v2.png" },
    { "id": "use-of-english", "name": "Use of English", "image": "/subjects/english_v2.png" },
    { "id": "yoruba", "name": "Yoruba", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" }
  ],
  "bece": [
    { "id": "basic-science", "name": "Basic Science", "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80" },
    { "id": "basic-technology", "name": "Basic Technology", "image": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80" },
    { "id": "business-studies", "name": "Business Studies", "image": "https://images.unsplash.com/photo-1454165833767-027ffea7025c?auto=format&fit=crop&w=400&q=80" },
    { "id": "social-studies", "name": "Social Studies", "image": "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=400&q=80" },
    { "id": "home-economics", "name": "Home Economics", "image": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80" },
    { "id": "cultural-creative-arts", "name": "Cultural & Creative Arts", "image": "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=400&q=80" },
    { "id": "physical-health-education", "name": "Physical & Health Education", "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80" },
    { "id": "computer-studies", "name": "Computer Studies", "image": "/subjects/computer_science_v2.png" },
    { "id": "mathematics", "name": "Mathematics", "image": "/subjects/mathematics_v2.png" },
    { "id": "english-language", "name": "English Language", "image": "/subjects/english_v2.png" }
  ]
};

export const topics = {
  biology: ["Introduction to Biology", "Advanced Biology"],
  chemistry: ["Introduction to Chemistry", "Structure of the Atom", "Standard Separation Techniques", "Periodic Chemistry", "Chemical Bonds", "Stoichiometry and Chemical Reactions", "States of Matter", "Energy and Energy Changes", "Acids, Bases, and Salts", "Chemical Kinetics and Equilibrium", "Redox Reactions", "Chemistry of Carbon Compounds", "Non-Metals and their Compounds", "Metals and their Compounds"],
  physics: ["Concepts of Matter", "Quantities and Units", "Kinematics", "Dynamics", "Fluids and Equilibrium", "Circular and Periodic Motion", "Scalars and Vectors", "Mechanical Energy", "Heat Energy", "Wave Mechanics", "Light Waves", "Sound Waves", "Force Fields", "Current Electricity", "Electromagnetism", "Simple A.C. Circuits", "Atomic and Nuclear Physics", "Quantum Mechanics and Electronics"],
  mathematics: ["Introduction to Mathematics", "Advanced Mathematics"],
  english: ["Introduction to English", "Advanced English"],
  "use-of-english": ["Introduction to English", "Advanced English"],
  literature: ["Introduction to Literature", "Advanced Literature"],
  economics: ["Introduction to Economics", "Advanced Economics"],
  government: ["Introduction to Government", "Advanced Government"],
  geography: ["Maps and Map Work", "Statistical Methods and Diagrams", "Elementary Surveying", "Geographic Information System (GIS)", "The Earth and the Solar System", "Rocks and Landform Development", "Denudational Processes", "Water Bodies and Climate", "Soils and Vegetation", "Population and Settlement", "Economic Activities", "Geography of Nigeria", "Regional Geography of West Africa", "Selected Topics on World Geography"],
  "agric-science": ["Introduction to Agriculture", "Advanced Agriculture"],
  agriculture: ["Introduction to Agriculture", "Advanced Agriculture"],
  "civic-education": ["Values", "Citizenship and Nationalism", "Human Rights", "Law and Order", "Responsible Parenthood", "Traffic Regulations", "Inter-Personal and Inter-Communal Relationships", "Cultism", "Drugs and Drug Abuse", "Human Trafficking", "HIV/AIDS", "Youth Empowerment", "Structure and Functions of Government", "Democracy, Rule of Law and National Development", "Political Apathy", "Civil Society and Popular Participation", "Public Service in Democracy"],
  "further-maths": ["Sets and Logic", "Algebraic Structures and Surds", "Functions and Polynomials", "Indices, Logarithms, and Series", "Matrices and Trigonometry", "Coordinate Geometry", "Calculus", "Statistics", "Probability", "Vectors", "Statics", "Dynamics"],
  "further-mathematics-or-mathematics-elective": ["Sets and Logic", "Algebraic Structures and Surds", "Functions and Polynomials", "Indices, Logarithms, and Series", "Matrices and Trigonometry", "Coordinate Geometry", "Calculus", "Statistics", "Probability", "Vectors", "Statics", "Dynamics"],
  "basic-science": ["Introduction to Basic Science", "Advanced Basic Science"],
  "basic-technology": ["Introduction to Basic Technology", "Advanced Basic Technology"],
  "business-studies": ["Introduction to Business Studies", "Advanced Business Studies"],
  "computer-studies": ["Introduction to Computer Studies", "Advanced Computer Studies"],
  "home-economics": ["Introduction to Home Economics", "Advanced Home Economics"],
  "physical-health-education": ["Introduction to PHE", "Advanced PHE"],
  "social-studies": ["Introduction to Social Studies", "Advanced Social Studies"],
  "cultural-creative-arts": ["Introduction to CCA", "Advanced CCA"],
  "commerce": ["Introduction to Commerce", "Advanced Commerce"],
  "principles-of-account": ["Introduction to Principles of Account", "Advanced Principles of Account"],
  "crs": ["Introduction to CRS", "Advanced CRS"],
  "islamic-studies": ["Introduction to Islamic Studies", "Advanced Islamic Studies"],
  "history": ["Introduction to History", "Advanced History"],
  "art": ["Introduction to Art", "Advanced Art"]
};

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  topic?: string;
}

export const mockQuestions: Record<string, Question[]> = {
  physics: [
    {
      id: 1,
      topic: "Waves",
      question: "Which of the following phenomena cannot be explained by the wave theory of light?",
      options: ["Reflection", "Refraction", "Interference", "Photoelectric Effect"],
      correctAnswer: "Photoelectric Effect",
      explanation: "The photoelectric effect demonstrates the particle nature of light (photons), whereas reflection, refraction, and interference are wave-like behaviors."
    },
    {
      id: 2,
      topic: "Optics",
      question: "A converging lens of focal length 15cm forms a virtual image at 30cm from the lens. The object distance is?",
      options: ["10cm", "15cm", "20cm", "30cm"],
      correctAnswer: "10cm",
      explanation: "Using 1/f = 1/u + 1/v. For virtual image, v is negative. 1/15 = 1/u - 1/30 => 1/u = 1/15 + 1/30 = 3/30 = 1/10. So u = 10cm."
    },
    {
      id: 3,
      topic: "Nuclear Physics",
      question: "The process by which a heavy nucleus splits into two lighter nuclei is called?",
      options: ["Nuclear Fusion", "Nuclear Fission", "Radioactive Decay", "Ionization"],
      correctAnswer: "Nuclear Fission",
      explanation: "Nuclear fission is the splitting of a heavy nucleus into lighter ones, releasing energy. Fusion is the opposite (combining lighter nuclei)."
    }
  ],
  mathematics: [
    {
      id: 1,
      topic: "Algebra",
      question: "If 3^(2x+1) = 27, find the value of x.",
      options: ["1", "2", "3", "4"],
      correctAnswer: "1",
      explanation: "27 can be written as 3^3. So 3^(2x+1) = 3^3. Equating powers: 2x + 1 = 3 => 2x = 2 => x = 1."
    },
    {
      id: 2,
      topic: "Statistics",
      question: "The mean of 5 numbers is 12. If a sixth number is added, the new mean becomes 13. What is the sixth number?",
      options: ["13", "15", "18", "21"],
      correctAnswer: "18",
      explanation: "Sum of 5 numbers = 5 * 12 = 60. Sum of 6 numbers = 6 * 13 = 78. Sixth number = 78 - 60 = 18."
    },
    {
      id: 3,
      topic: "Calculus & Trig",
      question: "Evaluate ∫(2x + 3)dx.",
      options: ["x² + 3x + c", "2x² + 3x + c", "x² + c", "3x + c"],
      correctAnswer: "x² + 3x + c",
      explanation: "Integration adds 1 to the power and divides by the new power: ∫2x dx = x², and ∫3 dx = 3x. Adding the constant of integration 'c'."
    }
  ],
  biology: [
    {
      id: 1,
      topic: "Genetics",
      question: "A man with blood group A (heterozygous) marries a woman with blood group O. What is the probability of them having a child with blood group O?",
      options: ["0%", "25%", "50%", "100%"],
      correctAnswer: "50%",
      explanation: "A (heterozygous) is AO, O is OO. Cross: AO x OO -> AO, AO, OO, OO. 2 out of 4 (50%) are group O."
    },
    {
      id: 2,
      topic: "Animal Nutrition",
      question: "Which of the following enzymes is responsible for the digestion of protein in the stomach?",
      options: ["Amylase", "Pepsin", "Lipase", "Trypsin"],
      correctAnswer: "Pepsin",
      explanation: "Pepsin is secreted in the stomach (as pepsinogen) and works in acidic conditions to break down proteins into peptides."
    },
    {
      id: 3,
      topic: "Cell Biology",
      question: "Which of these is absent in an animal cell?",
      options: ["Cell membrane", "Cytoplasm", "Cell Wall", "Nucleus"],
      correctAnswer: "Cell Wall",
      explanation: "Animal cells have a cell membrane but lack the rigid cell wall found in plant cells and bacteria."
    }
  ],
  chemistry: [
    {
      id: 1,
      topic: "Stoichiometry",
      question: "What volume of 0.5M HCl is required to neutralize 25cm³ of 0.2M NaOH?",
      options: ["10cm³", "12.5cm³", "25cm³", "50cm³"],
      correctAnswer: "10cm³",
      explanation: "Using C1V1 = C2V2: 0.5 * V1 = 0.2 * 25 => 0.5V1 = 5 => V1 = 5 / 0.5 = 10cm³."
    },
    {
      id: 2,
      topic: "Chemical Bonding",
      question: "Which type of bond is formed by the complete transfer of electrons from a metal to a non-metal?",
      options: ["Covalent", "Ionic", "Metallic", "Dative"],
      correctAnswer: "Ionic",
      explanation: "Ionic bonds (electrovalent) occur when one atom loses electrons and another gains them, resulting in electrostatic attraction between ions."
    },
    {
      id: 3,
      topic: "Atomic Structure",
      question: "The horizontal rows of the periodic table are called?",
      options: ["Groups", "Periods", "Families", "Series"],
      correctAnswer: "Periods",
      explanation: "Horizontal rows are periods (1-7), while vertical columns are groups (1-18)."
    }
  ],
  english: [
    {
      id: 1,
      topic: "Grammar",
      question: "Choose the option that best completes the sentence: Neither the students nor their teacher ___ present at the seminar yesterday.",
      options: ["was", "were", "is", "are"],
      correctAnswer: "was",
      explanation: "In 'neither...nor' constructions, the verb agrees with the closer subject. 'Their teacher' is singular, so 'was' is used for past tense."
    },
    {
      id: 2,
      topic: "Vocabulary",
      question: "Choose the word nearest in meaning to the underlined word: The witness gave a **candid** account of the accident.",
      options: ["False", "Honest", "Biased", "Vague"],
      correctAnswer: "Honest",
      explanation: "'Candid' means truthful, straightforward, or honest."
    }
  ],
  economics: [
    {
      id: 1,
      topic: "Market Structures",
      question: "In which market structure are there many sellers but the products are differentiated?",
      options: ["Perfect Competition", "Monopoly", "Monopolistic Competition", "Oligopoly"],
      correctAnswer: "Monopolistic Competition",
      explanation: "Monopolistic competition features many firms selling products that are similar but not identical (differentiated)."
    },
    {
      id: 2,
      topic: "Public Finance",
      question: "A tax that takes a higher percentage of income from high-income earners is called a:",
      options: ["Proportional tax", "Regressive tax", "Progressive tax", "Indirect tax"],
      correctAnswer: "Progressive tax",
      explanation: "A progressive tax increases the tax rate as the taxable amount increases."
    }
  ],
  government: [
    {
      id: 1,
      topic: "Constitutional Development",
      question: "The first elective principle in Nigeria was introduced by which constitution?",
      options: ["Clifford Constitution of 1922", "Richards Constitution of 1946", "Macpherson Constitution of 1951", "Lyttelton Constitution of 1954"],
      correctAnswer: "Clifford Constitution of 1922",
      explanation: "The Clifford Constitution of 1922 introduced the elective principle for the first time in Nigeria for 4 seats in Lagos and Calabar."
    }
  ],
  literature: [
    {
      id: 1,
      topic: "Figurative Language",
      question: "'The sun smiled down on us' is an example of which literary device?",
      options: ["Metaphor", "Simile", "Personification", "Hyperbole"],
      correctAnswer: "Personification",
      explanation: "Personification gives human qualities (smiling) to non-human things (the sun)."
    }
  ],
  geography: [
    {
      id: 1,
      topic: "Physical Geography",
      question: "Which of the following is a sedimentary rock?",
      options: ["Granite", "Basalt", "Limestone", "Gneiss"],
      correctAnswer: "Limestone",
      explanation: "Limestone is formed by the accumulation of organic remains or chemical precipitation, making it sedimentary."
    }
  ],
  "agric-science": [
    {
      id: 1,
      topic: "Soil Science",
      question: "The process of wearing away of the topsoil by water or wind is known as:",
      options: ["Weathering", "Erosion", "Leaching", "Irrigation"],
      correctAnswer: "Erosion",
      explanation: "Soil erosion is the displacement of the upper layer of soil."
    }
  ],
  "civic-education": [
    {
      id: 1,
      topic: "Political Systems",
      question: "The arm of government responsible for interpreting the law is the:",
      options: ["Executive", "Legislature", "Judiciary", "Press"],
      correctAnswer: "Judiciary",
      explanation: "The Judiciary interprets the laws and ensures justice is served based on the constitution."
    }
  ]
};
