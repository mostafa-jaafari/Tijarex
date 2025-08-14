import { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth as ClientAuth } from "@/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { genareteUniqueUsername } from "@/components/Functions/generateUniqueUsername";

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image: string;
      role: string;
    };
  }

  interface JWT {
    id: string;
    email: string;
    name: string;
    picture: string;
    role: string;
  }
}

// Extend the Profile type to include picture property
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
const Admins = ["jaafarimostafa081@gmail.com"];

// Helper function to determine role
const getUserRole = (email: string): string => {
  if (Admins.includes(email)) {
    return "admin";
  }
  return "seller";
};

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXTAUTH_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXTAUTH_GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.NEXTAUTH_GITHUB_CLIENT_ID!,
      clientSecret: process.env.NEXTAUTH_GITHUB_CLIENT_SECRET!,
      profile(profile: GitHubProfile) {
        const fallbackEmail = profile.email || `${profile.login}@github.com`;
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: fallbackEmail,
          image: profile.avatar_url,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (credentials?.email && credentials?.password) {
            const userCredential = await signInWithEmailAndPassword(
              ClientAuth,
              credentials.email,
              credentials.password
            );
            
            const user = userCredential.user;
            if (!user.emailVerified) {
              throw new Error("Email not verified");
            }
            return {
              id: user.uid,
              email: user.email,
              name: user.displayName || "Guest",
              image: user.photoURL || "https://s.gravatar.com/avatar/0743d216d4ce5aea55b0a45675d313e4?s=64&d=mp",
            };
          }
          return null;
        } catch (error) {
          console.error("Error during Firebase sign-in:", error);
          return null;
        }
      },
    })
  ],
  callbacks: {
    async signIn({ user, profile }) {
      try {
        if (profile?.email) {
          const userRef = doc(db, "users", profile.email);
          const userSnap = await getDoc(userRef);

          const fallbackName =
            profile.name ||
            (profile as GitHubProfile).login ||
            profile.email?.split("@")[0]?.replace(/\./g, " ").replace(/\b\w/g, c => c.toUpperCase()) ||
            "Guest";
          
          const UniqueUserName = await genareteUniqueUsername(profile?.name || fallbackName);
          
          // Determine role based on email
          const userRole = getUserRole(profile.email);

          if (!userSnap.exists()) {
            await setDoc(userRef, {
              id: profile.sub || user.id,
              email: profile.email,
              name: fallbackName,
              profileimage: user.image,
              isPrivateProfile: false,
              username: UniqueUserName,
              role: userRole, // Use determined role instead of hardcoded "seller"
            });
          }
        }

        return true;
      } catch (error) {
        console.error("🔥 Firestore error in signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, account, profile, user }) {
      // Only fetch from Firestore on first login (when account exists)
      if (account) {
        try {
          const email = profile?.email || user?.email || token.email;
          
          if (!email) {
            console.warn("No email found for user");
            return token;
          }

          console.log("🔥 JWT Callback - Processing user:", email);

          // Get user data from Firestore
          const userRef = doc(db, "users", email);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();

          // OAuth providers (Google, GitHub)
          if (profile) {
            const extendedProfile = profile as ExtendedProfile;
            token.id = extendedProfile.sub || user?.id || "";
            token.email = email;
            token.name = extendedProfile.name || 
                        (profile as GitHubProfile).login || 
                        email.split("@")[0] || 
                        "Guest";
            token.picture = extendedProfile.picture || 
                           extendedProfile.image || 
                           user?.image || 
                           "";
          }
          
          // Credentials provider
          if (account.type === "credentials" && user) {
            token.id = user.id;
            token.email = user.email || "";
            token.name = user.name || "Guest";
            token.picture = user.image || "";
          }

          // Set role from Firestore or determine from email
          token.role = userData?.role || getUserRole(email);

          console.log("🔥 JWT Token created:", { 
            id: token.id, 
            email: token.email, 
            role: token.role 
          });

        } catch (error) {
          console.error("Error in JWT callback:", error);
          // Fallback values
          token.role = getUserRole(token.email || "");
        }
      }

      return token;
    },

    async session({ session, token }) {
      console.log("🔥 Session Callback - Token received:", token);
      
      try {
        session.user = {
          id: (token.id as string) || "",
          email: (token.email as string) || session.user?.email || "",
          name: (token.name as string) || session.user?.name || "Guest",
          image: (token.picture as string) || session.user?.image || "",
          role: (token.role as string) || "seller",
        };
        
        console.log("🔥 Session created:", session.user);
        
      } catch (error) {
        console.error("Error in session callback:", error);
        // Ensure we always have a role
        if (session.user) {
          session.user.role = "seller";
        }
      }
      
      return session;
    },
  },
};