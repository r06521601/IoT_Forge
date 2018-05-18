class aa extends Autodesk.Viewing.Extension {
  constructor( viewer, options ) {
    super( viewer, options );

    this.subtoolbar = null;
  }

  createUI() {
     // button to show the docking panel
     const button = new Autodesk.Viewing.UI.Button( 'MyAwesomeButton' );
     button.onClick = function( event ) {
       const btnState = button.getState();
       if( btnState === Autodesk.Viewing.UI.Button.State.INACTIVE ) {
         button.setState( Autodesk.Viewing.UI.Button.State.ACTIVE );

         alert( 'MyAwesomeButton active' );
       } else if( btnState === Autodesk.Viewing.UI.Button.State.ACTIVE ) {
         button.setState( Autodesk.Viewing.UI.Button.State.INACTIVE );

         alert( 'MyAwesomeButton inactive' );
       }
     };

     button.addClass( 'myAwesomeToolbarButton' );
     button.icon.classList.add( 'glyphicon' );
     button.setIcon( 'glyphicon-book' );
     button.setToolTip( 'My Awesome button' );

     // SubToolbar
     this.subToolbar = new Autodesk.Viewing.UI.ControlGroup( 'MyAwesomeAppToolbar' );
     this.subToolbar.addControl( button );

     const toolbar = this.viewer.getToolbar();
     toolbar.addControl( this.subToolbar );
  }

  onToolbarCreatedBinded( event ) {
    this.viewer.removeEventListener( Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded );
    this.onToolbarCreatedBinded = null;
      //事件取消 
    this.createUI();
  }

  load() {
     if( this.viewer.getToolbar() ) {
       // Toolbar is already available, create the UI
       this.createUI();
     } else {
       // Toolbar hasn't been created yet, wait until we get notification of its creation
       this.onToolbarCreatedBinded = this.onToolbarCreated.bind( this );
       this.viewer.addEventListener( Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded );
     }
    return true;
  }

  unload() {
    // this.viewer.toolbar.removeControl( this.subToolbar );
    return true;
  }
}

 Autodesk.Viewing.theExtensionManager.registerExtension( 'Autodesk.ADN.Extensions.MyTool', aa );