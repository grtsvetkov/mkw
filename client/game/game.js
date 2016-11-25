let game = new ReactiveVar(null);

Template.gameLayout.rendered = function() {
    Meteor.call('game.get', function(err, data) {
        if(err) {
            sAlert.error(err.reason);
        } else {
            game.set(data);
        }
    })
};

Template.gameLayout.helpers({
    'state': function(){
        return game ? 'run' : 'loading';
    }
});

THREE = require('three');

general = {
    clock: new THREE.Clock(),
    events: {
        click: null
    }
};

let Detector = require('./mkw/Detector.js');
let Stats = require('./mkw/stats.min.js');
let dat = require('./mkw/dat.gui.min.js');


let Light = require('./mkw/Light.js');
let Controls = require('./mkw/Controls.js');
let Renderer = require('./mkw/Renderer.js');
let Raycast = require('./mkw/Raycast.js');
let WindowResize = require('./mkw/WindowResize.js');

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
//container, camera, scene, renderer;
var gui, playbackConfig = {
    speed: 1.0,
    wireframe: false
};

spheres = [];
spheresIndex = 0;

Template.game.rendered = function() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    // CAMERA
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.set( 77, 806, 546 );
    // SCENE
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x050505, 400, 4000 );
    // LIGHTS
    Light.init(scene);
    //  GROUND
    var gt = new THREE.TextureLoader().load( "/textures/terrain/grasslight-big.jpg" );
    var gg = new THREE.PlaneBufferGeometry( 2000, 2000 );
    var gm = new THREE.MeshPhongMaterial( { color: 0xffffff, map: gt } );
    ground = new THREE.Mesh( gg, gm );
    ground.rotation.x = - Math.PI / 2;
    ground.material.map.repeat.set( 8, 8 );
    ground.material.map.wrapS = ground.material.map.wrapT = THREE.RepeatWrapping;
    ground.receiveShadow = true;
    scene.add( ground );
    // RENDERER

    renderer = Renderer.create(scene.fog.color, SCREEN_WIDTH, SCREEN_HEIGHT);

    container.appendChild( renderer.domElement );

    let windowResize = WindowResize(renderer, camera);


    // STATS
    stats = new Stats();
    container.appendChild( stats.dom );


    // CONTROLS
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 50, 0 );
    //controls.enableRotate = false;
    // GUI
    gui = new dat.GUI();
    gui.add( playbackConfig, 'speed', 0, 2 ).onChange( function() {
        character.setPlaybackRate( playbackConfig.speed );
    } );
    gui.add( playbackConfig, 'wireframe', false ).onChange( function() {
        character.setWireframe( playbackConfig.wireframe );
    } );
    // CHARACTER
    var config = {
        baseUrl: "/models/md2/ratamahatta/",
        body: "ratamahatta.md2",
        skins: [ "ratamahatta.png", "ctf_b.png", "ctf_r.png", "dead.png", "gearwhore.png" ],
        weapons:  [  [ "weapon.md2", "weapon.png" ],
            [ "w_bfg.md2", "w_bfg.png" ],
            [ "w_blaster.md2", "w_blaster.png" ],
            [ "w_chaingun.md2", "w_chaingun.png" ],
            [ "w_glauncher.md2", "w_glauncher.png" ],
            [ "w_hyperblaster.md2", "w_hyperblaster.png" ],
            [ "w_machinegun.md2", "w_machinegun.png" ],
            [ "w_railgun.md2", "w_railgun.png" ],
            [ "w_rlauncher.md2", "w_rlauncher.png" ],
            [ "w_shotgun.md2", "w_shotgun.png" ],
            [ "w_sshotgun.md2", "w_sshotgun.png" ]
        ]
    };
    character = new THREE.MD2Character();
    character.scale = 3;
    character.onLoadComplete = function() {
        setupSkinsGUI( character );
        setupWeaponsGUI( character );
        setupGUIAnimations( character );
        character.setAnimation( character.meshBody.geometry.animations[0].name )
    };
    character.loadParts( config );
    scene.add( character.root );

    raycaster = Raycast.create();

    var sphereGeometry = new THREE.SphereGeometry( 32, 32, 32 );
    var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, shading: THREE.FlatShading } );
    sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
    sphere.visible = false;
    scene.add( sphere );

    new Controls( general );

    animate();
};



// GUI
function labelize( text ) {
    var parts = text.split( "." );
    if ( parts.length > 1 ) {
        parts.length -= 1;
        return parts.join( "." );
    }
    return text;
}
//
function setupWeaponsGUI( character ) {
    var folder = gui.addFolder( "Weapons" );
    var generateCallback = function( index ) {
        return function () { character.setWeapon( index ); };
    };
    var guiItems = [];
    for ( var i = 0; i < character.weapons.length; i ++ ) {
        var name = character.weapons[ i ].name;
        playbackConfig[ name ] = generateCallback( i );
        guiItems[ i ] = folder.add( playbackConfig, name ).name( labelize( name ) );
    }
}
//
function setupSkinsGUI( character ) {
    var folder = gui.addFolder( "Skins" );
    var generateCallback = function( index ) {
        return function () { character.setSkin( index ); };
    };
    var guiItems = [];
    for ( var i = 0; i < character.skinsBody.length; i ++ ) {
        var name = character.skinsBody[ i ].name;
        playbackConfig[ name ] = generateCallback( i );
        guiItems[ i ] = folder.add( playbackConfig, name ).name( labelize( name ) );
    }
}
//
function setupGUIAnimations( character ) {
    var folder = gui.addFolder( "Animations" );
    var generateCallback = function( animationClip ) {
        return function () { character.setAnimation( animationClip.name ); };
    };
    var i = 0, guiItems = [];
    var animations = character.meshBody.geometry.animations;
    for ( var i = 0; i < animations.length; i ++ ) {
        var clip = animations[i];
        playbackConfig[ clip.name ] = generateCallback( clip );
        guiItems[ i ] = folder.add( playbackConfig, clip.name, clip.name );
        i ++;
    }
}


function animate() {
    requestAnimationFrame( animate );
    render();
    stats.update();
}

function render() {
    var delta = general.clock.getDelta();

    if(general.events.click) {

        raycaster.setFromCamera(general.events.click, camera);

        var intersections = raycaster.intersectObjects([ground]);
        intersection = ( intersections.length ) > 0 ? intersections[0] : null;

        if (intersection !== null) {
            sphere.timeToLife = 1;
            sphere.position.copy(intersection.point);
            sphere.scale.set( 1, 1, 1 );
            sphere.visible = true;



            let pos = new THREE.Vector3();
            pos.copy(intersection.point).add(intersection.face.normal);
            pos.divideScalar(10).floor().multiplyScalar(10).addScalar(5);

            if (character) {
                character.move(pos.clone());
            }

        }

        general.events.click = null;
    }

    if(sphere.visible) {
        sphere.timeToLife -= delta*2;
        if(sphere.timeToLife <= 0) {
            sphere.visible = false;
        } else {
            sphere.scale.set( sphere.timeToLife, sphere.timeToLife, sphere.timeToLife );
        }
    }

    //controls.update();
    character.update( delta );
    renderer.render( scene, camera );
}
