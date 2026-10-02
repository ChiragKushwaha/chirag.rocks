import React from "react";
import { useTranslations } from "next-intl";

interface NotesWidgetProps {
  size: "small" | "medium" | "large";
}

export const NotesWidget: React.FC<NotesWidgetProps> = () => {
  const t = useTranslations("Widgets.Notes");

  return (
    <div className="flex flex-col p-3.5 h-full bg-[#fef08a] dark:bg-[#ca8a04]/30 text-gray-900 dark:text-yellow-100 select-none justify-between rounded-xl">
      <div className="font-semibold text-[13px] border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
        <span>📝</span>
        <span>{t("Title")}</span>
      </div>
      <div
        className="text-[12px] leading-relaxed my-auto line-clamp-3 text-gray-800 dark:text-yellow-100/90"
        dangerouslySetInnerHTML={{ __html: t.raw("Content") }}
      />
    </div>
  );
};
