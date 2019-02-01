
var viewer;


/////////////////////////////////////////////////////////////////////////////////
//
//設定Extension
//
/////////////////////////////////////////////////////////////////////////////////
const config = {
      extensions: [
          'Autodesk.ADN.Extension.Monitor.Selection',
          
          //'HeatMapFloorFlat',
          /*'Autodesk.ADN.Extensions.MyTool',*/
          /*'Autodesk.ADN.Extensions.MyPanelTool',
      'Autodesk.focuscolor.contextmenu'*/]
  };
  


var s = null;

var element = null;

var data_sensor = null;

var it = null;

var id = null;

/////////////////////////////////////////////////////////////////////////////////
//
//取得元件ID
//
/////////////////////////////////////////////////////////////////////////////////
//res function for draw the google chat and determine show heatmap or not
function res(r) {
    element = r;
    s = r.dbId;
    if (s == "12316")
    {
        //draw();  Realtime setinterval
        drawChart();
        RouteSetting(false);
        OCWindow('close');
        alert('空氣品質不佳，大樓門窗自動關閉!')
    }
    if (s == "12302")
    {
        firstChat();
        OCWindow('open');
        RouteSetting(true);
        alert('發生地震，所有人員請依逃生路線徹散!')
    }
    if (r.properties[0].displayValue.split(' ')[1] == "樓板" || r.properties[0].displayValue.split(' ')[1] == "Floors")
    {
        try{
            document.getElementById('texture').remove()
            viewer.impl.removeOverlay('pivot', _plane);
            cancelAnimationFrame(_requesId);
    }catch(err){};//preprocessing for if exist a texture already

        it = viewer.model.getData().instanceTree;
        it.enumNodeFragments(r.dbId, function(fragementid) {
            id = fragementid;
    
            }, false);
        _bounds = getBounds(id);       
        _heat = genHeatMap();
        _texture = genTexture();
        _material = genMaterial();
        
        _plane = clonePlane();
        //setMaterial(id, _material);
        animate();
        console.log("Heat Map Floor loaded.");
    }
    return s, element
	
}

function fall(m, n) {
    console.log(m, n)
}

function getid(i) {
    viewer.getProperties(i, res, fall)
}

/////////////////////////////////////////////////////////////////////////////////
//
//Google圖表
//
/////////////////////////////////////////////////////////////////////////////////


var v = [];

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "images/c.csv",
        dataType: "text",
        success: function(data) {v = data.split(',');}
     });
});

function firstChat(){

    var eurValues = [['time', 'acceleration']]
    euri = 0;
    v.forEach(
        function(elem){
        eurValues.push([euri/100,parseFloat(elem)]);
        euri = euri+1;
    });

    var ori_data = google.visualization.arrayToDataTable(eurValues, false);
    
    var ori_options = {
        title: 'Sensor-Acceleration',
        curveType: 'function',
        lineWidth: 0.6,
        backgroundColor: 'LightGray',
        legend: { position: 'bottom' },
        hAxis: {            // same thing for horisontal, just use hAxis
            viewWindow: {   // what range will be visible
                max: 80,
                min: 0
            },
            gridlines: {
                count: 10   // how many gridlines. You can set not the step, but total count of gridlines.
            }
        }
      };
    
    var ori_chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    
    ori_chart.draw(ori_data, ori_options);
}
function FfirstChat(){

    var eurValues = [['time', '']]
    eurValues.push(['',0]);

    var ori_data = google.visualization.arrayToDataTable(eurValues, false);
    
    var ori_options = {
        title: 'Sensor',
        curveType: 'function',
        lineWidth: 0.6,
        backgroundColor: 'LightGray',
        legend: { position: 'bottom' },
        hAxis: {            // same thing for horisontal, just use hAxis
            viewWindow: {   // what range will be visible
                max: 80,
                min: 0
            },
            gridlines: {
                count: 10   // how many gridlines. You can set not the step, but total count of gridlines.
            }
        }
      };
    
    var ori_chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    
    ori_chart.draw(ori_data, ori_options);
}


