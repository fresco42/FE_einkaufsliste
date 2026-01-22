import { e as createComponent, f as createAstro, l as renderHead, n as renderSlot, o as renderScript, r as renderTemplate } from './astro/server_DEbdbej9.mjs';
import 'piccolore';
import 'clsx';
/* empty css                         */

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="de" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><title>${title} | Einkaufsliste</title>${renderHead()}</head> <body data-astro-cid-sckkx6r4> <header class="header" data-astro-cid-sckkx6r4> <div class="header-content" data-astro-cid-sckkx6r4> <a href="/" class="logo" data-astro-cid-sckkx6r4>Einkaufsliste</a> <nav id="nav-auth" data-astro-cid-sckkx6r4></nav> </div> </header> <main data-astro-cid-sckkx6r4> ${renderSlot($$result, $$slots["default"])} </main>   ${renderScript($$result, "D:/3sem/einkaufsliste_frontend/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts")}</body></html>`;
}, "D:/3sem/einkaufsliste_frontend/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
