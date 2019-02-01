class FocusColor extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);

        this.statusPanel = null;
        this.onCreateMenu = this.onCreateMenu.bind(this);

    }

    onCreateMenu(menu, status) {

        if (!status.hasSelected)
            return;

        menu.push({
            title: '聚焦變色',
            target: () => {

                const selSet = this.viewer.getSelection();
                const dbId = selSet[0];
                this.viewer.fitToView(selSet);
                this.viewer.clearSelection();
                FocusColor.colorchange(dbId,100);
            }
        });


        menu.push({
            title: 'cancel變色',
            target: () => {
                
                this.viewer.clearThemingColors();
            }
        });
        }
    
    

    static colorchange(id, time) {

        if (time < 0) return;

        setTimeout(
            function () {
                this.viewer.setThemingColor(id, new THREE.Vector4(1 - 1 / 100 * time, 0, 0, 1));
                FocusColor.colorchange(id, --time);
            },
            10000/100);
    }
      
    

    load() {

        this.viewer.registerContextMenuCallback(
            'Autodesk.focuscolor.contextmenu', this.onCreateMenu
        );
        return true;
    };

    unload() {

        this.viewer.unregisterContextMenuCallback(
            'Autodesk.focuscolor.contextmenu', this.onCreateMenu
        );
        return true;
    }
}
    Autodesk.Viewing.theExtensionManager.registerExtension(
    'Autodesk.focuscolor.contextmenu',  
        FocusColor
    );