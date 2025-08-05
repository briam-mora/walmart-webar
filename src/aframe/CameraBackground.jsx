AFRAME.registerComponent('camera-background', {
  schema: {
    facingMode: { type: 'string', default: 'environment' }, // 'user' for front camera, 'environment' for back camera
    width: { type: 'number', default: 1280 },
    height: { type: 'number', default: 720 }
  },

  init: function () {
    this.video = null;
    this.texture = null;
    this.material = null;
    this.isMobile = this.isMobileDevice();
    this.isSecure = window.location.protocol === 'https:';
    
    // Don't block scene loading - handle camera access after scene is ready
    this.el.sceneEl.addEventListener('loaded', () => {
      if (this.isMobile) {
        if (!this.isSecure) {
          console.log('Camera access requires HTTPS. Using fallback skybox.');
          this.showHttpsMessage();
          this.fallbackToSkybox();
        } else {
          // Small delay to ensure scene is fully loaded
          setTimeout(() => {
            this.setupCamera();
          }, 100);
        }
      } else {
        console.log('Camera background only works on mobile devices');
        this.fallbackToSkybox();
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
          this.fallbackToSkybox();
        });
      })
      .catch(error => {
        console.error('Error accessing camera:', error);
        // Fallback to original skybox if camera access fails
        this.fallbackToSkybox();
      });
  },

  createBackground: function () {
    // Create a video texture
    this.texture = new THREE.VideoTexture(this.video);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.format = THREE.RGBFormat;

    // Create material with video texture
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      side: THREE.BackSide
    });

    // Create a large sphere to act as the background
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    const mesh = new THREE.Mesh(geometry, this.material);
    
    // Add to scene
    this.el.sceneEl.object3D.add(mesh);
    
    // Store reference for cleanup
    this.backgroundMesh = mesh;
    
    // Hide the original skybox when camera is active
    const sky = this.el.sceneEl.querySelector('a-sky');
    if (sky) {
      sky.setAttribute('visible', false);
    }
  },

  fallbackToSkybox: function () {
    console.log('Falling back to original skybox');
    // Show the original skybox if camera access fails
    const sky = this.el.sceneEl.querySelector('a-sky');
    if (sky) {
      sky.setAttribute('visible', true);
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

  tick: function () {
    // Update video texture if it exists
    if (this.texture && this.video && this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.texture.needsUpdate = true;
    }
  },

  remove: function () {
    // Cleanup
    if (this.video && this.video.srcObject) {
      const tracks = this.video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    
    if (this.backgroundMesh) {
      this.el.sceneEl.object3D.remove(this.backgroundMesh);
      this.backgroundMesh.geometry.dispose();
      this.backgroundMesh.material.dispose();
    }
    
    if (this.texture) {
      this.texture.dispose();
    }
  }
}); 