var WindowResize = function(renderer, camera) {
    var callback = function() {
        renderer.setSize( window.innerWidth, window.innerHeight );
        camera.aspect	= window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    };
    
    window.addEventListener('resize', callback, false);
    
    return {
        stop	: function() {
            window.removeEventListener('resize', callback);
        }
    };
};

// browserify support
if ( typeof module === 'object' ) {

    module.exports = WindowResize;

}