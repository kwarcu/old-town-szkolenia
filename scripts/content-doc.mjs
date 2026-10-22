// Generates docs/content-doc/teksty-strony.docx: every editable text of the page, section by
// section, next to a phone screenshot of that section. The owner edits the right column in
// Google Docs; scripts/content-doc-import.mjs reads the edited .docx back into src/content/*.json.
//
// Usage: node scripts/content-doc.mjs   (run `npm run build && node scripts/screenshots.mjs` first
// if the screenshots in docs/content-doc/crops/ should be refreshed; see docs/content-doc/README.md)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType,
  ImageRun, HeadingLevel, AlignmentType, BorderStyle, PageBreak,
} from 'docx';

const content = Object.fromEntries(['site', 'courses', 'team', 'faq', 'gallery', 'contact', 'reviews']
  .map((n) => [n, JSON.parse(readFileSync(resolve(`src/content/${n}.json`), 'utf8'))]));
const crops = resolve('docs/content-doc/crops');

/* ---------- read a value by key: "site.hero.headline", "faq[3].a", "team[1].bio" ---------- */
const get = (key) => {
  const [, file, rest] = key.match(/^([a-z]+)(.*)$/);
  let v = content[file];
  for (const m of rest.matchAll(/\.([A-Za-z]+)|\[(\d+)\]/g)) { if (v == null) return undefined; v = v[m[1] ?? Number(m[2])]; }
  return v;
};

/* ---------- document pieces ---------- */
const INK = '161615', MUTED = '6b6b68', PAPER = 'ECE9E0', BRASS = 'C58F34';
const text = (t, o = {}) => new TextRun({ text: t, font: 'Arial', size: 20, color: INK, ...o });
const para = (t, o = {}) => new Paragraph({ children: [text(t, o.run)], spacing: { after: 120 }, ...o.p });
const small = (t) => para(t, { run: { size: 17, color: MUTED } });
const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: t, font: 'Arial', size: 36, bold: true, color: INK })], spacing: { before: 240, after: 120 } });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: t, font: 'Arial', size: 26, bold: true, color: INK })], spacing: { before: 240, after: 80 } });
const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

const image = (file, maxW = 300, maxH = 560) => {
  const path = resolve(crops, file);
  if (!existsSync(path)) return para(`[brak zrzutu: ${file}]`, { run: { color: MUTED, italics: true } });
  const buf = readFileSync(path);
  // JPEG size from the SOF marker
  let i = 2, w = 0, h = 0;
  while (i < buf.length) { if (buf[i] !== 0xff) break; const m = buf[i + 1]; const len = buf.readUInt16BE(i + 2); if (m >= 0xc0 && m <= 0xc3) { h = buf.readUInt16BE(i + 5); w = buf.readUInt16BE(i + 7); break; } i += 2 + len; }
  const s = Math.min(maxW / w, maxH / h, 1);
  return new Paragraph({ children: [new ImageRun({ type: 'jpg', data: buf, transformation: { width: Math.round(w * s), height: Math.round(h * s) } })], spacing: { after: 160 } });
};

const W = 9638; // text width in DXA (A4 minus 2 cm margins)
const cell = (children, width, shade) => new TableCell({ children, width: { size: width, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 100, right: 100 }, shading: shade ? { type: ShadingType.CLEAR, fill: shade, color: 'auto' } : undefined, verticalAlign: 'top' });

/* a field row: label + key on the left, the editable text on the right */
const fieldRow = (label, key, value, note) => {
  const lines = value == null || value === '' ? [''] : String(value).split('\n');
  const left = [para(label, { run: { bold: true, size: 18 } }), new Paragraph({ children: [text(key, { size: 13, color: MUTED, font: 'Courier New' })], spacing: { after: 0 } })];
  if (note) left.push(new Paragraph({ children: [text(note, { size: 15, color: MUTED, italics: true })], spacing: { before: 60, after: 0 } }));
  const right = lines.map((l, i) => new Paragraph({ children: [text(l, { size: 21 })], spacing: { after: i === lines.length - 1 ? 0 : 80 } }));
  return new TableRow({ children: [cell(left, 3000, PAPER), cell(right, W - 3000)] });
};
const fieldTable = (rows) => new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [3000, W - 3000], rows,
  borders: { top: { style: BorderStyle.SINGLE, size: 4, color: 'C8C3B6' }, bottom: { style: BorderStyle.SINGLE, size: 4, color: 'C8C3B6' }, left: { style: BorderStyle.NONE, size: 0 }, right: { style: BorderStyle.NONE, size: 0 }, insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'C8C3B6' }, insideVertical: { style: BorderStyle.NONE, size: 0 } } });

