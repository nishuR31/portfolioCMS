import BaseRepository from "./baseRepository.js";
import type {
  Profile,
  Education,
  Experience,
  Project,
  Hackathon,
  Skill,
  Certification,
  Achievement,
} from "../generated/prisma/client.js";

// ─── Profile ──────────────────────────────────────────────────────────────────

export class ProfileRepository extends BaseRepository<Profile> {
  constructor() {
    super("profile");
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    return this.findOne({ id: userId });
  }

  async upsert(userId: string, data: Partial<Profile>): Promise<Profile> {
    const existing = await this.findByUserId(userId);
    if (existing) {
      return this.update(existing.id, data);
    }
    return this.create({ ...data, userId });
  }
}

// ─── Education ────────────────────────────────────────────────────────────────

export class EducationRepository extends BaseRepository<Education> {
  constructor() {
    super("education");
  }

  async findAllByUserId(userId: string): Promise<Education[]> {
    return this.findAll({ where: { id: userId }, orderBy: { startDate: "desc" } });
  }
}

// ─── Experience ───────────────────────────────────────────────────────────────

export class ExperienceRepository extends BaseRepository<Experience> {
  constructor() {
    super("experience");
  }

  async findAllByUserId(userId: string): Promise<Experience[]> {
    return this.findAll({ where: { id: userId }, orderBy: { startDate: "desc" } });
  }
}

// ─── Project ──────────────────────────────────────────────────────────────────

export class ProjectRepository extends BaseRepository<Project> {
  constructor() {
    super("project");
  }

  async findAllByUserId(userId: string): Promise<Project[]> {
    return this.findAll({ where: { id: userId }, orderBy: { createdAt: "desc" } });
  }

  async findFeaturedByUserId(userId: string): Promise<Project[]> {
    return this.findAll({
      where: { id: userId, isFeatured: true },
      orderBy: { createdAt: "desc" },
    });
  }
}

// ─── Hackathon ────────────────────────────────────────────────────────────────

export class HackathonRepository extends BaseRepository<Hackathon> {
  constructor() {
    super("hackathon");
  }

  async findAllByUserId(userId: string): Promise<Hackathon[]> {
    return this.findAll({ where: { id: userId }, orderBy: { date: "desc" } });
  }
}

// ─── Skill ────────────────────────────────────────────────────────────────────

export class SkillRepository extends BaseRepository<Skill> {
  constructor() {
    super("skill");
  }

  async findAllByUserId(userId: string): Promise<Skill[]> {
    return this.findAll({ where: { id: userId }, orderBy: { category: "asc" } });
  }

  async findByCategory(userId: string, category: string): Promise<Skill[]> {
    return this.findAll({ where: { id: userId, category } });
  }
}

// ─── Certification ────────────────────────────────────────────────────────────

export class CertificationRepository extends BaseRepository<Certification> {
  constructor() {
    super("certification");
  }

  async findAllByUserId(userId: string): Promise<Certification[]> {
    return this.findAll({ where: { id: userId }, orderBy: { issueDate: "desc" } });
  }
}

// ─── Achievement ──────────────────────────────────────────────────────────────

export class AchievementRepository extends BaseRepository<Achievement> {
  constructor() {
    super("achievement");
  }

  async findAllByUserId(userId: string): Promise<Achievement[]> {
    return this.findAll({ where: { id: userId }, orderBy: { date: "desc" } });
  }
}
