import React, { useState } from "react";
import {
  Search,
  Plus,
  User,
  Phone,
  Mail,
  MessageSquare,
  Video,
} from "lucide-react";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone: string;
  email: string;
}

export const Contacts: React.FC = () => {
  const [contacts] = useState<Contact[]>([
    {
      id: "1",
      firstName: "Chirag",
      lastName: "",
      phone: "+1 (555) 000-0000",
      email: "chirag@example.com",
    },
    {
      id: "2",
      firstName: "Apple",
      lastName: "Support",
      company: "Apple Inc.",
      phone: "1-800-275-2273",
      email: "support@apple.com",
    },
    {
      id: "3",
      firstName: "Jane",
      lastName: "Doe",
      phone: "+1 (555) 123-4567",
      email: "jane.doe@example.com",
    },
    {
      id: "4",
      firstName: "John",
      lastName: "Smith",
      company: "Tech Corp",
      phone: "+1 (555) 987-6543",
      email: "john.smith@techcorp.com",
    },
  ]);

  const [selectedId, setSelectedId] = useState<string>(contacts[0].id);
  const selectedContact = contacts.find((c) => c.id === selectedId);

  // Group contacts by first letter
  const groupedContacts = contacts.reduce((acc, contact) => {
    const letter = contact.firstName[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(contact);
    return acc;
  }, {} as Record<string, Contact[]>);

  const sortedLetters = Object.keys(groupedContacts).sort();

  return (
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-sans">
      {/* Sidebar List */}
      <div className="w-64 bg-[#f5f5f7] dark:bg-[#2b2b2b] border-r border-gray-200 dark:border-black/20 flex flex-col">
        <div className="p-3 border-b border-gray-200 dark:border-black/10">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-gray-200 dark:bg-black/20 border-none rounded-md pl-8 pr-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sortedLetters.map((letter) => (
            <div key={letter}>
              <div className="px-4 py-1 bg-gray-100 dark:bg-[#333] text-xs font-bold text-gray-500 dark:text-gray-400 sticky top-0">
                {letter}
              </div>
              {groupedContacts[letter].map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedId(contact.id)}
                  className={`px-4 py-2 text-sm font-medium cursor-pointer flex items-center gap-2 ${
                    selectedId === contact.id
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-200 dark:hover:bg-white/5"
                  }`}
                >
                  <span
                    className={
                      selectedId === contact.id ? "font-semibold" : "font-bold"
                    }
                  >
                    {contact.firstName}
                  </span>
                  <span>{contact.lastName}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="p-2 border-t border-gray-200 dark:border-black/10 flex justify-between text-gray-500">
          <button className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded">
            <Plus size={18} />
          </button>
          <span className="text-xs self-center">
            {contacts.length} Contacts
          </span>
        </div>
      </div>

      {/* Details View */}
      <div className="flex-1 bg-white dark:bg-[#1e1e1e] flex flex-col items-center pt-16">
        {selectedContact ? (
          <div className="w-full max-w-md flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4 text-gray-400">
              <User size={48} />
            </div>

            <h1 className="text-2xl font-bold mb-1">
              {selectedContact.firstName} {selectedContact.lastName}
            </h1>
            {selectedContact.company && (
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {selectedContact.company}
              </p>
            )}

            <div className="flex gap-6 mb-8 w-full justify-center">
              <div className="flex flex-col items-center gap-1 cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-sm group-hover:bg-blue-600">
                  <MessageSquare size={18} fill="currentColor" />
                </div>
                <span className="text-xs text-blue-500">message</span>
              </div>
              <div className="flex flex-col items-center gap-1 cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-sm group-hover:bg-blue-600">
                  <Phone size={18} fill="currentColor" />
                </div>
                <span className="text-xs text-blue-500">mobile</span>
              </div>
              <div className="flex flex-col items-center gap-1 cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-sm group-hover:bg-blue-600">
                  <Video size={20} fill="currentColor" />
                </div>
                <span className="text-xs text-blue-500">video</span>
              </div>
              <div className="flex flex-col items-center gap-1 cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-sm group-hover:bg-blue-600">
                  <Mail size={18} />
                </div>
                <span className="text-xs text-blue-500">mail</span>
              </div>
            </div>

            <div className="w-full bg-gray-50 dark:bg-[#2b2b2b] rounded-xl p-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  mobile
                </label>
                <p className="text-blue-500">{selectedContact.phone}</p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700/50 pt-3">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  home
                </label>
                <p className="text-blue-500">{selectedContact.email}</p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700/50 pt-3">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Notes
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400">Select a contact</div>
        )}
      </div>
    </div>
  );
};
