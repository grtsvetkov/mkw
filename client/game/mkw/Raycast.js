import THREE from 'three';

var Raycast = {

    threshold: 0.1,
    
    scope: null,
    
    create: function() {
        this.scope = new THREE.Raycaster();
        this.scope.params.Points.threshold = this.threshold;
        
        return this.scope;
    }
};

// browserify support
if ( typeof module === 'object' ) {

    module.exports = Raycast;

}
