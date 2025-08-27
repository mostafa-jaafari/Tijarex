import { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth as ClientAuth } from "@/lib/FirebaseClient";
import { signInWithEmailAndPassword } from "firebase/auth";
import { genareteUniqueUsername } from "@/components/Functions/generateUniqueUsername";
import { UserInfosType } from "@/types/userinfos";

// Extend NextAuth types to include the 'role'
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image: string;
      role?: string; // <-- ADDED: Role is now part of the session user object
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string; // <-- ADDED: Role is now part of the JWT token
  }
}

// Interfaces for different OAuth profiles
interface ExtendedProfile {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
  image?: string;
}

interface GitHubProfile {
  id: number;
  name: string | null;
  login: string;
  email: string | null;
  avatar_url: string;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }
          
          const userCredential = await signInWithEmailAndPassword(
            ClientAuth,
            credentials.email,
            credentials.password
          );

          const user = userCredential.user;
          return {
            id: user.uid,
            email: user.email,
            name: user.displayName,
            image: user.photoURL,
          };
        } catch (error) {
          console.error("Error during Firebase sign-in:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      // This callback runs for OAuth providers. For credentials, user data
      // should already exist from your registration flow.
      try {
        if (profile?.email) {
          const userRef = doc(db, "users", profile.email);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            const fallbackName =
              profile.name ||
              (profile as GitHubProfile).login ||
              profile.email?.split("@")[0] ||
              "User";
            const uniqueUserName = await genareteUniqueUsername(fallbackName);

            await setDoc(userRef, {
              id: user.id,
              email: profile.email,
              name: fallbackName,
              profileimage: user.image,
              isPrivateProfile: false,
              username: uniqueUserName,
              UserRole: "affiliate", // Assign a default role on creation
            });
          }
        }
        return true;
      } catch (error) {
        console.error("🔥 Firestore error in signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      // This function is called first to create/update the JWT.
      // The role is added here.
      if (user) {
        token.id = user.id;
      }

      if (token.email) {
        const userRef = doc(db, "users", token.email);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data() as UserInfosType;
          // IMPORTANT: Add the role to the token
          token.role = userData.UserRole || "affiliate"; 
        } else {
          // Default role if user doc doesn't exist for some reason
          token.role = "affiliate";
        }
      }
      return token;
    },

    async session({ session, token }) {
      // This function makes token data available to the client-side session object.
      // We must pass the role from the token to the session here.
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role; // <-- CRITICAL FIX: Pass role to the session
      }
      return session;
    },
  },
};