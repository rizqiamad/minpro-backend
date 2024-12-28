import { Router } from "express";
import { OrganizerAuthController } from "../controllers/organizerAuth.controller";

export class OrganizerAuthRouter {
  private organizerAuthController: OrganizerAuthController;
  private router: Router;

  constructor() {
    this.organizerAuthController = new OrganizerAuthController();
    this.router = Router();
    this.InitializeRoutes();
  }

  private InitializeRoutes() {
    this.router.post(
      "/register",
      this.organizerAuthController.registerOrganizer
    );
    this.router.post(
      "/login",
      this.organizerAuthController.loginOrganizer
    );
    this.router.patch(
      "/verify/:token",
      this.organizerAuthController.verifyOrganizer
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
