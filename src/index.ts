import express, { Application, Request, Response } from "express"
import cors from 'cors'
import { UserRouter } from "./routers/user.router"
import { OrganizerRouter } from "./routers/organizer.router"
import { AuthRouter } from "./routers/auth.router"

const PORT: number = 8000
const app: Application = express()

app.use(express.json())
app.use(cors())

app.get('/api', (req: Request, res: Response) => {
    res.status(200).send('Welcome to API')
})

//bagian user
const userRouter = new UserRouter()
app.use("/api/users", userRouter.getRouter())

//bagian organizer
const organizerRouter = new OrganizerRouter()
app.use("/api/organizers", organizerRouter.getRouter())

//bagian auth
const authRouter = new AuthRouter()
app.use("/api/auth", authRouter.getRouter())

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/api`)
})
