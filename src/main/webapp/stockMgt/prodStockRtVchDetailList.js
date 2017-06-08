//<script type="text/javascript">

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    var listPanel = Ext.create('stockMgt.WHVchDetailListPanel',
    {
        flex: 1,
        loadUrl : 'stockMgt/loadProdStockRtVchDetailByStoreAndCreatedDateRange.action',
        title: '退货单明细列表',
        outstock: true
    });       
    
    stockReportPanel.add(listPanel);

});
//</script>