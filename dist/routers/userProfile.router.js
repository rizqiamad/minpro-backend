"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileRouter = void 0;
const express_1 = require("express");
const userProfile_controller_1 = require("../controllers/userProfile.controller");
const verify_1 = require("../middlewares/verify");
const __1 = require("..");
class UserProfileRouter {
    constructor() {
        this.userController = new userProfile_controller_1.UserProfileController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/profile", verify_1.verifyToken, this.userController.getUserId);
        this.router.get("/events", verify_1.verifyToken, this.userController.getEventsUser);
        this.router.get("/coupon", verify_1.verifyToken, this.userController.getUserCoupon);
        this.router.get("/points", verify_1.verifyToken, this.userController.getPointsUser);
        this.router.patch("/avatar", verify_1.verifyToken, __1.upload.single("image"), this.userController.editAvatarCloud);
        this.router.get("/tickets/:id", verify_1.verifyToken, this.userController.getTicketsUser);
        this.router.get("/amount/tickets/:id", verify_1.verifyToken, this.userController.getAmountTicketsUser);
    }
    getRouter() {
        return this.router;
    }
}
exports.UserProfileRouter = UserProfileRouter;
