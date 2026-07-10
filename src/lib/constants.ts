export const LANGUAGES = [
  "English",
  "isiZulu",
  "Afrikaans",
  "Sesotho",
  "isiXhosa",
] as const;

export const FUTURE_LANGUAGES = [
  "French",
  "Portuguese",
  "Spanish",
  "Arabic",
  "German",
  "Chinese (Simplified)",
  "Hindi",
  "Swahili",
];

export const WORKPLACE_PROFILES = [
  "Information Technology",
  "Education",
  "Healthcare",
  "Finance",
  "Human Resources",
  "Marketing",
  "Retail",
  "Legal",
  "Government",
  "Business",
  "Other",
] as const;

export const READING_LEVELS = ["Standard", "Simple English", "Beginner"] as const;

export const ACCEPTED_DOC_EXT = [
  ".pdf", ".doc", ".docx", ".txt", ".rtf", ".md",
  ".xls", ".xlsx", ".csv",
  ".ppt", ".pptx",
] as const;

export const ACCEPTED_IMAGE_EXT = [
  ".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".tiff", ".tif",
] as const;

export const TEXT_READABLE_EXT = [".txt", ".md", ".csv", ".rtf"] as const;

export const EMAIL_TONES = [
  "Professional",
  "Friendly",
  "Formal",
  "Persuasive",
  "Apologetic",
  "Assertive",
  "Empathetic",
] as const;

export const EMAIL_AUDIENCES = [
  "Colleague",
  "Manager",
  "Team Member",
  "Client",
  "Customer",
  "Supplier",
  "Vendor",
  "External Partner",
  "Business Partner",
  "Stakeholder",
  "Investor",
  "Recruiter",
  "HR Representative",
  "CEO",
  "Executive",
  "Department Head",
  "Teacher",
  "Lecturer",
  "Student",
  "Parent",
  "Healthcare Professional",
  "Patient",
  "Government Official",
  "Community Leader",
  "Other (Custom)",
];

export type ReadingLevel = (typeof READING_LEVELS)[number];
export type WorkplaceProfile = (typeof WORKPLACE_PROFILES)[number];