import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    minlength: [3, 'Le nom doit contenir au moins 3 caractères'],
    maxlength: [50, 'Le nom est trop long']
  },
  message: {
    type: String,
    required: [true, 'Le message est obligatoire'],
    maxlength: [200, 'Message trop long (200 caractères max)']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
