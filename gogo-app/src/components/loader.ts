import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import "../styles.css";

@customElement("gogo-loader")
export class Loader extends LitElement {
  @property()
  text = "";

  createRenderRoot() {
    return this; // turn off shadow dom to access external styles
  }

  render() {
    return html`
      <div class="flex flex-col items-center">
        <div class="loader-dots relative mt-2 block h-5 w-14">
          <div
            class="absolute top-0 mt-1 h-2 w-2 rounded-full bg-emerald-500"
          ></div>
          <div
            class="absolute top-0 mt-1 h-2 w-2 rounded-full bg-emerald-500"
          ></div>
          <div
            class="absolute top-0 mt-1 h-2 w-2 rounded-full bg-emerald-500"
          ></div>
          <div
            class="absolute top-0 mt-1 h-2 w-2 rounded-full bg-emerald-500"
          ></div>
        </div>
        <div class="mt-2 text-center text-xs font-light text-gray-500">
          ${this.text}
        </div>
      </div>
    `;
  }

  static styles = css``;
}

declare global {
  interface HTMLElementTagNameMap {
    "gogo-loader": Loader;
  }
}
