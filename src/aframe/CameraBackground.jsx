AFRAME.registerComponent('camera-background', {
  schema: {
    facingMode: { type: 'string', default: 'environment' }, // 'user' for front camera, 'environment' for back camera
    width: { type: 'number', default: 1280 },
    height: { type: 'number', default: 720 }
  },

  init: function () {
    this.video = null;
    this.isMobile = this.isMobileDevice();
    this.isSecure = window.location.protocol === 'https:';
    
    // Don't block scene loading - handle camera access after scene is ready
    this.el.sceneEl.addEventListener('loaded', () => {
      if (this.isMobile) {
        if (!this.isSecure) {
          console.log('Camera access requires HTTPS. Using fallback background.');
          this.showHttpsMessage();
          this.fallbackToImage();
        } else {
          // Small delay to ensure scene is fully loaded
          setTimeout(() => {
            this.setupCamera();
          }, 100);
        }
      } else {
        console.log('Camera background only works on mobile devices');
        this.fallbackToImage();
      }
    });
  },

  isMobileDevice: function () {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  setupCamera: function () {
    const constraints = {
      video: {
        facingMode: this.data.facingMode,
        width: { ideal: this.data.width },
        height: { ideal: this.data.height }
      }
    };

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Camera access timeout')), 5000);
    });

    Promise.race([
      navigator.mediaDevices.getUserMedia(constraints),
      timeoutPromise
    ])
      .then(stream => {
        this.video = document.createElement('video');
        this.video.srcObject = stream;
        this.video.setAttribute('playsinline', true);
        this.video.setAttribute('autoplay', true);
        this.video.setAttribute('muted', true);
        this.video.setAttribute('loop', true);
        
        // Wait for video to be ready
        this.video.addEventListener('loadedmetadata', () => {
          this.video.play();
          this.createBackground();
        });

        this.video.addEventListener('error', (error) => {
          console.error('Error accessing camera:', error);
          this.fallbackToImage();
        });
      })
      .catch(error => {
        console.error('Error accessing camera:', error);
        // Fallback to image background if camera access fails
        this.fallbackToImage();
      });
  },

  createBackground: function () {
    // Create a background container if it doesn't exist
    let backgroundContainer = document.getElementById('camera-background-container');
    if (!backgroundContainer) {
      backgroundContainer = document.createElement('div');
      backgroundContainer.id = 'camera-background-container';
      backgroundContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: -1;
        overflow: hidden;
      `;
      document.body.appendChild(backgroundContainer);
    }

    // Style the video element
    this.video.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
    `;

    // Add video to background container
    backgroundContainer.appendChild(this.video);
    
    // Hide the original skybox when camera is active
    const sky = this.el.sceneEl.querySelector('a-sky');
    if (sky) {
      sky.setAttribute('visible', false);
    }
  },

  fallbackToImage: function () {
    console.log('Falling back to image background');
    
    // Remove any existing background container
    const backgroundContainer = document.getElementById('camera-background-container');
    if (backgroundContainer) {
      document.body.removeChild(backgroundContainer);
    }

    // Show the original skybox - this is the proper fallback for A-Frame
    const sky = this.el.sceneEl.querySelector('a-sky');
    if (sky) {
      sky.setAttribute('visible', true);
      // Ensure the sky is properly positioned and scaled
      sky.setAttribute('position', '0 0 0');
      sky.setAttribute('scale', '1 1 1');
    }
  },

  showHttpsMessage: function () {
    // Create a text entity to show HTTPS requirement message
    const message = document.createElement('a-text');
    message.setAttribute('value', 'Camera AR requires HTTPS\nUse ngrok or deploy to test');
    message.setAttribute('position', '0 0.5 -1');
    message.setAttribute('align', 'center');
    message.setAttribute('color', '#FFD200');
    message.setAttribute('width', '4');
    this.el.sceneEl.appendChild(message);
  },

  remove: function () {
    // Cleanup
    if (this.video && this.video.srcObject) {
      const tracks = this.video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    
    // Remove background container
    const backgroundContainer = document.getElementById('camera-background-container');
    if (backgroundContainer) {
      document.body.removeChild(backgroundContainer);
    }
  }
}); 