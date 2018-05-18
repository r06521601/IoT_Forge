
var viewer;


/////////////////////////////////////////////////////////////////////////////////
//
//設定Extension
//
/////////////////////////////////////////////////////////////////////////////////
const config = {
      extensions: [
          'Autodesk.ADN.Extension.Monitor.Selection',
          /*'Autodesk.ADN.Extensions.MyTool',*/
          'Autodesk.ADN.Extensions.MyPanelTool',
          'Autodesk.focuscolor.contextmenu']
  };
  


var s = null;

var data_sensor = null;


/////////////////////////////////////////////////////////////////////////////////
//
//取得元件ID
//
/////////////////////////////////////////////////////////////////////////////////
function res(r) {
    alert(r.name);
    s = r.name;
	
    return s
	
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
google.charts.load('current', { 'packages': ['corechart'] });
var time_control = null;
function drawChart() {
	data_sensor = getDatabase();
	var data = google.visualization.arrayToDataTable([
          ['time', 'humidity'],
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
          title: 'Sensor-Humidity',
          curveType: 'function',
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

var documentId = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6b3JlbzMvY2l2aWxidWlsZGluZzIwMTctNkYucnZ0';

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
}


function onDocumentLoadFailure(viewerErrorCode) {
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function onLoadModelSuccess(model) {
    console.log('onLoadModelSuccess()!');
    console.log('Validate model loaded: ' + (viewer.model === model));
    console.log(model);
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





