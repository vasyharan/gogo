import { LitElement, css, html, PropertyValues } from "lit";
import { until } from "lit/directives/until.js";
import { map } from "lit/directives/map.js";
import { customElement, state } from "lit/decorators.js";

import { iconSearch } from "./components/icons";
import { ApiResponse, listLinks } from "./api";
import { Golink } from "./models";
import { assertNever } from "./assert";

import "./styles.css";
import "./components/loader";
import "./components/link";

@customElement("gogo-app")
export class App extends LitElement {
  @state()
  query = "";

  @state()
  links: Promise<ApiResponse<Golink[]>> = new Promise(() => {});

  render() {
    return html`
      <div class="max-w-2xl mx-auto">
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

        ${until(this.renderLinks(), html`<gogo-loader></gogo-loader>`)}
      </div>
    `;
  }

  private updateQuery(e: Event) {
    const input = e.target as HTMLInputElement;
    this.query = input.value;
  }

  private async renderLinks() {
    const resp = await this.links;
    if (resp.type === "success") {
      return map(resp.value, (golink) => {
        return html`<gogo-link .link=${golink}></gogo-link>`;
      });
    } else if (resp.type === "error") {
      // TODO: handle error
      return html`<p>TODO: Handle error</p>`;
    } else {
      assertNever(resp);
    }
  }

  protected updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("query")) {
      this.links = listLinks(this.query);
    }
  }

  createRenderRoot() {
    return this; // turn off shadow dom to access external styles
  }

  static styles = css``;
}

declare global {
  interface HTMLElementTagNameMap {
    "gogo-app": App;
  }
}
