import mongoose from 'mongoose';
import uuid from 'uuid';

const userSchema = new mongoose.Schema({
  form_id: {
    type: String,
    default: () => uuidv4(),
    unique: true,
  },

  // Page 1: EN No. + DOB + Payment Details
  en_no: { type: String, required: true },
  dob: { type: String, required: true },

  account_holder: { type: String },
  transaction_id: { type: String, required: true, unique: true },
  payment_screenshot_url: { type: String },

  declarations: {
    admission_rules: { type: Boolean },
    correct_info: { type: Boolean },
    fee_agreement: { type: Boolean },
  },

  // Page 2: Personal Details
 personal_details: { first_name: String,
  middle_name: String,
  last_name: String,
  mother_name: String,
  student_mobile: String,
  parent_mobile: String,
  address: String,
  gender: String,
  religion: String,
  category: String,
  candidate_type: String,},


  // Page 3: Qualification Type
  qualification_type: { type: String, required: true , enum: ['HSC', 'Diploma']}, // "HSC" or "Diploma"

  // Page 4: HSC Details
  hsc_details: {
    physics: Number,
    chemistry: Number,
    maths: Number,
    biology_or_other: Number,
    total_marks: Number,
    percentage: Number,
    mh_cet_score: String,
    jee_score: String,
    state_merit: String,
    all_india_merit: String,
  },

  // Page 5: Diploma Details
  diploma_details: {
    total_marks: Number,
    percentage: Number,
    mh_cet_score: String,
    jee_score: String,
  },

  // Page 6: Branch Preferences
  branch_preferences: [String], // Max 5 preferences

  // Page 7: Document Uploads
  document_ack_url: { type: String },
  additional_docs_urls: [String],

  // Meta Fields
  status: { type: String, default: 'page1' }, // Tracks progress
  locked: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});


export default mongoose.model('User', userSchema);