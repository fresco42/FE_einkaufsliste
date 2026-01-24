import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_DrhNJFxr.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_MbU6vGeP.mjs';
import 'clsx';
/* empty css                                   */
export { r as renderers } from '../../chunks/_@astro-renderers_Dih0nM_v.mjs';

function ListDetail($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { listId } = $$props;

		$$renderer.push(`<div class="container">`);

		{
			$$renderer.push('<!--[-->');
			$$renderer.push(`<div class="loading">Laden...</div>`);
		}

		$$renderer.push(`<!--]--></div>`);
	});
}

const $$Astro = createAstro();
const $$id = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const listId = parseInt(id || "0", 10);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Liste" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ListDetail", ListDetail, { "listId": listId, "client:load": true, "client:component-hydration": "load", "client:component-path": "D:/3sem/einkaufsliste_frontend/src/components/ListDetail.svelte", "client:component-export": "default" })} ` })}`;
}, "D:/3sem/einkaufsliste_frontend/src/pages/lists/[id].astro", void 0);

const $$file = "D:/3sem/einkaufsliste_frontend/src/pages/lists/[id].astro";
const $$url = "/lists/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
