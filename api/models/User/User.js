const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        user_name: {
            type: String,
            min: 3,
            max: 20,
            default: "",
        },
        email: {
            type: String,
            max: 50,
            length: 50,
            required: true,
            unique: true,
        },
        facebook_url: {
            type: String,
            max: 100,
            length: 100,
            default: "",
        },
        phone: {
            type: String,
            max: 15,
            length: 15,
            default: ""
        },
        password: {
            type: String,
            min: 5,
            max: 14,
            length: 14,
        },
        otp: {
            type: String,
            min: 4,
            max: 4,
            length: 4,
        },
        division: { type: String, },
        district: { type: String, },
        upazilla: { type: String, },
        union: { type: String, },
        address: {
            type: String,
            default: ""
        },
        blood_group: {
            type: String,
            max: 10,
            length: 10,
            default: ""
        },
        last_donation_date: {
            type: String,
            default: ""
        },
        gender: {
            type: String,
            max: 10,
            length: 10,
            default: ""
        },
        age: {
            type: Number,
            length: 100,
            default: null
        },
        avatar: {
            type: String,
            default: ""
        },
        user_id: {
            type: String,
            max: 14,
        },
        role_id: {
            type: Number,
            default: 3,
        },
        user_role: {
            type: String,
            max: 14,
            default: "User"
        },
        // group id
        group_id: {
            type: String,
            default: ""
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        remember_token: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);