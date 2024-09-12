import express from 'express';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
const app = express();
const PORT = process.env.PORT || 3000;
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
