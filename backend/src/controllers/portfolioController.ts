import { FastifyReply, FastifyRequest } from "fastify";
import asyncHandler from "../utils/common/asyncHandler.js";
import { sendSuccess } from "../utils/common/response.js";
import { STATUS_CODES } from "../utils/common/constants.js";
import PortfolioService from "../services/portfolioService.js";
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

const svc = new PortfolioService();

// ─── Helper types ─────────────────────────────────────────────────────────────

type IdParam = FastifyRequest<{ Params: { id?: string } }>;
type UsernameParam = FastifyRequest<{ Params: { username?: string } }>;

// ─── Public full-portfolio ────────────────────────────────────────────────────

/** GET /api/v1/portfolio/user/:userId — public */
export const getFullPortfolio = asyncHandler(
  async (req: UsernameParam, res: FastifyReply) => {
    const data = await svc.getFullPortfolio(req.params.username!);
    sendSuccess(res, "Portfolio fetched successfully", data, STATUS_CODES.OK);
  },
);

// ─── Profile ──────────────────────────────────────────────────────────────────

/** GET /api/v1/portfolio/user/:userId/profile — public */
export const getProfile = asyncHandler(
  async (req: UsernameParam, res: FastifyReply) => {
    const data = await svc.getProfile(req.params.username!);
    sendSuccess(res, "Profile fetched", data, STATUS_CODES.OK);
  },
);

/** PUT /api/v1/portfolio/profile — authenticated */
export const upsertProfile = asyncHandler(
  async (req: FastifyRequest<{ Body: UpsertProfileBody }>, res: FastifyReply) => {
    const data = await svc.upsertProfile(req.user!.id!, req.body);
    sendSuccess(res, "Profile updated", data, STATUS_CODES.OK);
  },
);

// ─── Education ────────────────────────────────────────────────────────────────

/** GET /api/v1/portfolio/user/:userId/education — public */
export const getAllEducation = asyncHandler(
  async (req: UsernameParam, res: FastifyReply) => {
    const data = await svc.getAllEducation(req.params.username!);
    sendSuccess(res, "Education fetched", data, STATUS_CODES.OK);
  },
);

/** POST /api/v1/portfolio/education — authenticated */
export const createEducation = asyncHandler(
  async (req: FastifyRequest<{ Body: CreateEducationBody }>, res: FastifyReply) => {
    const data = await svc.createEducation(req.user!.id!, req.body);
    sendSuccess(res, "Education created", data, STATUS_CODES.CREATED);
  },
);

/** PUT /api/v1/portfolio/education/:id — authenticated */
export const updateEducation = asyncHandler(
  async (req: FastifyRequest<{ Params: { id: string }; Body: UpdateEducationBody }>, res: FastifyReply) => {
    const data = await svc.updateEducation(req.user!.id!, req.params.id, req.body);
    sendSuccess(res, "Education updated", data, STATUS_CODES.OK);
  },
);

/** DELETE /api/v1/portfolio/education/:id — authenticated */
export const deleteEducation = asyncHandler(async (req: IdParam, res: FastifyReply) => {
  await svc.deleteEducation(req.user!.id!, req.params.id!);
  sendSuccess(res, "Education deleted", null, STATUS_CODES.OK);
});

// ─── Experience ───────────────────────────────────────────────────────────────

/** GET /api/v1/portfolio/user/:userId/experience — public */
export const getAllExperience = asyncHandler(
  async (req: UsernameParam, res: FastifyReply) => {
    const data = await svc.getAllExperience(req.params.username!);
    sendSuccess(res, "Experience fetched", data, STATUS_CODES.OK);
  },
);

/** POST /api/v1/portfolio/experience — authenticated */
export const createExperience = asyncHandler(
  async (req: FastifyRequest<{ Body: CreateExperienceBody }>, res: FastifyReply) => {
    const data = await svc.createExperience(req.user!.id!, req.body);
    sendSuccess(res, "Experience created", data, STATUS_CODES.CREATED);
  },
);

/** PUT /api/v1/portfolio/experience/:id — authenticated */
export const updateExperience = asyncHandler(
  async (req: FastifyRequest<{ Params: { id: string }; Body: UpdateExperienceBody }>, res: FastifyReply) => {
    const data = await svc.updateExperience(req.user!.id!, req.params.id!, req.body);
    sendSuccess(res, "Experience updated", data, STATUS_CODES.OK);
  },
);

