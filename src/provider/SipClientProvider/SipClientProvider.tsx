import { UAConfiguration } from "jssip/lib/UA";
import { UA, WebSocketInterface } from "jssip";
import {
  FC,
  useState,
  useEffect,
  ReactNode,
  useContext,
  createContext,
} from "react";

interface SipClientContextData {
  sipClient: UA | undefined;
  main: (userName: string, password: string) => void;
}

interface SipClientContextProviderProps {
  children: ReactNode;
}

const SipClientContext = createContext<SipClientContextData | null>(null);

export const SipClientProvider: FC<SipClientContextProviderProps> = ({
  children,
}) => {
  const [sipClient, setSipClient] = useState<UA>();

  // Create our JsSIP instance and run it:
  const server = "wss://edge.sip.onsip.com";
  const domain = "sipjs.onsip.com";
  const socket = new WebSocketInterface(server);

  const main = async (userName: string, password: string) => {
    const configuration: UAConfiguration = {
      sockets: [socket],
      uri: `sip:${userName}@${domain}`,
      authorization_user: userName,
      password: password,
      display_name: userName,
    };

    const ua: UA = new UA(configuration);

    // WebSocket connection events
    ua.on("connecting", function (e) {
      console.log("WebSocket connecting", e);
    });
    ua.on("connected", function (e) {
      console.log("WebSocket connected", e);
    });
    ua.on("disconnected", function (e) {
      console.log("WebSocket disconnected", e);
    });

    // SIP registration events
    ua.on("registered", function (e) {
      console.log("SIP registered", e);
      localStorage.setItem("userName", userName);
      localStorage.setItem("password", password);
    });
    ua.on("unregistered", function (e) {
      console.log("SIP unregistered", e);
    });
    ua.on("registrationFailed", function (e) {
      console.log("SIP registrationFailed", e);
    });

    // SIP.debug.enable("JsSIP:*");

    // Starting the User Agent
    ua.start();
    setSipClient(ua);
  };

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    const password = localStorage.getItem("password");

    if (userName && password) {
      main(userName, password)
        .then((res) => {
          console.log("success", res);
        })
        .catch((err: any) => {
          console.log("err", err);
        });
    }
  }, []);

  return (
    <SipClientContext.Provider
      value={{
        sipClient,
        main,
      }}
    >
      {children}
    </SipClientContext.Provider>
  );
};

export const useSipClient = () => {
  const context = useContext(SipClientContext);
  if (!context) {
    throw new Error("useSipClient must be used within a SipClientProvider");
  }
  return context;
};
