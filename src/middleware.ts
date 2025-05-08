import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
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
  
  if (acceptLanguage) {
    const fullLanguage = acceptLanguage.split(',')[0];
    const baseLanguage = fullLanguage.split('-')[0];
    
    console.log(`Idioma completo: ${fullLanguage}, Idioma base: ${baseLanguage}`);
    
    // Redirigir a idioma soportado o inglés por defecto
    // const targetLang = supportedLanguages.includes(baseLanguage) ? baseLanguage : 'en';
    // return context.redirect(`/${targetLang}${url.pathname === '/' ? '' : url.pathname}`);
  }
  
  return next();
});
