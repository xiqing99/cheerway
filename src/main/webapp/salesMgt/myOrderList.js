//<script type="text/javascript">

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    var framePanel = Ext.create('salesMgt.OrderListPanel',
    {
        loadUrl: 'salesMgt/loadMyOrderListByCreatedDateRange.action',
        flex: 1
    });           
   
    if (mainPanel) {
        mainPanel.getActiveTab().add(framePanel);
        mainPanel.getActiveTab().doLayout();
    } else {
        var vp = new Ext.Viewport({layout:'fit', items:[framePanel]});
    } 

});
//</script>