import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import roomRoutes from './routes/roomRoutes'
import authRoutes from './routes/authRoutes';
import usersRoutes from './routes/usersRoutes';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger';

dotenv.config();

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());

// Routes Setup
app.use('/api', authRoutes);
app.use('/api', usersRoutes);
// Uncomment or add additional routes as needed
// app.use('/api', feedBackRoutes);
app.use('/api', roomRoutes)

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err.message });
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start Server
app.listen(PORT, () => {
  console.log(`Your Server is running on port ${PORT}`);
});

export default app;
