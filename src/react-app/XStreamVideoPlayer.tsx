// src/App.tsx

// import { ReactNode, 
//   // useEffect, useRef, useState 
// } from "react";

import "./xstream-video-player.css";
// import CryptoJS from "crypto-js";
// @ts-ignore
// import * as XStream from "./xstream-video-player.js";
import * as Flashphoner from '@flashphoner/websdk';
// @ts-ignore
import { streamName, url, videoQuality, autoplay } from "../../config.js";

interface XStreamVideoPlayerProps {
  container: HTMLElement;
  autoplay?: boolean;
}

interface StreamElements {
  videoPlayer: HTMLElement | null;
  playButton: HTMLElement | null;
  loader: HTMLElement | null;
  errorMessage: HTMLElement | null;
  tryAgainButton: HTMLElement | null;
  bottomController: HTMLElement | null;
  playPauseBtn: HTMLElement | null;
  muteUnmuteBtn: HTMLElement | null;
  settingsBtn: HTMLElement | null;
  resolutionOptions: NodeListOf<Element> | null;
}

export class XStreamVideoPlayer {
  private container: HTMLElement;
  private stream: any;
  private elements: StreamElements;
  private mouseTimeout: ReturnType<typeof setTimeout> | null = null;

  
  constructor(props: XStreamVideoPlayerProps) {
    // Required configuration
    this.container = props.container;
    this.elements = {
      videoPlayer: null,
      playButton: null,
      loader: null,
      errorMessage: null,
      tryAgainButton: null,
      bottomController: null,
      playPauseBtn: null,
      muteUnmuteBtn: null,
      settingsBtn: null,
      resolutionOptions: null
    };
    this.mouseTimeout = null;
    
  }

  public async init()  {
    // await this.getStreamsName();
    this.initializeElements();
    this.attachEventListeners();
    
    Flashphoner.init({
      flashMediaProviderSwfLocation: "",
    });

    if (autoplay) {
      this.start();
    }
  }
  initializeElements() {
    this.elements = {
      videoPlayer: this.container.querySelector("#xstream_video_player"),
      playButton: this.container.querySelector("#xstreamVideoPlayBtn"),
      loader: this.container.querySelector(".video-player-loader"),
      errorMessage: this.container.querySelector(".xstream-error-message"),
      tryAgainButton: this.container.querySelector(".xstream-video-try-again-btn"),
      bottomController: this.container.querySelector(".xstream-bottom-controller"),
      playPauseBtn: this.container.querySelector(".play-pause-btn"),
      muteUnmuteBtn: this.container.querySelector(".mute-unmute-btn"),
      settingsBtn: this.container.querySelector(".setting-btn"),
      resolutionOptions: this.container.querySelectorAll(".resolution-option")
    };
  }

  attachEventListeners() {
    // Play/Pause controls
    this.elements?.playButton?.addEventListener("click", () => this.start());
    this.elements?.tryAgainButton?.addEventListener("click", () => this.start());
    this.elements?.playPauseBtn?.addEventListener("click", () => this.togglePlayPause());

    // Mouse movement controls
    // this.container.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.container.addEventListener("mouseleave", this.handleMouseLeave.bind(this));

    // Quality controls
    this.elements?.resolutionOptions?.forEach(option => {
      option?.addEventListener("click", (e) => this.handleQualityChange(e));
    });

    // Other controls
    this.elements?.muteUnmuteBtn?.addEventListener("click", () => this.toggleMute());

    // Fullscreen change event
  }

  // Streaming Methods
  start() {
    this.showLoader();
    this.hideError();
    const existingSession = Flashphoner.getSessions()[0];
    if (existingSession) {
      this.handleExistingSession();
    } else {
      this.createNewSession();
    }
  }

  handleExistingSession() {
    const session = Flashphoner.getSessions()[0];
    if (session.getServerUrl() === url) {
      this.playStream(session);
    } else {
      session.disconnect();
      this.createNewSession();
    }
  }

  createNewSession() {
    Flashphoner.createSession({ urlServer: url,
      custom:{
        token:"KzBNPrvzfn3JFmFvnLKxkG5QhqhGbjDP3jMa3jZD"
      } 
    })
      .on(Flashphoner.constants.SESSION_STATUS.ESTABLISHED, (session: any) => this.playStream(session))
      .on(Flashphoner.constants.SESSION_STATUS.DISCONNECTED, () => this.handleDisconnect())
      // .on(Flashphoner.constants.SESSION_STATUS.FAILED, () => this.handleSessionFailed());
  }

