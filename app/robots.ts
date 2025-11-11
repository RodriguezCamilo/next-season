export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://nextseason.app/sitemap.xml'
  };
}
