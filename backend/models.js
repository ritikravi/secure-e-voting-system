import mongoose from 'mongoose';

const voterSchema = new mongoose.Schema({
    voterId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    hasVoted: { type: Boolean, default: false },
    walletAddress: { type: String },
    registrationDate: { type: Date, default: Date.now }
});

export const Voter = mongoose.model('Voter', voterSchema);

const electionSchema = new mongoose.Schema({
    status: { type: String, enum: ['upcoming', 'ongoing', 'ended'], default: 'upcoming' },
    title: { type: String, default: 'Hackathon Election 2026' },
    candidates: [{
        id: Number,
        name: String
    }]
});

export const Election = mongoose.model('Election', electionSchema);
