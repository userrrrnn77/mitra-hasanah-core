// src/models/Registration.ts

import { Schema, model, Document } from "mongoose";

export type Gender = "Laki-laki" | "Perempuan";
export type MaritalStatus = "Lajang" | "Menikah" | "Janda" | "Duda";
export type Education = "SD/SMP" | "SMA" | "Akademi/D-3/S1" | "S2/S3";
export type Religion = "Islam" | "Kristen/Katholik" | "Hindu" | "Budha";

export type Occupation =
  | "Karyawan"
  | "Peg. Negeri"
  | "TNI/POLRI"
  | "Pedagang/Wirausaha"
  | "Manajer"
  | "Profesional"
  | "Pelajar/Mahasiswa"
  | "Lainnya";

export type IncomeRange =
  | "< Rp. 500.000,-"
  | "Rp. 500.000 - 1.000.000"
  | "Rp. 1 - 2 juta"
  | "Rp. 2 - 3 juta"
  | "Rp. 3 - 4 juta"
  | "Rp. 4 - 5 juta"
  | "Rp. 5 - 6 juta"
  | "> Rp. 6.000.000,-";

export type SavingProduct =
  | "SIRELA"
  | "Simpanan Syariah"
  | "SAJAAH"
  | "Simpanan Hasanah"
  | "SISUQUR"
  | "SIAROFAH"
  | "SISIDIK"
  | "SIMAPAN"
  | "SIHARA"
  | "SIZawa";

export interface IRegistration extends Document {
  fullName: string;
  birthPlace: string;
  birthDate: Date; // ini date ya mbot kagak string
  gender: Gender;
  addressKTP: string;
  addressDomisili: string;
  phoneNumber: string;
  ktpNumber: string;
  occupation: Occupation;
  maritalStatus: MaritalStatus;
  education: Education;
  religion: Religion;
  monthlyIncome: IncomeRange;
  selectedProduct: SavingProduct;
  initialDeposit: number;
  isVerified: boolean;
  heirName?: string;
  heirAddress?: string;
}

export type RegistrationDocument = IRegistration & Document;

const RegistrationSchema = new Schema<RegistrationDocument>(
  {
    fullName: { type: String, required: true, trim: true },
    birthPlace: { type: String, required: true },
    birthDate: { type: Date, required: true },
    gender: {
      type: String,
      enum: ["Laki-laki", "Perempuan"],
      required: true,
    },
    addressKTP: { type: String, required: true },
    addressDomisili: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    ktpNumber: { type: String, required: true, unique: true }, // KTP kaga boleh double, taik!
    occupation: {
      type: String,
      enum: [
        "Karyawan",
        "Peg. Negeri",
        "TNI/POLRI",
        "Pedagang/Wirausaha",
        "Manajer",
        "Profesional",
        "Pelajar/Mahasiswa",
        "Lainnya",
      ],
      required: true,
    },
    maritalStatus: {
      type: String,
      enum: ["Lajang", "Menikah", "Janda", "Duda"],
      required: true,
    },
    education: {
      type: String,
      enum: ["SD/SMP", "SMA", "Akademi/D-3/S1", "S2/S3"],
      required: true,
    },
    religion: {
      type: String,
      enum: ["Islam", "Kristen/Katholik", "Hindu", "Budha"],
      required: true,
    },
    monthlyIncome: {
      type: String,
      enum: [
        "< Rp. 500.000,-",
        "Rp. 500.000 - 1.000.000",
        "Rp. 1 - 2 juta",
        "Rp. 2 - 3 juta",
        "Rp. 3 - 4 juta",
        "Rp. 4 - 5 juta",
        "Rp. 5 - 6 juta",
        "> Rp. 6.000.000,-",
      ],
      required: true,
    },
    selectedProduct: {
      type: String,
      enum: [
        "SIRELA",
        "Simpanan Syariah",
        "SAJAAH",
        "Simpanan Hasanah",
        "SISUQUR",
        "SIAROFAH",
        "SISIDIK",
        "SIMAPAN",
        "SIHARA",
        "SIZawa",
      ],
      required: true,
    },
    initialDeposit: { type: Number, required: true },
    isVerified: { type: Boolean, default: false }, // kasih ini bre, kalo dia udah daftar tapi belum deposit jangan kasih akses, ya ga bre?
    heirName: { type: String, trim: true }, // Opsional sesuai Interface lu
    heirAddress: { type: String, trim: true },
  },
  {
    timestamps: true, // Biar lu tau record createdAt & updatedAt-nya, Bre!
  },
);

const Registration = model<RegistrationDocument>(
  "Registration",
  RegistrationSchema,
);
export default Registration;
