//<script type="text/javascript">

Ext.define('smartOA.accountMgt.ReceiptVoucherListPanel',
{   
    extend : "smartOA.commonClass.EditDateRangeGridPanel",
    constructor : function(conf)
    { 
        
        Ext.define('ReceiptVoucher',{
             extend : 'Ext.data.Model',
            fields: [
                 {name: 'voucherId', type: 'int'},
                 {name: 'custName'},
                 {name: 'sequenceNum'},
                 {name: 'saleVchSeqNum'},
                 {name: 'createdDate', type:'date', dateFormat: 'Y-m-d'},
                 {name: 'state'},
                 {name: 'payWay'},
                 {name: 'currencyName'}, 
                 {name: 'rspEmpName'},
                 {name: 'auditEmpName'},
                 {name: 'totalAmount', type: 'number'},
                 {name: 'notes'},
                 {name: 'approvedTime',type:'date', dateFormat: 'Y-m-d'}
            ]         
        }  
        );      
        
        Ext.apply(this, {   
            loadUrl : 'accountMgt/loadReceiptVoucherListByCreatedDateRange.action',
            delUrl: 'accountMgt/delReceiptVoucher.action',       
            dataModel: 'ReceiptVoucher', 
            searchField: 'saleVchSeqNum',
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : '', dataIndex:'voucherId', hidden: true},
              {text : '', dataIndex:'saleVchType', hidden: true},
              {text : "单据日期" , dataIndex : 'createdDate', filter:true,
                renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 120, align : 'center'},              
              {text : "单据编号" , dataIndex : 'sequenceNum', sortable : true, width : 120, align : 'center',
                    summaryType : 'count', 
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '单据总数  :  ' + value;
                    }                 
              },
              {text : "单据状态" , dataIndex : 'state', sortable : true, width : 100, align : 'center',
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
                {text : "客户名称" , dataIndex : 'custName', sortable : true, width : 150, align : 'center'},
                {text : "订单/销货单" , dataIndex : 'saleVchSeqNum', sortable : true, width : 150, align : 'center'},       
              {text : "结算货币" , dataIndex : 'currencyName',  width : 100, align : 'center'},
              {text : "收款金额" , dataIndex : 'totalAmount', sortable : true, width : 150, align : 'center',
                    renderer:function(data, cell, record, rowIndex,columnIndex, store)
                    {
                        var currency = record.get('currencyName');
                       
                        if(currency === '美元')
                            return Ext.util.Format.usMoney(data);
                            
                        return Ext.util.Format.currency(data, '¥');
                    }              
              },  
              {text : "负责人" , dataIndex : 'rspEmpName', sortable : true, width : 100, align : 'center'},
              {text : "审核人" , dataIndex : 'auditEmpName', sortable : true, width : 100, align : 'center'},
              {text : "审核日期" , dataIndex : 'approvedTime', filter:true,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 100, align : 'center'},
              {text : "备注" , dataIndex : 'notes', sortable : true,  align : 'center',flex:1}
              ]
        }); 
        
        this.callParent(arguments); 
    },   
    openDetailsWin : function(id)
    {    
        smartOA.util.genWindow({
                loader: {
                url: 'accountMgt/editReceiptVch.js',
                autoLoad: true,
                scripts:true
            },
            title: '收款单',
            initId : id,
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

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    
    var framePanel = Ext.create('smartOA.accountMgt.ReceiptVoucherListPanel');       

    if (mainPanel) {
        mainPanel.getActiveTab().add(framePanel);
        mainPanel.getActiveTab().doLayout();
    } else {
        var vp = new Ext.Viewport({layout:'fit', items:[framePanel]});
    } 
});
//</script>