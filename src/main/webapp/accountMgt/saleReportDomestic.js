//<script type="text/javascript">

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
       
    var listPanel = Ext.create('accountMgt.CustReportPanel', 
            {loadUrl:'accountMgt/loadSaleReportByMarketArea.action', criteraId: smartOA.csn.getValue('CUST_AREA_DOMESTIC_ID')});         
    accountReportPanel.add(listPanel);

});
//</script>