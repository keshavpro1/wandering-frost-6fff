import { useEffect, useRef } from "react";
import "./xstream-video-player.css";
// import { XStreamVideoPlayer } from "./xstream-video-player.js";

import XStreamVideoPlayer from "./XStreamVideoPlayer";

function App() {
  const playerRef = useRef<HTMLDivElement>(null);
  let initialized = false;
  useEffect(() => {
    if (playerRef.current && !initialized) {
      const player = new XStreamVideoPlayer({
        container: playerRef.current,
        autoplay: true,
      });
      player.init();
      initialized = true;
    }
  }, []); // Empty dependency array already ensures this runs once only

  return ( 
    <div className="app-container">
      <div className="xstream-video-container" ref={playerRef} id="xstream-video-container">
        <div id="xstream_video_player"></div>
        <div className="xstream-video-controls">
          <div className="xstream-video-center-wrapper">
            <span className="xstream-video-loader video-player-loader"></span>
            <button className="xstream-video-play-btn" id="xstreamVideoPlayBtn">
              <svg style={{width: "25px", height: "25px"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path fill="#fff" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"/>
              </svg>
            </button>
            <div className="xstream-error-message">
              <svg style={{width: "30px", height: "30px" }}xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 496 512">
                <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-33.8-217.9c7.8-7.8 7.8-20.5 0-28.3L196.3 192l17.9-17.9c7.8-7.8 7.8-20.5 0-28.3-7.8-7.8-20.5-7.8-28.3 0L168 163.7l-17.8-17.8c-7.8-7.8-20.5-7.8-28.3 0-7.8 7.8-7.8 20.5 0 28.3l17.9 17.9-17.9 17.9c-7.8 7.8-7.8 20.5 0 28.3 7.8 7.8 20.5 7.8 28.3 0l17.8-17.8 17.8 17.8c7.9 7.7 20.5 7.7 28.4-.2zm160-92.2c-7.8-7.8-20.5-7.8-28.3 0L328 163.7l-17.8-17.8c-7.8-7.8-20.5-7.8-28.3 0-7.8 7.8-7.8 20.5 0 28.3l17.9 17.9-17.9 17.9c-7.8 7.8-7.8 20.5 0 28.3 7.8 7.8 20.5 7.8 28.3 0l17.8-17.8 17.8 17.8c7.8 7.8 20.5 7.8 28.3 0 7.8-7.8 7.8-20.5 0-28.3l-17.8-18 17.9-17.9c7.7-7.8 7.7-20.4 0-28.2zM248 272c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64z"/>
              </svg>
              <h3> No Live Event </h3>
              <br/>
              <button className="xstream-video-try-again-btn">
                <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M256.5 8c66.3.1 126.4 26.2 170.9 68.7l35.7-35.7C478.1 25.9 504 36.6 504 57.9V192c0 13.3-10.7 24-24 24H345.9c-21.4 0-32.1-25.9-17-41l41.8-41.8c-30.9-28.9-70.8-44.9-113.2-45.3-92.4-.8-170.3 74-169.5 169.4C88.8 348 162.2 424 256 424c41.1 0 80-14.7 110.6-41.6 4.7-4.2 11.9-3.9 16.4.6l39.7 39.7c4.9 4.9 4.6 12.8-.5 17.4C378.2 479.8 319.9 504 256 504 119 504 8 393 8 256 8 119.2 119.6 7.8 256.5 8z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="xstream-bottom-controller xstream-hide">
            <div className="xstream-controls-left">
              <button className="play-pause-btn">
                <svg style={{width: "18px", height: "18px"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path fill="#fff" d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"/>
                </svg>
              </button>
              <button className="mute-unmute-btn">
                <svg style={{width: "18px", height: "18px"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                  <path fill="#fff" d="M215 71.1L126.1 160H24c-13.3 0-24 10.7-24 24v144c0 13.3 10.7 24 24 24h102.1l89 89c15 15 41 4.5 41-17V88c0-21.5-26-32-41-17zm233.3-51.1c-11.2-7.3-26.2-4.2-33.5 7-7.3 11.2-4.2 26.2 7 33.5 66.3 43.5 105.8 116.6 105.8 195.6 0 79-39.6 152.1-105.8 195.6-11.2 7.3-14.3 22.3-7 33.5 7 10.7 21.9 14.6 33.5 7C528.3 439.6 576 351.3 576 256S528.3 72.4 448.4 20z"/>
                </svg>
              </button>
              <span className="live-status-text-wrapper">
                LIVE
              </span>
            </div>
            
          </div>
        </div>
      </div>
      {/* <XStreamVideoPlayer ref={playerRef} /> */}
    </div>
  );
}

export default App;