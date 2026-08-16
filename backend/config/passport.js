import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import config from "./config.js";

passport.use(
  new GoogleStrategy(
    {
      clientID:     config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL:  config.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email from Google profile"), null);

        let user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: email.toLowerCase(),
            provider: "google",
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value || null,
            plan: "free",
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          user.avatar = user.avatar || profile.photos?.[0]?.value;
          await user.save({ validateBeforeSave: false });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;