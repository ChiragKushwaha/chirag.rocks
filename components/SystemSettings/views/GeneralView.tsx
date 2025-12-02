import React from "react";
import {
  User,
  Lock,
  CreditCard,
  Cloud,
  ShoppingBag,
  Users,
  Laptop,
} from "lucide-react";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";

interface GeneralViewProps {
  currentAvatar: string;
  onEditAvatar: () => void;
}

export const GeneralView: React.FC<GeneralViewProps> = ({
  currentAvatar,
  onEditAvatar,
}) => {
  return (
    <div className="max-w-xl mx-auto pt-8">
      {/* Header Profile */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative group cursor-pointer" onClick={onEditAvatar}>
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-6xl overflow-hidden border-4 border-transparent group-hover:border-gray-300 dark:group-hover:border-gray-600 transition-all">
            {currentAvatar}
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full transition-opacity text-white text-xs font-medium">
            Edit
          </div>
        </div>
        <h2 className="mt-4 text-xl font-semibold dark:text-white">
          Chirag Kushwaha
        </h2>
        <p className="text-sm text-gray-500">chiragkushwaha1811@gmail.com</p>
      </div>

      {/* Settings Groups */}
      <SettingsGroup>
        <SettingsRow icon={User} label="Personal Information" color="#8E8E93" />
        <SettingsRow icon={Lock} label="Sign-In & Security" color="#8E8E93" />
        <SettingsRow
          icon={CreditCard}
          label="Payment & Shipping"
          color="#8E8E93"
          isLast
        />
      </SettingsGroup>

      <SettingsGroup>
        <SettingsRow icon={Cloud} label="iCloud" color="#007AFF" />
        <SettingsRow
          icon={ShoppingBag}
          label="Media & Purchases"
          color="#007AFF"
        />
        <SettingsRow
          icon={Users}
          label="Family"
          value="Set Up"
          color="#007AFF"
          isLast
        />
      </SettingsGroup>

      {/* Devices */}
      <SettingsGroup title="Devices">
        <SettingsRow
          icon={Laptop}
          label="MacBook Pro"
          value="This MacBook Pro 14″"
          color="#8E8E93"
        />
        <SettingsRow
          icon={Laptop}
          label="MacBookPro"
          value="MacBook Pro 15″"
          color="#8E8E93"
          isLast
        />
      </SettingsGroup>

      <div className="flex justify-center mt-8">
        <button className="px-4 py-1 text-sm text-red-500 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700/50 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          Sign Out...
        </button>
      </div>
    </div>
  );
};
