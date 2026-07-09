export const LANGUAGES = [
  "English",
  "isiZulu",
  "isiXhosa",
  "Sesotho",
  "Setswana",
  "Sepedi",
  "Xitsonga",
  "Tshivenda",
  "siSwati",
  "isiNdebele",
  "Afrikaans",
  "French",
  "Portuguese",
  "Spanish",
  "German",
  "Arabic",
  "Hindi",
  "Swahili",
  "Mandarin Chinese",
  "Japanese",
  "Korean",
] as const;

export const FUTURE_LANGUAGES = [
  "Italian",
  "Dutch",
  "Russian",
  "Turkish",
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
  "Client",
  "Team",
  "External Partner",
  "Customer",
  "Vendor",
];

export type ReadingLevel = (typeof READING_LEVELS)[number];
export type WorkplaceProfile = (typeof WORKPLACE_PROFILES)[number];