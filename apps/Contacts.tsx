import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Search,
  Plus,
  User,
  Phone,
  Mail,
  MessageSquare,
  Video,
  Camera,
  MapPin,
  Globe,
  ChevronDown,
} from "lucide-react";
import { fs } from "../lib/FileSystem";
import { useTranslations } from "next-intl";

const AVATAR_COLORS = [
  "from-red-400 to-red-600",
  "from-orange-400 to-orange-600",
  "from-amber-400 to-yellow-500",
  "from-green-400 to-emerald-600",
  "from-teal-400 to-cyan-600",
  "from-blue-400 to-blue-600",
  "from-indigo-400 to-violet-600",
  "from-purple-400 to-pink-600",
  "from-pink-400 to-rose-600",
  "from-gray-400 to-gray-600",
];

function getAvatarColor(id: string): string {
  const hash = id.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function getInitials(first: string, last: string): string {
  return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase() || "?";
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone: string;
  email: string;
  imagePath?: string;
  notes?: string;
}

export const Contacts: React.FC = () => {
  const t = useTranslations("Contacts");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("mac-contacts");
    if (saved) {
      const parsed = JSON.parse(saved);
      requestAnimationFrame(() => {
        setContacts(parsed);
        if (parsed.length > 0) {
          setSelectedId(parsed[0].id);
        }
      });
    } else {
      const defaultContacts = [
        {
          id: "1",
          firstName: "Chirag",
          lastName: "Kushwaha",
          phone: "+916387935021",
          email: "chiragkushwaha1811+mac@gmail.com",
          notes: "Creator",
        },
      ];
      requestAnimationFrame(() => {
        setContacts(defaultContacts);
        setSelectedId(defaultContacts[0].id);
      });
    }
    requestAnimationFrame(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("mac-contacts", JSON.stringify(contacts));
    }
  }, [contacts, isLoaded]);

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newContact, setNewContact] = useState<Partial<Contact>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [displayImage, setDisplayImage] = useState<string | null>(null);

  const selectedContact = contacts.find((c) => c.id === selectedId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load image for selected contact
  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    const loadImage = async () => {
      if (selectedContact?.imagePath) {
        try {
          const blob = await fs.readBlob(
            "/Images/Contacts",
            selectedContact.imagePath.split("/").pop()!
          );
          if (active && blob) {
            objectUrl = URL.createObjectURL(blob);
            setDisplayImage(objectUrl);
          } else {
            setDisplayImage(null);
          }
        } catch {
          if (active) setDisplayImage(null);
        }
      } else {
        if (active) setDisplayImage(null);
      }
    };
    loadImage();
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [selectedContact]);

  // Group contacts by first letter
  const groupedContacts = contacts.reduce((acc, contact) => {
    const letter = contact.firstName[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(contact);
    return acc;
  }, {} as Record<string, Contact[]>);

  const sortedLetters = Object.keys(groupedContacts).sort();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditContact = () => {
    if (!selectedContact) return;
    setNewContact({ ...selectedContact });
    setImagePreview(displayImage);
    setIsEditing(true);
    setIsAdding(true);
  };

  const handleDeleteContact = async () => {
    if (!selectedContact) return;

    if (confirm(t("Alerts.DeleteConfirm"))) {
      if (selectedContact.imagePath) {
        const filename = selectedContact.imagePath.split("/").pop();
        if (filename) await fs.delete("/Images/Contacts", filename);
      }
      const newContacts = contacts.filter((c) => c.id !== selectedContact.id);
      setContacts(newContacts);
      setSelectedId(newContacts.length > 0 ? newContacts[0].id : "");
      setIsAdding(false);
      setIsEditing(false);
    }
  };

  const handleSaveContact = async () => {
    if (!newContact.firstName && !newContact.lastName && !newContact.company) {
      alert(t("Alerts.NameRequired"));
      return;
    }

    const id = newContact.id || Date.now().toString();
    let imagePath = newContact.imagePath;

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const filename = `contact-${id}-${Date.now()}.${ext}`;
      await fs.writeBlob("/Images/Contacts", filename, imageFile);
      imagePath = `/Images/Contacts/${filename}`;
    }

    const contact: Contact = {
      id,
      firstName: newContact.firstName || "",
      lastName: newContact.lastName || "",
      company: newContact.company || "",
      phone: newContact.phone || "",
      email: newContact.email || "",
      notes: newContact.notes || "",
      imagePath,
    };

    if (isEditing) {
      setContacts(contacts.map((c) => (c.id === id ? contact : c)));
    } else {
      setContacts([...contacts, contact]);
    }

    setIsAdding(false);
    setIsEditing(false);
    setSelectedId(id);
    setNewContact({});
    setImageFile(null);
    setImagePreview(null);
  };

  if (!isLoaded) return null; // Prevent hydration mismatch

  return (
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-[13px] font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text',sans-serif] text-gray-900 dark:text-gray-100 select-none">
      {/* ── SIDEBAR ── */}
      <div className="w-[240px] bg-[#f0f0f5] dark:bg-[#272727] border-r border-gray-300/50 dark:border-black/25 flex flex-col">
        {/* Search */}
        <div className="p-3 pb-2">
          <div className="relative">
            <Search size={12} className="absolute left-2 top-[7px] text-gray-400" />
            <input
              type="text"
              placeholder={t("SearchPlaceholder")}
              className="w-full bg-[#dcdce0] dark:bg-[#3a3a3a] border-none rounded-[6px] pl-7 pr-3 py-1 text-[12px] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              aria-label={t("SearchAria")}
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {sortedLetters.map((letter) => (
            <div key={letter} className="mb-1">
              <div className="px-2 py-0.5 text-[11px] font-bold text-gray-500 dark:text-gray-400 sticky top-0 bg-[#f0f0f5]/95 dark:bg-[#272727]/95 backdrop-blur-sm z-10">
                {letter}
              </div>
              {groupedContacts[letter].map((contact) => {
                const isSelected = selectedId === contact.id && !isAdding;
                return (
                  <div
                    key={contact.id}
                    onClick={() => {
                      setSelectedId(contact.id);
                      setIsAdding(false);
                      setIsEditing(false);
                    }}
                    className={`px-2 py-1.5 rounded-[5px] cursor-default flex items-center gap-2.5 transition-colors ${
                      isSelected
                        ? "bg-[#007AFF] text-white"
                        : "hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedId(contact.id);
                        setIsAdding(false);
                        setIsEditing(false);
                      }
                    }}
                  >
                    {/* Mini avatar */}
                    <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-br ${getAvatarColor(contact.id)}`}>
                      {getInitials(contact.firstName, contact.lastName)}
                    </div>
                    <span className={`text-[13px] font-medium truncate ${isSelected ? "text-white" : "text-gray-900 dark:text-gray-100"}`}>
                      {contact.firstName} <span className={isSelected ? "text-white/85" : "text-gray-600 dark:text-gray-300"}>{contact.lastName}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="px-3 py-2.5 border-t border-gray-200/60 dark:border-black/15 flex justify-between items-center">
          <button
            className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors text-gray-500"
            onClick={() => {
              setIsAdding(true);
              setIsEditing(false);
              setNewContact({});
              setImageFile(null);
              setImagePreview(null);
            }}
            aria-label={t("Aria.AddContact")}
          >
            <Plus size={16} />
          </button>
          <span className="text-[11px] text-gray-400 font-medium">
            {t("Count", { count: contacts.length })}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white dark:bg-[#1e1e1e] flex flex-col items-center overflow-y-auto relative">
        {isAdding ? (
          <div className="w-full max-w-[480px] flex flex-col items-center pt-12 px-8 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-lg font-semibold mb-8 text-gray-500 dark:text-gray-400">
              {isEditing ? t("EditContact") : t("NewContact")}
            </h2>

            <div
              className="relative w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-8 cursor-pointer group overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt={t("Preview")}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <Camera
                  size={40}
                  className="text-gray-300 dark:text-gray-600"
                />
              )}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-medium drop-shadow-md">
                  {t("Edit")}
                </span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>

            <div className="w-full space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder={t("Labels.FirstName")}
                  className="bg-transparent border-b border-gray-200 dark:border-gray-700 px-1 py-2 text-lg outline-none focus:border-[#007AFF] transition-colors placeholder-gray-400"
                  value={newContact.firstName || ""}
                  onChange={(e) =>
                    setNewContact({ ...newContact, firstName: e.target.value })
                  }
                />
                <input
                  placeholder={t("Labels.LastName")}
                  className="bg-transparent border-b border-gray-200 dark:border-gray-700 px-1 py-2 text-lg outline-none focus:border-[#007AFF] transition-colors placeholder-gray-400"
                  value={newContact.lastName || ""}
                  onChange={(e) =>
                    setNewContact({ ...newContact, lastName: e.target.value })
                  }
                />
              </div>
              <input
                placeholder={t("Labels.Company")}
                className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 px-1 py-2 outline-none focus:border-[#007AFF] transition-colors placeholder-gray-400"
                value={newContact.company || ""}
                onChange={(e) =>
                  setNewContact({ ...newContact, company: e.target.value })
                }
              />
              <input
                placeholder={t("Labels.Phone")}
                className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 px-1 py-2 outline-none focus:border-[#007AFF] transition-colors placeholder-gray-400"
                value={newContact.phone || ""}
                onChange={(e) =>
                  setNewContact({ ...newContact, phone: e.target.value })
                }
              />
              <input
                placeholder={t("Labels.Email")}
                className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 px-1 py-2 outline-none focus:border-[#007AFF] transition-colors placeholder-gray-400"
                value={newContact.email || ""}
                onChange={(e) =>
                  setNewContact({ ...newContact, email: e.target.value })
                }
              />
              <textarea
                placeholder={t("Labels.Notes")}
                className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 px-1 py-2 outline-none focus:border-[#007AFF] transition-colors placeholder-gray-400 resize-none h-24"
                value={newContact.notes || ""}
                onChange={(e) =>
                  setNewContact({ ...newContact, notes: e.target.value })
                }
              />

              <div className="flex gap-3 pt-8 justify-end">
                {isEditing && (
                  <button
                    onClick={handleDeleteContact}
                    className="px-6 py-1.5 rounded-[6px] text-[13px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mr-auto"
                  >
                    {t("DeleteContact")}
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setIsEditing(false);
                  }}
                  className="px-6 py-1.5 rounded-[6px] text-[13px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  {t("Cancel")}
                </button>
                <button
                  onClick={handleSaveContact}
                  className="px-6 py-1.5 rounded-[6px] text-[13px] font-medium bg-[#007AFF] hover:bg-[#0069d9] text-white shadow-sm transition-colors flex items-center gap-2"
                >
                  {t("Done")}
                </button>
              </div>
            </div>
          </div>
        ) : selectedContact ? (
          <div className="w-full max-w-[520px] flex flex-col items-center pt-16 px-8 animate-in fade-in zoom-in-95 duration-200 relative">
            <button
              onClick={handleEditContact}
              className="absolute top-6 right-6 text-[#007AFF] text-[13px] font-medium hover:text-[#0069d9] transition-colors"
            >
              {t("Edit")}
            </button>

            {/* Profile Header */}
            <div className="flex flex-col items-center mb-10">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-5 shadow-md overflow-hidden relative ${displayImage ? "" : `bg-gradient-to-br ${getAvatarColor(selectedContact.id)}`}`}>
                {displayImage ? (
                  <Image
                    src={displayImage}
                    alt={selectedContact.firstName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-white text-[44px] font-bold leading-none">
                    {getInitials(selectedContact.firstName, selectedContact.lastName)}
                  </span>
                )}
              </div>

              <h1 className="text-[28px] font-bold text-gray-900 dark:text-white leading-tight">
                {selectedContact.firstName} {selectedContact.lastName}
              </h1>
              {selectedContact.company && (
                <p className="text-[15px] text-gray-500 dark:text-gray-400 mt-1 font-medium">
                  {selectedContact.company}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-10 mb-12">
              {[
                {
                  icon: MessageSquare,
                  label: "message",
                  display: t("Labels.Message"),
                  action: `sms:${selectedContact.phone.replace(
                    /[^0-9+]/g,
                    ""
                  )}`,
                },
                {
                  icon: Phone,
                  display: t("Labels.Mobile"),
                  label: "mobile",
                  action: `tel:${selectedContact.phone.replace(
                    /[^0-9+]/g,
                    ""
                  )}`,
                },
                {
                  icon: Video,
                  display: t("Labels.Video"),
                  label: "video",
                  action: `facetime:${selectedContact.phone.replace(
                    /[^0-9+]/g,
                    ""
                  )}`,
                },
                {
                  icon: Mail,
                  display: t("Labels.Mail"),
                  label: "mail",
                  action: `mailto:${selectedContact.email}`,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 cursor-pointer group"
                  onClick={() => (window.location.href = item.action)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      window.location.href = item.action;
                    }
                  }}
                  aria-label={t("Aria.Action", {
                    action: item.display,
                    name: selectedContact.firstName,
                  })}
                >
                  <div className="w-[42px] h-[42px] rounded-full bg-[#007AFF] text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:bg-[#0069d9] group-active:scale-95 transition-all">
                    <item.icon size={18} fill="currentColor" strokeWidth={0} />
                  </div>
                  <span className="text-[11px] text-[#007AFF] font-medium tracking-wide">
                    {item.display}
                  </span>
                </div>
              ))}
            </div>

            {/* Details Card */}
            <div className="w-full bg-white dark:bg-[#2b2b2b] rounded-[10px] border border-gray-200 dark:border-black/20 shadow-sm overflow-hidden">
              <div className="p-4 flex flex-col gap-1 border-b border-gray-100 dark:border-white/5">
                <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t("Labels.Mobile")}
                </label>
                <p className="text-[15px] text-gray-900 dark:text-gray-100">
                  {selectedContact.phone}
                </p>
              </div>
              <div className="p-4 flex flex-col gap-1 border-b border-gray-100 dark:border-white/5">
                <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t("Labels.Home")}
                </label>
                <p className="text-[15px] text-gray-900 dark:text-gray-100">
                  {selectedContact.email}
                </p>
              </div>
              <div className="p-4 flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t("Labels.Notes")}
                </label>
                <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selectedContact.notes || t("NoNotes")}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <span className="text-sm">{t("NoSelection")}</span>
          </div>
        )}
      </div>
    </div>
  );
};
