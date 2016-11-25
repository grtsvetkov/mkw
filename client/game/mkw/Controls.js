var Controls = function (general) {

    var scope = this;
    
    var onMouseMove = function ( event ) {

        if ( scope.enabled === false ) return;

        event.preventDefault();
        scope.position = { x: (event.clientX / window.innerWidth) * 2 - 1, y: - (event.clientY / window.innerHeight) * 2 + 1};
    };
    
    var onMouseUp = function( event ) {
        if ( scope.enabled === false ) return;

        event.preventDefault();
        scope.general.events.click = { x: (event.clientX / window.innerWidth) * 2 - 1, y: - (event.clientY / window.innerHeight) * 2 + 1};
        
    };
    
    this.general = general;

    this.enabled = true;

    this.position = null;


    this.dispose = function() {
        document.removeEventListener( 'mousemove', onMouseMove, false );
        document.removeEventListener( 'mouseup', onMouseUp, false );
    };
    
    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'mouseup', onMouseUp, false );

};

// browserify support
if ( typeof module === 'object' ) {

    module.exports = Controls;

}