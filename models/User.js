import mongoose from 'mongoose';

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  roles: [{ type: String, default: 'employee' }],
  active: { type: Boolean, default: true }
});

export default User = mongoose.model('User', userSchema)