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
    };
  }

  interface JWT {
    id: string;
    picture: string;
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
        const fallbackEmail = profile.email || `${profile.login}@github.com`; // fallback dummy email if null
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
            return {
              id: user.uid,
              email: user.email,
              name: user.displayName || "UnknowUser",
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
            "User";
            const UniqueUserName = await genareteUniqueUsername(profile?.name || fallbackName)


          if (!userSnap.exists()) {
            await setDoc(userRef, {
              id: profile.sub || user.id,
              email: profile.email,
              name: fallbackName,
              profileimage: user.image,
              isPrivateProfile: false,
              username: UniqueUserName,
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
      if (account && profile) {
        const extendedProfile = profile as ExtendedProfile;

        token.id = extendedProfile.sub || user?.id || "";
        token.email = extendedProfile.email || user?.email || "";
        token.name =
          extendedProfile.name ||
          (profile as GitHubProfile).login ||
          extendedProfile.email?.split("@")[0] ||
          "User";
        token.picture =
          extendedProfile.picture ||
          extendedProfile.image ||
          user?.image ||
          "";
      }

      if (account?.type === "credentials" && user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image || "";
      }

      return token;
    },


    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        image: (token.picture as string) || session.user?.image || "",
      };
      return session;
    },
  },
};