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
} from "lucide-react";
import { fs } from "../lib/FileSystem";

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
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("mac-contacts");
    if (saved) {
      const parsed = JSON.parse(saved);
      setContacts(parsed);
      if (parsed.length > 0) setSelectedId(parsed[0].id);
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
      setContacts(defaultContacts);
      setSelectedId(defaultContacts[0].id);
    }
    setIsLoaded(true);
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
    const loadImage = async () => {
      if (selectedContact?.imagePath) {
        const blob = await fs.readBlob(
          "/Images/Contacts",
          selectedContact.imagePath.split("/").pop()!
        );
        if (active && blob) {
          setDisplayImage(URL.createObjectURL(blob));
        } else {
          setDisplayImage(null);
        }
      } else {
        setDisplayImage(null);
      }
    };
    loadImage();
    return () => {
      active = false;
      if (displayImage) URL.revokeObjectURL(displayImage);
    };
  }, [selectedId, selectedContact]);

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

    if (confirm("Are you sure you want to delete this contact?")) {
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
      alert("Please enter a name or company.");
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
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-sans select-none">
      {/* Sidebar */}
      <div className="w-[260px] bg-[#e8e8ed]/80 dark:bg-[#2b2b2b]/90 backdrop-blur-xl border-r border-gray-300/50 dark:border-black/20 flex flex-col">
        {/* Search Bar */}
        <div className="p-4 pb-2">
          <div className="relative group">
            <Search
              size={14}
              className="absolute left-2.5 top-1.5 text-gray-500 dark:text-gray-400 group-focus-within:text-gray-700 dark:group-focus-within:text-gray-200"
            />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#dcdce0] dark:bg-[#1e1e1e] border-none rounded-[6px] pl-8 pr-3 py-1 text-[13px] placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {sortedLetters.map((letter) => (
            <div key={letter} className="mb-2">
              <div className="px-3 py-1 text-[11px] font-semibold text-gray-500 dark:text-gray-400 sticky top-0 bg-[#e8e8ed]/90 dark:bg-[#2b2b2b]/90 backdrop-blur-sm z-10">
                {letter}
              </div>
              {groupedContacts[letter].map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => {
                    setSelectedId(contact.id);
                    setIsAdding(false);
                    setIsEditing(false);
                  }}
                  className={`px-3 py-1.5 text-[13px] font-medium rounded-[5px] cursor-default flex items-center gap-2.5 transition-colors ${
                    selectedId === contact.id && !isAdding
                      ? "bg-[#007AFF] text-white"
                      : "hover:bg-black/5 dark:hover:bg-white/5 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  <span
                    className={`font-semibold ${
                      selectedId === contact.id ? "text-white" : ""
                    }`}
                  >
                    {contact.firstName}
                  </span>
                  <span
                    className={`${
                      selectedId === contact.id
                        ? "text-white/90"
                        : "text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {contact.lastName}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="px-4 py-3 border-t border-gray-300/50 dark:border-black/10 flex justify-between items-center text-gray-500">
          <button
            className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors"
            onClick={() => {
              setIsAdding(true);
              setIsEditing(false);
              setNewContact({});
              setImageFile(null);
              setImagePreview(null);
            }}
          >
            <Plus size={16} />
          </button>
          <span className="text-[11px] font-medium">
            {contacts.length} Contacts
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white dark:bg-[#1e1e1e] flex flex-col items-center overflow-y-auto relative">
        {isAdding ? (
          <div className="w-full max-w-[480px] flex flex-col items-center pt-12 px-8 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-lg font-semibold mb-8 text-gray-500 dark:text-gray-400">
              {isEditing ? "Edit Contact" : "New Contact"}
            </h2>

            <div
              className="relative w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-8 cursor-pointer group overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
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
                  Edit
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
                  placeholder="First Name"
                  className="bg-transparent border-b border-gray-200 dark:border-gray-700 px-1 py-2 text-lg outline-none focus:border-[#007AFF] transition-colors placeholder-gray-400"
                  value={newContact.firstName || ""}
                  onChange={(e) =>
                    setNewContact({ ...newContact, firstName: e.target.value })
                  }
                />
                <input
                  placeholder="Last Name"
                  className="bg-transparent border-b border-gray-200 dark:border-gray-700 px-1 py-2 text-lg outline-none focus:border-[#007AFF] transition-colors placeholder-gray-400"
                  value={newContact.lastName || ""}
                  onChange={(e) =>
                    setNewContact({ ...newContact, lastName: e.target.value })
                  }
                />
              </div>
              <input
                placeholder="Company"
                className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 px-1 py-2 outline-none focus:border-[#007AFF] transition-colors placeholder-gray-400"
                value={newContact.company || ""}
                onChange={(e) =>
                  setNewContact({ ...newContact, company: e.target.value })
                }
              />
              <input
                placeholder="Phone"
                className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 px-1 py-2 outline-none focus:border-[#007AFF] transition-colors placeholder-gray-400"
                value={newContact.phone || ""}
                onChange={(e) =>
                  setNewContact({ ...newContact, phone: e.target.value })
                }
              />
              <input
                placeholder="Email"
                className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 px-1 py-2 outline-none focus:border-[#007AFF] transition-colors placeholder-gray-400"
                value={newContact.email || ""}
                onChange={(e) =>
                  setNewContact({ ...newContact, email: e.target.value })
                }
              />
              <textarea
                placeholder="Notes"
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
                    Delete Contact
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setIsEditing(false);
                  }}
                  className="px-6 py-1.5 rounded-[6px] text-[13px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveContact}
                  className="px-6 py-1.5 rounded-[6px] text-[13px] font-medium bg-[#007AFF] hover:bg-[#0069d9] text-white shadow-sm transition-colors flex items-center gap-2"
                >
                  Done
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
              Edit
            </button>

            {/* Profile Header */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-5 text-gray-300 dark:text-gray-600 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative">
                {displayImage ? (
                  <Image
                    src={displayImage}
                    alt={selectedContact.firstName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <User size={64} strokeWidth={1.5} />
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
                  action: `sms:${selectedContact.phone.replace(
                    /[^0-9+]/g,
                    ""
                  )}`,
                },
                {
                  icon: Phone,
                  label: "mobile",
                  action: `tel:${selectedContact.phone.replace(
                    /[^0-9+]/g,
                    ""
                  )}`,
                },
                {
                  icon: Video,
                  label: "video",
                  action: `facetime:${selectedContact.phone.replace(
                    /[^0-9+]/g,
                    ""
                  )}`,
                },
                {
                  icon: Mail,
                  label: "mail",
                  action: `mailto:${selectedContact.email}`,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 cursor-pointer group"
                  onClick={() => (window.location.href = item.action)}
                >
                  <div className="w-[42px] h-[42px] rounded-full bg-[#007AFF] text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:bg-[#0069d9] group-active:scale-95 transition-all">
                    <item.icon size={18} fill="currentColor" strokeWidth={0} />
                  </div>
                  <span className="text-[11px] text-[#007AFF] font-medium tracking-wide">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Details Card */}
            <div className="w-full bg-white dark:bg-[#2b2b2b] rounded-[10px] border border-gray-200 dark:border-black/20 shadow-sm overflow-hidden">
              <div className="p-4 flex flex-col gap-1 border-b border-gray-100 dark:border-white/5">
                <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  mobile
                </label>
                <p className="text-[15px] text-gray-900 dark:text-gray-100">
                  {selectedContact.phone}
                </p>
              </div>
              <div className="p-4 flex flex-col gap-1 border-b border-gray-100 dark:border-white/5">
                <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  home
                </label>
                <p className="text-[15px] text-gray-900 dark:text-gray-100">
                  {selectedContact.email}
                </p>
              </div>
              <div className="p-4 flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Notes
                </label>
                <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selectedContact.notes || "No notes"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <span className="text-sm">No Contact Selected</span>
          </div>
        )}
      </div>
    </div>
  );
};
