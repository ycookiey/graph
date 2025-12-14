import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

const isProtectedRoute = createRouteMatcher(['/app(.*)']);

export const onRequest = clerkMiddleware((auth, context, next) => {
  if (isProtectedRoute(context.request)) {
    const authObject = auth();
    if (!authObject.userId) {
      return authObject.redirectToSignIn();
    }
  }

  return next();
});
