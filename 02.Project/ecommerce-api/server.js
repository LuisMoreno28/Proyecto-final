import express from 'express';
import dotenv from 'dotenv';
import routes from './src/routes/index.js';
import dbConnection from './src/config/database.js';
import logger from './src/middlewares/logger.js';
import errorHandler from './src/middlewares/errorHandler.js';
import setupGlobalErrorHandlers from './src/middlewares/globalErrorHandler.js';
import cors from 'cors';
import initializeData from './src/config/initializeData.js';

dotenv.config();

setupGlobalErrorHandlers();

const allowedOrigins = [ 
  'http://localhost:4200',
  'https://proyectofinal-1-tm89.onrender.com', //Agregando dominios
];

const app = express();
dbConnection();
console.log("CORS ORIGIN:", process.env.FRONT_APP_URL);
app.use(
  cors({

    origin(origin, callback) {
      // Para Postman o llamadas sin origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.send('WELCOME!');
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    method: req.method,
    url: req.originalUrl
  });
});

if (process.env.INITIAL_DATA === "development") {
  console.log("Development environment, creating mocking data...");
  initializeData();
}

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

