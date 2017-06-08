<script type="text/javascript">


Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side'    
    
    var win = Ext.WindowMgr.getActive();
    
    win.setSize({width:540, height:360});
    win.center();    
    
    var panel = Ext.create('smartOA.commonClass.EnumDataGridPanel',
    {
        loadUrl : 'salesMgt/loadAllFreightCmp.action',
        saveUrl : 'salesMgt/saveFreightCmp.action',
        delUrl : 'salesMgt/delFreightCmp.action'      
    });

 
    win.add(panel);
    win.doLayout();  
});
</script>