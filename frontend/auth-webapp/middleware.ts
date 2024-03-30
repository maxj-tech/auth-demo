import NextAuth from "next-auth"

import authConfig from "@/auth.config"
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes"

const { auth } = NextAuth(authConfig)

export default auth((req) => {  
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  console.info("Middleware invoked on ROUTE: ", nextUrl.pathname)
  console.info("isLoggedIn: ", isLoggedIn)

  // Define prefix and routes at the beginning or import them from a config module
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

// fixme rework this
// as this logic is super brittle - touch anything and it will break

  // Handle API auth routes - immediately exit for these routes
  if (isApiAuthRoute) 
    return undefined

  // Redirect logic for authenticated users trying to access auth routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return undefined;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  // For all other cases, proceed without modifying the request
  // Explicitly return undefined for clarity, though omitting the return would have the same effect
  return undefined
})

// Optionally, don't invoke Middleware on some paths
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {

  /*  this matcher *only* says on which routes the middleware is active,
   *  i.e. on which routes the auth() function above is called.
   *  it does not say anything about public / protected routes as such !
   */
  // matcher from https://clerk.com/docs/references/nextjs/auth-middleware#usage
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
