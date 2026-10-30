// Generates the /built disc covers with Gemini image generation. Each cover
// is an original image in the visual language of a classic album from
// Elliot's own listening (his Spotify history, ranked by hours), showing
// the project on the disc. Not run in the build; run by hand when a cover
// changes, then commit the images.
//
//   GEMINI_API_KEY=... node scripts/gen-covers.mjs [slug ...]
//
// Writes public/work/covers/<slug>.png. With slugs, only those are redone.

import { mkdir, writeFile } from "node:fs/promises";

const MODEL = "gemini-3-pro-image";
const OUT = "public/work/covers";

const RULES =
  "Square album cover, 1:1. An original image: borrow the album's mood, palette, medium and composition, never copy it. " +
  "No text, lettering, logos, band names or watermarks anywhere. No recognisable real people; figures are anonymous, seen from behind, at a distance or obscured. " +
  "It will be printed on a CD with a hole in the middle, so keep the main subject off the exact centre and let it read at small sizes.";

export const COVERS = {
  "ai-stem-tutor": {
    after: "OK Computer, Radiohead",
    prompt:
      "In the style of Radiohead's OK Computer (1997): a washed-out white and pale-blue digital collage, scratchy pencil marks, blurred motorway interchange, cold clinical diagrams. " +
      "The subject: torn fragments of maths and science exam papers and mark schemes, red-pen ticks, and a tiny pictogram of a student and a helper figure pointing at a question mark rather than handing over an answer.",
  },
  "tutor-safety": {
    after: "A Deeper Understanding, The War On Drugs",
    prompt:
      "In the style of The War On Drugs' A Deeper Understanding (2017): a dim, grainy, blue-lit photograph of a quiet room at night, a lone anonymous figure backlit at a window, soft film grain. " +
      "The subject: on the desk, a laptop glowing with a single small red flag; through the window, a school building with its gate closed under a streetlight.",
  },
  "school-hub": {
    after: "Abbey Road, The Beatles",
    prompt:
      "In the style of The Beatles' Abbey Road (1969): a flat-lit, symmetrical street photograph taken from road level, tree-lined London street, a white-striped zebra crossing, late-sixties colour film. " +
      "The subject: a teacher leading a single-file line of secondary-school students in uniform across the zebra crossing outside a school, all seen side-on mid-stride, faces not visible.",
  },
  "lease-citations": {
    after: "The Velvet Underground & Nico",
    prompt:
      "In the style of the Andy Warhol pop-art screenprint for The Velvet Underground & Nico (1967): a stark flat white background, one bold flat-colour object, slightly misregistered print. " +
      "The subject: a single page of a legal lease drawn as illegible grey lines, with one clause highlighted in bright yellow, the highlight a peel-off sticker half peeled back to show a pink underside.",
  },
  "persona-interviews": {
    after: "Blonde, Frank Ocean",
    prompt:
      "In the style of Frank Ocean's Blonde (2016): a grainy, soft-focus, muted teal photograph behind steamed glass, a fully clothed figure in a hoodie with a hand raised over the face. " +
      "The subject: the figure is only half real: one side a soft photograph, the other side a dashed outline and faint wireframe mesh, as if partly synthetic. Tasteful, no bare skin beyond the hand.",
  },
  "district-nursing": {
    after: "For Emma, Forever Ago, Bon Iver",
    prompt:
      "In the style of Bon Iver's For Emma, Forever Ago (2007): a blurred, frosted, condensation-covered window view, a small lit house at dusk in winter, cold blue and warm amber, lo-fi. " +
      "The subject: a small car parked outside the house with its interior light on, a clipboard and a list of home visits on the dashboard.",
  },
  "enterprise-partnerships": {
    after: "Rumours, Fleetwood Mac",
    prompt:
      "In the style of Fleetwood Mac's Rumours (1977): a staged, softly lit 1970s studio portrait on a plain pale backdrop, two figures posed mid-step like dancers, warm film grain, theatrical and slightly playful. " +
      "The subject: one figure in a pinstriped banker's suit holding up a dangling security certificate on a chain, the other in casual startup clothes stepping forward to take it. Faces turned away or out of frame.",
  },

  safeguarding: {
    after: "Kid A, Radiohead",
    prompt:
      "In the style of Radiohead's Kid A (2000): a digitally painted, glitchy landscape of jagged snowy peaks under a burning orange-red sky, smeared palette-knife textures. " +
      "The subject: the peaks are shaped like speech bubbles; one bubble glows red; a small watchtower with a single lit window stands guard in the foreground.",
  },
  "mentee-to-mentor": {
    after: "Punisher, Phoebe Bridgers",
    prompt:
      "In the style of Phoebe Bridgers' Punisher (2020): a vast, quiet desert at night under a deep blue sky full of stars, soft film grain, lonely and beautiful. " +
      "The subject: two very small figures in skeleton-print onesies seen from behind in the middle distance, one taller pointing up at a bright constellation while the smaller one looks where it points. The figures are tiny in the frame, faces never visible; the landscape and sky dominate.",
  },


  "company-operating-system": {
    after: "Aerial, Kate Bush",
    prompt:
      "In the style of Kate Bush's Aerial (2005): a calm golden-brown seascape at dusk where a long sound waveform sits on the horizon and its reflection in still water makes it read as a line of rocky islands. " +
      "The subject: the waveform is the steady pulse of a company running smoothly, small regular peaks like a heartbeat, with a few faint lit windows of an office building hidden among the islands. No people.",
  },


  "probate-operations": {
    after: "All Things Must Pass, George Harrison",
    prompt:
      "In the style of George Harrison's All Things Must Pass (1970): a black-and-white photograph of an English country-house lawn, a seated figure in a wide-brimmed hat seen from a distance, overcast light. " +
      "The subject: instead of garden gnomes, neat stacks of archive boxes and tied legal folders reclining on the grass around the figure.",
  },
  mealsforthenhs: {
    after: "Let It Bleed, The Rolling Stones",
    prompt:
      "In the style of The Rolling Stones' Let It Bleed (1969): a surreal, saturated late-sixties studio photograph of a tall tiered confection sitting on a record turntable against a plain backdrop. " +
      "The subject: the tiers are neat stacked takeaway meal boxes tied with ribbon, topped with a tiny model hospital and a model delivery bike. Clean and cheerful: no drips, no sauce, nothing red running, no people.",
  },
  "flash-pack-operations": {
    after: "Houses of the Holy, Led Zeppelin",
    prompt:
      "In the style of Led Zeppelin's Houses of the Holy (1973): a surreal, hand-tinted photograph of hexagonal basalt columns at dawn, orange and violet sky, dreamlike colour. " +
      "The subject: a small group of fully clothed adult travellers with rucksacks climbing the stones together toward the light.",
  },
};

async function generate(slug, { prompt }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${prompt}\n\n${RULES}` }] }],
      generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "1:1", imageSize: "1K" } },
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`${slug}: ${res.status} ${JSON.stringify(data.error ?? data).slice(0, 300)}`);
  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) throw new Error(`${slug}: no image (${data.candidates?.[0]?.finishReason ?? "unknown"})`);
  await writeFile(`${OUT}/${slug}.png`, Buffer.from(part.inlineData.data, "base64"));
  console.log(`ok  ${slug}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await mkdir(OUT, { recursive: true });
  const only = process.argv.slice(2);
  const todo = Object.entries(COVERS).filter(([slug]) => !only.length || only.includes(slug));
  const results = await Promise.allSettled(todo.map(([slug, c]) => generate(slug, c)));
  results.forEach((r) => r.status === "rejected" && console.error(`err ${r.reason.message}`));
}
