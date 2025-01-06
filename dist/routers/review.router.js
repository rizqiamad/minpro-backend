"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRouter = void 0;
const express_1 = require("express");
const review_controller_1 = require("../controllers/review.controller");
const verify_1 = require("../middlewares/verify");
class ReviewRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.reviewController = new review_controller_1.ReviewController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/:id", verify_1.verifyToken, this.reviewController.createReview);
        this.router.get("/:id", this.reviewController.getReviews);
        this.router.get("/avg/:id", this.reviewController.getAvg);
    }
    getRouter() {
        return this.router;
    }
}
exports.ReviewRouter = ReviewRouter;
