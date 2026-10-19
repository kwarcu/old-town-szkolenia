import type { APIRoute } from 'astro';

/* robots.txt — every crawler, including the ones that feed AI answers, is welcome (PRD §8.5). */
export const GET: APIRoute = ({ site }) => {
  const base = new URL(import.meta.env.BASE_URL, site).toString();
  const bots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'PerplexityBot', 'Google-Extended', 'Applebot', 'CCBot'];
  const body = ['User-agent: *', 'Allow: /', '', ...bots.flatMap((b) => [`User-agent: ${b}`, 'Allow: /']), '', `Sitemap: ${base}sitemap-index.xml`, ''].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
