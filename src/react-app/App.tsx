import { useEffect, useRef } from "react";
import "./xstream-video-player.css";
// import { XStreamVideoPlayer } from "./xstream-video-player.js";

import * as Flashphoner from '@flashphoner/websdk';

function App() {
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     if (playerRef.current) {
      
      console.log(Flashphoner.init({}));
      
  //     const player = new XStreamVideoPlayer({
  //       container: "player",
  //       autoplay: true,
  //     });
  //     player.init();
    }
  }, []);

  return (
    <div className="app-container">
      <div ref={playerRef} id="player"></div>
    </div>
  );
}

export default App;