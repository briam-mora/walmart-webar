import React from 'react';

const Station0 = ({ position }) => {
  return (
    <a-entity id="station-0" position={position}>
      <a-plane
        src="#celular-instrucciones"
        position="0 -0.2 0"
        transparent="true"
        scale="0.5 0.1 0.1"
        material="shader: flat"
      />
      <a-plane
        src="#celular-flechas"
        position="0 0 0"
        transparent="true"
        scale="0.3 0.05 0.1"
        material="shader: flat"
      />
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
        />
      </a-entity>
    </a-entity>
  );
};

export default Station0;
