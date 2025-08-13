import React, { useEffect, useState } from 'react';
import content from '../content.json';
import { useAudio } from '../contexts/AudioContext.jsx';

const Station2 = ({ position }) => {
  const [balloonsAnimated, setBalloonsAnimated] = useState(false);
  const { playAudio } = useAudio();

  // Play intro audio when station opens
  useEffect(() => {
    playAudio('intro_station_2');
  }, [playAudio]);

  // Function to play balloon audio
  const playBalloonAudio = (balloonId) => {
    playAudio(balloonId);
  };

  // Function to animate balloons out of the box
  const animateBalloons = () => {
    setBalloonsAnimated(true);
  };

  return (
    <a-entity id="station-2" position={position} scale="1 1 1">
      <a-entity
        id="models"
        position="0 0 0"
        scale="1 1 1"
      >
        <a-entity
          class="clickable"
          gltf-model="Caja.glb"
          position="0 0 0"
          rotation="0 0 0"
          scale="0.4 0.4 0.4"
          onClick={animateBalloons}
        />
        <a-entity
          class="clickable"
          gltf-model="GloboDisfrute.glb"
          position="0 0 0"
          rotation="0 0 0"
          scale="0.1 0.1 0.1"
          hover-animator="duration: 2000; easing: easeInOutQuad; delay: 200;"
          onClick={() => playBalloonAudio('globo_1')}
          animation={balloonsAnimated ? "property: position; from: 0 0 0; to: -0.6 1 0; dur: 1000; easing: easeOutQuad; loop: false" : ""}
        />
        <a-entity
          class="clickable"
          gltf-model="GloboInclusion.glb"
          position="0 0 0"
          rotation="0 0 0"
          scale="0.1 0.1 0.1"
          hover-animator="duration: 2000; easing: easeInOutQuad; delay: 800;"
          onClick={() => playBalloonAudio('globo_2')}
          animation={balloonsAnimated ? "property: position; from: 0 0 0; to: -0.3 1 0; dur: 1000; easing: easeOutQuad; delay: 200; loop: false" : ""}
        />
        <a-entity
          class="clickable"
          gltf-model="GloboOportunidad.glb"
          position="0 0 0"
          rotation="0 0 0"
          scale="0.1 0.1 0.1"
          hover-animator="duration: 2000; easing: easeInOutQuad; delay: 1500;"
          onClick={() => playBalloonAudio('globo_3')}
          animation={balloonsAnimated ? "property: position; from: 0 0 0; to: 0 1 0; dur: 1000; easing: easeOutQuad; delay: 400; loop: false" : ""}
        />
        <a-entity
          class="clickable"
          gltf-model="GloboProposito.glb"
          position="0 0 0"
          rotation="0 0 0"
          scale="0.1 0.1 0.1"
          hover-animator="duration: 2000; easing: easeInOutQuad; delay: 300;"
          onClick={() => playBalloonAudio('globo_4')}
          animation={balloonsAnimated ? "property: position; from: 0 0 0; to: 0.3 1 0; dur: 1000; easing: easeOutQuad; delay: 600; loop: false" : ""}
        />
        <a-entity
          class="clickable"
          gltf-model="GloboReto.glb"
          position="0 0 0"
          rotation="0 0 0"
          scale="0.1 0.1 0.1"
          hover-animator="duration: 2000; easing: easeInOutQuad; delay: 1200;"
          onClick={() => playBalloonAudio('globo_5')}
          animation={balloonsAnimated ? "property: position; from: 0 0 0; to: 0.6 1 0; dur: 1000; easing: easeOutQuad; delay: 800; loop: false" : ""}
        />
      </a-entity>
    </a-entity>
  );
};

export default Station2;
