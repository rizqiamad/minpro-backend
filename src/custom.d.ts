import { Kelamin } from '@prisma/client'
import 'express'

export type UserPayload = {
    id: number,
}

export type OrganizerPayload = {
    id: number
}

declare global{
    namespace Express{
        export interface Request{
            user?: UserPayload
            organizer?: OrganizerPayload
        }
    }
}