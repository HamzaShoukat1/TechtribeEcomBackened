import mongoose, { Schema } from 'mongoose';

const paymentSchema = new Schema<any>(
  {
    idempotencyKey: { 
      type: String, 
      required: true, 
      unique: true 
    },
    stripeSessionId: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true 
    },
    stripePaymentIntentId: { 
      type: String, 
      index: true 
    },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'USERSCHEMA', 
      required: [true, 'User ID is required'], 
      index: true 
    },
    orderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'ORDER' 
    },
    amount: { 
      type: mongoose.Schema.Types.Decimal128, 
      required: true 
    },
    currency: { 
      type: String, 
      required: true, 
      default: 'USD' 
    },
    status: { 
      type: String, 
      required: true, 
      enum: ['PENDING', 'SUCCESSFUL', 'FAILED'], 
      default: 'PENDING' 
    },
    customerEmail: { 
      type: String, 
      required: true 
    }
  },
  { timestamps: true }
);

export const PAYMENTSCHEMA = mongoose.model('PAYMENTSCHEMA', paymentSchema);
