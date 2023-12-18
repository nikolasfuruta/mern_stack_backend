import { User } from '../models/User.js';
import { Note } from '../models/Note.js';

import asyncHandler from 'express-async-handler';

//PRIVATE

//@desc - CREATE NOTE
//@method - POST /notes
export const createNewNote = asyncHandler(async (req,res) => {
  const { user,title,text } = req.body;
  //validate datas
  if(!user||!title||!text) return res.status(400).json({ message: "All fields required" });

  //check for duplicates
  const foundNote = await Note.findOne({title}).lean().exec()
  if(foundNote) return res.status(409).json({ message: "Duplicate Title" });

  //create note
  const newNote = await Note.create({ user:user,title:title,text:text });
  if(!newNote) return res.status(400).json({ message: "Invalid note data" });
  res.status(201).json({ message: `New note ${title} created` })
});


//@desc - GET ALL NOTES
//@method - GET /notes
export const getAllNotes = asyncHandler(async (req,res) => {
  const notes = await Note.find({}).lean();
  if(!notes?.length) return res.status(400).json({ message: "No notes found" });

  //Add username before sending response
  const notesWithUsername = await Promise.all(notes.map(async (note) => {
    const user = await User.findById(note.user).lean().exec();
    return {...note, username: user.username}
  }));
  res.json(notesWithUsername)
});


//@desc - PATCH NOTE
//@method - PATCH /notes
export const updateNote = asyncHandler(async (req,res) => {
  const {id, user, title, text, completed} = req.body;

  if(!id || !user || !title || !text || typeof completed !== 'boolean'){
    return res.status(400).json({ message: "All fields required" });
  }

  //check for note
  const foundNote = await Note.findById(id).exec();
  if(!foundNote) return res.status(400).json({ message: "Note not found" });

  //check for duplicate
  const duplicate = await Note.findOne({title}).lean().exec()
  if(duplicate && duplicate._id.toString() !== id){
    return res.status(400).json({ message: "Duplicate note title" });
  }

  //update
  foundNote.user = user;
  foundNote.title = title;
  foundNote.text = text;
  foundNote.completed = completed;
  const updatedNote = await foundNote.save();
  res.json(`${updatedNote.title} updated`);
});


//@desc - DELETE NOTE
//@method - PATCH /notes
export const deleteNote = asyncHandler(async (req,res) => {
  const { id } = req.body;

  if(!id) return res.status(400).json({ message: "ID required" });

  const foundNote = await Note.findById(id).exec();
  if(!foundNote) return res.status(400).json({ message: "Note not found" });

  //delete note
  await foundNote.deleteOne();

  res.json(`${foundNote.title} with ID ${foundNote._id} deleted`)
});