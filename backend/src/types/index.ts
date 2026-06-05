export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export type MailTemplate = Record<
  string,
  {
    subject: string;
    html: string;
  }
>;

export type RegisterBody = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  gender: string;
};
export type LoginBody = {
  email: string;
  password: string;
  totpToken: string | any;
};

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuditLogEntry {
  action: string;
  entity: string;
  entityId: string;
  userId: string;
  details?: Record<string, any>;
}

export type { TestUser } from "./testUser";
export { testUser } from "./testUser";

// ─── Portfolio Types ───────────────────────────────────────────────────────────

export type ExperienceType =
  | "FULL_TIME"
  | "PART_TIME"
  | "INTERNSHIP"
  | "FREELANCE"
  | "CONTRACT";

export type Proficiency = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";

export type UpsertProfileBody = {
  headline?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
};

export type CreateEducationBody = {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  grade?: string;
  description?: string;
  logoUrl?: string;
};
export type UpdateEducationBody = Partial<CreateEducationBody>;

export type CreateExperienceBody = {
  company: string;
  role: string;
  type?: ExperienceType;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
  logoUrl?: string;
  companyUrl?: string;
};
export type UpdateExperienceBody = Partial<CreateExperienceBody>;

export type CreateProjectBody = {
  title: string;
  description?: string;
  techStack?: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  isFeatured?: boolean;
  startDate?: string;
  endDate?: string;
};
export type UpdateProjectBody = Partial<CreateProjectBody>;

export type CreateHackathonBody = {
  name: string;
  organizer?: string;
  position?: string;
  description?: string;
  date?: string;
  teamSize?: number;
  projectUrl?: string;
  certificateUrl?: string;
  award?: string;
};
export type UpdateHackathonBody = Partial<CreateHackathonBody>;

export type CreateSkillBody = {
  name: string;
  category: string;
  proficiency?: Proficiency;
  iconUrl?: string;
};
export type UpdateSkillBody = Partial<CreateSkillBody>;

export type CreateCertificationBody = {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  logoUrl?: string;
};
export type UpdateCertificationBody = Partial<CreateCertificationBody>;

export type CreateAchievementBody = {
  title: string;
  description?: string;
  date?: string;
  url?: string;
  icon?: string;
};
export type UpdateAchievementBody = Partial<CreateAchievementBody>;
