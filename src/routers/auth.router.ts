import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

export class AuthRouter{
    private authController: AuthController
    private router: Router

    constructor(){
        this.authController = new AuthController()
        this.router = Router()
        this.InitializeRoutes()
    }

    private InitializeRoutes(){
        this.router.post('/register/user', this.authController.registerUser)
        this.router.post('/login/user', this.authController.loginUser)
        this.router.post('/register/organizer', this.authController.registerOrganizer)
        this.router.post('/login/organizer', this.authController.loginOrganizer)
        this.router.patch('/verify/user/:token', this.authController.verifyUser)
        this.router.patch('/verify/organizer/:token', this.authController.verifyOrganizer)
    }

    getRouter(): Router{
        return this.router
    }
}