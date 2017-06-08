<script type="text/javascript">

Ext.define('smartOA.accountMgt.RefundPerStockRt', {
     extend: 'Ext.data.Model',
     fields: [
         {name: 'vchId', type: 'int'},
         {name: 'stockRtVchSeqNum'},
         {name: 'totalAmount',  type: 'number'},
         {name: 'remainedAmount',  type: 'number'},
         {name: 'currencyName'},
         {name: 'createdDate'},
         {name: 'accountEmpName'},
         {name: 'saleVchSeqNum'}
     ]
 });

Ext.define("smartOA.accountMgt.RefundPerStockRtPanel",
{   
    extend : "Ext.grid.Panel",
    parentStore : '',
    constructor : function(conf)
    {   
            
        var myStore = Ext.create('Ext.data.Store', {
            model : 'smartOA.accountMgt.RefundPerStockRt',
            proxy: {
                type: 'ajax',
                url: conf.loadUrl,
                extraParams: {saleVchId: conf.saleVchId}, 
                reader: {
                    type: 'json'
                }
            },
            autoLoad : true
        });     

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
            store : myStore,
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 50, header: '序号'},
              {text : '', dataIndex:'vchId', hidden: true},              
              {text : "退货单编号" , dataIndex : 'stockRtVchSeqNum', sortable : true, width : 150, align : 'center'},
              {text : "结算货币" , dataIndex : 'currencyName',  width : 100, align : 'center'},
              {text : "应付总金额" , dataIndex : 'totalAmount', sortable : true, width : 150, align : 'center',
                    renderer:function(data, cell, record, rowIndex,columnIndex, store)
                    {
                        var currency = record.get('currencyName');
                       
                        if(currency === '美元')
                            return Ext.util.Format.usMoney(data);
                            
                        return Ext.util.Format.currency(data, '¥');
                    }
              },
              {text : "未付金额" , dataIndex : 'remainedAmount', sortable : true, width : 150, align : 'center',
                    renderer:function(data, cell, record, rowIndex,columnIndex, store)
                    {
                        var currency = record.get('currencyName');
                       
                        if(currency === '美元')
                            return Ext.util.Format.usMoney(data);
                            
                        return Ext.util.Format.currency(data, '¥');
                    }
              },   
              {text : "财务负责人" , dataIndex : 'accountEmpName', sortable : true,  width : 100, align : 'center'},
              {text : "订单号" , dataIndex : 'saleVchSeqNum', sortable : true, flex:1, align : 'center'}
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
                
                if(data.vchId == oldRec.refundPerStockRtId)
                {
                    Ext.Msg.alert('错误', '退款单 ' + data.vchId +' 已经存在, 请不要重复选择');
                    return;
                }
            }
            
            var convRec = {refundPerStockRtId:data.vchId,  stockRtVchSeqNum:data.stockRtVchSeqNum,  createdDate:data.createdDate,
                            totalAmount:data.totalAmount, amount: data.remainedAmount, currencyName:data.currencyName};
            convRecords.push(convRec);
        }                
        if(this.parentStore.getCount() == 1 && this.parentStore.getAt(0).data.stockRtVchSeqNum == '')
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
    Ext.form.Field.prototype.msgTarget = 'side';
     
    var win = Ext.WindowMgr.getActive();    
    
    var framePanel = Ext.create('smartOA.accountMgt.RefundPerStockRtPanel',
                        {
                            parentStore : win.store,
                            saleVchId: win.saleVchId,
                            loadUrl: win.loadUrl
                        });
//    var vp = new Ext.Viewport({layout:'fit', items:[framePanel]});

    win.add(framePanel);
    win.doLayout(); 

});
</script>