/* a field spec: [label, key, note?]; value comes from the content files unless given */
const F = (label, key, note) => fieldRow(label, key, get(key), note);
const EMPTY = (label, key, note) => fieldRow(label, key, '', note);

/* ---------- the sections, in page order ---------- */
const sections = [];
const section = (title, crop, intro, rows, extra = []) => sections.push({ title, crop, intro, rows, extra });

section('1. Nagłówek strony', 'hero.jpg', 'Pierwszy ekran: zdjęcie, mały napis, nagłówek główny, pasek z faktami, podtytuł, przycisk i cytat.', [
  F('Mały napis nad nagłówkiem', 'site.hero.kicker', 'Wielkimi literami, z kropką na końcu dodaną automatycznie.'),
  F('Nagłówek główny', 'site.hero.headline'),
  F('Podtytuł', 'site.hero.sub'),
  F('Cytat pod przyciskiem', 'site.hero.quote'),
  F('Przycisk', 'site.hero.ctaPrimary', 'Ten sam napis jest na dolnym pasku na telefonie.'),
  F('Przycisk „Zadzwoń” (dolny pasek)', 'site.hero.ctaCall'),
  fieldRow('Pasek z faktami', '(automatyczny)', `${get('courses.items[0].days')} dni od podstaw · ${get('courses.items[0].group')} · ${get('courses.items[0].price')} · start ${get('courses.items[0].cohorts[0].label')}`, 'Składa się sam z danych szkolenia od podstaw (sekcja 2): liczba dni, grupa, cena, pierwszy termin.'),
]);

const c0 = 'courses.items[0]', c1 = 'courses.items[1]';
section('2. Szkolenia', 'szkolenia.jpg', 'Dwie karty: szkolenie od podstaw (21 dni) i szkolenie 10-dniowe. Pod nimi wspólna informacja, co jest w cenie.', [
  F('Tytuł sekcji', 'courses.title'),
  F('Wstęp pod tytułem', 'courses.lede'),
  F('Etykieta „W cenie obu szkoleń”', 'courses.includedLabel'),
  F('Co jest w cenie', 'courses.included', 'Zdanie zaczyna się po dwukropku, dlatego małą literą.'),
  F('Zasada minimalnej grupy', 'courses.groupRule'),
], [
  { title: 'Karta: szkolenie od podstaw', rows: [
    F('Pełna nazwa szkolenia', `${c0}.name`, 'Używana w formularzu, w Google i dla asystentów AI.'),
    F('Tytuł na karcie', `${c0}.short`),
    F('Liczba dni', `${c0}.days`, 'Liczba. Trafia też do paska z faktami.'),
    F('Podpis przy liczbie', `${c0}.daysLabel`),
    F('Termin 1', `${c0}.cohorts[0].label`),
    F('Termin 2', `${c0}.cohorts[1].label`),
    F('Wielkość grupy', `${c0}.group`),
    F('Dla kogo (opis)', `${c0}.forWhom`),
    F('Punkt 1', `${c0}.learn[0]`),
    F('Punkt 2', `${c0}.learn[1]`),
    F('Punkt 3', `${c0}.learn[2]`),
    F('Punkt 4', `${c0}.learn[3]`, 'Na stronie widać trzy pierwsze punkty; czwarty jest w opisie dla asystentów AI.'),
    F('Etykieta ceny', `${c0}.priceLabel`),
    F('Cena', `${c0}.price`),
    F('Zaliczka', `${c0}.deposit`),
    F('Nazwa certyfikatu', `${c0}.certificate`, 'Pojawia się w pytaniach i w opisie dla asystentów AI.'),
  ] },
  { title: 'Karta: szkolenie 10-dniowe', rows: [
    F('Pełna nazwa szkolenia', `${c1}.name`),
    F('Tytuł na karcie', `${c1}.short`),
    F('Liczba dni', `${c1}.days`),
    F('Podpis przy liczbie', `${c1}.daysLabel`),
    F('Termin 1', `${c1}.cohorts[0].label`),
    F('Termin 2', `${c1}.cohorts[1].label`),
    F('Wielkość grupy', `${c1}.group`),
    F('Dla kogo (opis)', `${c1}.forWhom`),
    F('Punkt 1', `${c1}.learn[0]`),
    F('Punkt 2', `${c1}.learn[1]`),
    F('Punkt 3', `${c1}.learn[2]`),
    F('Punkt 4', `${c1}.learn[3]`, 'Na stronie widać trzy pierwsze punkty.'),
    F('Etykieta ceny', `${c1}.priceLabel`),
    F('Cena', `${c1}.price`),
    F('Tekst pod ceną', `${c1}.deposit`),
    F('Nazwa certyfikatu', `${c1}.certificate`),
  ] },
]);

