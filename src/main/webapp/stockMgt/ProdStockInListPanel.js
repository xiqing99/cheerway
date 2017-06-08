//<script type="text/javascript">

Ext.define('stockMgt.ProdStockInListPanel',
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
                 {name: 'manuLine'},
                 {name: 'manuLineRspEmp'},
                 {name: 'notes'}
            ]         
        }  
        );     
        
/*        var menu = Ext.create('Ext.menu.Menu',
        {                    
          items: [
          {text:  '订单入库单', handler : this.addVoucherPerOrder, icon :'images/add.png',scope: this},
          {text:  '产品入库单', handler : this.addVoucherManul,icon :'images/add.png',scope: this}         
          ]             
        });        
 */       
        Ext.apply(this, {        
            title: '入库单列表',
            flex: 1,
            loadUrl: conf.loadUrl,
            delUrl: 'stockMgt/deleteProdInstockVch.action',
            searchField: 'saleVchSeqNum',
            dataModel: 'WHVoucherModel', 
 //           addMenu: menu,
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : '', dataIndex:'voucherId', hidden: true}, 
              {text : "单据日期" , dataIndex : 'createdDate', filter:true, width : 120,
              renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 100, align : 'center'},              
              {text : "单据编号" , dataIndex : 'sequenceNum', sortable : true, width : 150, align : 'center',
                    summaryType : 'count', 
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '单据总数  :  ' + value;
                    }                 
              },
              {text : "单据状态" , dataIndex : 'state',filter:true, sortable : true, width : 100, align : 'center',
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
              {text : "仓库名称" , dataIndex : 'storeName', sortable : true, width : 130, align : 'center'},  
              {text : "库管员" , dataIndex : 'rspEmpName', sortable : true, width : 120, align : 'center'},
              {text : "入库车间" , dataIndex : 'manuLine', sortable : true, filter:true,width : 130, align : 'center'},
              {text : "车间负责人" , dataIndex : 'manuLineRspEmp', sortable : true, filter:true,width : 90, align : 'center'},
              {text : "订单号" , dataIndex : 'saleVchSeqNum', filter:true,sortable : true, width : 130, align : 'center'},
              {text : "客户名称" , dataIndex : 'customerName', sortable : true, filter:true,width : 130, align : 'center'},
              {text : "备注" , dataIndex : 'notes', sortable : true, width : 100, align : 'center',flex:1}
              ]
        });
        
        this.callParent(arguments);              
    },   
    openDetailsWin : function(vId)
    {
        var editUrl = 'stockMgt/editProdInstockVch.js';
        var title = '成品入库单';      
        smartOA.util.genWindow({
                title    : title,
                loader: {
                        url: editUrl,
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