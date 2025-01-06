"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthRouter = void 0;
const express_1 = require("express");
const userAuth_controller_1 = require("../controllers/userAuth.controller");
class UserAuthRouter {
    constructor() {
        this.userAuthController = new userAuth_controller_1.UserAuthController();
        this.router = (0, express_1.Router)();
        this.InitializeRoutes();
    }
    InitializeRoutes() {
        this.router.post("/register", this.userAuthController.registerUser);
        this.router.post("/login", this.userAuthController.loginUser);
        this.router.patch("/verify/:token", this.userAuthController.verifyUser);
    }
    getRouter() {
        return this.router;
    }
}
exports.UserAuthRouter = UserAuthRouter;
