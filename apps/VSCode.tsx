import React from "react";
import { useTranslations } from "next-intl";

export const VSCode: React.FC = () => {
  const t = useTranslations("VSCode");
  return (
    <div className="w-full h-full bg-[#1e1e1e] flex flex-col">
      <iframe
        src="https://github1s.com/ChiragKushwaha/mac-os-web/blob/main/README.md"
        className="w-full h-full border-none"
        title={t("Title")}
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
};