section('3. Jak wygląda szkolenie', 'jak-uczymy.jpg', 'Wstęp i cztery kroki dnia w salonie.', [
  F('Tytuł sekcji', 'site.day.title'),
  F('Wstęp', 'site.day.intro'),
  ...[0, 1, 2, 3].flatMap((i) => [F(`Krok 0${i + 1}: tytuł`, `site.day.steps[${i}].title`), F(`Krok 0${i + 1}: opis`, `site.day.steps[${i}].text`)]),
  F('Dłuższa wersja wstępu', 'site.day.introLong', 'Niewidoczna na stronie; czytają ją wyszukiwarki i asystenci AI.'),
]);

section('4. Pasek zdjęć', 'trio.jpg', 'Trzy zdjęcia z podpisami. Na telefonie widać tylko trzecie (golenie), na komputerze wszystkie trzy.', [
  F('Zdjęcie 1 (dłonie z maszynką): podpis', 'site.strip[0].caption'),
  F('Zdjęcie 2 (fotel na posadzce): podpis', 'site.strip[1].caption'),
  F('Zdjęcie 3 (Basia goli): podpis', 'site.strip[2].caption'),
]);

section('5. Kto uczy', 'kto-uczy.jpg', 'Portrety Basi i Kuby z opisami, cytat, a pod nimi „Nasza historia” z latami.', [
  F('Tytuł sekcji', 'site.team.title'),
  F('Wstęp', 'site.team.note'),
], [
  { title: 'Basia', rows: [
    F('Imię (nagłówek)', 'team[0].name'),
    F('Imię i nazwisko', 'team[0].full', 'Wyświetlane obok roli i w danych dla Google.'),
    F('Rola', 'team[0].role'),
    F('Opis', 'team[0].bio'),
    F('Cytat pod portretami', 'team[0].quote', 'Podpisany imieniem.'),
  ] },
  { title: 'Kuba', rows: [
    F('Imię (nagłówek)', 'team[1].name'),
    F('Imię i nazwisko', 'team[1].full', 'Teraz tylko „Kuba”; jeśli ma być nazwisko, wpisz je tutaj.'),
    F('Rola', 'team[1].role'),
    F('Opis', 'team[1].bio', 'Warto dodać, od kiedy strzyże i od kiedy jest w Old Town.'),
  ] },
  { title: 'Nasza historia', rows: [
    F('Tytuł', 'site.history.title'),
    F('Akapit', 'site.history.intro'),
    ...[0, 1, 2, 3].flatMap((i) => [F(`Rok ${i + 1}`, `site.history.items[${i}].year`), F(`Rok ${i + 1}: opis`, `site.history.items[${i}].text`)]),
  ] },
]);

section('6. Galeria', 'galeria.jpg', 'Karuzela 14 zdjęć; po kliknięciu zdjęcie otwiera się na cały ekran. Każde ma krótki podpis.', [
  F('Tytuł sekcji', 'gallery.title'),
  F('Wstęp', 'gallery.lede'),
], [{ title: 'Podpisy zdjęć', gallery: true }]);

