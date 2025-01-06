"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizerAuthRouter = void 0;
const express_1 = require("express");
const organizerAuth_controller_1 = require("../controllers/organizerAuth.controller");
class OrganizerAuthRouter {
    constructor() {
        this.organizerAuthController = new organizerAuth_controller_1.OrganizerAuthController();
        this.router = (0, express_1.Router)();
        this.InitializeRoutes();
    }
    InitializeRoutes() {
        this.router.post("/register", this.organizerAuthController.registerOrganizer);
        this.router.post("/login", this.organizerAuthController.loginOrganizer);
        this.router.patch("/verify/:token", this.organizerAuthController.verifyOrganizer);
    }
    getRouter() {
        return this.router;
    }
}
exports.OrganizerAuthRouter = OrganizerAuthRouter;
