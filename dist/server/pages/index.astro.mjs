import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DrhNJFxr.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_MbU6vGeP.mjs';
import { a as attr, e as escape_html } from '../chunks/_@astro-renderers_Dih0nM_v.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_Dih0nM_v.mjs';
/* empty css                                 */

function LoginForm($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let username = '';
		let password = '';
		let loading = false;

		$$renderer.push(`<div class="card form-card svelte-o8qrqj"><h1 class="svelte-o8qrqj">Anmelden</h1> <form><div class="form-group"><label for="username">Benutzername</label> <input id="username"${attr('value', username)}${attr('disabled', loading, true)}/></div> <div class="form-group"><label for="password">Passwort</label> <input type="password" id="password"${attr('value', password)}${attr('disabled', loading, true)}/></div> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> <button type="submit" class="btn-primary full svelte-o8qrqj"${attr('disabled', loading, true)}>${escape_html('Anmelden')}</button></form> <p class="link svelte-o8qrqj">Noch kein Konto? <a href="/register">Registrieren</a></p></div>`);
	});
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Anmelden" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container"> ${renderComponent($$result2, "LoginForm", LoginForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "D:/3sem/einkaufsliste_frontend/src/components/LoginForm.svelte", "client:component-export": "default" })} </div> ` })}`;
}, "D:/3sem/einkaufsliste_frontend/src/pages/index.astro", void 0);

const $$file = "D:/3sem/einkaufsliste_frontend/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
