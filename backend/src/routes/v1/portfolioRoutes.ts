import { FastifyPluginAsync } from "fastify";
import { authenticate } from "../../middlewares/authMiddleware.js";
import {
  // Public — full portfolio
  getFullPortfolio,
  // Public — profile
  getProfile,
  // Public — education
  getAllEducation,
  // Public — experience
  getAllExperience,
  // Public — projects
  getAllProjects,
  getFeaturedProjects,
  // Public — hackathons
  getAllHackathons,
  // Public — skills
  getAllSkills,
  getSkillsByCategory,
  // Public — certifications
  getAllCertifications,
  // Public — achievements
  getAllAchievements,
  // Authenticated — profile
  upsertProfile,
  // Authenticated — education
  createEducation,
  updateEducation,
  deleteEducation,
  // Authenticated — experience
  createExperience,
  updateExperience,
  deleteExperience,
  // Authenticated — projects
  createProject,
  updateProject,
  deleteProject,
  // Authenticated — hackathons
  createHackathon,
  updateHackathon,
  deleteHackathon,
  // Authenticated — skills
  createSkill,
  updateSkill,
  deleteSkill,
  // Authenticated — certifications
  createCertification,
  updateCertification,
  deleteCertification,
  // Authenticated — achievements
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "../../controllers/portfolioController.js";

const auth = { preHandler: [authenticate] };

const portfolioRouter: FastifyPluginAsync = async (app) => {
  // ── Public: full portfolio ──────────────────────────────────────────────────
  app.get("/user/:userId", getFullPortfolio);

  // ── Public: profile ────────────────────────────────────────────────────────
  app.get("/user/:userId/profile", getProfile);

  // ── Authenticated: profile ─────────────────────────────────────────────────
  app.put("/profile", auth, upsertProfile);

  // ── Public: education ──────────────────────────────────────────────────────
  app.get("/user/:userId/education", getAllEducation);

  // ── Authenticated: education ───────────────────────────────────────────────
  app.post("/education", auth, createEducation);
  app.put("/education/:id", auth, updateEducation);
  app.delete("/education/:id", auth, deleteEducation);

  // ── Public: experience ─────────────────────────────────────────────────────
  app.get("/user/:userId/experience", getAllExperience);

  // ── Authenticated: experience ──────────────────────────────────────────────
  app.post("/experience", auth, createExperience);
  app.put("/experience/:id", auth, updateExperience);
  app.delete("/experience/:id", auth, deleteExperience);

  // ── Public: projects ───────────────────────────────────────────────────────
  app.get("/user/:userId/projects", getAllProjects);
  app.get("/user/:userId/projects/featured", getFeaturedProjects);

  // ── Authenticated: projects ────────────────────────────────────────────────
  app.post("/projects", auth, createProject);
  app.put("/projects/:id", auth, updateProject);
  app.delete("/projects/:id", auth, deleteProject);

  // ── Public: hackathons ─────────────────────────────────────────────────────
  app.get("/user/:userId/hackathons", getAllHackathons);

  // ── Authenticated: hackathons ──────────────────────────────────────────────
  app.post("/hackathons", auth, createHackathon);
  app.put("/hackathons/:id", auth, updateHackathon);
  app.delete("/hackathons/:id", auth, deleteHackathon);

  // ── Public: skills ─────────────────────────────────────────────────────────
  app.get("/user/:userId/skills", getAllSkills);
  app.get("/user/:userId/skills/category/:category", getSkillsByCategory);

  // ── Authenticated: skills ──────────────────────────────────────────────────
  app.post("/skills", auth, createSkill);
  app.put("/skills/:id", auth, updateSkill);
  app.delete("/skills/:id", auth, deleteSkill);

  // ── Public: certifications ─────────────────────────────────────────────────
  app.get("/user/:userId/certifications", getAllCertifications);

  // ── Authenticated: certifications ──────────────────────────────────────────
  app.post("/certifications", auth, createCertification);
  app.put("/certifications/:id", auth, updateCertification);
  app.delete("/certifications/:id", auth, deleteCertification);

  // ── Public: achievements ───────────────────────────────────────────────────
  app.get("/user/:userId/achievements", getAllAchievements);

  // ── Authenticated: achievements ────────────────────────────────────────────
  app.post("/achievements", auth, createAchievement);
  app.put("/achievements/:id", auth, updateAchievement);
  app.delete("/achievements/:id", auth, deleteAchievement);
};

export default portfolioRouter;
