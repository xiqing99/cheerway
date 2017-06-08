//<script type="text/javascript">

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    console.log(smartOA.csn.getValue('CUST_AREA_ROOT_ID'));
    var listPanel = Ext.create('salesMgt.SalesReportPerCustPanel', 
            {loadUrl:'salesMgt/loadStSaleReportByMarketArea.action', criteraId: smartOA.csn.getValue('CUST_AREA_ROOT_ID')});    
      
    salesReportPanel.add(listPanel);

});
//</script>