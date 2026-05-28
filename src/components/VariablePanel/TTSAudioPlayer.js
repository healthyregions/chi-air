import React from "react";
import { useSpeech } from "react-text-to-speech";

// TODO: Parameterize after testing
export default function TTSAudioPlayer({ text }) {
  const { Text, speechStatus, start, pause, stop } = useSpeech({
    text,
    pitch: 1,
    rate: 0.9,
    volume: 1,
    lang: "en-US",
    voiceURI: "Nicky",
    autoPlay: false,
    highlightText: true,
    showOnlyHighlightedText: true,
    highlightMode: "word",
    enableDirectives: "false"
  });

  return (
    <div style={{ margin: "1rem", whiteSpace: "pre-wrap" }}>
      <div style={{ display: "flex", columnGap: "1rem", marginBottom: "1rem" }}>
        <button disabled={speechStatus === "started"} onClick={start}>
          Start
        </button>
        <button disabled={speechStatus === "paused"} onClick={pause}>
          Pause
        </button>
        <button disabled={speechStatus === "stopped"} onClick={stop}>
          Stop
        </button>
      </div>
      <Text />
    </div>
  );
}
