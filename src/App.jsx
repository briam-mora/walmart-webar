import 'aframe';
import React, { useState, useEffect } from 'react';
import Station0 from './components/Station0.jsx';
import Station1 from './components/Station1.jsx';
import Station2 from './components/Station2.jsx';
import Station3 from './components/Station3.jsx';
import Station4 from './components/Station4.jsx';
import Station5 from './components/Station5.jsx';
import Station6 from './components/Station6.jsx';
import Station7 from './components/Station7.jsx';
import './aframe/ScaleAnimator.jsx';
import './aframe/HoverAnimator.jsx';
import './aframe/GLTFMaterialFix.jsx';
import './aframe/CameraBackground.jsx';
import content from './content.json';
import { DEFAULT_DISTANCE_FROM_USER } from './constants.js';
import { AudioProvider } from './contexts/AudioContext.jsx';

export function App() {
  const [showPanelist, setShowPanelists] = useState(false);
  const [started, setStarted] = useState(false);
  const [showCharacteristics, setShowCharacteristics] = useState(false);
  
  // Station visibility state
  const [currentStation, setCurrentStation] = useState(-1); // -1 for none, 0, 1, 2, 3
  const [stationsVisible, setStationsVisible] = useState({
    0: false,  // center - hidden
    1: false,  // left - hidden
    2: false,  // right - hidden
    3: false   // front - hidden
  });

  // Station management functions
  const nextStation = () => {
    let next;
    if (currentStation === -1) {
      next = 0; // Start with first station if all are hidden
    } else if (currentStation < 6) {
      next = currentStation + 1; // Go to next station if not at last
    } else {
      next = currentStation; // Stay at last station
    }
    setCurrentStation(next);
    
    // Hide all stations first
    setStationsVisible({
      0: false,
      1: false, 
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
    });
    
    // Show only the next station
    setStationsVisible(prev => ({
      ...prev,
      [next]: true
    }));
  };

  const prevStation = () => {
    let prev;
    if (currentStation === -1) {
      prev = 0;
    } else if (currentStation > 0) {
      prev = currentStation - 1; // Go to previous station if not at first
    } else {
      prev = currentStation; // Stay at first station
    }
    setCurrentStation(prev);
    
    // Hide all stations first
    setStationsVisible({
      0: false,
      1: false, 
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
    });
    
    // Show only the previous station
    setStationsVisible(prevState => ({
      ...prevState,
      [prev]: true
    }));
  };

  // Get current station name
  const getCurrentStationName = () => {
    if (currentStation === -1) return '';
    const station = content.stations.find(s => s.id === currentStation);
    return station ? station.name : '';
  };





  // Suppress WebGL warnings
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      const message = args[0];
      if (typeof message === 'string' && (
        message.includes('GL_INVALID_VALUE') ||
        message.includes('GL_INVALID_OPERATION') ||
        message.includes('Texture dimensions must all be greater than zero') ||
        message.includes('Texture format does not support mipmap generation')
      )) {
        return; // Suppress these specific WebGL warnings
      }
      originalError.apply(console, args);
    };

    // Development-specific A-Frame configuration
    if (import.meta.env.DEV) {
      // Force WebGL context creation
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        gl.getExtension('WEBGL_debug_renderer_info');
        console.log('WebGL context initialized successfully');
      }
    }

    return () => {
      console.error = originalError;
    };
  }, []);

  useEffect(() => {
    const videoElement = document.querySelector('#video');
    if (videoElement) {
      videoElement.pause(); // Pause the video
      videoElement.currentTime = 0; // Reset the video to the beginning
    }
  
    return () => {
    };
  }, []);
  

  return (
    <AudioProvider>
      <>
        {/* Station Control UI */}
        {started && <div style={{
          position: 'fixed',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '300px',
          maxWidth: '90vw'
        }}>
          {/* Navigation Bar */}
          <div style={{
            background: '#ADD8E6',
            borderRadius: '25px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            position: 'relative',
            width: '100%',
            justifyContent: 'space-between'
          }}>
            {/* Previous Button */}
            <button 
              onClick={prevStation}
              disabled={currentStation <= 0}
              style={{
                background: currentStation <= 0 ? '#cccccc' : '#4169E1',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: currentStation <= 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                transition: 'all 0.2s ease',
                minWidth: '40px',
                minHeight: '40px',
                opacity: currentStation <= 0 ? 0.6 : 1
              }}
            >
              ‹
            </button>

            {/* Station Name */}
            <div style={{
              color: '#000080',
              fontSize: '18px',
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif',
              minWidth: '120px',
              textAlign: 'center'
            }}>
              {getCurrentStationName()}
            </div>

            {/* Next Button */}
            <button 
              onClick={nextStation}
              disabled={currentStation >= 6}
              style={{
                background: currentStation >= 6 ? '#cccccc' : '#4169E1',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: currentStation >= 6 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                transition: 'all 0.2s ease',
                minWidth: '40px',
                minHeight: '40px',
                opacity: currentStation >= 6 ? 0.6 : 1
              }}
            >
              ›
            </button>
          </div>
        </div>}
        <a-scene loading-screen="dotsColor: #ffc21f; backgroundColor: #0071ce" 
                 device-orientation-permission-ui="allowButtonText: Permitir; denyButtonText: Denegar; deviceMotionMessage: Esta Web Inmersiva requiere acceso a los sensores de movimiento de tu dispositivo"
                 renderer="alpha: true; antialias: false; premultipliedAlpha: true; logarithmicDepthBuffer: false; colorManagement: true; precision: mediump"
                 onerror="console.error('A-Frame error:', event.detail)"
                 embedded="true"
                 webgl="antialias: false; alpha: true; depth: true; stencil: true; preserveDrawingBuffer: false; logarithmicDepthBuffer: false">
          <a-camera camera-background look-controls="reverseMouseDrag: true; mouseEnabled: true; touchEnabled: true" wasd-controls-enabled="false" position="0 0 0"></a-camera>
          <a-entity id="raycaster" raycaster="objects: .clickable" cursor="rayOrigin: mouse"></a-entity>

          {/* Load assets */}
          <a-assets timeout="30000">
            <img id="panorama" src="panorama.webp" crossOrigin="anonymous" />
            {content.images.map(image => <img key={image.id} id={image.id} src={image.src} crossOrigin="anonymous" preload="auto" />)}
            {content.memory.map(card => <img key={card.id} id={card.id} src={card.src} crossOrigin="anonymous" preload="auto" />)}
            {content.memory_win.map(card => <img key={card.id} id={card.id} src={card.src} crossOrigin="anonymous" preload="auto" />)}
            {content.globos.map(globo => <img key={globo.id} id={globo.id} src={globo.src} crossOrigin="anonymous" preload="auto" />)}
            {content.plataforma.map(plataforma => <img key={plataforma.id} id={plataforma.id} src={plataforma.src} crossOrigin="anonymous" preload="auto" />)}
            <img id="light-arrow" src="icono.png" crossOrigin="anonymous" preload="auto" />
            <img id="play-button" src="play.png" crossOrigin="anonymous" preload="auto" />
            <img id="pantalla-carga" src="walmart_start.png" crossOrigin="anonymous" preload="auto" />
            <img id="celular" src="celular.png" crossOrigin="anonymous" preload="auto" />
            <img id="celular-flechas" src="celular-flechas.png" crossOrigin="anonymous" preload="auto" />
            <img id="celular-instrucciones" src="celular-instrucciones.png" crossOrigin="anonymous" preload="auto" />
            <img id="next" src="next.png" crossOrigin="anonymous" preload="auto" />
            <img id="prev" src="prev.png" crossOrigin="anonymous" preload="auto" />
            <img id="close" src="close.png" crossOrigin="anonymous" preload="auto" />
            <img id="cardback" src="cardback.png" crossOrigin="anonymous" preload="auto" />
            <video id="video" src="video.mp4" autoPlay={false} loop={false} preload="metadata"></video>
            <audio id="click" src="click.wav" preload="auto"></audio>
            {content.audios.station_2.map(audio => <audio key={audio.id} id={audio.id} src={audio.src} preload="none"></audio>)}
            {content.audios.station_3.map(audio => <audio key={audio.id} id={audio.id} src={audio.src} preload="none"></audio>)}
            {content.audios.station_4.map(audio => <audio key={audio.id} id={audio.id} src={audio.src} preload="none"></audio>)}
            {content.audios.station_5.map(audio => <audio key={audio.id} id={audio.id} src={audio.src} preload="none"></audio>)}
            {content.audios.station_6.map(audio => <audio key={audio.id} id={audio.id} src={audio.src} preload="none"></audio>)}
            {content.audios.station_7.map(audio => <audio key={audio.id} id={audio.id} src={audio.src} preload="none"></audio>)}
          </a-assets>

          {/* Sky with panorama - fallback when camera is not available */}
          <a-sky src="#panorama" material="shader: flat"></a-sky>

          <a-plane
            class="clickable"
            src="#pantalla-carga"
            position={`0 0 -${DEFAULT_DISTANCE_FROM_USER}`}
            transparent="true"
            scale="1 2 1"
            material="shader: flat"
            onClick={(e) => {
              setStarted(true);
              e.target.setAttribute("scale", "0 0 0")
              nextStation();
            }}
          ></a-plane>

          {started && stationsVisible[0] && <Station1 position={`0 0 -${DEFAULT_DISTANCE_FROM_USER}`} />}

          {started && stationsVisible[1] && <Station2 position={`0 -0.5 -${DEFAULT_DISTANCE_FROM_USER}`} />}

          {started && stationsVisible[2] && <Station3 position={`0 0.3 -${DEFAULT_DISTANCE_FROM_USER}`} />}
          {started && stationsVisible[3] && <Station4 position={`0 0 -${DEFAULT_DISTANCE_FROM_USER + 1}`} />}
          {started && stationsVisible[4] && <Station5 position={`0 0.3 -${DEFAULT_DISTANCE_FROM_USER}`} />}
          {started && stationsVisible[5] && <Station6 position={`0 0 -${DEFAULT_DISTANCE_FROM_USER}`} />}
          {started && stationsVisible[6] && <Station7 position={`0 0 -${DEFAULT_DISTANCE_FROM_USER}`} />}
        </a-scene>
      </>
    </AudioProvider>
  );
}
