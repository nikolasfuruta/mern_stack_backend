import mongoose from 'mongoose';
import Inc from "mongoose-sequence";
const AutoIncrement = Inc(mongoose); 

const Schema = mongoose.Schema;
const noteId = Schema.ObjectId;

const noteSchema = new Schema({
  user: { type:noteId, required: true, ref: 'User' },
  title: { type: String, required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  },
  {
    timestamps: true//createdAt and updatedAt
  }
);

//configure sequencial counter
noteSchema.plugin(AutoIncrement, {
  inc_field: 'ticket',
  id: 'ticketNums',
  start_seq:1
})

export const Note = mongoose.model('Note', noteSchema)