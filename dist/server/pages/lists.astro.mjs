import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_7qVk8nB1.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_Cv2NQVt0.mjs';
import 'clsx';
import '../chunks/auth_DKb3P1uZ.mjs';
/* empty css                                 */
export { r as renderers } from '../chunks/_@astro-renderers_BXEaK-9A.mjs';

function ListsOverview($$renderer, $$props) {
	$$renderer.component(($$renderer) => {

		$$renderer.push(`<div class="container">`);

		{
			$$renderer.push('<!--[!-->');

			{
				$$renderer.push('<!--[-->');
				$$renderer.push(`<div class="loading">Listen werden geladen...</div>`);
			}

			$$renderer.push(`<!--]-->`);
		}

		$$renderer.push(`<!--]--></div>`);
	});
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Meine Listen" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ListsOverview", ListsOverview, { "client:load": true, "client:component-hydration": "load", "client:component-path": "D:/3sem/einkaufsliste_frontend/src/components/ListsOverview.svelte", "client:component-export": "default" })} ` })}`;
}, "D:/3sem/einkaufsliste_frontend/src/pages/lists/index.astro", void 0);

const $$file = "D:/3sem/einkaufsliste_frontend/src/pages/lists/index.astro";
const $$url = "/lists";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
