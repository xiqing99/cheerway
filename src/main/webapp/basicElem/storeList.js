<script type="text/javascript">

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side'
    
            
    var panel = Ext.create('smartOA.commonClass.EditTreeViewPanel',{
            loadUrl : 'basicElem/loadStoreTree.action',
            editJs : 'basicElem/editStore.js',
            delUrl : 'basicElem/delStore.action',
            itemName : '仓库'
    });
    

   if (mainPanel) {
        mainPanel.getActiveTab().add(panel);
        mainPanel.getActiveTab().doLayout();
    } else {
        var vp = new Ext.Viewport({layout:'fit', items:[panel]});
    }

    panel.on('itemdblclick', function(object,record)
    {
        var data = record.getData();
        
        if(data.leaf == true)
            panel.edit();
    });

});
</script>