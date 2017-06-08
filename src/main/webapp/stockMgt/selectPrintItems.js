<script type="text/javascript">

Ext.define("smartOA.stockMgt.SelPrintItemsPanel",
{   
    extend : "Ext.grid.Panel",
    parentStore : ' ',
    vchInfo: '',
    vchGrid: '',
    constructor : function(conf)
    {                       
        var selModel = Ext.create('Ext.selection.CheckboxModel', {
            listeners: {
                selectionchange: function(sm, selections) {
                }
            }
        });        
        
        Ext.apply(this, {
            autoScroll:true,            
            frame : true,
            columnLines : true,
            store : conf.vchGrid.getStore(),
            columns: [
                {xtype: 'rownumberer', header: 'ID'},
                {text : "物料号" , dataIndex : 'mtNum',  width : 120, align : 'center',
                    summaryType : 'count', 
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '总计:  '+ value;
                    }                
                },
                {text : "物料名称" , dataIndex : 'mtName',  width : 150, align : 'center'},                 
                {text : "单位" , dataIndex : 'unit',  width : 80, align : 'center'},
                {text : "数量" , dataIndex : 'quantity', sortable : true, width : 120, align : 'center',
                    editor: {xtype: 'numberfield', submitValue: false, validator: function(value){ if(value > 0) return true; return "数量必须大于零";}},
                    summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return ((value === 0 || value > 1) ?  + value  : 0);
                    }                     
                },
                {text : "包装方式" , dataIndex : 'packageModel',  width : 120, align : 'center'},  
                {text : "客户型号" , dataIndex : 'custModelNum',  width : 120, align : 'center'},    
                {text : "备注" , dataIndex : 'notes',  flex : 1, editor: {xtype: 'textfield',submitValue: false}}
              ],            
            selModel: selModel,
            tbar: ['->','->',
               {
                    text:'取消',
                    icon :'images/cross.png',
                    iconCls :'add-icon',
                    handler: function()
                    {
                        Ext.WindowMgr.getActive().close();
                    },
                    scope: this
               },
               {
                    text:'打印',
                    icon :'images/accept.png',
                    iconCls :'add-icon',
                    handler: this.saveAndReturn,
                    scope: this
               }               
                ]
        });
        
        this.callParent(arguments);
    },
    saveAndReturn: function()
    {
        var records = this.getSelectionModel().getSelection();
        
        if(records.length < 1)
        {
             Ext.Msg.alert('提醒', '请先选择打印单据明细!');
             return;
        }        

        var suc = Ext.ux.grid.VchPrinter.print(this.vchGrid, records, this.vchInfo);
        
        if(suc)
        {
            Ext.WindowMgr.getActive().close();
        }
        
    }    
}
    
);


Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side'
    
    var win = Ext.WindowMgr.getActive();    
    
    var framePanel = Ext.create('smartOA.stockMgt.SelPrintItemsPanel',
                        {
                            store : win.store,
                            vchInfo: win.vchInfo,
                            vchGrid: win.vchGrid
                        });

    win.add(framePanel);
    win.doLayout(); 

});
</script>