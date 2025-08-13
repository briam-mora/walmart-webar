import React from 'react';
import VideoGallery from './VideoGallery.jsx';

const Station1 = ({ position }) => {
  return (
    <a-entity id="station-1" position={position} scale="1 1 1">
      <VideoGallery
        videos={[{ src: "#video", autoplay: false }]}
        position="0 0 0"
        rotation="0 0 0"
        scale="1 1 1"
        width="7.94"
        height="14.8"
      />
      <a-entity
          gltf-model="marco.glb"
          position="0.005 -0.85 0.05"
          rotation="0 0 0"
          scale="0.264 0.264 0.264"
        />
    </a-entity>
  );
};

export default Station1;