section('7. Opinie o salonie', 'opinie.jpg', 'Ocena i liczba opinii z Booksy, zdanie o nowej szkole. Miejsce na cytaty z opinii jest puste: wpisz te, które chcesz pokazać.', [
  F('Tytuł sekcji', 'reviews.title'),
  F('Wstęp', 'reviews.lede'),
  F('Ocena', 'reviews.rating'),
  F('Liczba opinii', 'reviews.count'),
  F('Podpis pod liczbą', 'reviews.countLabel'),
  F('Notka o nowej szkole', 'reviews.note'),
  EMPTY('Opinia 1: treść', 'reviews.quotes[0].text', 'Cytat z Booksy, najlepiej taki, który wspomina Basię, Kubę albo salon.'),
  EMPTY('Opinia 1: kto', 'reviews.quotes[0].who', 'Np. „Marcin, opinia na Booksy”.'),
  EMPTY('Opinia 2: treść', 'reviews.quotes[1].text'),
  EMPTY('Opinia 2: kto', 'reviews.quotes[1].who'),
  EMPTY('Opinia 3: treść', 'reviews.quotes[2].text'),
  EMPTY('Opinia 3: kto', 'reviews.quotes[2].who'),
]);

section('8. Pytania o szkolenie', 'faq.jpg', 'Lista pytań; odpowiedź rozwija się po kliknięciu. Odpowiedzi czytają też wyszukiwarki i asystenci AI, dlatego każda powinna mieć sens sama w sobie (40–80 słów).', [
  F('Tytuł sekcji', 'site.faqTitle'),
  F('Zdanie pod tytułem', 'site.faqLede'),
  ...content.faq.flatMap((_, i) => [F(`Pytanie ${i + 1}`, `faq[${i}].q`), F(`Odpowiedź ${i + 1}`, `faq[${i}].a`)]),
  EMPTY(`Nowe pytanie ${content.faq.length + 1}`, `faq[${content.faq.length}].q`, 'Zostaw puste, jeśli nie chcesz dodawać.'),
  EMPTY(`Nowa odpowiedź ${content.faq.length + 1}`, `faq[${content.faq.length}].a`),
  EMPTY(`Nowe pytanie ${content.faq.length + 2}`, `faq[${content.faq.length + 1}].q`),
  EMPTY(`Nowa odpowiedź ${content.faq.length + 2}`, `faq[${content.faq.length + 1}].a`),
]);

section('9. Kontakt i formularz', 'kontakt.jpg', 'Telefon, e-mail, adres, dojazd i formularz zapytania.', [
  F('Tytuł sekcji', 'contact.title'),
  F('Zdanie nad formularzem', 'contact.intro'),
  F('Telefon (wyświetlany)', 'contact.phone', 'Numer do dzwonienia jest ustawiony osobno; przy zmianie numeru daj znać Bartkowi.'),
  F('E-mail', 'contact.email', 'Adres jeszcze nie istnieje; powstanie razem z domeną.'),
  F('Nazwa miejsca', 'contact.address.name'),
  F('Ulica', 'contact.address.street'),
  F('Kod pocztowy', 'contact.address.postal'),
  F('Miasto', 'contact.address.city'),
  F('Dojazd', 'contact.directions'),
  F('Etykieta pola „szkolenie”', 'contact.form.courseLabel'),
  ...[0, 1, 2].map((i) => F(`Opcja szkolenia ${i + 1}`, `contact.form.courseOptions[${i}]`)),
  ...[0, 1, 2, 3, 4].map((i) => F(`Opcja terminu ${i + 1}`, `contact.form.termOptions[${i}]`)),
  ...[0, 1, 2, 3, 4].map((i) => F(`Opcja doświadczenia ${i + 1}`, `contact.form.expOptions[${i}]`)),
  F('Przycisk wysyłki', 'contact.form.submit'),
  F('Zgoda RODO', 'contact.form.rodo'),
  F('Podziękowanie po wysłaniu', 'contact.form.thanks'),
]);

section('10. Stopka i wyszukiwarka', 'footer.jpg', 'Dół strony oraz teksty, które widać tylko w Google i u asystentów AI.', [
  F('Nazwa szkoły', 'site.name', 'Pełna nazwa używana wszędzie, gdzie strona przedstawia się z nazwy.'),
  F('Dopisek „by …”', 'site.by'),
  F('Adres w stopce', 'site.footer.legal', 'Przed startem dojdzie pełna nazwa firmy i NIP.'),
  F('Tytuł w Google', 'site.title', 'Do 60 znaków.'),
  F('Opis w Google', 'site.description', 'Do 155 znaków.'),
  F('Opis dla asystentów AI', 'site.brief', 'Akapit, który ChatGPT czy Google mogą zacytować w całości.'),
  F('Inne nazwy', 'site.synonyms'),
]);