   async playStream(session: any) {
       
    const options = {
      name:streamName,
      display: this.elements.videoPlayer,
      playHeight: videoQuality,
      unmutePlayOnStart: true
    };

    if (autoplay) {
      options.unmutePlayOnStart = false;
    }

    this.stream = session.createStream(options)
      .on(Flashphoner.constants.STREAM_STATUS.PENDING, this.handleStreamPending.bind(this))
      .on(Flashphoner.constants.STREAM_STATUS.PLAYING, this.handleStreamPlaying.bind(this))
      .on(Flashphoner.constants.STREAM_STATUS.STOPPED, this.handleStreamStopped.bind(this))
      .on(Flashphoner.constants.STREAM_STATUS.FAILED, this.handleStreamFailed.bind(this))
      .on(Flashphoner.constants.STREAM_EVENT, this.handleStreamEvent.bind(this));

    this.stream.play();
    this.container.addEventListener("mousemove", this.handleMouseMove.bind(this));
  }

  // UI Control Methods
  showLoader() {
    if (this.elements?.loader) {
      this.elements.loader.style.display = "block";
    }
    if (this.elements?.playButton) {
      this.elements.playButton.style.display = "none";
    }
  }

  hideLoader() {
    if(this.elements.loader){
      this.elements.loader.style.display = "none";
    }
  }

  showError() {
    if(this.elements.errorMessage){
      this.elements.errorMessage.style.display = "block";
    }
  }

  hideError() {
    if (this.elements?.errorMessage) {
      this.elements.errorMessage.style.display = "none";
    }
  }

  togglePlayPause() {
    if (this.stream) {
      if (this.elements?.playPauseBtn?.classList.contains("play")) {
        this.start();
      } else {
        this.stream.stop();
      }
    }
  }

  toggleMute() {
    if (this.stream) {
      if (this.stream.isRemoteAudioMuted()) {
        this.stream.unmuteRemoteAudio();
      } else {
        this.stream.muteRemoteAudio();
      }
      this.updateMuteButtonUI();
    }
  }

  // Event Handlers
  handleMouseMove() {
    if (this.elements?.bottomController) {
      this.elements.bottomController.classList.remove("xstream-hide");
    }
    
    if (this.mouseTimeout) {
      clearTimeout(this.mouseTimeout);
    }
    
    this.mouseTimeout = setTimeout(() => {
      if (this.elements?.bottomController) {
        this.elements.bottomController.classList.add("xstream-hide");
      }
    }, 3000);
  }

  handleMouseLeave() {
    if (this.elements?.bottomController) {
      this.elements.bottomController.classList.add("xstream-hide");
    }
  }

  handleQualityChange(event: any) {
    // const quality = event.target.getAttribute("data-value");
    // if (this.elements?.resolutionOptions) {
    //   this.elements.resolutionOptions.forEach(option => {
    //     option.classList.remove("active");
    //   });
    // }
    event.target.classList.add("active");
    // this.setQuality(quality);
  }

  

  // Stream Event Handlers
  handleStreamPending(stream: any) {
    const video = document.getElementById(stream.id());
    if (video && !(video as any).hasListeners) {
      (video as any).hasListeners = true;
      video.addEventListener("playing", () => this.hideLoader());
      video.addEventListener("volumechange", () => this.updateMuteButtonUI());
    }
  }

  handleStreamPlaying() {
    this.hideLoader();
    if (this.elements?.playButton) {
      this.elements.playButton.style.display = "none";
    }
    this.updatePlayButtonUI(true);
  }

  handleStreamStopped() {
    if (this.elements?.playButton) {
      this.elements.playButton.style.display = "inline-block";
    }
    this.hideLoader();
    this.updatePlayButtonUI(false);
    if (this.elements?.bottomController) {
      this.elements.bottomController.classList.add("xstream-hide");
    }
    
  }

  handleStreamFailed() {
    this.showError();
    this.hideLoader();
    this.container.removeEventListener("mousemove", this.handleMouseMove);
    if (this.elements?.bottomController) {
      this.elements.bottomController.classList.add("xstream-hide");
    }
  }
  handleDisconnect() {
    this.showError();
    this.hideLoader();
    this.container.removeEventListener("mousemove", this.handleMouseMove);
    if (this.elements?.bottomController) {
      this.elements.bottomController.classList.add("xstream-hide");
    }
  }

  handleStreamEvent(streamEvent: any) {
    switch (streamEvent.type) {
      case Flashphoner.constants.STREAM_EVENT_TYPE.AUDIO_MUTED:
        // this.handleBandwidthIssue(streamEvent);
        break;
      case Flashphoner.constants.STREAM_EVENT_TYPE.VIDEO_MUTED:
        // this.handleStreamResize(streamEvent);
        break;
      case Flashphoner.constants.STREAM_EVENT_TYPE.VIDEO_UNMUTED:
        // this.handleUnmuteRequired();
        break;
    }
  }

  // UI Update Methods
  private updatePlayButtonUI(isPlaying: boolean):void {
    const btn = this.elements.playPauseBtn;
    if (isPlaying) {
      if (btn) {
        btn.innerHTML = `<svg style="width: 18px;height: 18px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path fill="#fff" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z"/>
      </svg>`;
        btn.classList.remove("play");
        btn.classList.add("pause");
      }
    } else {
      if (btn) {
        btn.innerHTML = `<svg style="width: 18px;height: 18px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path fill="#fff" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"/>
        </svg>`;
        btn.classList.remove("pause");
        btn.classList.add("play");
      }
    }
  }

