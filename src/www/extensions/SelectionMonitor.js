class SelectionMonitor extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
    }
    
    onSelectionChange(event) {
        
        const dbIds = event.dbIdArray;
        if (dbIds.length > 0) {
            var i = dbIds[0];
            clearInterval(time_control);
            console.log('Now Selected: ', dbIds);
            getid(i);
            draw();
            
        }
        
        else {
            console.log('Now Nothing Selected');
            
        }
        
        
    }

    load() {
        viewer.addEventListener(
            Autodesk.Viewing.SELECTION_CHANGED_EVENT,
            this.onSelectionChange
        );

        return true;
    }

    unload() {
        
        viewer.removeEventListener(
            Autodesk.Viewing.SELECTION_CHANGED_EVENT,
            this.onSelectionChange
        );
        return true;
    }

}

Autodesk.Viewing.theExtensionManager.registerExtension(
    'Autodesk.ADN.Extension.Monitor.Selection',  
    SelectionMonitor  
);

