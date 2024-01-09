import {
  useState,
  ReactNode,
  useContext,
  createContext,
  SetStateAction,
} from "react";

interface SessionContextType {
  sessions: any[];
  setSessions: React.Dispatch<SetStateAction<any[]>>;
}

const SipSessionContext = createContext<SessionContextType | null>(null);

export const SipSessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<any[]>([]);

  return (
    <SipSessionContext.Provider
      value={{
        sessions,
        setSessions,
      }}
    >
      {children}
    </SipSessionContext.Provider>
  );
};

export function UseSipSession() {
  const context = useContext(SipSessionContext);
  if (!context) {
    throw new Error(
      "SipSessionContext must be used within a SipSessionProvider"
    );
  }
  return context;
}
