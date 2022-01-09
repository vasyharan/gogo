type IconProps = React.SVGProps<SVGSVGElement>;

function SVGIcon(props: React.SVGProps<SVGSVGElement>) {
  const {
    xmlns = "http://www.w3.org/2000/svg",
    fill = "none",
    viewBox = "0 0 24 24",
    stroke = "currentColor",
    children,
    ...rest
  } = props;
  return (
    <svg xmlns={xmlns} fill={fill} viewBox={viewBox} stroke={stroke} {...rest}>
      {children}
    </svg>
  );
}

export function EditIcon(props: IconProps) {
  const { className = "w-6 h-6", ...rest } = props;
  return (
    <SVGIcon className={className} {...rest}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </SVGIcon>
  );
}

export function SaveIcon(props: IconProps) {
  const { className = "w-6 h-6", ...rest } = props;
  return (
    <SVGIcon className={className} {...rest}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </SVGIcon>
  );
}

export function CancelIcon(props: IconProps) {
  const { className = "w-6 h-6", ...rest } = props;
  return (
    <SVGIcon className={className} {...rest}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </SVGIcon>
  );
}

export function SearchIcon(props: IconProps) {
  const { className = "w-6 h-6", ...rest } = props;
  return (
    <SVGIcon className={className} {...rest}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </SVGIcon>
  );
}
