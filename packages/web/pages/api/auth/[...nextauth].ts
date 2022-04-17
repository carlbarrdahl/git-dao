import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Set access_token to session
      session.accessToken = token.accessToken;
      return session;
    },
    async redirect({ url, baseUrl }) {
      const redirect = new URL(url).searchParams.get("redirect");
      return redirect || url || baseUrl;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
});
