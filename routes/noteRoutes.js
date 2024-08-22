import { Router } from 'express'
import { NoteController } from '../controllers/noteController.js'

export const noteRouter = Router()

noteRouter.get("/notes",NoteController.getNotes)
noteRouter.get("/notes/:id", NoteController.getNotesById)
noteRouter.post("/notes", NoteController.postNotes)
noteRouter.patch("/notes/:id", NoteController.patchNotes)
noteRouter.delete("/notes/:id", NoteController.deleteNotes)