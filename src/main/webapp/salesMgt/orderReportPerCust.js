//<script type="text/javascript">

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    var listPanel = Ext.create('salesMgt.SalesReportPerCustPanel', 
            {loadUrl:'salesMgt/loadOrderReportByMarketArea.action', criteraId: smartOA.csn.getValue('CUST_AREA_ROOT_ID')});    
      
    salesReportPanel.add(listPanel);

});
//</script>