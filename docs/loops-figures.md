# /loops figure slots

Each slot on /loops renders `public/loops/<name>.png` (or `.jpg`, `.webp`, `.svg`) when that file exists. Until then the slot shows a dashed placeholder in `npm run dev` and renders nothing on the live site. So: generate the image, save it with the right name, push. No code changes needed.

House style for every prompt below: flat editorial illustration, off-white paper background (#fef9ed) with warm dark ink (#342e29), one orange accent (#cc5600) and one muted green (#3f6b47). Thin lines, generous white space. No gradients, no glow, no robots, no brains, no circuit boards, no 3D, no stock-photo people. Readable labels in a plain serif. Landscape 16:9, at least 1600px wide.

## hero
Save as `public/loops/hero.png`.

> A calm circular diagram of a personal work system, drawn like a page from a field notebook. Six small labelled stations around a loop: "capture", "sort", "one board", "night pass", "morning", "review". In the middle, a simple outline of one person at a desk. Arrows run clockwise between the stations. The "night pass" station sits in a faint dark band, as if it happens overnight. Style: [house style].

## flow
Save as `public/loops/flow.png`.

> A left-to-right process diagram with six steps. 1 "capture": a phone with a message bubble and a terminal prompt. 2 "sort": one line splitting into four labelled bins: "next action", "project", "waiting for", "nothing". 3 "one board": three sources ("my loops", "job tracker", "household list") feeding one list, with a small note "read, never copied". 4 "night pass": a moon icon over three inputs merging into a single card. 5 "morning 07:30": one message with a single bold line. 6 "Friday review": three question marks. Style: [house style].

## night
Save as `public/loops/night.png`.

> Three streams flowing into one small card at night. Stream 1 labelled "my words, verbatim". Stream 2 labelled "what I say I want vs what actually happens", drawn as two lines diverging. Stream 3 labelled "the last three days of the world". Most of each stream fades out; one thread from each meets on the card, labelled "one collision, or nothing". Dark navy band behind, same palette otherwise. Style: [house style].

## ledger
Save as `public/loops/ledger.png` (or better, build it from data; see below).

This one should come from `data/ledger.json`, not from an image model. A chart drawn by a model can't update itself and can quietly get a number wrong, and wrong numbers are what this page exists to catch. If you want a picture here before the data has a few weeks in it, generate a static explainer instead:

> A simple two-line weekly chart sketch with axes labelled "week" and "count": one line "thoughts captured", one line "loops closed". A small annotation where the lines diverge: "if this gap keeps widening, the system is failing". No real numbers on the axes. Style: [house style].
