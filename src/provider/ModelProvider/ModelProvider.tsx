import {
  useState,
  ReactNode,
  useContext,
  createContext,
  SetStateAction,
} from "react";

interface ModelContextType {
  outgoingCall: boolean;
  inCommingCall: boolean;
  setOutgoingCall: React.Dispatch<SetStateAction<boolean>>;
  setIncommingCall: React.Dispatch<SetStateAction<boolean>>;
}

const ModelContext = createContext<ModelContextType | null>(null);

export const ModelProvider = ({ children }: { children: ReactNode }) => {
  const [outgoingCall, setOutgoingCall] = useState(false);
  const [inCommingCall, setIncommingCall] = useState(false);

  return (
    <ModelContext.Provider
      value={{
        outgoingCall,
        inCommingCall,
        setOutgoingCall,
        setIncommingCall,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};

export function UseMoel() {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error("ModelContext must be used within a ModelProvider");
  }
  return context;
}
