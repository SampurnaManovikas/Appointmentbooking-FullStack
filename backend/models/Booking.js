import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String,
    required: [true, "Date is required"],
    match: [/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"],
  },
  time: {
    type: String,
    required: [true, "Time is required"],
  },
  sessionType: {
    type: String,
    required: [true, "Session type is required"],
    enum: ["in-person", "video", "phone"],
  },
  clientName: {
    type: String,
    required: [true, "Client name is required"],
    trim: true,
  },
  clientPhone: {
    type: String,
    required: [true, "Client phone is required"],
    match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"],
  },
  clientEmail: {
    type: String,
    required: [true, "Client email is required"],
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  notes: {
    type: String,
    maxlength: [500, "Notes cannot be more than 500 characters"],
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "confirmed",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt field before saving
bookingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
bookingSchema.index({ date: 1, time: 1 });
bookingSchema.index({ user: 1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
