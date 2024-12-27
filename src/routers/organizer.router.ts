import { Router } from "express";
import { OrganizerController } from "../controllers/organizer.controller";
import { verifyToken } from "../middlewares/verify";


export class OrganizerRouter{
    private organizerController: OrganizerController
    private router: Router

    constructor() {
        this.organizerController = new OrganizerController()
        this.router = Router()
        this.initializeRoutes()
    }

    private initializeRoutes(){
        this.router.get('/',verifyToken, this.organizerController.getOrganizers)
        this.router.get('/profile', verifyToken, this.organizerController.getOrganizerId)
        this.router.post('/', this.organizerController.createOrganizer)

        this.router.patch('/:id', this.organizerController.editOrganizer)
        this.router.delete('/:id', this.organizerController.deleteOrganizer)
    }

    getRouter(): Router{
        return this.router
    }
}