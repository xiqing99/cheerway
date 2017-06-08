<script type="text/javascript">

Ext.define('smartOA.accountMgt.SaleVch', {
     extend: 'Ext.data.Model',
     fields: [
         {name: 'saleVchId', type: 'int'},
         {name: 'saleVchSeqNum'},
         {name: 'totalAmount',  type: 'number'},
         {name: 'currencyName'},
         {name: 'auditedDate'},
         {name: 'rspEmpName'}
     ]
 });

Ext.define("smartOA.accountMgt.selectSaleVch",
{   
    extend : "Ext.grid.Panel",
    parentStore : ' ',
    loadUrl: 'salesMgt/loadSaleVchListByCustIdAndState.action',
    constructor : function(conf)
    {   
            
        var myStore = Ext.create('Ext.data.Store', {
            model : 'smartOA.accountMgt.SaleVch',
            proxy: {
                type: 'ajax',
                url: this.loadUrl,
                extraParams: {custId: conf.custId, state: 'AUDITED'}, 
                reader: {
                    type: 'json'
                }
            },
            autoLoad : true
        });     

        var selModel = Ext.create('Ext.selection.CheckboxModel', {
            listeners: {
                selectionchange: function(sm, selections) {
    //                grid4.down('#removeButton').setDisabled(selections.length === 0);
                }
            }
        });        
        
        Ext.apply(this, {
            
            autoScroll:true,            
            frame : true,
            columnLines : true,
            store : myStore,
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 50, header: '序号'},
              {text : '', dataIndex:'saleVchId', hidden: true},              
              {text : "销售单据编号" , dataIndex : 'saleVchSeqNum', sortable : true, width : 150, align : 'center'}, 
              {text : "审核日期" , dataIndex : 'auditedDate', sortable : true, width : 150, align : 'center'},
              {text : "结算货币" , dataIndex : 'currencyName',  width : 120, align : 'center'},
              {text : "总金额" , dataIndex : 'totalAmount', sortable : true, width : 180, align : 'center',
                    renderer:function(data, cell, record, rowIndex,columnIndex, store)
                    {
                        var currency = record.get('currencyName');
                       
                        if(currency === '美元')
                            return Ext.util.Format.usMoney(data);
                            
                        return Ext.util.Format.currency(data, '¥');
                    }
              },
              {text : "负责业务员" , dataIndex : 'rspEmpName', sortable : true, flex:1, align : 'center'}
              ],            
            selModel: selModel,
            tbar: ['->','->',
               {
                    text:'选择',
                    icon :'images/accept.png',
                    iconCls :'add-icon',
                    handler: this.saveAndReturn,
                    scope: this
               },
               {
                    text:'取消',
                    icon :'images/cross.png',
                    iconCls :'add-icon',
                    handler: function()
                    {
                        Ext.WindowMgr.getActive().close();
                    },
                    scope: this
               }               
                ]
        });
        
        this.callParent(arguments);
    },
    saveAndReturn: function()
    {
        if(this.getSelectionModel().getCount() == 0)
        {
            Ext.WindowMgr.getActive().close();
            return;
        }
        
        var records = this.getSelectionModel().getSelection();
        var convRecords = new Array();
        
        for(var rec in records)
        {
            var data = records[rec].data;
            
            for(var i =0; i<this.parentStore.getCount(); i++)
            {
                var oldRec = this.parentStore.getAt(i).getData();
                
                if(data.saleVchId == oldRec.saleVchId)
                {
                    Ext.Msg.alert('提醒', data.saleVchSeqNum +' 已经存在, 请不要重复选择');
                    return;
                }
            }
            
            var convRec = {saleVchId:data.saleVchId,  saleVchSeqNum:data.saleVchSeqNum, auditedDate:data.auditedDate,
                            totalAmount:data.totalAmount, amount: data.totalAmount, currencyName:data.currencyName};
            convRecords.push(convRec);
        }                
        if(this.parentStore.getCount() == 1 && this.parentStore.getAt(0).data.saleVchSeqNum == '')
        {
             this.parentStore.removeAt(0);
        }
        
        this.parentStore.insert(this.parentStore.getCount(), convRecords);
        
        Ext.WindowMgr.getActive().close();
    }    
}
    
);


Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side'
     
    var win = Ext.WindowMgr.getActive();    
    
    var framePanel = Ext.create('smartOA.accountMgt.selectSaleVch',
                        {
                            parentStore : win.store,
                            custId: win.custId
                        });

    win.add(framePanel);
    win.doLayout(); 

});
</script>