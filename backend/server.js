import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Voter, Election } from './models.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Simulated OTP Login
app.post('/api/auth/login', async (req, res) => {
    const { voterId, otp } = req.body;
    
    // Simulate OTP verification
    if (otp !== process.env.VOTER_OTP_SECRET) {
        return res.status(401).json({ message: 'Invalid OTP' });
    }

    try {
        let voter = await Voter.findOne({ voterId });
        if (!voter) {
            return res.status(404).json({ message: 'Voter not registered' });
        }

        const token = jwt.sign({ id: voter._id, voterId: voter.voterId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, voter });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Voter Registration (Hackathon Mock)
app.post('/api/auth/register', async (req, res) => {
    const { voterId, name } = req.body;
    try {
        const newVoter = new Voter({ voterId, name });
        await newVoter.save();
        res.status(201).json(newVoter);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get Election Info
app.get('/api/election/info', async (req, res) => {
    try {
        let election = await Election.findOne();
        if (!election) {
            election = new Election({
                candidates: [
                    { id: 1, name: 'Candidate Apple' },
                    { id: 2, name: 'Candidate Banana' },
                    { id: 3, name: 'Candidate Cherry' }
                ]
            });
            await election.save();
        }
        res.json(election);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
