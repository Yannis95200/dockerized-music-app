import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import "./auth.js";
import registerRoute from './routes/registerRoutes.js';

mongoose.connect("mongodb://localhost:27017/radiooooo-auth")
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.error("Erreur MongoDB :", err));

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
  secret: 'unmotsecretdev',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(registerRoute);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
