import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import crmRoutes from './routes/crm.routes.js';
import hrRoutes from './routes/hr.routes.js';
import serviceRequestRoutes from './routes/service-requests.routes.js';
import clientRoutes from './routes/client.routes.js';
import financeRoutes from './routes/finance.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import adminRoutes from './routes/admin.routes.js';
import aiRoutes from './routes/ai.routes.js';
import announcementRoutes from './routes/announcement.routes.js';
import recruitmentRoutes from './routes/recruitment.routes.js';
import marketingRoutes from './routes/marketing.routes.js';
import { initSocket } from './config/socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
initSocket(server);
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/service-requests', serviceRequestRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/recruitment', recruitmentRoutes);
app.use('/api/marketing', marketingRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'BusinessOS API is running' });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
