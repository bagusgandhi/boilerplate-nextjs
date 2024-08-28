import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import BeApiService from '@/utils/services/be-api.service';
// import { Env } from '@/common/env';

// export const authOptions = {
//   trustHost: true,
//   pages: {
//     signIn: '/auth/login',
//     error: undefined,
//   },
//   providers: [
//     CredentialsProvider({
//       id: 'cred-email-password',
//       name: 'custom',
//       credentials: {
//         email: {
//           label: 'Email',
//           type: 'text',
//           placeholder: 'your@mail.co',
//         },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         const beApiService = new BeApiService();
//         const response = await beApiService.request('/auth/login', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Accept: 'application/json',
//           },
//           data: {
//             email: credentials?.email,
//             password: credentials?.password,
//           },
//         });

//         const user = response.data;

//         // console.log("credentials", credentials)
//         // console.log("response", response)

//         if (!user) return null;

//         return user;
//       },
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account, profile, email, credentials }: any) {
//         // console.log("response", response)
//         account.response = {
//           access_token: user?.access_token,
//           id: user?.user?.id,
//           role: user?.user?.roles[0],
//           name: user?.user?.name,
//           email: user?.user?.email,
//         };


//         return true;
//     },
//     async session({ session, token, user }: any) {
//       session.user.name = token.account.response.name ?? token.account.response.profile.name;
//       session.user.email = token.account.response.email ?? token.account.response.profile.email;
//       session.user.id = token.account.response.id;
//       session.user.role = token.account.response.role;
//       // session.access_token = token.account.response.access_token;

//       // console.log("session",  token.account.response)
//       return session;
//     },
//     secret: Env.NEXTAUTH_SECRET,
//     async jwt({ token, user, account, profile, isNewUser }: any) {

//       if (account) {
//         token.account = {
//           ...account,
//           // access_token: user?.access_token, // <-- add token to JWT (Next's) object
//           // roles: user?.roles,
//         };
//       }

//       // console.log("user", user)
//       // console.log("token", token)


//       return token;
//     },
//   },
//   jwt: {
//     maxAge: 60 * 60 * 24,
//   },
// };

const handlers = NextAuth(authOptions);

export { handlers as GET, handlers as POST };
