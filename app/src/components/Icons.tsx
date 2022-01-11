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
        d="M5 13l4 4L19 7"
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
        d="M6 18L18 6M6 6l12 12"
      />
    </SVGIcon>
  );
}

export function DeleteIcon(props: IconProps) {
  const { className = "w-6 h-6", ...rest } = props;
  return (
    <SVGIcon className={className} {...rest}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </SVGIcon>
  );
}

export function ArchiveIcon(props: IconProps) {
  const { className = "w-6 h-6", ...rest } = props;
  return (
    <SVGIcon className={className} {...rest}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
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
