//<script type="text/javascript">

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    
    var framePanel = Ext.create('stockMgt.ProdStockInListPanel',
    {
        loadUrl: 'stockMgt/loadMyProdInstockByCreatedDateRange.action'
    }
    );       
    
    framePanel.down("[name=addNewBtn]").disable();
    framePanel.down("[name=editBtn]").disable();
    framePanel.down("[name=delBtn]").disable();

    
   if (mainPanel) {
        mainPanel.getActiveTab().add(framePanel);
        mainPanel.getActiveTab().doLayout();
    } else {
        var vp = new Ext.Viewport({layout:'fit', items:[framePanel]});
    }
});
//</script>