google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(FfirstChat)
var time_control = null;
function drawChart() {
	data_sensor = getDatabase();
	var data = google.visualization.arrayToDataTable([
          ['time', 'pm2.5'],
        ['', data_sensor[0].v],
        ['', data_sensor[1].v],
        ['', data_sensor[2].v],
        ['', data_sensor[3].v],
        ['', data_sensor[4].v],
        ['', data_sensor[5].v],
        ['', data_sensor[6].v],
        ['', data_sensor[7].v],
        ['', data_sensor[8].v],
        ['', data_sensor[9].v]
        ]);

        var options = {
          title: 'Sensor-PM2.5',
          curveType: 'function',
          backgroundColor: 'LightGray',
          legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
	
}

function draw() {
    
		time_control = setInterval(function () { google.charts.setOnLoadCallback(drawChart) }, 500);
	
	
    
    
}


/////////////////////////////////////////////////////////////////////////////////
//
//Viewer設定
//
/////////////////////////////////////////////////////////////////////////////////
var options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken
}
//civil research build 
var documentId = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dGVzdGluZ3VrajZodGI1Y3AyaHlmYmgzb2FicG1zeG5iY3dmcHFvL2NpdmlsYnVpbGRpbmcyMDE4LWYucnZ0';
//thesis smaple build
//var documentId = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dGVzdGluZ3VrajZodGI1Y3AyaHlmYmgzb2FicG1zeG5iY3dmcHFvL3JhbmRvbV9zYW1wbGVfY29sb3IucnZ0';

Autodesk.Viewing.Initializer(options, function onInitialized() {
    Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
    
});

function onDocumentLoadSuccess(doc) {

    // A document contains references to 3D and 2D viewables.
    var viewable = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
        'type': 'geometry',
        'role': '3d'
    }, true);
    if (viewable.length === 0) {
        console.error('Document contains no viewables.');
        return;
    }

    // Choose any of the available viewable
    var initialViewable = viewable[0]; // You can check for other available views in your model,
    var svfUrl = doc.getViewablePath(initialViewable);
    var modelOptions = {
        sharedPropertyDbPath: doc.getPropertyDbPath()
    };

    var viewerDiv = document.getElementById('viewerDiv');

    ///////////////USE ONLY ONE OPTION AT A TIME/////////////////////////

    /////////////////////// Headless Viewer /////////////////////////////
    // viewer = new Autodesk.Viewing.Viewer3D(viewerDiv);
    //////////////////////////////////////////////////////////////////////

    //////////////////Viewer with Autodesk Toolbar///////////////////////
    viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv, config);

    //////////////////////////////////////////////////////////////////////

    viewer.start(svfUrl, modelOptions, onLoadModelSuccess, onLoadModelError);
    document.getElementsByClassName('adsk-viewing-viewer notouch')[0].style.width = "60%";
}


