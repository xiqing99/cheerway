//<script type="text/javascript">

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    
    var listPanel = Ext.create('salesMgt.StoreSaleDetailListPanel',
    {
        loadUrl: 'salesMgt/loadStoreSaleVchDetailListByDeptAndCreatedDateRange.action'
    }
    );   
   
    salesReportPanel.add(listPanel);

});
//</script>