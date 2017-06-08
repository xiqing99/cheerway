<script type="text/javascript">


Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side'    

    var win = Ext.WindowMgr.getActive();
    
    win.setSize({width:540, height:360});
    win.center();    
    
    var panel = Ext.create('smartOA.commonClass.EnumDataGridPanel',
    {
        loadUrl : 'salesMgt/loadAllPaymentMode.action',
        saveUrl : 'salesMgt/savePaymentMode.action',
        delUrl : 'salesMgt/delPaymentMode.action'      
    });

 
    win.add(panel);
    win.doLayout();  

});
</script>