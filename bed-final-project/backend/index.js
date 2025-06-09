//dotenv.config();
//import dotenv from "dotenv";
import express from "express";
//setting Sentry
import * as Sentry from "@sentry/node";
import "dotenv/config";

//Routers
import loginRouter from "./src/routes/login.js";
import usersRouter from "./src/routes/users.js";
import bookingsRouter from "./src/routes/bookings.js";
import propertiesRouter from "./src/routes/properties.js";
import amenitiesRouter from "./src/routes/amenities.js";
import hostsRouter from "./src/routes/hosts.js";
import reviewsRouter from "./src/routes/reviews.js";
//Hulpmiddellen
import log from "./src/middleware/logMiddleware.js";
import errorHandler from "./src/middleware/erroHandler.js";
//import authLocal from "./src/middleware/authLocal.js";

//----import-------------

const app = express();

// Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({
      tracing: true,
    }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({
      app,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!,
});

// Trace incoming requests
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

//Algemene middleware
app.use(express.json());
app.use(log);

//Login
app.use("/login", loginRouter);

//Routes
app.use("/users", usersRouter);
app.use("/bookings", bookingsRouter);
app.use("/properties", propertiesRouter);
app.use("/amenities", amenitiesRouter);
app.use("/hosts", hostsRouter);
app.use("/reviews", reviewsRouter);

//Home Route
app.get("/", (req, res) => {
  res.send("Hello world!  met Sentry actief!");
});
//sentry error handling
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// Error handling
app.use(Sentry.Handlers.errorHandler());
app.use(errorHandler);

app.listen(3000, () => {
  console.log(`Server draait op http://localhost:3000`);
});
