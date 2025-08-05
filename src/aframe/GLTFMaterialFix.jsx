import 'aframe';

AFRAME.registerComponent('gltf-material-fix', {
  schema: {
    color: { type: 'string', default: 'white' } // Easing type
  },

  init: function () {
    const el = this.el;
    const data = this.data;

    el.addEventListener("model-loaded", e => {
      // grab the mesh 
      let model = this.el.getObject3D("mesh");
      // find the node with the basic material     
      model.traverse(function(node) {
        // ignore bones and other nodes without any material 
        if (!node.material) return;

        // keep the reference to the old material - we want to dispose it later
        var tmp = node.material
        // substitute the material     
        node.material = new THREE.MeshStandardMaterial({
           skinning: true, // the original material is using skinning
           map: node.material.map, // we want the original texture
           color: data.color,
           metalness: 0,
           roughness: 0,
        });
        // update and clean up
        node.material.needsUpdate = true;
        tmp.dispose()
      });
    });
  }
});