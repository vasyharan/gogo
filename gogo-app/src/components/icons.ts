import { html, svg } from "lit";

// HeroIcons

type IconProps = {
  klass?: string;
  strokeWidth?: number;
};

export function iconSearch(props: IconProps = {}) {
  const { klass = "w-6 h-6", strokeWidth = 2 } = props;
  return html`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      class="${klass}"
      aria-hidden="true"
    >
      ${svg`<path
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width=${strokeWidth}
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z">
      </path>`}
    </svg>
  `;
}
