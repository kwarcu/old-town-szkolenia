import type { APIRoute } from 'astro';
import site from '../content/site.json';
import courses from '../content/courses.json';
import faq from '../content/faq.json';
import contact from '../content/contact.json';
import team from '../content/team.json';
import reviews from '../content/reviews.json';

/* /llms.txt — the same facts as the page, generated from the same content files. */
export const GET: APIRoute = ({ site: origin }) => {
  const url = origin?.toString() ?? '';
  const a = contact.address;
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.brief}`,
    '',
    `Stan na ${site.updatedLabel}. Strona: ${url}`,
    '',
    '## Szkolenia',
    ...courses.items.flatMap((c) => [
      `- ${c.name} (${url}#${c.id}): ${c.days} ${c.daysLabel}, grupa ${c.group}, terminy: ${c.cohorts.map((k) => k.label).join(', ')}. ${c.priceLabel}: ${c.depositShort ?? `${c.price}, ${c.deposit}`}. ${c.certificate}.`,
    ]),
    `- ${courses.includedLabel}: ${courses.included} ${courses.groupRule}`,
    '',
    '## Jak wygląda szkolenie',
    `${site.day.intro}`,
    ...site.day.steps.map((s) => `- ${s.n} ${s.title}: ${s.text}`),
    '',
    '## Kto uczy',
    ...team.map((t) => `- ${t.full}${t.full !== t.name ? ` (${t.name})` : ""}, ${t.role}. ${t.bio}`),
    '',
    '## Opinie',
    `- Salon Barber Shop Old Town: ocena ${reviews.rating} z ${reviews.count} opinii na ${reviews.source} (stan na ${reviews.checked}). ${reviews.note}`,
    '',
    '## Pytania i odpowiedzi',
    ...faq.map((f) => `- ${f.q} ${f.a}`),
    '',
    '## Kontakt',
    `- ${a.name}, ${a.street}, ${a.postal} ${a.city}, woj. ${a.region}. Tel. ${contact.phone}. E-mail: ${contact.email}.`,
    `- ${contact.directions}`,
    '',
    site.synonyms,
    '',
    '## Linki',
    `- Strona: ${url}`,
    `- Instagram: ${site.social.instagram}`,
    `- Booksy: ${site.social.booksy}`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
