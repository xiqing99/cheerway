<script type="text/javascript">

Ext.onReady(function(){

     Ext.tip.QuickTipManager.init();
     
     Ext.form.Field.prototype.msgTarget = 'side';
 
    var win = Ext.WindowMgr.getActive();
    
    var formpanel = Ext.create('smartOA.commonClass.GeneTreeNodeEditForm',{
                                initId: win.initId,
                                parentStore : win.parentStore,
                                comboLoadUrl: 'basicElem/loadDeptListForCombo.action',
                                dataLoadUrl : 'basicElem/loadDept.action',
                                saveUrl : 'basicElem/saveDept.action',
                                nameText : '部门'
                                
    });
     
    win.add(formpanel);
    win.doLayout();  

});
</script>