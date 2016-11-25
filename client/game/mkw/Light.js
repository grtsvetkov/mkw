import THREE from 'three';

var Light = {

    ambient: {color: 0x555555, intensity: 5},

    init: function(scene) {

        scene.add( new THREE.AmbientLight( this.ambient.color, this.ambient.intensity ) );
        
        /*let light = new THREE.SpotLight( 0xffffff, 15, 2000 );
        light.position.set( 10, 10, 3000 );
        light.angle = 0.5;
        light.penumbra = 0.5;
        light.castShadow = true;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;*/
        // scene.add( new THREE.CameraHelper( light.shadow.camera ) );
        //scene.add( light );
        
        
        
        /*let light = new THREE.SpotLight( 0xffffff, 5, 1000 );
         light.position.set( -100, 350, 350 );
         light.angle = 0.5;
         light.penumbra = 0.5;
         light.castShadow = true;
         light.shadow.mapSize.width = 1024;
         light.shadow.mapSize.height = 1024;
         // scene.add( new THREE.CameraHelper( light.shadow.camera ) );
         scene.add( light );*/
    }
};

// browserify support
if ( typeof module === 'object' ) {

    module.exports = Light;

}