function onDocumentLoadFailure(viewerErrorCode) {
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function onLoadModelSuccess(model) {
    console.log('onLoadModelSuccess()!');
    console.log('Validate model loaded: ' + (viewer.model === model));
    //code before the pause
    setTimeout(function(){
        //do what you need here
        OCWindow('close');
        RouteSetting(false);
    }, 1000);
    //Bellow is Markup function
    //SetMarkup();
    //render();
}

function onLoadModelError(viewerErrorCode) {
    console.error('onLoadModelError() - errorCode:' + viewerErrorCode);
}


/////////////////////////////////////////////////////////////////////////////////
//
// Load Viewer Background Color Extension
//
/////////////////////////////////////////////////////////////////////////////////

function changeBackground (){
       viewer.setBackgroundColor(0, 59, 111, 255,255, 255);
}

/////////////////////////////////////////////////////////////////////////////////
//
// Unload Viewer Background Color Extension
//
/////////////////////////////////////////////////////////////////////////////////

function resetBackground (){
       viewer.setBackgroundColor(169,169,169, 255,255, 255);
}





/////////////////////////////////////////////////////////////////////////////////
//
// The block for heatmap
//
/////////////////////////////////////////////////////////////////////////////////


// simpleheat private variables
var _heat, _data = [];

// Configurable heatmap variables:
// MAX-the maximum amplitude of data input
// VAL-the value of a data input, in this case, it's constant
// RESOLUTION-the size of the circles, high res -> smaller circles
// FALLOFF-the rate a datapoint disappears
// Z_POS-vertical displacement of plane
var MAX = 3500, VAL = 2500, RESOLUTION = 5, FALLOFF = 100, Z_POS = 0.5;

// THREE.js private variables
var _material, _texture, _bounds, _plane, _requesId;

////////////////////////////////////////////////////////////////////////////

function animate() {

    _requesId = requestAnimationFrame(animate);
    _heat.add(receivedData());
    _heat.add(receivedData());
    _heat.add(receivedData());
    _heat._data = decay(_heat._data);
    _heat.draw();
    document.getElementById('texture').style.display = 'none'

    _texture.needsUpdate = true;
    // setting var 3 to true enables invalidation even without changing scene
    viewer.impl.invalidate(true, false, true);
}

////////////////////////////////////////////////////////////////////////////

/* Geometry/Fragment/Location functions */

// Gets bounds of a fragment
function getBounds(fragId) {


    var bBox = new THREE.Box3();
    
    viewer.model.getFragmentList().getWorldBounds(fragId, bBox);
    
    var width = Math.abs(bBox.max.x - bBox.min.x);
    var height = Math.abs(bBox.max.y - bBox.min.y);
    var depth = Math.abs(bBox.max.z - bBox.min.z);

    // min is used to shift for the shader, the others are roof dimensions

    return {width: width, height: height, depth: depth, max: bBox.max, min: bBox.min};
}

///////////////////////////////////////////////////////////////////////

/* Heatmap functions */

// Starts a heatmap
function genHeatMap() {

    var canvas = document.createElement("canvas");
    canvas.id = "texture";
    canvas.width = _bounds.width * RESOLUTION;
    canvas.height = _bounds.height * RESOLUTION;
    document.body.appendChild(canvas);

    return simpleheat("texture").max(MAX);
}

// TODO: Replace with actually received data
// returns an array of data received by sensors
function receivedData() {

    return [Math.random() * $("#texture").width(),
            Math.random() * $("#texture").height(),
            Math.random() * VAL];
}

// decrements the amplitude of a signal by FALLOFF for decay over time
function decay(data) {

    // removes elements whose amlitude is < 1
    return data.filter(function(d) {
        d[2] -= FALLOFF;
        return d[2] > 1;
    });
}

///////////////////////////////////////////////////////////////////////

/* Texture and material functions */

// Creates a texture
function genTexture() {
    
    var canvas = document.getElementById("texture");
    var texture = new THREE.Texture(canvas);
    return texture;
}

// generates a material
function genMaterial() {

    var material;

        // shader uniforms
        // corner is the vertex UV mapped to (0, 0)
        // width and height are fragment size
        // tex is texture
        var uniforms = {
            corner: {
                type: 'v2',
                value: new THREE.Vector2(_bounds.min.x, _bounds.min.y)
            },
            width: {
                type: 'f',
                value: _bounds.width
            },
            height: {
                type: 'f',
                value: _bounds.height
            },
            tex: {
                type: 't',
                value: _texture
            }
        };
        
        material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: $("#vertexshader").text(),
            fragmentShader: $("#fragmentshader").text(),
            side: THREE.DoubleSide
        });

        material.transparent = true;

        // register the material under the name "heatmap"
        viewer.impl.matman().addMaterial("heatmap", material, true);
        
        return material;
}

///////////////////////////////////////////////////////////////////////

/* Rendering the heatmap in the Viewer */

// copies a fragment and moves it elsewhere
function clonePlane() {

    // To use native three.js plane, use the following mesh constructor
    geom = new THREE.PlaneGeometry(_bounds.width, _bounds.height);
    plane = new THREE.Mesh(geom, _material);
    plane.position.set(_bounds.min.x+(_bounds.max.x-_bounds.min.x)/2, _bounds.min.y+(_bounds.max.y-_bounds.min.y)/2, _bounds.min.z + Z_POS);

    viewer.impl.addOverlay("pivot", plane);
    
    return plane;
}

function setMaterial(fragId, material) {
        
    viewer.model.getFragmentList().setMaterial(fragId, material);
    viewer.impl.invalidate(true);
}


/////////////////////////////////////////////////////////////////////////////////
//
// image upload zone
//
/////////////////////////////////////////////////////////////////////////////////

var image_base64;

