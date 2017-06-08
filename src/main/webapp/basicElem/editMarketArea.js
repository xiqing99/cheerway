<script type="text/javascript">

Ext.onReady(function(){

     Ext.tip.QuickTipManager.init();
     
     Ext.form.Field.prototype.msgTarget = 'side';
 
    var win = Ext.WindowMgr.getActive();
    
    var formpanel = Ext.create('smartOA.commonClass.GeneTreeNodeEditForm',{
                                initId: win.initId,
                                parentStore : win.parentStore,
                                comboLoadUrl: 'basicElem/loadMarketAreaForCombo.action',
                                dataLoadUrl : 'basicElem/loadMarketArea.action',
                                saveUrl : 'basicElem/saveMarketArea.action',
                                nameText : '客户区域'
                                
    });
     
    win.add(formpanel);
    win.doLayout();  

});
</script>