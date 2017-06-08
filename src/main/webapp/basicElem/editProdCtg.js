<script type="text/javascript">

Ext.onReady(function(){

     Ext.tip.QuickTipManager.init();
     
     Ext.form.Field.prototype.msgTarget = 'side';
 
    var win = Ext.WindowMgr.getActive();
    
    var formpanel = Ext.create('smartOA.commonClass.GeneTreeNodeEditForm',{
                                initId: win.initId,
                                parentStore : win.parentStore,
                                comboLoadUrl: 'basicElem/loadProdCtgForCombo.action',
                                dataLoadUrl : 'basicElem/loadProdCtg.action',
                                saveUrl : 'basicElem/saveProdCtg.action',
                                nameText : '产品目录'
                                
    });
     
    win.add(formpanel);
    win.doLayout();  

});
</script>