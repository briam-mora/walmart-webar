import 'aframe';

AFRAME.registerComponent('hover-animator', {
  schema: {
    duration: { type: 'number', default: 1000 }, // Duration in milliseconds
    easing: { type: 'string', default: 'linear' }, // Easing type
    direction: { type: 'string', default: 'up' }, // Direction: up, down, right, left
    distance: { type: 'number', default: 0.05 } // Distance
  },

  init: function () {
    const el = this.el;
    const data = this.data;

    let xMovement = 0;
    let yMovement = 0;

    switch (data.direction) {
      case 'up':
        yMovement = data.distance
        break;
      case 'down':
        yMovement = -data.distance
        break;
      case 'right':
        xMovement = data.distance
        break;
      case 'left':
        xMovement = -data.distance
        break;
      default:
    }


    // Wait until the entity is fully loaded
    el.addEventListener('loaded', () => {
      // Fetch the original scale after the entity is fully loaded
      const originalPosition = el.getAttribute('position') || { x: 1, y: 1, z: 1 };

      // Animate the scale from 0 to the original scale
      el.setAttribute('animation', {
        property: 'position',
        from: `${originalPosition.x} ${originalPosition.y} ${originalPosition.z}`,
        to: `${originalPosition.x + xMovement} ${originalPosition.y + yMovement} ${originalPosition.z}`, // Convert to string
        dur: this.data.duration,
        easing: this.data.easing,
        loop: true,
        dir: "alternate",
      });
    });
  }
});