  private updateMuteButtonUI():void {
    const btn = this.elements.muteUnmuteBtn;
    if (this.stream && this.stream.isRemoteAudioMuted()) {
      if (btn) {
        btn.innerHTML = `<svg style="width: 18px;height: 18px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path fill="#fff" d="M215 71.1L126.1 160H24c-13.3 0-24 10.7-24 24v144c0 13.3 10.7 24 24 24h102.1l89 89c15 15 41 4.5 41-17V88c0-21.5-26-32-41-17zM461.6 256l45.6-45.6c6.3-6.3 6.3-16.5 0-22.8l-22.8-22.8c-6.3-6.3-16.5-6.3-22.8 0L416 210.4l-45.6-45.6c-6.3-6.3-16.5-6.3-22.8 0l-22.8 22.8c-6.3 6.3-6.3 16.5 0 22.8L370.4 256l-45.6 45.6c-6.3 6.3-6.3 16.5 0 22.8l22.8 22.8c6.3 6.3 16.5 6.3 22.8 0L416 301.6l45.6 45.6c6.3 6.3 16.5 6.3 22.8 0l22.8-22.8c6.3-6.3 6.3-16.5 0-22.8L461.6 256z"/>
        </svg>`;
      }
    } else {
      if (btn) {
        btn.innerHTML = `<svg style="width: 18px;height: 18px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
          <path fill="#fff" d="M215 71.1L126.1 160H24c-13.3 0-24 10.7-24 24v144c0 13.3 10.7 24 24 24h102.1l89 89c15 15 41 4.5 41-17V88c0-21.5-26-32-41-17zm233.3-51.1c-11.2-7.3-26.2-4.2-33.5 7-7.3 11.2-4.2 26.2 7 33.5 66.3 43.5 105.8 116.6 105.8 195.6 0 79-39.6 152.1-105.8 195.6-11.2 7.3-14.3 22.3-7 33.5 7 10.7 21.9 14.6 33.5 7C528.3 439.6 576 351.3 576 256S528.3 72.4 448.4 20z"/>
        </svg>`;
      }
    }
  }

  // Utility Methods
    
  // private setQuality(quality: string) {
  //   // videoQuality = parseInt(quality);
  //   if (this.stream) {
  //     this.stream.stop();
  //     this.start();
  //   }
  // }

  public destroy() {
    if (this.stream) {
      this.stream.stop();
    }
    this.container.innerHTML = '';
    // Remove all event listeners
    this.container.removeEventListener("mousemove", this.handleMouseMove);
  }

  // private async getStreamsName(){ 
  //   try { 

  //     const urlParams = new URLSearchParams(window.location.search);
  //     const eventid = urlParams.get('eventid');

  //     let __BODY =
  //     {
  //       "stEventID": eventid,
  //       "authToken": "G3boKxR920DFyRGfKybatZwgHY8Y"
  //     }
  //     var key = CryptoJS.enc.Utf8.parse("cD2bM1bfZd35cQiO");
  //     var iv = CryptoJS.enc.Utf8.parse("cD2bM1bfZd35cQiO");
     
  //     var encrypt = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify(__BODY)), key,
  //     {
  //       keySize: 128 / 8,
  //       iv: iv,
  //       mode: CryptoJS.mode.CBC,
  //       padding: CryptoJS.pad.Pkcs7
  //     });
     
  //     const myHeaders = new Headers();
  //     myHeaders.append("Content-Type","application/json");
  //     const raw = JSON.stringify({  "data":encrypt.toString()});
  //     const requestOptions = {  method: "POST",  headers: myHeaders,  body: raw,  redirect: "follow" as RequestRedirect};

  //     const data = await fetch("https://dapi.fstlive.video/api/ChannelMaster/getChannelMasters",requestOptions)
      
  //     const cipherText = (await data.text()).replace('"','').replace('"',''); 
  //     var key = CryptoJS.enc.Utf8.parse("cD2bM1bfZd35cQiO");
  //     var iv = CryptoJS.enc.Utf8.parse("cD2bM1bfZd35cQiO");
  
  //     var decrypt = CryptoJS.AES.decrypt(cipherText, key,
  //     {
  //       keySize: 128 / 8,
  //       iv: iv,
  //       mode: CryptoJS.mode.CBC,
  //       padding: CryptoJS.pad.Pkcs7
  //     });
  //     const data1 = decrypt.toString(CryptoJS.enc.Utf8);
  //     const channelMasterList = JSON.parse(data1).channelMasterList;
  //     const streamName = channelMasterList[0].stStreamName;
  //     return streamName;
  //   } catch (error) {
  //     this.showError();
  //     this.hideLoader();
  //   }
  // }
  
}


export default XStreamVideoPlayer;
