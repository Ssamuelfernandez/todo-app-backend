import { Router } from 'express'
import { NoteController } from '../controllers/noteController.js'

export const noteRouter = Router()

noteRouter.get("/",NoteController.getNotes)
noteRouter.get("/:id", NoteController.getNotesById)
noteRouter.post("/", NoteController.postNotes)
noteRouter.patch("/:id", NoteController.patchNotes)
noteRouter.delete("/:id", NoteController.deleteNotes)