/** DELETE /api/v1/portfolio/experience/:id — authenticated */
export const deleteExperience = asyncHandler(async (req: IdParam, res: FastifyReply) => {
  await svc.deleteExperience(req.user!.id!, req.params.id!);
  sendSuccess(res, "Experience deleted", null, STATUS_CODES.OK);
});

// ─── Projects ─────────────────────────────────────────────────────────────────

/** GET /api/v1/portfolio/user/:userId/projects — public */
export const getAllProjects = asyncHandler(
  async (req: UsernameParam, res: FastifyReply) => {
    const data = await svc.getAllProjects(req.params.username!);
    sendSuccess(res, "Projects fetched", data, STATUS_CODES.OK);
  },
);

/** GET /api/v1/portfolio/user/:userId/projects/featured — public */
export const getFeaturedProjects = asyncHandler(
  async (req: UsernameParam, res: FastifyReply) => {
    const data = await svc.getFeaturedProjects(req.params.username!);
    sendSuccess(res, "Featured projects fetched", data, STATUS_CODES.OK);
  },
);

/** POST /api/v1/portfolio/projects — authenticated */
export const createProject = asyncHandler(
  async (req: FastifyRequest<{ Body: CreateProjectBody }>, res: FastifyReply) => {
    const data = await svc.createProject(req.user!.id!, req.body);
    sendSuccess(res, "Project created", data, STATUS_CODES.CREATED);
  },
);

/** PUT /api/v1/portfolio/projects/:id — authenticated */
export const updateProject = asyncHandler(
  async (req: FastifyRequest<{ Params: { id: string }; Body: UpdateProjectBody }>, res: FastifyReply) => {
    const data = await svc.updateProject(req.user!.id!, req.params.id!, req.body);
    sendSuccess(res, "Project updated", data, STATUS_CODES.OK);
  },
);

/** DELETE /api/v1/portfolio/projects/:id — authenticated */
export const deleteProject = asyncHandler(async (req: IdParam, res: FastifyReply) => {
  await svc.deleteProject(req.user!.id!, req.params.id!);
  sendSuccess(res, "Project deleted", null, STATUS_CODES.OK);
});

// ─── Hackathons ───────────────────────────────────────────────────────────────

/** GET /api/v1/portfolio/user/:userId/hackathons — public */
export const getAllHackathons = asyncHandler(
  async (req: UsernameParam, res: FastifyReply) => {
    const data = await svc.getAllHackathons(req.params.username!);
    sendSuccess(res, "Hackathons fetched", data, STATUS_CODES.OK);
  },
);

/** POST /api/v1/portfolio/hackathons — authenticated */
export const createHackathon = asyncHandler(
  async (req: FastifyRequest<{ Body: CreateHackathonBody }>, res: FastifyReply) => {
    const data = await svc.createHackathon(req.user!.id!, req.body);
    sendSuccess(res, "Hackathon created", data, STATUS_CODES.CREATED);
  },
);

/** PUT /api/v1/portfolio/hackathons/:id — authenticated */
export const updateHackathon = asyncHandler(
  async (req: FastifyRequest<{ Params: { id: string }; Body: UpdateHackathonBody }>, res: FastifyReply) => {
    const data = await svc.updateHackathon(req.user!.id!, req.params.id!, req.body);
    sendSuccess(res, "Hackathon updated", data, STATUS_CODES.OK);
  },
);

/** DELETE /api/v1/portfolio/hackathons/:id — authenticated */
export const deleteHackathon = asyncHandler(async (req: IdParam, res: FastifyReply) => {
  await svc.deleteHackathon(req.user!.id!, req.params.id!);
  sendSuccess(res, "Hackathon deleted", null, STATUS_CODES.OK);
});

// ─── Skills ───────────────────────────────────────────────────────────────────

/** GET /api/v1/portfolio/user/:userId/skills — public */
export const getAllSkills = asyncHandler(
  async (req: UsernameParam, res: FastifyReply) => {
    const data = await svc.getAllSkills(req.params.username!);
    sendSuccess(res, "Skills fetched", data, STATUS_CODES.OK);
  },
);

/** GET /api/v1/portfolio/user/:userId/skills/:category — public */
export const getSkillsByCategory = asyncHandler(
  async (req: FastifyRequest<{ Params: { username: string; category: string } }>, res: FastifyReply) => {
    const data = await svc.getSkillsByCategory(req.params.username!, req.params.category!);
    sendSuccess(res, "Skills fetched by category", data, STATUS_CODES.OK);
  },
);

