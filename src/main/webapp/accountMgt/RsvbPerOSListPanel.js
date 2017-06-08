//<script type="text/javascript">

Ext.define("accountMgt.RsvbPerOSListPanel",
{   
    extend : "smartOA.commonClass.DateRangeGridPanel",
    constructor : function(conf)
    { 
        
        Ext.define('RsvbVoucher',{
             extend : 'Ext.data.Model',
            fields: [
                 {name: 'vchId', type: 'int'},
                 {name: 'accountEmpName'},
                 {name: 'saleVchRspEmpName'},
                 {name: 'createdDate', type:'date', dateFormat: 'Y-m-d'},
                 {name: 'osVoucherSeqNum'},
                 {name: 'custName'},
                 {name: 'saleVchSeqNum'},
                 {name: 'currencyName'},         
                 {name: 'remainedAmount', type: 'float'},
                 {name: 'totalAmount', type: 'float'},
                 {name: 'deadlineDate', type:'date', dateFormat: 'Y-m-d'},
                 {name: 'paidOffDate', type:'date', dateFormat: 'Y-m-d'},
                 {name: 'dateOfOverDue', type:'int'},
                 {name: 'notes'}
            ]         
        }  
        );        
        
        Ext.apply(this, {         
            loadUrl: conf.loadUrl,
            editUrl: '',
            dataModel: 'RsvbVoucher', 
            searchField: 'osVoucherSeqNum',
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : '', dataIndex:'vchId', hidden: true},
              {text : "出库单编号" , dataIndex : 'osVoucherSeqNum', sortable : true, width : 120, align : 'center',
                    summaryType : 'count', 
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '单据数  :  ' + value;
                    }                 
              },
              {text : "出库日期" , dataIndex : 'createdDate', filter:true,
                    renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 100, align : 'center'},
              {text : "客户名称" , dataIndex : 'custName', sortable : true, width : 150, align : 'center'},
              {text : "订单/销货单" , dataIndex : 'saleVchSeqNum', sortable : true, width : 120, align : 'center'},             
              {text : "结算货币" , dataIndex : 'currencyName', sortable : true, width : 100, align : 'center'
              },
              {text : "应收总金额" , dataIndex : 'totalAmount', sortable : true, width : 150, align : 'center',
                    summaryType : 'sum', 
                    renderer:function(data, cell, record, rowIndex,columnIndex, store)
                    {
                        var currency = record.get('currencyName');
                       
                        if(currency === '美元')
                            return Ext.util.Format.usMoney(data);
                            
                        return Ext.util.Format.currency(data, '¥');
                    }              
              },
              {text : "剩余应收金额" , dataIndex : 'remainedAmount', sortable : true, width : 150, align : 'center',
                    summaryType : 'sum', 
                    renderer:function(data, cell, record, rowIndex,columnIndex, store)
                    {
                        var currency = record.get('currencyName');
                       
                        if(currency === '人民币')
                        {
                            if(data > 0)
                                return "<p style='color:red'>"+Ext.util.Format.currency(data, '¥')+"</p>";
                            else
                                return Ext.util.Format.currency(data, '¥');
                        }

                        if(data > 0)
                            return "<p style='color:red'>"+Ext.util.Format.usMoney(data)+"</p>";
                        else
                            return Ext.util.Format.usMoney(data);                            
                    }              
              },
              {text : "付款期限" , dataIndex : 'deadlineDate', filter:true,
                renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 100, align : 'center'},
              {text : "尾款实到日期" , dataIndex : 'paidOffDate', filter:true,
                renderer: Ext.util.Format.dateRenderer('Y-m-d'),sortable : true, width : 100, align : 'center'},
              {text : "尾款剩余天数" , dataIndex : 'dateOfOverDue', sortable : true, width : 100, align : 'center',filter:true,
                    renderer:function(data)
                    {
                        if(data < 0)
                        {
                            return "<p style='color:red'>"+data+"</p>";
                        }else
                            return "<p style='color:green'>"+data+"</p>";
                    }   
              },  
              {text : "财务负责人" , dataIndex : 'accountEmpName', sortable : true, width : 100, align : 'center'},
              {text : "业务负责人" , dataIndex : 'saleVchRspEmpName', sortable : true, width : 100, align : 'center'},
              {text : "备注" , dataIndex : 'notes', sortable : true, width : 100, align : 'center',flex:1}  
              ]           
        });
        
        this.callParent(arguments);
        
        var tbar = this.getDockedItems('toolbar[dock="top"]')[0];
        
        tbar.insert(0,{
                    text: mbLocale.editItem,
                    icon :'images/application_edit.png',
                    iconCls :'delete-icon',
                    handler: this.edit,
                    scope: this
                });      
         
    },
    listeners:{
        itemdblclick : function(view, record, item, index, e)
        {      
            this.edit();
        }
    },
    edit : function()
    {
        var selection = this.getSelectionModel().getSelection();
        
        if(selection.length == 0 )
        {
            Ext.Msg.alert("错误", "请选择要编辑的单据");
            return;
        }       

        this.openDetailsWin(selection[0].raw.vchId);              
    },
    openDetailsWin : function(id)
    {
             smartOA.util.genWindow({
                    title    : '应收款单',
                    loader: {
                            url: 'accountMgt/editRsvbPerOS.js',
                            autoLoad: true,
                            scripts:true
                        },
                    width    : 800,
                    height   : 200,
                    maximizable: true,
                    modal: true,
                    layout   : 'fit',
                    resizable: true,
                    initId : id,
                    store : this.store
                });         
    }
});
//</script>