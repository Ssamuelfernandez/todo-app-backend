import { Router } from 'express'
import { NoteController } from '../controllers/noteController.js'

export const noteRouter = Router()

noteRouter.get("/notes",NoteController.getNotes)