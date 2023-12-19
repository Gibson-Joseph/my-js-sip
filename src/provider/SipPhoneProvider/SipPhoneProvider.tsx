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
import { getAudioElement, getVideoElement } from "../../utils/media-helpers";

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
    const mediaElement = getVideoElement(elementId);
    session.ontrack = (event) => {
      if (event.track.kind === "video") {
        console.log("event.streams RemoteStream", event.streams);
        if (event.streams.length > 0 && mediaElement) {
          console.log("RemoteStream If block is called");
          mediaElement.srcObject = event.streams[0];
          mediaElement.play();
        } else {
          console.log("RemoteStream Else block is called");
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
    const mediaElement = getVideoElement(elementId);
    session.connection.ontrack = (event) => {
      if (event.track.kind === "audio") {
        console.log("event.streams LocalStream", event.streams);
        if (event.streams.length > 0 && mediaElement) {
          console.log("LocalStream If block is called");
          mediaElement.srcObject = event.streams[0];
          mediaElement.play();
        } else {
          console.log("Else block is called");
          const stream = new MediaStream([event.track]);
          if (mediaElement) {
            mediaElement.srcObject = stream;
            mediaElement.play();
          }
        }
      }
    };
  };

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

  function conference(
    sessions: RTCPeerConnectionDeprecated[],
    remoteAudioId: string
  ) {
    //take all received tracks from the sessions you want to merge
    var receivedTracks: any = [];
    sessions.forEach(function (session: any) {
      if (session !== null && session !== undefined) {
        session.connection.getReceivers().forEach(function (receiver: any) {
          receivedTracks.push(receiver?.track);
        });
      }
    });

    //use the Web Audio API to mix the received tracks
    var context = new AudioContext();
    var allReceivedMediaStreams = new MediaStream();

    sessions.forEach(function (session: any) {
      if (session !== null && session !== undefined) {
        var mixedOutput = context.createMediaStreamDestination();

        session.connection.getReceivers().forEach(function (receiver: any) {
          receivedTracks.forEach(function (track: any) {
            allReceivedMediaStreams.addTrack(receiver.track);
            if (receiver.track.id !== track.id) {
              var sourceStream = context.createMediaStreamSource(
                new MediaStream([track])
              );
              sourceStream.connect(mixedOutput);
            }
          });
        });
        //mixing your voice with all the received audio
        session.connection.getSenders().forEach(function (sender: any) {
          var sourceStream = context.createMediaStreamSource(
            new MediaStream([sender.track])
          );
          sourceStream.connect(mixedOutput);
        });
        session.connection
          .getSenders()[0]
          .replaceTrack(mixedOutput.stream.getTracks()[0]);
      }
    });

    //play all received stream to you
    var remoteAudio: any = document.getElementById(remoteAudioId);
    remoteAudio.srcObject = allReceivedMediaStreams;
    var promiseRemote = remoteAudio.play();
    if (promiseRemote !== undefined) {
      promiseRemote
        .then((_: any) => {
          console.log("playing all received streams to you");
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  }

  const outgoingCall = async (session: RTCSession) => {
    attachLocalStream(session, "videoRemote");
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
    session.on("accepted", (e: any) => {
      console.log("outgoingCall has accepted");
      // attachLocalStream(session, "videoRemote");
      // need to remove this line
      attachIncommingLocalStream(session, "videoLocal");
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
      attachIncommingLocalStream(session, "videoLocal");
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
      attachRemoteStream(e.peerconnection, "videoRemote");
      // conference([e.peerconnection], "remoteAudio");
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
      video: true,
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
