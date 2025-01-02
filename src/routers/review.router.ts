import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { verifyToken } from "../middlewares/verify";

export class ReviewRouter {
  private router: Router;
  private reviewController: ReviewController;

  constructor() {
    this.router = Router();
    this.reviewController = new ReviewController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/:id", verifyToken, this.reviewController.createReview);
    this.router.get("/:id", this.reviewController.getReviews);
    this.router.get("/avg/:id", this.reviewController.getAvg);
  }

  getRouter(): Router {
    return this.router;
  }
}
