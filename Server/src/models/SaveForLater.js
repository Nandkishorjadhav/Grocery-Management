import mongoose from 'mongoose';

const saveForLaterSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  unit: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate total price before saving
saveForLaterSchema.pre('save', function(next) {
  this.totalPrice = this.quantity * this.price;
  next();
});

export default mongoose.model('SaveForLater', saveForLaterSchema);
