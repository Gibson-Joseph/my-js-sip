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
import {
  PeerConnectionEvent,
  RTCPeerConnectionDeprecated,
  RTCSession,
} from "jssip/lib/RTCSession";
import { useNavigate } from "react-router-dom";
import { useSipClient } from "../SipClientProvider/SipClientProvider";
import { CallOptions, RTCSessionEvent } from "jssip/lib/UA";
import { getAudioElement } from "../../utils/media-helpers";

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

  const attachRemoteStream = (
    session: RTCPeerConnectionDeprecated,
    elementId: string
  ) => {
    const mediaElement = getAudioElement(elementId);
    session.ontrack = (event) => {
      if (event.track.kind === "audio") {
        if (event.streams.length > 0 && mediaElement) {
          mediaElement.srcObject = event.streams[0];
          mediaElement.play();
        } else {
          const stream = new MediaStream([event.track]);
          if (mediaElement) {
            mediaElement.srcObject = stream;
            mediaElement.play();
          }
        }
      }
    };
  };

  const attachLocalStream = (session: RTCSession, elementId: string) => {
    const mediaElement = getAudioElement(elementId);
    session.connection.ontrack = (event) => {
      if (event.track.kind === "audio") {
        if (event.streams.length > 0 && mediaElement) {
          mediaElement.srcObject = event.streams[0];
          mediaElement.play();
        } else {
          const stream = new MediaStream([event.track]);
          if (mediaElement) {
            mediaElement.srcObject = stream;
            mediaElement.play();
          }
        }
      }
    };
  };

  const outgoingCall = (session: RTCSession) => {
    attachLocalStream(session, "localAudio");
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
    session.on("peerconnection", (e) => {
      attachRemoteStream(e.peerconnection, "remoteAudio");
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
    console.log("state", state.audio);

    if (state.audio) {
      session?.unmute();
    } else {
      session?.mute();
    }
  };

  const holdCall = () => {
    const state = session?.isOnHold();
    console.log("state", state);

    if (state?.local) {
      session?.unhold();
    } else {
      session?.hold();
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
