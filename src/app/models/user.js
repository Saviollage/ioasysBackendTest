const mongoose = require("../../database/database");
const { hash } = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    isActive: {
        type: Boolean,
        default: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre("save", async function (next) {
    const hashPass = await hash(this.password, 10);
    this.password = hashPass;
    next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;