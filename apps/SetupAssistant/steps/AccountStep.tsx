import React, { useState } from "react";
import { UserCircle } from "lucide-react";
import { SetupWindow } from "../SetupWindow";
import { useSystemStore } from "../../../store/systemStore";

interface AccountStepProps {
  onNext: () => void;
  onBack: () => void;
  title?: string;
  initialEmail?: string;
}

export const AccountStep: React.FC<AccountStepProps> = ({
  onNext,
  onBack,
  title = "Create Your Computer Account",
  initialEmail = "",
}) => {
  const { updateUser } = useSystemStore();
  const [formData, setFormData] = useState({
    name: "",
    email: initialEmail,
    age: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
    password: "",
  });

  const validateAccount = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", age: "", phone: "", password: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    }

    if (!formData.age.trim()) {
      newErrors.age = "Age is required.";
      isValid = false;
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 1) {
      newErrors.age = "Enter a valid age.";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAccountSubmit = () => {
    if (validateAccount()) {
      updateUser(formData);
      onNext();
    }
  };

  return (
    <SetupWindow
      title={title}
      description="Enter your name and account details to set up your computer."
      icon={UserCircle}
      onContinue={handleAccountSubmit}
      onBack={onBack}
    >
      <div className="w-full max-w-sm space-y-4 mt-2">
        {/* Full Name */}
        <div>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`
                w-full bg-white dark:bg-[#1C1C1E] border rounded-[6px] px-3 py-2 text-[13px] text-black dark:text-white outline-none focus:ring-2 focus:ring-[#007AFF]/50 transition-all
                ${
                  errors.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#D1D1D6] dark:border-[#38383A] focus:border-[#007AFF]"
                }
              `}
          />
          {errors.name && (
            <p className="text-red-500 text-[11px] mt-1 ml-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={`
                w-full bg-white dark:bg-[#1C1C1E] border rounded-[6px] px-3 py-2 text-[13px] text-black dark:text-white outline-none focus:ring-2 focus:ring-[#007AFF]/50 transition-all
                ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#D1D1D6] dark:border-[#38383A] focus:border-[#007AFF]"
                }
              `}
          />
          {errors.email && (
            <p className="text-red-500 text-[11px] mt-1 ml-1">{errors.email}</p>
          )}
        </div>

        {/* Age & Phone Row */}
        <div className="flex gap-3">
          <div className="w-24">
            <input
              type="text"
              placeholder="Age"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
              className={`
                  w-full bg-white dark:bg-[#1C1C1E] border rounded-[6px] px-3 py-2 text-[13px] text-black dark:text-white outline-none focus:ring-2 focus:ring-[#007AFF]/50 transition-all
                  ${
                    errors.age
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#D1D1D6] dark:border-[#38383A] focus:border-[#007AFF]"
                  }
                `}
            />
          </div>
          <div className="flex-1">
            <input
              type="tel"
              placeholder="Mobile Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className={`
                  w-full bg-white dark:bg-[#1C1C1E] border rounded-[6px] px-3 py-2 text-[13px] text-black dark:text-white outline-none focus:ring-2 focus:ring-[#007AFF]/50 transition-all
                  ${
                    errors.phone
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#D1D1D6] dark:border-[#38383A] focus:border-[#007AFF]"
                  }
                `}
            />
          </div>
        </div>
        <div className="flex gap-3">
          {errors.age && (
            <p className="text-red-500 text-[11px] ml-1 w-24 leading-tight">
              {errors.age}
            </p>
          )}
          {errors.phone && (
            <p className="text-red-500 text-[11px] ml-1 flex-1 leading-tight">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className={`
                w-full bg-white dark:bg-[#1C1C1E] border rounded-[6px] px-3 py-2 text-[13px] text-black dark:text-white outline-none focus:ring-2 focus:ring-[#007AFF]/50 transition-all
                ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#D1D1D6] dark:border-[#38383A] focus:border-[#007AFF]"
                }
              `}
          />
          {errors.password && (
            <p className="text-red-500 text-[11px] mt-1 ml-1">
              {errors.password}
            </p>
          )}
        </div>
      </div>
    </SetupWindow>
  );
};
