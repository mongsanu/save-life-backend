const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    patient_name: {
        type: String,
        min: 3,
        max: 30,
        default: "",
    },
    email: {
        type: String,
        max: 50,
        length: 50,
    },
    phone: {
        type: String,
        max: 15,
        length: 15,
        default: ""
    },
    medical_name: {
        type: String,
        max: 100,
        length: 100,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    cause: {
        type: String,
        default: "",
        max: 100,
        length: 100,
    },
    blood_group: {
        type: String,
        max: 10,
        length: 10,
        default: ""
    },
    blood_quantity: {
        type: Number,
        default: 0
    },
    message: {
        type: String,
        default: "",
        max: 500,
        length: 500,
    },
    gender: {
        type: String,
        max: 10,
        length: 10,
        default: ""
    },
    age: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String,
        default: ""
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", RequestSchema);