/** POST /api/v1/portfolio/skills — authenticated */
export const createSkill = asyncHandler(
  async (req: FastifyRequest<{ Body: CreateSkillBody }>, res: FastifyReply) => {
    const data = await svc.createSkill(req.user!.id!, req.body);
    sendSuccess(res, "Skill created", data, STATUS_CODES.CREATED);
  },
);

/** PUT /api/v1/portfolio/skills/:id — authenticated */
export const updateSkill = asyncHandler(
  async (req: FastifyRequest<{ Params: { id: string }; Body: UpdateSkillBody }>, res: FastifyReply) => {
    const data = await svc.updateSkill(req.user!.id!, req.params.id!, req.body);
    sendSuccess(res, "Skill updated", data, STATUS_CODES.OK);
  },
);

/** DELETE /api/v1/portfolio/skills/:id — authenticated */
export const deleteSkill = asyncHandler(async (req: IdParam, res: FastifyReply) => {
  await svc.deleteSkill(req.user!.id!, req.params.id!);
  sendSuccess(res, "Skill deleted", null, STATUS_CODES.OK);
});

// ─── Certifications ───────────────────────────────────────────────────────────

/** GET /api/v1/portfolio/user/:userId/certifications — public */
export const getAllCertifications = asyncHandler(
  async (req: UsernameParam, res: FastifyReply) => {
    const data = await svc.getAllCertifications(req.params.username!);
    sendSuccess(res, "Certifications fetched", data, STATUS_CODES.OK);
  },
);

/** POST /api/v1/portfolio/certifications — authenticated */
export const createCertification = asyncHandler(
  async (req: FastifyRequest<{ Body: CreateCertificationBody }>, res: FastifyReply) => {
    const data = await svc.createCertification(req.user!.id!, req.body);
    sendSuccess(res, "Certification created", data, STATUS_CODES.CREATED);
  },
);

/** PUT /api/v1/portfolio/certifications/:id — authenticated */
export const updateCertification = asyncHandler(
  async (req: FastifyRequest<{ Params: { id: string }; Body: UpdateCertificationBody }>, res: FastifyReply) => {
    const data = await svc.updateCertification(req.user!.id!, req.params.id!, req.body);
    sendSuccess(res, "Certification updated", data, STATUS_CODES.OK);
  },
);

/** DELETE /api/v1/portfolio/certifications/:id — authenticated */
export const deleteCertification = asyncHandler(async (req: IdParam, res: FastifyReply) => {
  await svc.deleteCertification(req.user!.id!, req.params.id!);
  sendSuccess(res, "Certification deleted", null, STATUS_CODES.OK);
});

// ─── Achievements ─────────────────────────────────────────────────────────────

/** GET /api/v1/portfolio/user/:userId/achievements — public */
export const getAllAchievements = asyncHandler(
  async (req: UsernameParam, res: FastifyReply) => {
    const data = await svc.getAllAchievements(req.params.username!);
    sendSuccess(res, "Achievements fetched", data, STATUS_CODES.OK);
  },
);

/** POST /api/v1/portfolio/achievements — authenticated */
export const createAchievement = asyncHandler(
  async (req: FastifyRequest<{ Body: CreateAchievementBody }>, res: FastifyReply) => {
    const data = await svc.createAchievement(req.user!.id!, req.body);
    sendSuccess(res, "Achievement created", data, STATUS_CODES.CREATED);
  },
);

/** PUT /api/v1/portfolio/achievements/:id — authenticated */
export const updateAchievement = asyncHandler(
  async (req: FastifyRequest<{ Params: { id: string }; Body: UpdateAchievementBody }>, res: FastifyReply) => {
    const data = await svc.updateAchievement(req.user!.id!, req.params.id!, req.body);
    sendSuccess(res, "Achievement updated", data, STATUS_CODES.OK);
  },
);

/** DELETE /api/v1/portfolio/achievements/:id — authenticated */
export const deleteAchievement = asyncHandler(async (req: IdParam, res: FastifyReply) => {
  await svc.deleteAchievement(req.user!.id!, req.params.id!);
  sendSuccess(res, "Achievement deleted", null, STATUS_CODES.OK);
});
