<script type="text/javascript">


Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';    
    
    var panel = Ext.create('smartOA.commonClass.EnumDataGridPanel',
    {
        loadUrl : 'basicElem/loadAllProdType.action',
        saveUrl : 'basicElem/saveProdType.action',
        delUrl : 'basicElem/delProdType.action'      
    });

    var win = Ext.WindowMgr.getActive();
 
    win.add(panel);
    win.doLayout();  

});
</script>