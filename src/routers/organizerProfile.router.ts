import { Router } from "express";
import { OrganizerProfileController } from "../controllers/organizerProfile.controller";
import { verifyToken } from "../middlewares/verify";


export class OrganizerProfileRouter{
    private organizerController: OrganizerProfileController
    private router: Router

    constructor() {
        this.organizerController = new OrganizerProfileController()
        this.router = Router()
        this.initializeRoutes()
    }

    private initializeRoutes(){
        this.router.get('/',verifyToken, this.organizerController.getOrganizers)
        this.router.get('/profile', verifyToken, this.organizerController.getOrganizerId)

        this.router.patch('/:id', this.organizerController.editOrganizer)
    }

    getRouter(): Router{
        return this.router
    }
}