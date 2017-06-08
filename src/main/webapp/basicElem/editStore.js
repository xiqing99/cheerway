<script type="text/javascript">


Ext.onReady(function(){

     Ext.tip.QuickTipManager.init();
     
     Ext.form.Field.prototype.msgTarget = 'side';
 
    var win = Ext.WindowMgr.getActive();
    win.center();
    
    var formpanel = Ext.create('js-lib.myapp.ux.GeneTreeNodeEditForm',{
                                initId: win.initId,
                                parentStore : win.parentStore,
                                comboLoadUrl: 'basicElem/loadStoreListForCombo.action',
                                dataLoadUrl : 'basicElem/loadStore.action',
                                saveUrl : 'basicElem/saveStore.action',
                                nameText : '仓库'
                                
    });
     
    win.add(formpanel);
    win.doLayout();  

});
</script>