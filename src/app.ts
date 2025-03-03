import express from "express";
import bodyParser from "body-parser";
import sequelize from "./database";
import contractRoutes from "./controllers/contract/contract.route";
import jobRoutes from "./controllers/job/job.route";
import balanceRoutes from "./controllers/balance/balance.route";
import adminRoutes from "./controllers/admin/admin.route";
import { successHandler } from "./middleware/success-handler.middleware";
import { errorHandler } from "./middleware/error-handler.middleware";
import { authMiddleware } from "./middleware/auth.middleware";
import pinoHttp from "pino-http";
import logger from "./utils/logger";
import { adminAuthMiddleware } from "./middleware/admin-auth.middleware";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

app.use(
  helmet({
    xssFilter: false,
  })
);

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);

app.use(cors());

app.use(
  pinoHttp({
    logger,
    customLogLevel: (request, response, err) => {
      if (response.statusCode >= 500 || err) return "error";
      if (response.statusCode >= 400) return "warn";
      return "info";
    },
    serializers: {
      request: (request) => ({
        method: request.method,
        url: request.url,
        query: request.query,
        params: request.params,
      }),
      response: (response) => ({
        statusCode: response.statusCode,
      }),
    },
  })
);

// Middleware for parsing JSON request bodies
app.use(bodyParser.json());

// Attach Sequelize instance and models to the app for easy access
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

// Authentication middleware (applied globally)
app.use(authMiddleware);

// Register API routes
app.use("/contracts", contractRoutes);
app.use("/jobs", jobRoutes);

// Apply adminAuthMiddleware only to admin routes
app.use("/balances", adminAuthMiddleware, balanceRoutes);
app.use("/admin", adminAuthMiddleware, adminRoutes);

// Middleware for handling successful API responses
app.use(successHandler);

// Global error handling middleware
app.use(errorHandler);

/**
 * Catch-all route handler for unmatched routes.
 * Returns a 404 response for undefined routes.
 */
app.use((request, response, next) => {
  response.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route ${request.method} ${request.originalUrl} not found`,
  });
});

export default app;
function cors(): any {
  throw new Error("Function not implemented.");
}
