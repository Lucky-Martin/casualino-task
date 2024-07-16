import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { ConnectOptions } from 'mongoose';
import { authRouter } from './api/routes/auth';
import { json, urlencoded } from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGODB_URL!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_HOST_URL!
}));

app.use(urlencoded({ extended: true }));
app.use(json());

app.use('/api/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
