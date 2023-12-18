import express from 'express';
import { createNewNote,getAllNotes,updateNote,deleteNote } from '../controllers/notesController.js'

export const notes = express.Router();

notes.route('/')
  .post(createNewNote)
  .get(getAllNotes)
  .patch(updateNote)
  .delete(deleteNote)
