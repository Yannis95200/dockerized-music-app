import express from "express";
import passport from "passport";
import User from "../model/User.js";

const router = express.Router();


router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Email déjà utilisé ou invalide" });
  }
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ logged: true, user: req.user.email });
});


const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized" });
};

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
