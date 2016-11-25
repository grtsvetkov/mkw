import THREE from 'three';

var Renderer = {

    antialias: true,

    create: function(clearColor, width, height) {

        let renderer = new THREE.WebGLRenderer( { antialias: this.antialias } );

        renderer.setClearColor( clearColor );

        renderer.setPixelRatio( window.devicePixelRatio );

        renderer.setSize( width, height );

        //renderer.gammaInput = true;
        //renderer.gammaOutput = true;
        //renderer.shadowMap.enabled = true;
        
        return renderer;
    }
};

// browserify support
if ( typeof module === 'object' ) {

    module.exports = Renderer;

}