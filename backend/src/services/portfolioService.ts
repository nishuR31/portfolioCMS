import {
  AchievementRepository,
  CertificationRepository,
  EducationRepository,
  ExperienceRepository,
  HackathonRepository,
  ProfileRepository,
  ProjectRepository,
  SkillRepository,
} from "../repositories/portfolioRepository.js";
import UserRepository from "../repositories/userRepository.js";
import {
  CreateAchievementBody,
  CreateCertificationBody,
  CreateEducationBody,
  CreateExperienceBody,
  CreateHackathonBody,
  CreateProjectBody,
  CreateSkillBody,
  UpdateAchievementBody,
  UpdateCertificationBody,
  UpdateEducationBody,
  UpdateExperienceBody,
  UpdateHackathonBody,
  UpdateProjectBody,
  UpdateSkillBody,
  UpsertProfileBody,
} from "../types/index.js";
import { ForbiddenError, NotFoundError } from "../utils/errors/error.js";

// ─── Repos (singletons per service instance) ─────────────────────────────────

const userRepo = new UserRepository();
const profileRepo = new ProfileRepository();
const educationRepo = new EducationRepository();
const experienceRepo = new ExperienceRepository();
const projectRepo = new ProjectRepository();
const hackathonRepo = new HackathonRepository();
const skillRepo = new SkillRepository();
const certRepo = new CertificationRepository();
const achievementRepo = new AchievementRepository();

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Parse ISO date strings to Date objects for Prisma */
function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (isNaN(d.getTime())) return undefined;
  return d;
}

/** Throw 403 if the resource doesn't belong to the requesting user */
function assertOwnership(resourceUserId: string, requestingUserId: string) {
  if (resourceUserId !== requestingUserId) {
    throw new ForbiddenError("You do not have permission to modify this resource.");
  }
}

// ─── Service ──────────────────────────────────────────────────────────────────

export default class PortfolioService {
  // ── Public ─────────────────────────────────────────────────────────────────

  /** Returns the full portfolio for any user by their ID (public read) */
  async getFullPortfolio(userId: string) {
    const user = await userRepo.findById(userId);
    const { password, refreshToken, totpSecret, ...publicUser } = user;

    const [profile, education, experience, projects, hackathons, skills, certifications, achievements] =
      await Promise.all([
        profileRepo.findByUserId(userId),
        educationRepo.findAllByUserId(userId),
        experienceRepo.findAllByUserId(userId),
        projectRepo.findAllByUserId(userId),
        hackathonRepo.findAllByUserId(userId),
        skillRepo.findAllByUserId(userId),
        certRepo.findAllByUserId(userId),
        achievementRepo.findAllByUserId(userId),
      ]);

    return {
      user: publicUser,
      profile,
      education,
      experience,
      projects,
      hackathons,
      skills,
      certifications,
      achievements,
    };
  }

  // ── Profile ────────────────────────────────────────────────────────────────

  async getProfile(userId: string) {
    return profileRepo.findByUserId(userId);
  }

  async upsertProfile(userId: string, data: UpsertProfileBody) {
    return profileRepo.upsert(userId, data);
  }

  // ── Education ──────────────────────────────────────────────────────────────

  async getAllEducation(userId: string) {
    return educationRepo.findAllByUserId(userId);
  }

  async createEducation(userId: string, data: CreateEducationBody) {
    return educationRepo.create({
      ...data,
      userId,
      startDate: new Date(data.startDate),
      endDate: parseDate(data.endDate),
    });
  }

  async updateEducation(userId: string, id: string, data: UpdateEducationBody) {
    const record = await educationRepo.findById(id);
    assertOwnership(record.userId, userId);
    return educationRepo.update(id, {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: parseDate(data.endDate),
    });
  }

  async deleteEducation(userId: string, id: string) {
    const record = await educationRepo.findById(id);
    assertOwnership(record.userId, userId);
    return educationRepo.delete(id);
  }

  // ── Experience ─────────────────────────────────────────────────────────────

  async getAllExperience(userId: string) {
    return experienceRepo.findAllByUserId(userId);
  }

  async createExperience(userId: string, data: CreateExperienceBody) {
    return experienceRepo.create({
      ...data,
      userId,
      startDate: new Date(data.startDate),
      endDate: parseDate(data.endDate),
    });
  }

  async updateExperience(userId: string, id: string, data: UpdateExperienceBody) {
    const record = await experienceRepo.findById(id);
    assertOwnership(record.userId, userId);
    return experienceRepo.update(id, {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: parseDate(data.endDate),
    });
  }

