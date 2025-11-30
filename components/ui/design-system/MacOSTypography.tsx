import React from "react";

type MacOSTextStyle =
  | "largeTitle"
  | "title1"
  | "title2"
  | "title3"
  | "headline"
  | "body"
  | "callout"
  | "subhead"
  | "footnote"
  | "caption1"
  | "caption2";

interface MacOSTypographyProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: MacOSTextStyle;
  as?: React.ElementType;
}

export const MacOSTypography: React.FC<MacOSTypographyProps> = ({
  variant = "body",
  as: Component = "p",
  className = "",
  children,
  ...props
}) => {
  const variantClasses = {
    largeTitle: "text-large-title",
    title1: "text-title-1",
    title2: "text-title-2",
    title3: "text-title-3",
    headline: "text-headline",
    body: "text-body",
    callout: "text-callout",
    subhead: "text-subhead",
    footnote: "text-footnote",
    caption1: "text-caption-1",
    caption2: "text-caption-2",
  };

  return (
    <Component className={`${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </Component>
  );
};
