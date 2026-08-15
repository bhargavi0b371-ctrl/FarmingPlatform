import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index.js';
import routes from './routes/index.js';
import { errorHandler, notFound, apiLimiter } from './middleware/index.js';
import schedulerService from './services/schedulerService.js';
import { ensureDatabaseSchema } from './config/prisma.js';
const app = express();
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: config.frontend.url, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api', apiLimiter);
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);
const PORT = config.port;
async function startServer() {
    await ensureDatabaseSchema();
    app.listen(PORT, () => {
        console.log(`EcoFarm API running on port ${PORT}`);
        console.log(`Health: http://localhost:${PORT}/api/health`);
        schedulerService.start();
    });
}
startServer().catch((error) => {
    console.error('Failed to start EcoFarm API:', error);
    process.exit(1);
});
export default app;
