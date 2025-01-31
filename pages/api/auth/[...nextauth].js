// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await dbConnect();

      // Check if the user exists in the database
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        // Create a new user in the database
        await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
        });
      }

      return true; // Allow sign-in
    },
    async session({ session }) {
      await dbConnect();

      // Attach the user ID to the session
      const user = await User.findOne({ email: session.user.email });
      session.user.id = user._id;

      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Optional: Custom sign-in page
  },
  secret: process.env.NEXTAUTH_SECRET, // Strong random value
};

export default NextAuth(authOptions);
