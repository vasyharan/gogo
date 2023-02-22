import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import "../styles.css";
import "./loader";
import "./editable";
import { NewGolink, Golink } from "../models";

@customElement("gogo-link")
export class Link extends LitElement {
  @property()
  link: NewGolink | Golink = { keyword: "", link: "", active: true };

  render() {
    return html`<form class="group relative m-8">
      <div
        class="grid grid-cols-4 items-start gap-y-2 gap-x-1 p-2 mt-2 rounded bg-gray-50"
      >
        <label for="keyword" class="text-right font-mono font-medium ">
          <span class="bg-gray-700 text-white p-1">go/</span>
        </label>
        <div class="col-span-3">
          <gogo-editable value=${this.link.keyword}></gogo-editable>
        </div>
        <label for="keyword" class="text-right font-mono font-medium text-sm">
          <span class="bg-gray-500 text-white p-1">redirects to:</span>
        </label>
        <div class="col-span-3">
          <gogo-editable
            class="text-sm text-gray-500"
            value=${this.link.link}
          ></gogo-editable>
        </div>
      </div>
    </form>`;
  }

  createRenderRoot() {
    return this; // turn off shadow dom to access external styles
  }

  static styles = css``;
}

declare global {
  interface HTMLElementTagNameMap {
    "gogo-link": Link;
  }
}