function readURL(input) {
    if (input.files && input.files[0]) {
        
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#imagePreview').attr('src', e.target.result);
            
            $('#imagePreview').hide();
            $('#imagePreview').fadeIn(650);
            var parameters = { search :e.target.result.split(',')[1]};
            image_base64 = parameters;
            jQuery.ajax({
                url: '/user/insert',
                async: false,
                dataType: "json",
                cache: false, 
                contentType: "application/json",
                
                type:"POST",
                data: JSON.stringify(parameters),
                
                success: function (result) {
                
                    $("#result").html(result);
                  
                  
                },
                error: function(xhr) {
                    console.log(xhr);
                  },
              });
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$("#imageupload").change(function() {
    readURL(this);
});


/////////////////////////////////////////////////////////////////////////////////
//
// markup3D
//
/////////////////////////////////////////////////////////////////////////////////
/*
var sphere;
var spherereq;
function SetMarkup()
{

    // setup dimensions of the sphere
    var radius = 1;
    var widthSegments = 100;
    var heightSegments = 100;
    var geometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments );

    //set material
    var material = new THREE.MeshPhongMaterial( { color: 0xff0000,transparent: true, opacity: 0.5 } );
    viewer.impl.matman().addMaterial(
        'transparent',
        material,
        true)

    //Create sphere
    sphere = new THREE.Mesh( geometry, material );

    //Set Markup position
    sphere.position.set(10,10,10)
    // prevents issue when running viewer selection
    sphere.geometry.attributes = {position:{array:[]}}
    // add to our scene
    viewer.impl.sceneAfter.add(sphere)
    viewer.impl.invalidate(true)

    // prevents your mesh from being hidden
    // when hidding other viewer components
    viewer.setGhosting(false)
    
}

// create render function. We use requestAnimationFrame.
function render(){
    var fps = 10
    //throttle requestAnimationFrame to custom fps
    setTimeout(function(){ 
        spherereq = requestAnimationFrame( render );
    }, 1000/fps)
    // set the markup's scale
    sphere.scale.x += 0.05;
    sphere.scale.y += 0.05;
    sphere.scale.z += 0.05;
    if(sphere.scale.x > 2)
    {
        sphere.scale.x = 1;
        sphere.scale.y = 1;
        sphere.scale.z = 1;

    }
    // setting var 3 to true enables invalidation even without changing scene
    viewer.impl.invalidate(true, false, true);
}

*/

/////////////////////////////////////////////////////////////////////////////////
//
// 4D model 
//
/////////////////////////////////////////////////////////////////////////////////
/*
var instanceTree = viewer.model.getData().instanceTree;

var allDbIdsStr = Object.keys(instanceTree.nodeAccess.dbIdToIndex);

var dbids = [];

allDbIdsStr.forEach(function(elem){viewer.impl.visibilityManager.setNodeOff(Number(elem), true);dbids.push(Number(elem))});

viewer.model.getBulkProperties(dbids, ['time'],
   function(elements){
     let dbIds = [];
     let filterValue = '2018-08-20';

     for(let i=0; i<elements.length; i++) {
       const prop = elements[i].properties[0];
       const dbId = elements[i].dbId;
       if(prop.displayValue <= filterValue) {
         dbIds.push( dbId );
       }
     }
     dbIds.forEach(function(elem){viewer.impl.visibilityManager.setNodeOff(Number(elem), false);});
   });
   */

   
/////////////////////////////////////////////////////////////////////////////////
//
// Color Bar
//
/////////////////////////////////////////////////////////////////////////////////
function SetTriangle(percent)
{
    document.getElementById('triangle').style.left = percent;

}


/////////////////////////////////////////////////////////////////////////////////
//
// Window
//
/////////////////////////////////////////////////////////////////////////////////

function OCWindow(OorC)
{
    var OorC2 = '';
    if(OorC == 'close')
    {
        OorC= '開固定窗';
        OorC2= '固定窗';
        SetTriangle('-30%');
    }
    else
    {
        OorC= '固定窗';
        OorC2= '開固定窗';
        SetTriangle('0%');
    }

    var instanceTree = viewer.model.getData().instanceTree;
    
    var allDbIdsStr = Object.keys(instanceTree.nodeAccess.dbIdToIndex);
    
    var dbids = [];
    var dbids_show = [];
    
    allDbIdsStr.forEach(function(elem){dbids.push(Number(elem))});
    
    viewer.model.getBulkProperties(dbids, ['name'],
       function(elements){
         let dbIds = [];
    
         for(let i=0; i<elements.length; i++) {
           const prop = elements[i].name;
           const dbId = elements[i].dbId;
           if(prop.split('-')[0] == OorC) {
             dbIds.push( dbId );
           }
           if(prop.split('-')[0] == OorC2) {
            dbids_show.push( dbId );
          }
         }
         dbIds.forEach(function(elem){viewer.impl.visibilityManager.setNodeOff(Number(elem), true);});
         dbids_show.forEach(function(elem){viewer.impl.visibilityManager.setNodeOff(Number(elem), false);});
       });

}


/////////////////////////////////////////////////////////////////////////////////
//
// Evacuation Route
//
/////////////////////////////////////////////////////////////////////////////////

function RouteSetting(routeSetting)
{
    if(routeSetting == true)
    {
        viewer.impl.visibilityManager.setNodeOff(Number(12776), false);
        SetTriangle('-20%');
    }
    else
    {
        viewer.impl.visibilityManager.setNodeOff(Number(12776), true);
        SetTriangle('0%');
    }

}