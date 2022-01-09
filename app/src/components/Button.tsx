import cx from "classnames";

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;
export function Button(props: ButtonProps) {
  const { type = "button", className, disabled, children, ...rest } = props;
  return (
    <button
      type={type}
      disabled={disabled}
      className={cx(
        className,
        "inline-flex items-center justify-center",
        "py-1 px-2 mr-2",
        "border border-transparent",
        "rounded shadow-sm",
        "leading-none",
        "transform-gpu transition-all duration-150",
        "outline-1 outline-offset-1",
        "disabled:opacity-30",
        "focus:outline",
        {
          "hover:shadow-lg hover:-translate-y-0.5": !disabled,
        }
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
