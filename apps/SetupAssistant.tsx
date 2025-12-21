import React from "react";
// import React, { useState } from "react";
import { useSystemStore } from "../store/systemStore";
import { HelloStep } from "./SetupAssistant/steps/HelloStep";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
// import { LanguageStep } from "./SetupAssistant/steps/LanguageStep";
// import { RegionStep } from "./SetupAssistant/steps/RegionStep";
// import { DataPrivacyStep } from "./SetupAssistant/steps/DataPrivacyStep";
// import { TouchIDStep } from "./SetupAssistant/steps/TouchIDStep";
// import { FingerprintStep } from "./SetupAssistant/steps/FingerprintStep";
// import { LanguagesStep } from "./SetupAssistant/steps/LanguagesStep";
// import { AccessibilityStep } from "./SetupAssistant/steps/AccessibilityStep";
// import { MigrationStep } from "./SetupAssistant/steps/MigrationStep";
// import { AppleIDStep } from "./SetupAssistant/steps/AppleIDStep";
// import { AccountStep } from "./SetupAssistant/steps/AccountStep";
// import { ThemeStep } from "./SetupAssistant/steps/ThemeStep";
// import { SetupContext } from "./SetupAssistant/SetupContext";

// Generate a funky random username like "CosmicTiger42" or "NeonPanda99"
const generateFunkyName = (): { name: string; email: string } => {
  const funkyName = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    separator: "",
    style: "capital",
    length: 2,
  });
  const name = `${funkyName}`;
  const email = `${name.toLowerCase()}@gmail.com`;
  return { name, email };
};

export const SetupAssistant: React.FC = () => {
  const { setSetupComplete, updateUser, setLanguage, setBooting } =
    useSystemStore();

  // Simplified flow: Hello -> Boot -> Desktop
  const handleGetStarted = () => {
    // Generate funky random user
    const { name, email } = generateFunkyName();

    // Set default user values
    updateUser({
      name,
      email,
      phone: "+916387935021",
      age: "26",
      password: "Dumas",
    });

    // Set default language (country: US implied)
    setLanguage("English");

    // Trigger booting screen and complete setup
    setBooting(true);
    setSetupComplete(true);
  };

  return <HelloStep onNext={handleGetStarted} />;

  /* ORIGINAL MULTI-STEP SETUP WIZARD - COMMENTED OUT
  const { setSetupComplete, setupStep: step, setSetupStep } = useSystemStore();

  const [selectedCountry, setSelectedCountry] = useState("US");
  const [selectedLanguages] = useState(["English (UK)", "German"]);
  const [accountTitle, setAccountTitle] = useState(
    "Create Your Computer Account"
  );
  const [appleID, setAppleID] = useState("");

  const nextStep = (next: string) => setSetupStep(next);

  const renderStep = () => {
    switch (step) {
      case "hello":
        return <HelloStep onNext={() => nextStep("language")} />;
      case "language":
        return (
          <LanguageStep
            onNext={() => nextStep("region")}
            onBack={() => setSetupStep("hello")}
          />
        );
      case "region":
        return (
          <RegionStep
            onNext={() => nextStep("dataprivacy")}
            onBack={() => setSetupStep("language")}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
          />
        );
      case "dataprivacy":
        return (
          <DataPrivacyStep
            onNext={() => nextStep("touchid")}
            onBack={() => setSetupStep("region")}
          />
        );
      case "touchid":
        return (
          <TouchIDStep
            onNext={() => nextStep("fingerprint")}
            onBack={() => setSetupStep("dataprivacy")}
          />
        );
      case "fingerprint":
        return (
          <FingerprintStep
            onNext={() => nextStep("languages")}
            onBack={() => setSetupStep("touchid")}
          />
        );
      case "languages":
        return (
          <LanguagesStep
            onNext={() => nextStep("accessibility")}
            onBack={() => setSetupStep("fingerprint")}
            selectedLanguages={selectedLanguages}
          />
        );
      case "accessibility":
        return (
          <AccessibilityStep
            onNext={() => nextStep("migration")}
            onBack={() => setSetupStep("languages")}
          />
        );
      case "migration":
        return (
          <MigrationStep
            onNext={() => nextStep("appleid")}
            onBack={() => setSetupStep("accessibility")}
          />
        );
      case "appleid":
        return (
          <AppleIDStep
            onNext={() => {
              setAccountTitle("Create Your Computer Account");
              nextStep("account");
            }}
            onBack={() => setSetupStep("migration")}
            onCreateAppleID={() => {
              setAccountTitle("Create Apple ID");
              nextStep("account");
            }}
            appleID={appleID}
            setAppleID={setAppleID}
          />
        );
      case "account":
        return (
          <AccountStep
            onNext={() => nextStep("theme")}
            onBack={() => setSetupStep("appleid")}
            title={accountTitle}
            initialEmail={appleID}
          />
        );
      case "theme":
        return (
          <ThemeStep
            onNext={() => setSetupComplete(true)}
            onBack={() => setSetupStep("account")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SetupContext.Provider value={{ currentStep: step }}>
      {renderStep()}
    </SetupContext.Provider>
  );
  */
};
