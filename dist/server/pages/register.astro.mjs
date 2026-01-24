import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DrhNJFxr.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_MbU6vGeP.mjs';
import { a as attr, e as escape_html } from '../chunks/_@astro-renderers_Dih0nM_v.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_Dih0nM_v.mjs';
/* empty css                                    */

function RegisterForm($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let username = '';
		let password = '';
		let confirmPassword = '';
		let loading = false;

		$$renderer.push(`<div class="card form-card svelte-18khd9h"><h1 class="svelte-18khd9h">Registrieren</h1> <form><div class="form-group"><label for="username">Benutzername</label> <input id="username"${attr('value', username)}${attr('disabled', loading, true)}/></div> <div class="form-group"><label for="password">Passwort</label> <input type="password" id="password"${attr('value', password)}${attr('disabled', loading, true)}/></div> <div class="form-group"><label for="confirm">Passwort bestaetigen</label> <input type="password" id="confirm"${attr('value', confirmPassword)}${attr('disabled', loading, true)}/></div> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> `);

		{
			$$renderer.push('<!--[!-->');
		}

		$$renderer.push(`<!--]--> <button type="submit" class="btn-primary full svelte-18khd9h"${attr('disabled', loading, true)}>${escape_html('Registrieren')}</button></form> <p class="link svelte-18khd9h">Bereits ein Konto? <a href="/">Anmelden</a></p></div>`);
	});
}

const $$Register = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Registrieren" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container"> ${renderComponent($$result2, "RegisterForm", RegisterForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "D:/3sem/einkaufsliste_frontend/src/components/RegisterForm.svelte", "client:component-export": "default" })} </div> ` })}`;
}, "D:/3sem/einkaufsliste_frontend/src/pages/register.astro", void 0);

const $$file = "D:/3sem/einkaufsliste_frontend/src/pages/register.astro";
const $$url = "/register";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Register,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
