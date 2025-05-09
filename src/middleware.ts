import { defineMiddleware } from "astro:middleware";
import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";

const isProtectedRoute = createRouteMatcher([
  "/docs(.*)",
])

// Middleware de Clerk
const clerk = clerkMiddleware((auth, context) => {
  const { userId, redirectToSignIn } = auth();
  
  if (isProtectedRoute(context.request)) {
    if (!userId) {
      return redirectToSignIn();
    }
  }
});

// Middleware de redirección de idioma (en proceso de desarrollo)
export const onRequest = defineMiddleware(async (context, next) => {
  // Primero aplicamos el middleware de Clerk
  const clerkResponse = await clerk(context, next);
  if (clerkResponse) return clerkResponse;
  
  // Si ya estamos en una ruta de idioma, continuar
  const url = new URL(context.request.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);
  
  const supportedLanguages = ['de', 'en', 'fr', 'es'];
  
  // Si ya estamos en una ruta de idioma, continuar
  if (pathSegments.length > 0 && supportedLanguages.includes(pathSegments[0])) {
    return next();
  }
  
  // Detectar idioma del navegador
  const acceptLanguage = context.request.headers.get('accept-language');
  console.log(`Idioma detectado: ${acceptLanguage}`);
  
  if (acceptLanguage) {
    const fullLanguage = acceptLanguage.split(',')[0];
    const baseLanguage = fullLanguage.split('-')[0];

    console.log(`Idioma completo: ${fullLanguage}, Idioma base: ${baseLanguage}`);
    
    // Redirigir a idioma soportado o inglés por defecto
    // const targetLang = supportedLanguages.includes(baseLanguage) ? baseLanguage : 'en';
    // return context.redirect(`/${targetLang}${url.pathname === '/' ? '' : url.pathname}`);
  }

  switch (acceptLanguage) {
    case 'de':
    case 'fr':
      break;
    case 'en':      
      context.locals.title = 'Hello Astro english';
      break;
    case 'es':      
      context.locals.title = 'Hola Astro español';
      break;
    default:        
      context.locals.title = 'Hello Astro english';
      break;
  }
  
  return next();
});
