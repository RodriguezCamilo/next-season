// src/i18n/request.ts
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  const fallback = 'es';
  let l = locale ?? fallback;
  if (l !== 'es' && l !== 'en') l = fallback;

  return {
    locale: l,
    messages: (await import(`../messages/${l}.json`)).default
  };
});
