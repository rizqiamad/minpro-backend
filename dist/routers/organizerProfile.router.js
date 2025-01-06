"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizerProfileRouter = void 0;
const express_1 = require("express");
const organizerProfile_controller_1 = require("../controllers/organizerProfile.controller");
const verify_1 = require("../middlewares/verify");
class OrganizerProfileRouter {
    constructor() {
        this.organizerController = new organizerProfile_controller_1.OrganizerProfileController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/", this.organizerController.getOrganizers);
        this.router.get("/profile", verify_1.verifyToken, this.organizerController.getOrganizerId);
        this.router.get("/events", verify_1.verifyToken, this.organizerController.getEventsOrganizer);
        this.router.patch("/:id", this.organizerController.editOrganizer);
    }
    getRouter() {
        return this.router;
    }
}
exports.OrganizerProfileRouter = OrganizerProfileRouter;
