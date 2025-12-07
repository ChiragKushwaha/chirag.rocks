import React, { useState } from "react";
import { Search, X, HelpCircle } from "lucide-react";

interface Language {
  code: string;
  name: string;
  nativeName?: string;
}

const LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "sv", name: "Swedish", nativeName: "Svenska" },
  { code: "da", name: "Danish", nativeName: "Dansk" },
  { code: "no", name: "Norwegian", nativeName: "Norsk" },
  { code: "fi", name: "Finnish", nativeName: "Suomi" },
  { code: "pl", name: "Polish", nativeName: "Polski" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
  { code: "th", name: "Thai", nativeName: "ภาษาไทย" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά" },
  { code: "cs", name: "Czech", nativeName: "Čeština" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar" },
  { code: "ro", name: "Romanian", nativeName: "Română" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina" },
  { code: "sl", name: "Slovenian", nativeName: "Slovenščina" },
  { code: "bg", name: "Bulgarian", nativeName: "Български" },
  { code: "sr", name: "Serbian", nativeName: "Srpski" },
  { code: "he", name: "Hebrew", nativeName: "עברית" },
];

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (languageCode: string) => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredLanguages = LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-[600px] bg-[#1e1e1e] rounded-xl shadow-2xl border border-gray-700/50 flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="p-4 pb-2">
          <h2 className="text-lg font-semibold mb-3 ml-1">
            Select a preferred language to add
          </h2>
          <div className="relative">
            <Search
              className="absolute left-2.5 top-1.5 text-gray-400"
              size={16}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-[#2c2c2c] border border-gray-600 rounded-lg pl-9 pr-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto max-h-[400px] min-h-[300px] p-2">
          <div className="space-y-0.5">
            {filteredLanguages.map((lang, index) => (
              <div
                key={`${lang.code}-${index}`}
                onClick={() => setSelectedLang(lang.code)}
                className={`px-3 py-1 rounded-[4px] text-sm flex items-center gap-2 cursor-pointer ${
                  selectedLang === lang.code
                    ? "bg-blue-600 text-white"
                    : "hover:bg-white/10"
                }`}
              >
                {lang.nativeName && (
                  <span className="font-medium mr-1">{lang.nativeName}</span>
                )}
                {lang.nativeName && <span className="text-gray-400">—</span>}
                <span
                  className={
                    selectedLang === lang.code ? "text-white" : "text-gray-300"
                  }
                >
                  {lang.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-700/50 bg-[#262626]">
          <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">
            <HelpCircle size={14} />
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-1 rounded-md bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!selectedLang}
              onClick={() => selectedLang && onSelect(selectedLang)}
              className="px-4 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
