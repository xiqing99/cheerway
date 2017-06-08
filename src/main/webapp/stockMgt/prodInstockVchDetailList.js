//<script type="text/javascript">

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    var listPanel = Ext.create('stockMgt.WHVchDetailListPanel',
    {
        flex: 1,
        loadUrl : 'stockMgt/loadProdInstockVchDetailByStoreAndCreatedDateRange.action',
        title: '入库单明细列表'
    });       
             
    stockReportPanel.add(listPanel);

});
//</script>