import React, {
  FC,
  useState,
  ReactNode,
  useEffect,
  useContext,
  createContext,
  SetStateAction,
} from "react";
import { UseMoel } from "../ModelProvider/ModelProvider";
import { RTCSession } from "jssip/lib/RTCSession";
import { useNavigate } from "react-router-dom";
import { useSipClient } from "../SipClientProvider/SipClientProvider";
import { CallOptions, RTCSessionEvent } from "jssip/lib/UA";

interface SipPhoneContextData {
  sipNum: string;
  holdCall: () => void;
  muteCall: () => void;
  setSipNum: React.Dispatch<SetStateAction<string>>;
  callReject: () => void;
  callAnswer: () => void;
  makeCallRequest: () => void;
}

interface SipPhoneContextProviderProps {
  children: ReactNode;
}

const SipPhoneContext = createContext<SipPhoneContextData | null>(null);

export const SipPhoneProvider: FC<SipPhoneContextProviderProps> = ({
  children,
}) => {
  const navigate = useNavigate();

  const { sipClient } = useSipClient();
  const { setOutgoingCall, setIncommingCall } = UseMoel();

  const [sipNum, setSipNum] = useState<string>("");
  const [session, setSession] = useState<RTCSession>();

  const domain = "sipjs.onsip.com";

  const outgoingCall = (session: RTCSession) => {
    session.on("progress", () => {
      console.log("outgoingCall call is in progress");
      setOutgoingCall(true);
    });
    session.on("connecting", () => {
      console.log("outgoingCall call is in connecting ...");
    });
    session.on("ended", () => {
      console.log("outgoingCall call has ended");
      navigate("/");
      setOutgoingCall(false);
    });
    session.on("confirmed", () => {
      console.log("outgoingCall is confirmed");
      setOutgoingCall(false);
    });
    session.on("failed", () => {
      console.log("outgoingCall unable to establish the call");
      navigate("/");
      setOutgoingCall(false);
    });
    session.on("accepted", () => {
      console.log("outgoingCall has accepted");
      navigate("/answer");
    });
  };

  const inCommingCall = (session: RTCSession) => {
    session.on("progress", () => {
      console.log("inCommingCall is in progress");
      setIncommingCall(true);
    });
    session.on("accepted", () => {
      console.log("inCommingCall call has answered");
      navigate("/answer");
      setIncommingCall(false);
    });
    session.on("connecting", () => {
      console.log("inCommingCall call is in connecting ...");
    });
    session.on("confirmed", () => {
      console.log(
        "inCommingCall handler will be called for incoming calls too"
      );
      setIncommingCall(false);
    });
    session.on("ended", () => {
      console.log("inCommingCall call has ended");
      setIncommingCall(false);
      navigate("/");
    });
    session.on("failed", () => {
      console.log("inCommingCall unable to establish the call");
      setIncommingCall(false);
    });
  };

  useEffect(() => {
    sipClient?.on("newRTCSession", (data: RTCSessionEvent) => {
      const session: RTCSession = data.session;
      const direction = session.direction;
      console.log("direction", direction);
      setSession(session);
      if (direction === "incoming") {
        inCommingCall(session);
        // SessionDirection?.OUTGOING
      } else if (direction === "outgoing") {
        outgoingCall(session);
      }
    });
  }, [sipClient]);

  const callAnswer = () => {
    session?.answer();
  };

  const callReject = () => {
    session?.terminate();
  };

  const muteCall = () => {
    const state = session?.isMuted();
    if (state) {
      session?.mute();
    } else {
      session?.unmute();
    }
  };

  const holdCall = () => {
    const state = session?.isOnHold();
    if (state) {
      session?.hold();
    } else {
      session?.unhold();
    }
  };

  const options: CallOptions = {
    // eventHandlers,
    mediaConstraints: {
      audio: true,
      video: false,
    },
  };

  const makeCallRequest = async () => {
    const target = `sip:${sipNum}@${domain}`;
    console.log("target", target);

    const session = await sipClient?.call(target, options);
    console.log("session", session);
  };

  return (
    <SipPhoneContext.Provider
      value={{
        sipNum,
        muteCall,
        holdCall,
        setSipNum,
        callAnswer,
        callReject,
        makeCallRequest,
      }}
    >
      {children}
    </SipPhoneContext.Provider>
  );
};

export const useSipPhone = () => {
  const context = useContext(SipPhoneContext);
  if (!context) {
    throw new Error(
      "useSipPhoneContext must be used within a SipPhoneProvider"
    );
  }
  return context;
};
