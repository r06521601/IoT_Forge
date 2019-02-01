// MarkupExt.js
function markup3d(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.PointCloud.threshold = 5; // hit-test markup size.  Change this if markup 'hover' doesn't work
    this.size = 150.0; // markup size.  Change this if markup size is too big or small
    this.lineColor = 0xcccccc; // off-white
    this.labelOffset = new THREE.Vector3(120,120,0);  // label offset 3D line offset position
    this.xDivOffset = -0.2;  // x offset position of the div label wrt 3D line.
    this.yDivOffset = 0.4;  // y offset position of the div label wrt 3D line.

    this.scene = viewer.impl.scene; // change this to viewer.impl.sceneAfter with transparency, if you want the markup always on top.
    this.markupItems = []; // array containing markup data
    this.pointCloud; // three js point-cloud mesh object
    this.line3d; // three js point-cloud mesh object
    this.camera = viewer.impl.camera;
    this.hovered; // index of selected pointCloud id, based on markupItems array
    this.selected; // index of selected pointCloud id, based on markupItems array
    this.label; // x,y div position of selected pointCloud. updated on mouse-move
    this.offset; // global offset

    this.vertexShader = `
        uniform float size;
        varying vec3 vColor;
        void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
            gl_PointSize = size * ( size / (length(mvPosition.xyz) + 1.0) );
            gl_Position = projectionMatrix * mvPosition;
        }
    `

    this.fragmentShader = `
        uniform sampler2D tex;
        varying vec3 vColor;
        void main() {
            gl_FragColor = vec4( vColor.x, vColor.x, vColor.x, 1.0 );
            gl_FragColor = gl_FragColor * texture2D(tex, vec2((gl_PointCoord.x+vColor.y*1.0)/4.0, 1.0-gl_PointCoord.y));
            if (gl_FragColor.w < 0.5) discard;
        }
    `

}

markup3d.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
markup3d.prototype.constructor = markup3d;

markup3d.prototype.updateHitTest = function(event) {
    // on mouse move event, check if ray hit with pointcloud, move selection cursor
    // https://stackoverflow.com/questions/28209645/raycasting-involving-individual-points-in-a-three-js-pointcloud
    if (!this.pointCloud) return;
    var x =  ((event.clientX - viewer.canvas.offsetLeft) / viewer.canvas.width) * 2 - 1;
    var y = -((event.clientY - viewer.canvas.offsetTop) / viewer.canvas.height) * 2 + 1;    
    var vector = new THREE.Vector3(x, y, 0.5).unproject(this.camera);
    this.raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize());
    var nodes = this.raycaster.intersectObject(this.pointCloud);
    if (nodes.length > 0) {
        if (this.hovered)
            this.geometry.colors[this.hovered].r = 1.0;
        this.hovered = nodes[0].index;
        this.geometry.colors[this.hovered].r = 2.0;
        this.geometry.colorsNeedUpdate = true;
        viewer.impl.invalidate(true);
    }
}

markup3d.prototype.unload = function() {
    return true;
};

function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) 
{	
	// note: texture passed by reference, will be updated by the update function.
		
	this.tilesHorizontal = tilesHoriz;
	this.tilesVertical = tilesVert;
	// how many images does this spritesheet contain?
	//  usually equals tilesHoriz * tilesVert, but not necessarily,
	//  if there at blank tiles at the bottom of the spritesheet. 
	this.numberOfTiles = numTiles;
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
	texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

	// how long should each image be displayed?
	this.tileDisplayDuration = tileDispDuration;

	// how long has the current image been displayed?
	this.currentDisplayTime = 0;

	// which image is currently being displayed?
	this.currentTile = 0;
		
	this.update = function( milliSec )
	{
		this.currentDisplayTime += milliSec;
		while (this.currentDisplayTime > this.tileDisplayDuration)
		{
			this.currentDisplayTime -= this.tileDisplayDuration;
			this.currentTile++;
			if (this.currentTile == this.numberOfTiles)
				this.currentTile = 0;
			var currentColumn = this.currentTile % this.tilesHorizontal;
			texture.offset.x = currentColumn / this.tilesHorizontal;
			var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
			texture.offset.y = currentRow / this.tilesVertical;
		}
	};
}	
markup3d.prototype.load = function() {
    var self = this;
    this.offset = viewer.model.getData().globalOffset; // use global offset to align pointCloud with lmv scene

    // setup listeners for new data and mouse events
    window.addEventListener("newData", e => { this.setMarkupData( e.detail ) }, false);


    // Load markup points into Point Cloud
    this.setMarkupData = function(data) {
        this.initMesh_PointCloud();
    };

    this.initMesh_PointCloud = function() {
                
        
        
    }


    this.initMesh_Line = function() {
        var geom = new THREE.Geometry();
        geom.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1,1,1), );
        this.line3d = new THREE.Line(geom, new THREE.LineBasicMaterial({ color: this.lineColor, linewidth: 4.0, }));
        this.line3d.position.sub( this.offset );
        this.scene.add(this.line3d);
    }

    this.update_Line = function() {
        var position = this.pointCloud.geometry.vertices[this.selected].clone();
        this.line3d.geometry.vertices[0] = position;
        this.line3d.geometry.vertices[1].set( position.x + this.labelOffset.x * Math.sign(position.x), position.y + this.labelOffset.y, position.z + this.labelOffset.z );
        this.line3d.geometry.verticesNeedUpdate = true;
    }

    this.update_DivLabel = function(eventName){
        var position = this.line3d.geometry.vertices[1].clone().sub(this.offset);
        this.label = position.project(this.camera);
        window.dispatchEvent(new CustomEvent(eventName, {
            'detail': {
                id: this.selected,
                x: this.label.x + this.xDivOffset,
                y: this.label.y + this.yDivOffset,
            }
        }));
    }

    // Dispatch Message when a point is clicked
    this.onMouseMove = function(event) {
        this.update_DivLabel('onMarkupMove');
        this.updateHitTest(event);
    }

    this.onClick = function() {
        this.updateHitTest(event);
        if (!this.hovered) return;
        this.selected = this.hovered;
        this.update_Line();
        this.update_DivLabel('onMarkupClick');
        viewer.impl.invalidate(true);
        viewer.clearSelection();
    }

    return true;
};


Autodesk.Viewing.theExtensionManager.registerExtension('markup3d', markup3d);
