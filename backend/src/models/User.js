import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

console.log('🔵 Loading User model...');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: '',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zipCode: { type: String, default: '' },
      country: { type: String, default: '' },
    },
    phone: {
      type: String,
      default: '',
    },
    resetPasswordToken: {
      type: String,
      default: undefined,
    },
    resetPasswordExpire: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

// COMPLETELY REWRITTEN pre-save middleware - NO next() issues
userSchema.pre('save', function(next) {
  console.log('🔵 Pre-save middleware triggered');
  console.log('🔵 Password modified:', this.isModified('password'));
  
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    console.log('🔵 Password not modified, skipping hash');
    return next();
  }
  
  console.log('🔵 Hashing password...');
  
  // Generate salt and hash password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.error('🔴 Salt generation error:', err);
      return next(err);
    }
    
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) {
        console.error('🔴 Hash generation error:', err);
        return next(err);
      }
      
      this.password = hash;
      console.log('🔵 Password hashed successfully');
      next();
    });
  });
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  console.log('🔵 Matching password for user:', this.email);
  try {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log('🔵 Password match result:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('🔴 Password match error:', error);
    return false;
  }
};

const User = mongoose.model('User', userSchema);
console.log('🟢 User model loaded successfully');

export default User;