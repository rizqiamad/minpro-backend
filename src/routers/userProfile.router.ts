import { Router } from "express";
import { UserProfileController } from "../controllers/userProfile.controller";
import { verifyToken } from "../middlewares/verify";
import { upload } from "..";

export class UserProfileRouter {
  private userController: UserProfileController;
  private router: Router;

  constructor() {
    this.userController = new UserProfileController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/profile", verifyToken, this.userController.getUserId);
    this.router.get("/events", verifyToken, this.userController.getEventsUser);
    this.router.get("/coupon", verifyToken, this.userController.getUserCoupon);
    this.router.get("/points", verifyToken, this.userController.getPointsUser);
    this.router.patch(
      "/avatar",
      verifyToken,
      upload.single("image"),
      this.userController.editAvatarCloud
    );

    this.router.get(
      "/tickets/:id",
      verifyToken,
      this.userController.getTicketsUser
    );
    this.router.get(
      "/amount/tickets/:id",
      verifyToken,
      this.userController.getAmountTicketsUser
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
