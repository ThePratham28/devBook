import passport from "passport";
import { User } from "../models/user.model.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.BASE_URL+"/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists by googleId
                let user = await User.findOne({
                    where: { googleId: profile.id },
                });

                if (user) {
                    user.lastLogin = Date.now();
                    await user.save();
                    return done(null, user);
                }

                // check if user already exists by traditional signup
                const existingUser = await User.findOne({
                    where: { email: profile.emails[0].value },
                });

                if (existingUser) {
                    existingUser.googleId = profile.id;
                    existingUser.isVerified = true;
                    await existingUser.save();
                    return done(null, existingUser);
                }

                // Create new user
                const newUser = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    password: Math.random().toString(36).slice(-12),
                    isVerified: true,
                });

                return done(null, newUser);
            } catch (error) {
                console.error("Error in Google Strategy", error);
                done(error, null);
            }
        }
    )
);

export default passport;