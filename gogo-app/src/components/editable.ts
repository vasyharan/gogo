import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("gogo-editable")
export class Editable extends LitElement {
  @property()
  value: string = "";

  @property({ attribute: "class" })
  klass: string = "";

  render() {
    return html`<span class="${this.klass}">${this.value}</span>`;
  }

  createRenderRoot() {
    return this; // turn off shadow dom to access external styles
  }

  static styles = css``;
}

declare global {
  interface HTMLElementTagNameMap {
    "gogo-editable": Editable;
  }
}
