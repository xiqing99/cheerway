//<script type="text/javascript">

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    var listPanel = Ext.create('accountMgt.RfdPerStockRtListPanel',
    {
        loadUrl: 'accountMgt/loadMyRefundPerStRtListByCreatedDateRange.action'
    }
    );         
    
    if (mainPanel) {
        mainPanel.getActiveTab().add(listPanel);
        mainPanel.getActiveTab().doLayout();
    } else {
        var vp = new Ext.Viewport({layout:'fit', items:[listPanel]});
    } 

});
//</script>