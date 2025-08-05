import 'aframe';

AFRAME.registerComponent('scale-animator', {
  schema: {
    duration: { type: 'number', default: 1000 }, // Duration in milliseconds
    easing: { type: 'string', default: 'easeInOutQuad' } // Easing type
  },

  init: function () {
    const el = this.el;

    // Wait until the entity is fully loaded
    el.addEventListener('loaded', () => {
      // Fetch the original scale after the entity is fully loaded
      const originalScale = el.getAttribute('scale') || { x: 1, y: 1, z: 1 };

      // Animate the scale from 0 to the original scale
      el.setAttribute('animation', {
        property: 'scale',
        from: "0 0 0",
        to: `${originalScale.x} ${originalScale.y} ${originalScale.z}`, // Convert to string
        dur: this.data.duration,
        easing: this.data.easing
      });
    });
  }
});
