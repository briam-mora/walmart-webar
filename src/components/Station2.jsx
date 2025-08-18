import React, { useEffect, useState } from 'react';
import { useAudio } from '../contexts/AudioContext.jsx';

const Station2 = ({ position }) => {

  const [currentCard, setCurrentCard] = useState('inicio_card');
  const [showCard, setShowCard] = useState(true);
  const { playAudio } = useAudio();

  // Play intro audio when station opens
  useEffect(() => {
    playAudio('intro_station_2');
  }, [playAudio]);

  // Function to play balloon audio and show card
  const playBalloonAudio = (balloonId) => {
    playAudio(balloonId);
    
    // Map balloon IDs to card IDs
    let cardId;
    switch (balloonId) {
      case 'globo_1':
        cardId = 'globo_1_card';
        break;
      case 'globo_2':
        cardId = 'globo_2_card';
        break;
      case 'globo_3':
        cardId = 'globo_3_card';
        break;
      case 'globo_4':
        cardId = 'globo_4_card';
        break;
      case 'globo_5':
        cardId = 'globo_5_card'; // Same as balloon 1
        break;
      default:
        cardId = 'inicio_card';
    }
    
    setCurrentCard(cardId);
    setShowCard(true);
  };



  return (
    <a-entity id="station-2" position={position} scale="1 1 1">
      {/* Card Display */}
      {showCard && (
        <a-entity
          id="card-display"
          position="0 0.5 -0.1"
          scale="0.5 0.5 0.5"
        >
          <a-plane
            src={`#${currentCard}`}
            position="0 0 0"
            width="2.2"
            height="1"
            class="clickable"
            material="shader: flat"
            transparent="true"
          />
        </a-entity>
      )}

      <a-entity
        id="models"
        position="0 0 0"
        scale="1 1 1"
      >
        <a-entity
          class="clickable"
          gltf-model="GloboDisfrute.glb"
          position="0.3 1 0"
          rotation="0 0 0"
          scale="0.1 0.1 0.1"
          hover-animator="duration: 2000; easing: easeInOutQuad; delay: 200;"
          onClick={() => playBalloonAudio('globo_1')}
        />
        <a-entity
          class="clickable"
          gltf-model="GloboInclusion.glb"
          position="0.6 1 0"
          rotation="0 0 0"
          scale="0.1 0.1 0.1"
          hover-animator="duration: 2000; easing: easeInOutQuad; delay: 800;"
          onClick={() => playBalloonAudio('globo_2')}
        />
        <a-entity
          class="clickable"
          gltf-model="GloboOportunidad.glb"
          position="0 1 0"
          rotation="0 0 0"
          scale="0.1 0.1 0.1"
          hover-animator="duration: 2000; easing: easeInOutQuad; delay: 1500;"
          onClick={() => playBalloonAudio('globo_3')}
        />
        <a-entity
          class="clickable"
          gltf-model="GloboProposito.glb"
          position="-0.6 1 0"
          rotation="0 0 0"
          scale="0.1 0.1 0.1"
          hover-animator="duration: 2000; easing: easeInOutQuad; delay: 300;"
          onClick={() => playBalloonAudio('globo_4')}
        />
        <a-entity
          class="clickable"
          gltf-model="GloboReto.glb"
          position="-0.3 1 0"
          rotation="0 0 0"
          scale="0.1 0.1 0.1"
          hover-animator="duration: 2000; easing: easeInOutQuad; delay: 1200;"
          onClick={() => playBalloonAudio('globo_5')}
        />
      </a-entity>
    </a-entity>
  );
};

export default Station2;
