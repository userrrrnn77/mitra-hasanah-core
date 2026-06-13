import mongoose, { Schema, model, Document } from "mongoose";

export interface IHistoryTransaction extends Document {
  registrationId: string;
  buktiTransfer: string;
  buktiKTP: string;
}

const HistoryTransactionSchema = new Schema<IHistoryTransaction>(
  {
    registrationId: {
      type: String,
      required: true,
    },
    buktiTransfer: {
      type: String,
      required: true,
    },
    buktiKTP: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const HistoryTransaction =
  (mongoose.models.HistoryTransaction as mongoose.Model<IHistoryTransaction>) ||
  mongoose.model<IHistoryTransaction>(
    "HistoryTransaction",
    HistoryTransactionSchema,
  );

export default HistoryTransaction;
