import { LitElement, css, html, svg } from "lit";
import { customElement, state } from "lit/decorators.js";

import { iconSearch } from "./icons";
import "../styles.css";

// const search = svg`
//     <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//     />
// `;

@customElement("gogo-navbar")
export class Navbar extends LitElement {
  @state()
  query = "";

  createRenderRoot() {
    return this; // turn off shadow dom to access external styles
  }

  render() {
    return html`
      <nav class="flex items-center p-2 mb-6">
        <div class="mr-4 h-8">
          <span
            class="font-sans font-semibold tracking-tight text-xl text-emerald-500"
          >
            <span class="font-bold">go/</span>
            <span>go</span>
          </span>
        </div>
        <div class="flex grow">
          <div
            class="mx-2 px-1 leading-6 flex grow items-center border-gray-700 focus-within:border-b text-gray-500 focus-within:text-gray-700"
          >
            ${iconSearch({ klass: "w-4 h-4" })}
            <input
              type="text"
              class="appearance-none border-0 w-full py-1 px-2 leading-tight text-sm placeholder-gray-300 focus:ring-0 focus:placeholder-gray-400 selection:bg-gray-700/20"
              placeholder="Search..."
              @input=${this.updateQuery}
            ></input>
          </div>
          <button type="button" class="button default">
            <span class="text-sm font-medium">New link</span>
          </button>
        </div>
      </nav>
    `;
  }

  updateQuery(e: Event) {
    const input = e.target as HTMLInputElement;
    this.query = input.value;
  }

  static styles = css`
    @tailwind base;
    @tailwind utilities;
    @tailwind components;
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "gogo-navbar": Navbar;
  }
}
