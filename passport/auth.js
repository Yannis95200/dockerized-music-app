import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "./model/User.js";

// Initialisation straégie
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: "Email invalide " });

        const valid = await user.checkPassword(password);
        if (!valid)
          return done(null, false, { message: "mots de passe incorrect" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Sérialisation

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
});
