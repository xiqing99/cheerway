<script type="text/javascript">


Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side'    
    
    var panel = Ext.create('smartOA.commonClass.EnumDataGridPanel',
    {
        loadUrl : 'basicElem/loadAllProdUnit.action',
        saveUrl : 'basicElem/saveProdUnit.action',
        delUrl : 'basicElem/delProdUnit.action'       
    });

    var win = Ext.WindowMgr.getActive();
 
    win.add(panel);
    win.doLayout();      

});
</script>