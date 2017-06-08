//<script type="text/javascript">

Ext.define('stockMgt.ProdStockOutListPanle',
{   
    extend : "smartOA.commonClass.EditDateRangeGridPanel",
    constructor : function(conf)
    {
        Ext.define('WHVoucherModel',{
             extend : 'Ext.data.Model',
            fields: [
                 {name: 'voucherId', type: 'int'},
                 {name: 'storeName'},
                 {name: 'sequenceNum'},
                 {name: 'createdDate', type:'date', dateFormat: 'Y-m-d'},
                 {name: 'state'},
                 {name: 'saleVchSeqNum'},
                 {name: 'customerName'},
                 {name: 'rspEmpName'},
                 {name: 'extraExpense', type: 'float'},
                 {name: 'notes'}
            ]         
        }  
        );     
        
/*        var menu = Ext.create('Ext.menu.Menu',
        {                    
          items: [
          {text:  '订单出库单', handler : this.addPerOrder, icon :'images/add.png',scope: this},
          {text:  '销货单出库单', handler : this.addPerStoreSale,icon :'images/add.png',scope: this}         
          ]             
        });*/        
        
        Ext.apply(this, {        
            title: '出库单列表',
            flex: 1,
            loadUrl: conf.loadUrl,
            delUrl: 'stockMgt/deleteProdOutstockVch.action',
            searchField: 'saleVchSeqNum',
            dataModel: 'WHVoucherModel', 
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : '', dataIndex:'voucherId', hidden: true}, 
              {text : "单据日期" , dataIndex : 'createdDate', filter:true, width : 120, sortable : true, align : 'center',
                renderer: Ext.util.Format.dateRenderer('Y-m-d')
              },              
              {text : "单据编号" , dataIndex : 'sequenceNum', sortable : true, width : 150, align : 'center',
                    summaryType : 'count', 
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '单据总数  :  ' + value;
                    }                 
              },
              {text : "单据状态" , dataIndex : 'state',filter:true, sortable : true, width : 120, align : 'center',
                renderer:function(data)
                {
                    switch (data)
                    {
                        case 'PROPOSED':
                            return '未审核';
                        case 'AUDITED':
                            return '已审核';
                        case 'COMPLETED':
                            return '已完成';
                    }                        
                }
              },
              {text : "仓库名称" , dataIndex : 'storeName', sortable : true, width : 150, align : 'center'},  
              {text : "库管员" , dataIndex : 'rspEmpName', sortable : true, width : 120, align : 'center'},
              {text : "订单号" , dataIndex : 'saleVchSeqNum', filter:true,sortable : true, width : 150, align : 'center'},
              {text : "客户名称" , dataIndex : 'customerName', sortable : true, filter:true,width : 150, align : 'center'},
              {text : "备注" , dataIndex : 'notes', sortable : true, align : 'center',flex:1}
              ]
        });
        
        this.callParent(arguments);              
    },   
    openDetailsWin : function(vId)
    {
        
        smartOA.util.genWindow({
                title    : "成品出库单",
                loader: {
                        url: 'stockMgt/editProdStockOutVch.js',
                autoLoad: true,
                scripts:true
            },
            initId : vId,
            store : this.store
        });         
    },    
    edit : function()
    {
        var selection = this.getSelectionModel().getSelection();
        
        if(selection.length == 0 )
        {
            Ext.Msg.alert("错误", "请选择要编辑的单据");
            return;
        }       

        this.openDetailsWin(selection[0].raw.voucherId);
              
    }
});

//</script>