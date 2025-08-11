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
        height="10.8"
      />
    </a-entity>
  );
};

export default Station1;