/* ---------- assemble ---------- */
const children = [];
children.push(new Paragraph({ children: [new TextRun({ text: 'Szkoła Barberingu Old Town', font: 'Arial', size: 44, bold: true, color: INK })], spacing: { after: 60 } }));
children.push(new Paragraph({ children: [new TextRun({ text: 'Teksty strony: wersja do edycji', font: 'Arial', size: 28, color: BRASS })], spacing: { after: 240 } }));
children.push(small(`Stan strony z ${content.site.updatedLabel}. Dokument wygenerowany ${new Date().toISOString().slice(0, 10)} z tych samych plików, z których budowana jest strona.`));
children.push(h2('Jak korzystać z tego dokumentu'));
for (const line of [
  'Dokument odtwarza stronę sekcja po sekcji. Na początku każdej sekcji jest zrzut z telefonu, żeby było widać, gdzie dany tekst się pojawia.',
  'Edytuj tylko prawą kolumnę tabel. Lewa kolumna to nazwa miejsca i kod techniczny: zostaw ją bez zmian, bo po nim teksty wracają na stronę.',
  'Możesz zmieniać wszystko: nagłówki, opisy, ceny, terminy, podpisy zdjęć. Jeśli coś ma zniknąć, wyczyść pole. Nowe pytania i opinie wpisz w pustych wierszach na końcu odpowiednich sekcji.',
  'Pisz zwykłym tekstem, bez pogrubień i kolorów: formatowanie nie przechodzi na stronę. Nowa linia w polu = nowy akapit.',
  'Uwagi do układu, zdjęć albo pytania zostaw jako komentarz w Google Docs (zaznacz tekst i wybierz „Dodaj komentarz”).',
  'Gdy skończysz, daj znać Bartkowi. Teksty trafią na stronę dokładnie w tej formie, w jakiej je tu zostawisz.',
]) children.push(new Paragraph({ children: [text(line)], bullet: { level: 0 }, spacing: { after: 100 } }));
children.push(small('Czego nie ma w dokumencie: nazwy pozycji w menu (Szkolenia, Jak uczymy, Kto uczy, Galeria, Pytania, Kontakt) i treść polityki prywatności. Te zmieniamy na życzenie.'));

for (const s of sections) {
  children.push(pageBreak(), h1(s.title));
  if (s.intro) children.push(para(s.intro, { run: { color: MUTED } }));
  children.push(image(s.crop));
  children.push(fieldTable(s.rows));
  for (const e of s.extra) {
    children.push(h2(e.title));
    if (e.gallery) {
      const rows = content.gallery.items.map((g, i) => new TableRow({ children: [
        cell([image(`g-${g.img}.jpg`, 130, 90)], 1500, PAPER),
        cell([para(`Zdjęcie ${i + 1}`, { run: { bold: true, size: 18 } }), new Paragraph({ children: [text(`gallery.items[${i}].caption`, { size: 13, color: MUTED, font: 'Courier New' })], spacing: { after: 0 } })], 2400, PAPER),
        cell([new Paragraph({ children: [text(g.caption, { size: 21 })], spacing: { after: 0 } })], W - 3900),
      ] }));
      children.push(new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [1500, 2400, W - 3900], rows,
        borders: { top: { style: BorderStyle.SINGLE, size: 4, color: 'C8C3B6' }, bottom: { style: BorderStyle.SINGLE, size: 4, color: 'C8C3B6' }, left: { style: BorderStyle.NONE, size: 0 }, right: { style: BorderStyle.NONE, size: 0 }, insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'C8C3B6' }, insideVertical: { style: BorderStyle.NONE, size: 0 } } }));
    } else {
      children.push(fieldTable(e.rows));
    }
  }
}

const doc = new Document({
  creator: 'Szkoła Barberingu Old Town',
  title: 'Teksty strony: wersja do edycji',
  styles: { default: { document: { run: { font: 'Arial', size: 20, color: INK } } } },
  sections: [{ properties: { page: { margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } } }, children }],
});
const out = resolve('docs/content-doc/teksty-strony.docx');
writeFileSync(out, await Packer.toBuffer(doc));
console.log('written', out);
