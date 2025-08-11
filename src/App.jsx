import 'aframe';
import React, { useState, useEffect } from 'react';
import ImageGallery from './components/ImageGallery.jsx';
import VideoGallery from './components/VideoGallery.jsx';
import Station0 from './components/Station0.jsx';
import Station1 from './components/Station1.jsx';
import Station2 from './components/Station2.jsx';
import Station3 from './components/Station3.jsx';
import './aframe/ScaleAnimator.jsx';
import './aframe/HoverAnimator.jsx';
import './aframe/GLTFMaterialFix.jsx';
import './aframe/CameraBackground.jsx';
import content from './content.json';
import { DEFAULT_DISTANCE_FROM_USER } from './constants.js';

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
    } else {
      next = (currentStation + 1) % 7;
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
      7: false,
    });
    
    // Show only the next station
    setStationsVisible(prev => ({
      ...prev,
      [next]: true
    }));
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

  const openCharacteristics = () => {
    var audio = new Audio('activacion_video.wav');
    audio.play();
    setShowCharacteristics(true)
  }

  const openPanelists = () => {
    var audio = new Audio('activacion_video.wav');
    audio.play();
    setShowPanelists(true)
  }

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
    <>
            {/* Station Control UI */}
      {started && <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        background: 'rgba(0,0,0,0.9)',
        padding: '20px',
        borderRadius: '15px',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        minWidth: '280px',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
          <button 
            onClick={nextStation}
            style={{
              background: currentStation === 0 ? '#FFD200' : '#333',
              color: currentStation === 0 ? '#000' : '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              minWidth: '120px',
              transition: 'all 0.2s ease'
            }}
          >
            Next Station
          </button>
        </div>
        <div style={{ fontSize: '14px', opacity: 0.9 }}>
          <div>Current Station: {currentStation === -1 ? 'None' : currentStation + 1}</div>
        </div>
      </div>
    }
      <a-scene loading-screen="dotsColor: #FFD200; backgroundColor: #EC1C24" 
               renderer="alpha: true; antialias: true; colorManagement: true; precision: mediump"
               onerror="console.error('A-Frame error:', event.detail)"
               embedded="true"
               webgl="antialias: true; alpha: true; depth: true; stencil: true; preserveDrawingBuffer: false; logarithmicDepthBuffer: false">
        <a-camera look-controls="reverseMouseDrag: true; mouseEnabled: true; touchEnabled: true" wasd-controls-enabled="false" position="0 0 0"></a-camera>
        <a-entity id="raycaster" raycaster="objects: .clickable" cursor="rayOrigin: mouse"></a-entity>

        {/* Load assets */}
        <a-assets>
          <img id="panorama" src="panorama.webp" crossOrigin="anonymous" />
          {content.videos.map(video => <video key={video.id} id={video.id} src={video.src} muted={video.muted} autoPlay={video.autoPlay} loop={false} preload="metadata"></video>)}
          {content.images.map(image => <img key={image.id} id={image.id} src={image.src} crossOrigin="anonymous" preload="auto" />)}
          {content.panelists.map(panelist => <img key={panelist.id} id={panelist.id} src={panelist.src} crossOrigin="anonymous" preload="auto" />)}
          <img id="light-arrow" src="icono.png" crossOrigin="anonymous" preload="auto" />
          <img id="play-button" src="play.png" crossOrigin="anonymous" preload="auto" />
          <img id="pantalla-carga" src="shell_AR.png" crossOrigin="anonymous" preload="auto" />
          <img id="celular" src="celular.png" crossOrigin="anonymous" preload="auto" />
          <img id="celular-flechas" src="celular-flechas.png" crossOrigin="anonymous" preload="auto" />
          <img id="celular-instrucciones" src="celular-instrucciones.png" crossOrigin="anonymous" preload="auto" />
          <img id="video-titulo" src="shell_AR_logo.png" crossOrigin="anonymous" preload="auto" />
          <img id="panelistas-video-titulo" src="titulo_panelistas_galeria.png" crossOrigin="anonymous" preload="auto" />
          <img id="panelists-button" src="titulo_panelistas.png" crossOrigin="anonymous" preload="auto" />
          <img id="characteristics-background" src="shell_bg.png" crossOrigin="anonymous" preload="auto" />
          <img id="characteristics-title" src="back-equipo.png" crossOrigin="anonymous" preload="auto" />
          <img id="panelists-text" src="nuevo-small_back_panelista.png" crossOrigin="anonymous" preload="auto" />
          <img id="characteristics-button" src="art_shell-18.png" crossOrigin="anonymous" preload="auto" />
          <img id="characteristics-arrow" src="art_shell-23.png" crossOrigin="anonymous" preload="auto" />
          <img id="characteristics-1" src="art_shell-19.png" crossOrigin="anonymous" preload="auto" />
          <img id="characteristics-2" src="shell_AR-41.png" crossOrigin="anonymous" preload="auto" />
          <img id="characteristics-3" src="shell_AR-40.png" crossOrigin="anonymous" preload="auto" />
          <img id="characteristics-4" src="art_shell-22.png" crossOrigin="anonymous" preload="auto" />
          <img id="ambient1" src="palabras_flotantes-COLOR-32.png" crossOrigin="anonymous" preload="auto" />
          <img id="ambient2" src="palabras_flotantes-COLOR-33.png" crossOrigin="anonymous" preload="auto" />
          <img id="ambient3" src="palabras_flotantes-COLOR-34.png" crossOrigin="anonymous" preload="auto" />
          <img id="agil" src="palabras_flotantes-COLOR-35.png" crossOrigin="anonymous" preload="auto" />
          <img id="simple" src="palabras_flotantes-COLOR-36.png" preload="auto" />
          <img id="impacto" src="palabras_flotantes-COLOR-37.png" crossOrigin="anonymous" preload="auto" />
          <img id="evolucion" src="palabras_flotantes-COLOR-38.png" crossOrigin="anonymous" preload="auto" />
          <img id="evolucionshell" src="palabras_flotantes-COLOR-39.png" crossOrigin="anonymous" preload="auto" />
          <img id="next" src="next.png" crossOrigin="anonymous" preload="auto" />
          <img id="prev" src="prev.png" crossOrigin="anonymous" preload="auto" />
          <img id="close" src="close.png" crossOrigin="anonymous" preload="auto" />
          <img id="date" src="date.png" crossOrigin="anonymous" preload="auto" />
          <video id="video" src="video.mp4" autoPlay={false} loop={false} preload="metadata" style={{background: 'transparent'}}></video>
          <audio src="bienvenida.wav" preload="auto"></audio>
        </a-assets>

        {/* Sky with panorama - fallback when camera is not available */}
        <a-sky src="#panorama" material="shader: flat"></a-sky>

        <a-plane
          class="clickable"
          src="#pantalla-carga"
          position={`0 0 -${DEFAULT_DISTANCE_FROM_USER - 0.1}`}
          transparent="true"
          scale="0.9 1.6 1"
          material="shader: flat"
          onClick={(e) => {
            setStarted(true);
            var audio = new Audio('shell_musica.wav');
            audio.loop = true; // Enable looping
            audio.play();
            audio.volume = 0.2;
            var voice = new Audio('LOC2.wav');
            voice.play();
            var button = new Audio('boton.wav');
            button.play();
            e.target.setAttribute("scale", "0 0 0")
            nextStation();
          }}
        ></a-plane>

        {started && stationsVisible[0] && <Station0 position={`0 -0.45 -${DEFAULT_DISTANCE_FROM_USER - 0.1}`} />}

        {stationsVisible[1] && <Station1 position={`0 0 -${DEFAULT_DISTANCE_FROM_USER}`} />}

        {started && stationsVisible[2] && <Station2 position={`0 -0.5 -${DEFAULT_DISTANCE_FROM_USER}`} />}



        {!showCharacteristics && stationsVisible[3] && <Station3 showCharacteristics={showCharacteristics} openCharacteristics={openCharacteristics} position={`0 -0.25 -${DEFAULT_DISTANCE_FROM_USER}`} />}

        {showCharacteristics && <ImageGallery
          id='gallery-1'
          images={content.images.map(image => `#${image.id}`)}
          audios={content.audios.map(audio => `${audio.src}`)}
          position={`0 0 -${DEFAULT_DISTANCE_FROM_USER}`}
          rotation="0 0 0"
          closeFunction={() => setShowCharacteristics(false)}
        />}
      </a-scene>
    </>
  );
}
