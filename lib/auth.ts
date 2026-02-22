import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { ensureUserExists } from "./queries";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user }) {
            if (user.email && user.name) {
                // Run database operation in the background so it doesn't block the OAuth redirect
                ensureUserExists(user.name, user.email, user.image || "").catch((error) => {
                    console.error("Error creating user record:", error);
                });
            }
            return true;
        },
    },
};
