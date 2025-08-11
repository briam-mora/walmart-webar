import React from 'react';

const Station3 = ({ showCharacteristics, openCharacteristics, position }) => {
  if (showCharacteristics) return null;

  return (
    <a-entity
      id="station-3"
      class="clickable"
      position={position}
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
      />
      <a-plane
        src="#characteristics-title"
        class="clickable"
        position="-0.01 1.2 0"
        scale="1.1 0.28 0.3"
        transparent="true"
        material="shader: flat"
        onClick={openCharacteristics}
      />
      <a-plane
        src="#characteristics-1"
        class="clickable"
        position="-0.4 0.75 0"
        scale="0.2 0.5 1"
        transparent="true"
        material="shader: flat"
        onClick={openCharacteristics}
      />
      <a-plane
        src="#characteristics-2"
        class="clickable"
        position="-0.1325 0.75 0"
        scale="0.2 0.5 1"
        transparent="true"
        material="shader: flat"
        onClick={openCharacteristics}
      />
      <a-plane
        src="#characteristics-3"
        class="clickable"
        position="0.1325 0.75 0"
        scale="0.2 0.5 1"
        transparent="true"
        material="shader: flat"
        onClick={openCharacteristics}
      />
      <a-plane
        src="#characteristics-4"
        class="clickable"
        position="0.4 0.75 0"
        scale="0.2 0.5 1"
        transparent="true"
        material="shader: flat"
        onClick={openCharacteristics}
      />
    </a-entity>
  );
};

export default Station3;
