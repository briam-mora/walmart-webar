AFRAME.registerComponent('performance-optimizer', {
  schema: {
    targetFPS: { type: 'number', default: 30 },
    reduceTextures: { type: 'boolean', default: true },
    disableShadows: { type: 'boolean', default: true },
    optimizeMaterials: { type: 'boolean', default: true }
  },

  init() {
    this.isLowEndDevice = this.detectLowEndDevice();
    
    if (this.isLowEndDevice) {
      console.log('Low-end device detected, applying performance optimizations...');
      this.applyOptimizations();
    }
  },

  detectLowEndDevice() {
    const userAgent = navigator.userAgent;
    const isAndroid = /Android/i.test(userAgent);
    
    if (!isAndroid) return false;
    
    // Check for older Android versions (API < 26)
    const androidVersion = userAgent.match(/Android\s([0-9.]+)/);
    if (androidVersion && parseFloat(androidVersion[1]) < 8.0) {
      return true;
    }
    
    // Check for low-end device indicators
    const memory = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    
    return memory < 4 || cores < 4;
  },

  applyOptimizations() {
    // Reduce target FPS for better performance
    if (this.data.targetFPS < 60) {
      this.el.sceneEl.setAttribute('renderer', 'maxFrameRate', this.data.targetFPS);
    }

    // Disable shadows globally
    if (this.data.disableShadows) {
      this.el.sceneEl.setAttribute('renderer', 'shadow', false);
      this.el.sceneEl.setAttribute('renderer', 'shadowMapType', 'none');
    }

    // Optimize materials and textures
    if (this.data.optimizeMaterials) {
      this.optimizeMaterials();
    }

    // Reduce texture quality
    if (this.data.reduceTextures) {
      this.reduceTextureQuality();
    }

    // Add frame rate monitoring
    this.setupFrameRateMonitoring();
  },

  optimizeMaterials() {
    const scene = this.el.sceneEl.object3D;
    
    scene.traverse((object) => {
      if (object.material) {
        // Optimize material properties for performance
        if (object.material.map) {
          object.material.map.generateMipmaps = false;
          object.material.map.minFilter = THREE.LinearFilter;
        }
        
        // Disable unnecessary material features
        object.material.transparent = false;
        object.material.alphaTest = 0;
        object.material.side = THREE.FrontSide;
        
        // Use simpler shaders
        if (object.material.shader) {
          object.material.shader.precision = 'mediump';
        }
      }
    });
  },

  reduceTextureQuality() {
    const scene = this.el.sceneEl.object3D;
    
    scene.traverse((object) => {
      if (object.material && object.material.map) {
        const texture = object.material.map;
        
        // Reduce texture size for better performance
        if (texture.image && texture.image.width > 512) {
          texture.maxAnisotropy = 1;
        }
        
        // Use simpler filtering
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
      }
    });
  },

  setupFrameRateMonitoring() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const monitorFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        if (fps < this.data.targetFPS * 0.8) {
          console.warn(`Low FPS detected: ${fps}, applying additional optimizations`);
          this.applyEmergencyOptimizations();
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(monitorFPS);
    };
    
    requestAnimationFrame(monitorFPS);
  },

  applyEmergencyOptimizations() {
    // Disable antialiasing if FPS is too low
    this.el.sceneEl.setAttribute('renderer', 'antialias', false);
    
    // Reduce render resolution
    const canvas = this.el.sceneEl.canvas;
    if (canvas) {
      const devicePixelRatio = Math.min(window.devicePixelRatio, 1.5);
      canvas.style.width = canvas.width / devicePixelRatio + 'px';
      canvas.style.height = canvas.height / devicePixelRatio + 'px';
    }
  },

  remove() {
    // Cleanup optimizations if needed
  }
});
