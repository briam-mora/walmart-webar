import 'aframe';
import React, { useState, useEffect } from 'react';
import ImageGallery from './components/ImageGallery.jsx';
import VideoGallery from './components/VideoGallery.jsx';
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
      <a-scene loading-screen="dotsColor: #FFD200; backgroundColor: #EC1C24" 
               renderer="alpha: true; antialias: true; colorManagement: true; precision: mediump"
               onerror="console.error('A-Frame error:', event.detail)"
               embedded="true"
               webgl="antialias: true; alpha: true; depth: true; stencil: true; preserveDrawingBuffer: false; logarithmicDepthBuffer: false">
        <a-camera look-controls="reverseMouseDrag: true" wasd-controls-enabled="false" position="0 0 0"></a-camera>
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
          <video id="video" src="SHELL V Power.mp4" autoPlay={false} loop={false} preload="metadata"></video>
          <audio src="bienvenida.wav" preload="auto"></audio>
        </a-assets>

        {/* Sky with panorama - fallback when camera is not available */}
        <a-sky src="#panorama" material="shader: flat"></a-sky>


        {/* {started && <a-plane
          class="clickable"
          src="#date"
          position={`0.04 -0.2 -${DEFAULT_DISTANCE_FROM_USER}`}
          rotation="0 0 0"
          scale="1.4 0.2 1.4"
          transparent="true"
          material="shader: flat"
          onClick={() => { window.open('https://maps.app.goo.gl/iwQ4uWfBv2cank8i9?g_st=com.google.maps.preview.copy', '_blank'); }}
        ></a-plane>} */}

        {started && (
          <a-entity position={`0 -0.45 -${DEFAULT_DISTANCE_FROM_USER - 0.1}`}>
            <a-plane
              src="#celular-instrucciones"
              position="0 -0.2 0"
              transparent="true"
              scale="0.5 0.1 0.1"
              material="shader: flat"
            >
            </a-plane>
            <a-plane
              src="#celular-flechas"
              position="0 0 0"
              transparent="true"
              scale="0.3 0.05 0.1"
              material="shader: flat"
            >
            </a-plane>
            <a-entity
              position="0 0 0.08"
              animation="property: rotation; from: 0 -45 0; to: 0 45 0; dur: 2000; easing: easeInOutQuad; loop: true; dir: alternate;"
            >
              <a-plane
                src="#celular"
                position="0 0 -0.05"
                transparent="true"
                scale="0.1 0.2 0.1"
                material="shader: flat"
              >
              </a-plane>
            </a-entity>
          </a-entity>
        )}

        {started && <a-entity
          id="logo-model"
          hover-animator="duration: 2000; easing: easeInOutQuad;"
          position={`0 0.15 -${DEFAULT_DISTANCE_FROM_USER}`}
          scale="1 1 1"
        >
          <a-entity
            gltf-model="02-vpower.glb"
            position="0 0 0"
            rotation="90 0 0"
            scale="0.4 0.4 0.4"
          ></a-entity>
          <a-entity
            gltf-model="01-logo.glb"
            position="0 0.5 0"
            rotation="90 0 0"
            scale="0.1 0.1 0.1"
          ></a-entity>
        </a-entity>}

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
          }}
        ></a-plane>


        <a-entity
          id="logo-model"
          hover-animator="duration: 2000; easing: easeInOutQuad;"
          position={`-${DEFAULT_DISTANCE_FROM_USER + 0.1} 0.75 0`}
          scale="1 1 1"
        >
          <a-entity
            gltf-model="FerrariMaya.glb"
            position="0 -1.1 0"
            scale="0.25 0.25 0.25"
            gltf-material-fix="color: #FFF;"
            animation="property: rotation; to: 0 -360 0; dur: 15000; easing: linear; loop: true; autoplay: true"
          ></a-entity>
        </a-entity>

        {/* {!showPanelist && <a-entity
          position={`-${DEFAULT_DISTANCE_FROM_USER + 0.1} 0.75 0`}
          rotation="0 90 0"
          scale="1 0.75 1"
          scale-animator="duration: 500; easing: easeInOutCubic"
        >
          <a-plane
            class="clickable"
            src="#panelists-button"
            position="0 -0.125 0"
            scale="1 0.6 1"
            transparent="true"
            material="shader: flat"
            onClick={openPanelists}
          ></a-plane>
          {content.panelists.map((panelist, index) => (
            <a-plane
              key={panelist.id}
              src={`#${panelist.id}`}
              class="clickable"
              position={`${-0.322 + (index % 3) * 0.3} -${0.8 + (Math.floor(index / 3) * 0.6)} ${0 + index * 0.01}`}
              scale="0.35 0.5 1"
              transparent="true"
              material="shader: flat"
              onClick={openPanelists}
              hover-animator={`direction: ${index === 0 || index === 3 ? 'left': (index === 2 || index === 5 ? 'right' : (index === 1 ? 'up' : 'down'))}; duration: 2000; easing: easeInOutQuad;`}
            ></a-plane>
          ))}
          <a-plane
            src="#panelists-text"
            class="clickable"
            position="0 -1.9 0"
            scale="1 0.2 1"
            transparent="true"
            material="shader: flat"
            onClick={openPanelists}
          ></a-plane>
        </a-entity>}

        {showPanelist && <VideoGallery
          videos={content.videos}
          titleSrc="#panelistas-video-titulo"
          position={`-${DEFAULT_DISTANCE_FROM_USER} 0 0`}
          rotation="0 90 0"
          scale="1 1 1"
          closeFunction={() => setShowPanelists(false)} />} */}

        {/* Video Principal */}

        <VideoGallery
          videos={[{ src: "#video", autoplay: false }]}
          titleSrc="#video-titulo"
          titleSrcScale = "0.5 0.3 0.5"
          position={`${DEFAULT_DISTANCE_FROM_USER} 0 0`}
          rotation="0 -90 0"
          scale="1 1 1" />

        {!showCharacteristics && <a-entity
          class="clickable"

          position={`0 -0.25 ${DEFAULT_DISTANCE_FROM_USER + 0.1}`}
          rotation="0 180 0"
          scale="1 0.7 1"
          onClick={openCharacteristics}
          scale-animator="duration: 500; easing: easeInOutCubic"
        >
          <a-plane
          class="clickable"
          src="#characteristics-button"
          position="0 0.1 0"
          scale="1 0.7 1"
          transparent="true"
          material="shader: flat"
          onClick={openCharacteristics}
        ></a-plane>
          <a-plane
            src="#characteristics-title"
            class="clickable"
            position="-0.01 1.2 0"
            scale="1.1 0.28 0.3"
            transparent="true"
            material="shader: flat"
            onClick={openCharacteristics}
          ></a-plane>
          <a-plane
            src="#characteristics-1"
            class="clickable"
            position="-0.4 0.75 0"
            scale="0.2 0.5 1"
            transparent="true"
            material="shader: flat"
            onClick={openCharacteristics}
          ></a-plane>
          {/* <a-plane
            src="#characteristics-arrow"
            class="clickable"
            hover-animator="duration: 2000; easing: easeInOutQuad;"
            position="-0.4 1.10 0.01"
            scale="0.2 0.22 1"
            transparent="true"
            material="shader: flat"
            onClick={openCharacteristics}
          ></a-plane> */}
          {/*<a-plane
            src="#characteristics-background"
            class="clickable"
            position="0 1 -1"
            scale="2 3 2"
            transparent="true"
            material="shader: flat"
            onClick={openCharacteristics}
          ></a-plane>*/}
          <a-plane
            src="#characteristics-2"
            class="clickable"
            position="-0.1325 0.75 0"
            scale="0.2 0.5 1"
            transparent="true"
            material="shader: flat"
            onClick={openCharacteristics}
          ></a-plane>
          {/* <a-plane
            src="#characteristics-arrow"
            class="clickable"
            hover-animator="duration: 2000; easing: easeInOutQuad;"
            position="-0.1325 1.10 0.01"
            scale="0.2 0.22 1"
            transparent="true"
            material="shader: flat"
            onClick={openCharacteristics}
          ></a-plane> */}
          <a-plane
            src="#characteristics-3"
            class="clickable"
            position="0.1325 0.75 0"
            scale="0.2 0.5 1"
            transparent="true"
            material="shader: flat"
            onClick={openCharacteristics}
          ></a-plane>
          {/* <a-plane
            src="#characteristics-arrow"
            class="clickable"
            hover-animator="duration: 2000; easing: easeInOutQuad;"
            position="0.1325 1.10 0.01"
            scale="0.2 0.22 1"
            transparent="true"
            material="shader: flat"
            onClick={openCharacteristics}
          ></a-plane> */}
          <a-plane
            src="#characteristics-4"
            class="clickable"
            position="0.4 0.75 0"
            scale="0.2 0.5 1"
            transparent="true"
            material="shader: flat"
            onClick={openCharacteristics}
          ></a-plane>
          {/* <a-plane
            src="#characteristics-arrow"
            class="clickable"
            hover-animator="duration: 2000; easing: easeInOutQuad;"
            position="0.4 1.10 0.01"
            scale="0.2 0.22 1"
            transparent="true"
            material="shader: flat"
            onClick={openCharacteristics}
          ></a-plane> */}
        </a-entity>}

        {showCharacteristics && <ImageGallery
          id='gallery-1'
          images={content.images.map(image => `#${image.id}`)}
          audios={content.audios.map(audio => `${audio.src}`)}
          position={`0 0 ${DEFAULT_DISTANCE_FROM_USER}`}
          rotation="0 180 0"
          closeFunction={() => setShowCharacteristics(false)}
        />}

        {/* Ambient Elements */}
        {/* <a-plane
          src="#ambient1"
          transparent="true"
          position="0.5 1 2"
          rotation="0 180 0"
          scale="0.25 0.25 0.25"
          material="shader: flat"
          animation="property: position; to: -2 1 1; dur: 15000; easing: easeInOutQuad; loop: true; dir: alternate;"
        ></a-plane>
        <a-plane
          src="#ambient2"
          transparent="true"
          position="-2 1 -1"
          rotation="0 90 0"
          scale="0.25 0.25 0.25"
          material="shader: flat"
          animation="property: position; to: -1 1 -1; dur: 15000; easing: easeInOutQuad; loop: true; dir: alternate;"
        ></a-plane>
        <a-plane
          src="#ambient1"
          transparent="true"
          position="1 1 -2"
          rotation="0 0 0"
          scale="0.25 0.25 0.25"
          material="shader: flat"
          animation="property: position; to: 3 1 -1; dur: 15000; easing: easeInOutQuad; loop: true; dir: alternate;"
        ></a-plane>
        <a-plane
          src="#ambient2"
          transparent="true"
          position="-3 2 -2"
          rotation="0 0 0"
          scale="0.25 0.25 0.25"
          material="shader: flat"
          animation="property: position; to: 0 1 -2; dur: 15000; easing: easeInOutQuad; loop: true; dir: alternate;"
        ></a-plane>
        <a-plane
          src="#ambient3"
          transparent="true"
          position="-2 0.5 -3"
          rotation="0 0 0"
          scale="0.25 0.247 0.25"
          material="shader: flat"
          animation="property: position; to: -0.5 -1 -1; dur: 15000; easing: easeInOutQuad; loop: true; dir: alternate;"
        ></a-plane>
        <a-plane
          src="#evolucion"
          transparent="true"
          position="2 -1 -1"
          rotation="0 -45 0"
          scale="0.7 0.15 0.7"
          material="shader: flat"
          animation="property: position; to: 1.2 0 -2; dur: 15000; easing: easeInOutQuad; loop: true; dir: alternate;"
        ></a-plane>
         <a-plane
          src="#evolucionshell"
          transparent="true"
          position="2 -1 -1"
          rotation="0 -45 0"
          scale="0.7 0.15 0.7"
          material="shader: flat"
          animation="property: position; to: -1.2 -1 -2; dur: 15000; easing: easeInOutQuad; loop: true; dir: alternate;"
        ></a-plane>
        <a-plane
          src="#ambient3"
          transparent="true"
          position="2 1 1"
          rotation="0 -135 0"
          scale="0.25 0.247 0.25"
          material="shader: flat"
          animation="property: position; to: 1 0.5 1; dur: 15000; easing: easeInOutQuad; loop: true; dir: alternate;"
        ></a-plane>
        <a-plane
          src="#agil"
          transparent="true"
          position="1 0 1"
          rotation="0 -90 0"
          scale="0.7 0.25 0.7"
          material="shader: flat"
          animation="property: position; to: 3 -1 1; dur: 15000; easing: easeInOutQuad; loop: true; dir: alternate;"
        ></a-plane>
        <a-plane
          src="#simple"
          transparent="true"
          position="2 -1.2 -0.5"
          rotation="0 -90 0"
          scale="0.7 0.7 0.7"
          material="shader: flat"
          animation="property: position; to: 2 -1.2 1; dur: 15000; easing: easeInOutQuad; loop: true; dir: alternate;"
        ></a-plane>
        <a-plane
          src="#ambient3"
          transparent="true"
          position="-2 -1 1"
          rotation="0 -225 0"
          scale="0.25 0.247 0.25"
          material="shader: flat"
          animation="property: position; to: -1 0 1; dur: 15000; easing: easeInOutQuad; loop: true; dir: alternate;"
        ></a-plane>
        <a-plane
          src="#ambient2"
          transparent="true"
          position="-1 1 2"
          rotation="0 -225 0"
          scale="0.2 0.2 0.2"
          material="shader: flat"
          animation="property: position; to: -1 -1 1; dur: 15000; easing: easeInOutQuad; loop: true; dir: alternate;"
        ></a-plane>
        <a-plane
          src="#impacto"
          transparent="true"
          position="2 -1.5 2"
          rotation="0 180 0"
          scale="0.588 0.2 0.588"
          material="shader: flat"
          animation="property: position; to: 0 -1 2; dur: 15000; easing: easeInOutQuad; loop: true; dir: alternate;"
        ></a-plane>
        <a-plane
          src="#ambient1"
          transparent="true"
          position="-3 -3 -2"
          rotation="0 90 0"
          scale="0.4 0.4 0.4"
          material="shader: flat"
          animation="property: position; to: -3 -1 -2; dur: 15000; easing: easeInOutQuad; loop: true; dir: alternate;"
        ></a-plane> */}
      </a-scene>
    </>
  );
}
