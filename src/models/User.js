const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    default: "Tally User"
  },

  userName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
  },
  yearOfJoining: {
    type: Number
  },
  function: {
    type: String,
    enum: ['PM', 'Developer', 'QA', 'Designer', 'Sales Manager', 'Branch Manager', 'Partner'],
    default: 'PM'
  },
  designation: {
    type: String,
  },
  experience: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  location: {
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    Country: {
      type: String,
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.post('save', function (doc) {
  const { syncDocument } = require('../utils/embeddingSync');
  syncDocument(doc, 'User');
});

userSchema.post('findOneAndUpdate', async function (doc) {
  if (doc) {
    const { syncDocument } = require('../utils/embeddingSync');
    const freshDoc = await doc.constructor.findById(doc._id);
    if (freshDoc) syncDocument(freshDoc, 'User');
  }
});

userSchema.post('findOneAndDelete', function (doc) {
  if (doc) {
    const { deleteDocumentEmbedding } = require('../utils/embeddingSync');
    deleteDocumentEmbedding(doc._id, 'User');
  }
});

module.exports = mongoose.model('User', userSchema);
