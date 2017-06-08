//<script type="text/javascript">

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    var listPanel = Ext.create('accountMgt.RsvbPerOSListPanel',
    {
        loadUrl: 'accountMgt/loadMyRsvbListByCreatedDateRange.action'
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