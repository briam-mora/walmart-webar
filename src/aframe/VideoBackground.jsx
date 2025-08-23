AFRAME.registerComponent('video-bg', {
  schema: { 
    src: { type: 'selector' },
    facingMode: { type: 'string', default: 'environment' }
  },

  init() {
    this.video = null;
    this.isMobile = this.isMobileDevice();
    this.isSecure = window.location.protocol === 'https:';
    this.cameraRequested = false;
    
    console.log('VideoBackground init:', {
      isMobile: this.isMobile,
      isSecure: this.isSecure,
      protocol: window.location.protocol
    });
    
    // Don't block scene loading - handle camera access after scene is ready
    this.el.sceneEl.addEventListener('loaded', () => {
      console.log('Scene loaded, checking camera access...');
      if (this.isMobile) {
        if (!this.isSecure) {
          console.log('Camera access requires HTTPS. Using fallback background.');
          this.fallbackToImage();
        } else {
          console.log('Mobile + HTTPS detected, setting up camera request...');
          // Add click listener to request camera on user interaction
          this.setupCameraRequest();
        }
      } else {
        console.log('Camera background only works on mobile devices');
        this.fallbackToImage();
      }
    });
  },

  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  setupCameraRequest() {
    console.log('Setting up camera request...');
    // Automatically request camera after a short delay for better UX
    setTimeout(() => {
      console.log('Auto-requesting camera access...');
      this.requestCamera();
    }, 1000); // 1 second delay
  },

  async requestCamera() {
    if (this.cameraRequested) return;
    this.cameraRequested = true;
    
    console.log('Requesting camera access...');
    
    try {
      // Check permissions first
      if (navigator.permissions && navigator.permissions.query) {
        console.log('Permissions API available, checking camera permission...');
        const permissionStatus = await navigator.permissions.query({ name: 'camera' });
        console.log('Camera permission state:', permissionStatus.state);
        
        if (permissionStatus.state === 'denied') {
          console.log('Camera permission denied');
          this.showPermissionDeniedMessage();
          this.fallbackToImage();
          return;
        }
      }
      
      console.log('Proceeding with camera request...');
      await this.setupCamera();
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        this.showPermissionDeniedMessage();
      }
      // Fallback to image background if camera access fails
      this.fallbackToImage();
    }
  },

  async setupCamera() {
    const constraints = {
      video: {
        facingMode: this.data.facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    };

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Camera access timeout')), 10000);
    });

    try {
      const stream = await Promise.race([
        navigator.mediaDevices.getUserMedia(constraints),
        timeoutPromise
      ]);
      
      this.video = document.createElement('video');
      this.video.srcObject = stream;
      this.video.setAttribute('playsinline', true);
      this.video.setAttribute('autoplay', true);
      this.video.setAttribute('muted', true);
      this.video.setAttribute('loop', true);
      this.video.setAttribute('controls', false);
      this.video.controls = false;
      this.video.style.display = 'none';
      
      // Wait for video to be ready
      this.video.addEventListener('loadedmetadata', () => {
        this.video.play();
        this.createBackground();
      });

      this.video.addEventListener('error', (error) => {
        console.error('Error accessing camera:', error);
        this.fallbackToImage();
      });
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      this.fallbackToImage();
    }
  },

  createBackground() {
    if (!this.video) return;
    
    console.log('Creating A-Frame video background...');
    
    const THREE = AFRAME.THREE;
    const tex = new THREE.VideoTexture(this.video);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    
    this.tex = tex;
    this.el.object3D.background = tex;
    
    // Hide the original skybox when camera is active
    const sky = this.el.sceneEl.querySelector('a-sky');
    if (sky) {
      sky.setAttribute('visible', false);
    }
  },

  fallbackToImage() {
    console.log('Falling back to image background');
    
    // Show the original skybox - this is the proper fallback for A-Frame
    const sky = this.el.sceneEl.querySelector('a-sky');
    if (sky) {
      sky.setAttribute('visible', true);
      // Ensure the sky is properly positioned and scaled
      sky.setAttribute('position', '0 0 0');
      sky.setAttribute('scale', '1 1 1');
    }
  },

  showPermissionDeniedMessage() {
    const message = document.createElement('div');
    message.innerHTML = 'Esta Web Inmersiva requiere acceso a los sensores de movimiento de tu dispositivo';
    message.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #ff4444;
      color: white;
      padding: 12px 24px;
      border-radius: 25px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      z-index: 1000;
    `;
    document.body.appendChild(message);
    
    setTimeout(() => message.remove(), 3000);
  },

  remove() {
    // Cleanup
    if (this.video && this.video.srcObject) {
      const tracks = this.video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    
    // Remove background texture
    if (this.tex) {
      this.el.object3D.background = null;
      this.tex.dispose();
    }
  }
});
