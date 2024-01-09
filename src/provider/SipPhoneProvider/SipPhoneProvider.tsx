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
import { getAudioElement, getVideoElement } from "../../utils/media-helpers";
import useSound from "use-sound";

// sound
import inRing from "../../assets/sounds/ring.mp3";
import outRing from "../../assets/sounds/ringback.mp3";

interface SipPhoneContextData {
  sipNum: string;
  callType: CallType;
  holdCall: () => void;
  muteCall: () => void;
  setSipNum: React.Dispatch<SetStateAction<string>>;
  callReject: () => void;
  callAnswer: () => void;
  addToCall: () => void;
  makeCallRequest: (audio: boolean, video: boolean) => void;
  session: RTCSession | undefined;
}

interface SipPhoneContextProviderProps {
  children: ReactNode;
}

const SipPhoneContext = createContext<SipPhoneContextData | null>(null);

export enum CallTypeEnum {
  VIDEO = "video",
  AUDIO = "audio",
}

export type CallType = CallTypeEnum.VIDEO | CallTypeEnum.AUDIO | null;

export const SipPhoneProvider: FC<SipPhoneContextProviderProps> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { sipClient } = useSipClient();
  const { setOutgoingCall, setIncommingCall } = UseMoel();

  const [sipNum, setSipNum] = useState<string>("");
  const [session, setSession] = useState<RTCSession>();
  const [callType, setCallType] = useState<CallType>(null);

  const [incommingRing, playIcommingRing] = useSound(inRing, {
    loop: true,
    forceSoundEnabled: true,
    soundEnabled: true,
  });

  const [outgoingRing, playOutgoingRing] = useSound(outRing, {
    loop: true,
    forceSoundEnabled: true,
    soundEnabled: true,
  });

  const domain = "sipjs.onsip.com";
  const mixedStream = new MediaStream();

  const attachIncommingLocalStream = (
    session: RTCSession,
    elementId: string
  ) => {
    const mediaElement = getVideoElement(elementId);

    if (!mediaElement) {
      console.error(`Media element with id ${elementId} not found.`);
      return;
    }

    // Assuming there is a local video track, add it to the local stream
    const localVideoSender = session.connection.getSenders().find((sender) => {
      return sender.track?.kind === "video";
    });
    console.log("localVideoSender", localVideoSender);

    if (localVideoSender && localVideoSender.track) {
      const localStream = new MediaStream([localVideoSender.track]);

      // Attach the local stream to the video element
      mediaElement.srcObject = localStream;
      mediaElement.play();

      // Log information for debugging
      console.log("Local video stream attached to", elementId);
      console.log("Local video track:", localVideoSender.track);
    } else {
      console.error("No local video track found in the session.");
      // test(session, elementId);
    }
  };

  const outgoingCall = (session: RTCSession) => {
    console.log("outgoingCall session is", session);
    session.connection.addEventListener("track", (e) => {
      let mediaElement;
      if (e.track.kind === "video") {
        setCallType(CallTypeEnum.VIDEO);
        mediaElement = getVideoElement("remoteVideo");
      } else if (e.track.kind === "audio") {
        mediaElement = getAudioElement("remoteAudio");
      }
      mixedStream.addTrack(e.track);
      if (mediaElement) {
        mediaElement.srcObject = mixedStream;
        mediaElement.play();
      }
    });

    session.on("progress", () => {
      console.log("outgoingCall call is in progress");
      setOutgoingCall(true);
      outgoingRing();
    });
    session.on("connecting", () => {
      console.log("outgoingCall call is in connecting ...");
    });
    session.on("ended", () => {
      console.log("outgoingCall call has ended");
      navigate("/");
      setOutgoingCall(false);
      setCallType(null);
      playOutgoingRing.stop();
    });
    session.on("confirmed", () => {
      console.log("outgoingCall is confirmed");
      setOutgoingCall(false);
      playOutgoingRing.stop();
    });
    session.on("failed", () => {
      console.log("outgoingCall unable to establish the call");
      navigate("/");
      setOutgoingCall(false);
      setCallType(null);
      playOutgoingRing.stop();
    });
    session.on("accepted", () => {
      console.log("outgoingCall has accepted");
      navigate("/answer");
      attachIncommingLocalStream(session, "localVideo");
      playOutgoingRing.stop();
    });
  };

  const inCommingCall = (session: RTCSession) => {
    console.log("Incomming call session is", session);
    session.on("progress", () => {
      console.log("inCommingCall is in progress");
      setIncommingCall(true);
      incommingRing();
    });
    session.on("accepted", () => {
      console.log("inCommingCall call has answered");
      navigate("/answer");
      setIncommingCall(false);
      playIcommingRing.stop();
    });
    session.on("connecting", () => {
      console.log("inCommingCall call is in connecting ...");
    });
    session.on("confirmed", () => {
      console.log(
        "inCommingCall handler will be called for incoming calls too"
      );
      setIncommingCall(false);
      attachIncommingLocalStream(session, "localVideo");
      playIcommingRing.stop();
    });
    session.on("ended", () => {
      console.log("inCommingCall call has ended");
      setIncommingCall(false);
      navigate("/");
      setCallType(null);
      playIcommingRing.stop();
    });
    session.on("failed", () => {
      console.log("inCommingCall unable to establish the call");
      setIncommingCall(false);
    });
    session.on("peerconnection", (e) => {
      session.connection.addEventListener("track", (e) => {
        let mediaElement;
        if (e.track.kind === "video") {
          setCallType(CallTypeEnum.VIDEO);
          mediaElement = getVideoElement("remoteVideo");
        } else if (e.track.kind === "audio") {
          mediaElement = getAudioElement("remoteAudio");
        }
        mixedStream.addTrack(e.track);
        if (mediaElement) {
          console.log("mediaElement is working fine");
          mediaElement.srcObject = mixedStream;
          mediaElement.play();
        }
      });
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

  const addToCall = () => {
    console.log("Add to call function is called");
    makeCallRequest(true, false);
  };

  const makeCallRequest = async (audio: boolean, video: boolean) => {
    const options: CallOptions = {
      // eventHandlers,
      mediaConstraints: {
        audio,
        video,
      },
    };

    const target = `sip:${sipNum}@${domain}`;
    console.log("target", target);

    const session = await sipClient?.call(target, options);
    console.log("session", session);
  };

  return (
    <SipPhoneContext.Provider
      value={{
        sipNum,
        callType,
        muteCall,
        holdCall,
        setSipNum,
        callAnswer,
        callReject,
        makeCallRequest,
        addToCall,
        session,
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
