// src/App.tsx

import { useEffect } from "react";
import "./xstream-video-player.css";
import { XStreamVideoPlayer } from "./xstream-video-player";

function App() {
  let init = false;
  useEffect(() => {
    const player = new XStreamVideoPlayer({
      container: `player`,
      autoplay: true,
    });
    if (!init) {
      player.init();
      console.log(player);
      init = true;
    }
  }, [XStreamVideoPlayer]);
  return (
    <>
      <div id="player"></div>
    </>
  );
}

export default App;
