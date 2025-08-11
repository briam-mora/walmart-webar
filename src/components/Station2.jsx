import React from 'react';

const Station2 = ({ position }) => {

  return (
    <a-entity id="station-2" position={position} scale="1 1 1">
      <a-entity
        id="models"
        position="0 0 0"
        scale="1 1 1"
      >
        <a-entity
          gltf-model="Caja.glb"
          position="0 0 0"
          rotation="0 0 0"
          scale="0.4 0.4 0.4"
        />
        <a-entity
          gltf-model="GloboDisfrute.glb"
          position="-0.6 1 0"
          rotation="0 0 0"
          scale="0.1 0.1 0.1"
          hover-animator="duration: 2000; easing: easeInOutQuad;"
        />
        <a-entity
          gltf-model="GloboInclusion.glb"
          position="-0.3 1 0"
          rotation="0 0 0"
          scale="0.1 0.1 0.1"
        />
        <a-entity
          gltf-model="GloboOportunidad.glb"
          position="0 1 0"
          rotation="0 0 0"
          scale="0.1 0.1 0.1"
        />
        <a-entity
          gltf-model="GloboProposito.glb"
          position="0.3 1 0"
          rotation="0 0 0"
          scale="0.1 0.1 0.1"
        />
        <a-entity
          gltf-model="GloboReto.glb"
          position="0.6 1 0"
          rotation="0 0 0"
          scale="0.1 0.1 0.1"
        />
      </a-entity>
    </a-entity>
  );
};

export default Station2;
