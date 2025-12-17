const { Schema, model } = require("mongoose")
const {ROLES} =require("../../../../constants/roles")
const addressSchema = new Schema({
    name: String,
    phone: String,
    street: String,
    ward: String,
    district: String,
    province: String,
    isDefault: {
        type: Boolean,
        default: false
    },

}, {
    _id: false
})

const userSchema = new Schema({
    fullName: { type: String, trim: true },
    email: { type: String, trim: true, unique: true, sparse: true },
    phone: { type: String, trim: true, unique: true, sparse: true },
    passwordHash: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(ROLES),
        default: ROLES.USER,
    },
    addresses: [addressSchema],
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = model("User", userSchema);