import { Router } from "express";
import { UserAuthController } from "../controllers/userAuth.controller";

export class UserAuthRouter {
  private userAuthController: UserAuthController;
  private router: Router;

  constructor() {
    this.userAuthController = new UserAuthController();
    this.router = Router();
    this.InitializeRoutes();
  }

  private InitializeRoutes() {
    this.router.post("/register", this.userAuthController.registerUser);
    this.router.post("/login", this.userAuthController.loginUser);
    this.router.patch(
      "/verify/:token",
      this.userAuthController.verifyUser
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
