import React, { useState } from "react";
import { useSystemStore } from "../store/systemStore";
import { HelloStep } from "./SetupAssistant/steps/HelloStep";
import { LanguageStep } from "./SetupAssistant/steps/LanguageStep";
import { RegionStep } from "./SetupAssistant/steps/RegionStep";
import { DataPrivacyStep } from "./SetupAssistant/steps/DataPrivacyStep";
import { TouchIDStep } from "./SetupAssistant/steps/TouchIDStep";
import { FingerprintStep } from "./SetupAssistant/steps/FingerprintStep";
import { LanguagesStep } from "./SetupAssistant/steps/LanguagesStep";
import { AccessibilityStep } from "./SetupAssistant/steps/AccessibilityStep";
import { MigrationStep } from "./SetupAssistant/steps/MigrationStep";
import { AppleIDStep } from "./SetupAssistant/steps/AppleIDStep";
import { AccountStep } from "./SetupAssistant/steps/AccountStep";
import { ThemeStep } from "./SetupAssistant/steps/ThemeStep";
import { SetupContext } from "./SetupAssistant/SetupContext";

export const SetupAssistant: React.FC = () => {
  const { setSetupComplete } = useSystemStore();
  const [step, setStep] = useState<
    | "hello"
    | "language"
    | "region"
    | "dataprivacy"
    | "touchid"
    | "fingerprint"
    | "languages"
    | "accessibility"
    | "migration"
    | "appleid"
    | "account"
    | "theme"
    | "finish"
  >("hello");

  const [selectedCountry, setSelectedCountry] = useState("Germany");
  const [selectedLanguages] = useState(["English (UK)", "German"]);
  const [accountTitle, setAccountTitle] = useState(
    "Create Your Computer Account"
  );
  const [appleID, setAppleID] = useState("");

  const nextStep = (next: typeof step) => setStep(next);

  const renderStep = () => {
    switch (step) {
      case "hello":
        return <HelloStep onNext={() => nextStep("language")} />;
      case "language":
        return (
          <LanguageStep
            onNext={() => nextStep("region")}
            onBack={() => setStep("hello")}
          />
        );
      case "region":
        return (
          <RegionStep
            onNext={() => nextStep("dataprivacy")}
            onBack={() => setStep("language")}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
          />
        );
      case "dataprivacy":
        return (
          <DataPrivacyStep
            onNext={() => nextStep("touchid")}
            onBack={() => setStep("region")}
          />
        );
      case "touchid":
        return (
          <TouchIDStep
            onNext={() => nextStep("fingerprint")}
            onBack={() => setStep("dataprivacy")}
          />
        );
      case "fingerprint":
        return (
          <FingerprintStep
            onNext={() => nextStep("languages")}
            onBack={() => setStep("touchid")}
          />
        );
      case "languages":
        return (
          <LanguagesStep
            onNext={() => nextStep("accessibility")}
            onBack={() => setStep("fingerprint")}
            selectedLanguages={selectedLanguages}
          />
        );
      case "accessibility":
        return (
          <AccessibilityStep
            onNext={() => nextStep("migration")}
            onBack={() => setStep("languages")}
          />
        );
      case "migration":
        return (
          <MigrationStep
            onNext={() => nextStep("appleid")}
            onBack={() => setStep("accessibility")}
          />
        );
      case "appleid":
        return (
          <AppleIDStep
            onNext={() => {
              setAccountTitle("Create Your Computer Account");
              nextStep("account");
            }}
            onBack={() => setStep("migration")}
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
            onBack={() => setStep("appleid")}
            title={accountTitle}
            initialEmail={appleID}
          />
        );
      case "theme":
        return (
          <ThemeStep
            onNext={() => setSetupComplete(true)}
            onBack={() => setStep("account")}
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
};
