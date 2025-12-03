import { createContext, useContext } from "react";

interface SetupContextType {
  currentStep: string;
}

export const SetupContext = createContext<SetupContextType>({
  currentStep: "hello",
});

export const useSetupContext = () => useContext(SetupContext);