  async deleteExperience(userId: string, id: string) {
    const record = await experienceRepo.findById(id);
    assertOwnership(record.userId, userId);
    return experienceRepo.delete(id);
  }

  // ── Projects ───────────────────────────────────────────────────────────────

  async getAllProjects(userId: string) {
    return projectRepo.findAllByUserId(userId);
  }

  async getFeaturedProjects(userId: string) {
    return projectRepo.findFeaturedByUserId(userId);
  }

  async createProject(userId: string, data: CreateProjectBody) {
    return projectRepo.create({
      ...data,
      userId,
      startDate: parseDate(data.startDate),
      endDate: parseDate(data.endDate),
    });
  }

  async updateProject(userId: string, id: string, data: UpdateProjectBody) {
    const record = await projectRepo.findById(id);
    assertOwnership(record.userId, userId);
    return projectRepo.update(id, {
      ...data,
      startDate: parseDate(data.startDate),
      endDate: parseDate(data.endDate),
    });
  }

  async deleteProject(userId: string, id: string) {
    const record = await projectRepo.findById(id);
    assertOwnership(record.userId, userId);
    return projectRepo.delete(id);
  }

  // ── Hackathons ─────────────────────────────────────────────────────────────

  async getAllHackathons(userId: string) {
    return hackathonRepo.findAllByUserId(userId);
  }

  async createHackathon(userId: string, data: CreateHackathonBody) {
    return hackathonRepo.create({
      ...data,
      userId,
      date: parseDate(data.date),
    });
  }

  async updateHackathon(userId: string, id: string, data: UpdateHackathonBody) {
    const record = await hackathonRepo.findById(id);
    assertOwnership(record.userId, userId);
    return hackathonRepo.update(id, {
      ...data,
      date: parseDate(data.date),
    });
  }

  async deleteHackathon(userId: string, id: string) {
    const record = await hackathonRepo.findById(id);
    assertOwnership(record.userId, userId);
    return hackathonRepo.delete(id);
  }

  // ── Skills ─────────────────────────────────────────────────────────────────

  async getAllSkills(userId: string) {
    return skillRepo.findAllByUserId(userId);
  }

  async getSkillsByCategory(userId: string, category: string) {
    return skillRepo.findByCategory(userId, category);
  }

  async createSkill(userId: string, data: CreateSkillBody) {
    return skillRepo.create({ ...data, userId });
  }

  async updateSkill(userId: string, id: string, data: UpdateSkillBody) {
    const record = await skillRepo.findById(id);
    assertOwnership(record.userId, userId);
    return skillRepo.update(id, data);
  }

  async deleteSkill(userId: string, id: string) {
    const record = await skillRepo.findById(id);
    assertOwnership(record.userId, userId);
    return skillRepo.delete(id);
  }

  // ── Certifications ─────────────────────────────────────────────────────────

  async getAllCertifications(userId: string) {
    return certRepo.findAllByUserId(userId);
  }

  async createCertification(userId: string, data: CreateCertificationBody) {
    return certRepo.create({
      ...data,
      userId,
      issueDate: new Date(data.issueDate),
      expiryDate: parseDate(data.expiryDate),
    });
  }

  async updateCertification(userId: string, id: string, data: UpdateCertificationBody) {
    const record = await certRepo.findById(id);
    assertOwnership(record.userId, userId);
    return certRepo.update(id, {
      ...data,
      issueDate: data.issueDate ? new Date(data.issueDate) : undefined,
      expiryDate: parseDate(data.expiryDate),
    });
  }

  async deleteCertification(userId: string, id: string) {
    const record = await certRepo.findById(id);
    assertOwnership(record.userId, userId);
    return certRepo.delete(id);
  }

  // ── Achievements ───────────────────────────────────────────────────────────

  async getAllAchievements(userId: string) {
    return achievementRepo.findAllByUserId(userId);
  }

  async createAchievement(userId: string, data: CreateAchievementBody) {
    return achievementRepo.create({
      ...data,
      userId,
      date: parseDate(data.date),
    });
  }

  async updateAchievement(userId: string, id: string, data: UpdateAchievementBody) {
    const record = await achievementRepo.findById(id);
    assertOwnership(record.userId, userId);
    return achievementRepo.update(id, {
      ...data,
      date: parseDate(data.date),
    });
  }

  async deleteAchievement(userId: string, id: string) {
    const record = await achievementRepo.findById(id);
    assertOwnership(record.userId, userId);
    return achievementRepo.delete(id);
  }
}
