
Ext.define("accountMgt.CustReportPanel",
{   
    extend : "smartOA.commonClass.DateRangeGridPanel",
    criteraId: 1,
    constructor : function(conf)
    {             
        Ext.apply(this, {      
            loadUrl: conf.loadUrl,
            startDateByMonth: true ,
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 50, header: '序号'},
              {text : '客户区域',  sortable : true, width : 100, align : 'center'},
              {text : '客户名称',  filter:true, sortable : true, width : 150, align : 'center'},
              {text : '结算货币',  filter:true, sortable : true, width : 80, align : 'center'},
              {text : "销售总金额" , width : 150, align : 'center'},
              {text : "销售总金额(¥)" , width : 150, align : 'center'},
              {text : "退货总金额" , width : 150, align : 'center'},
              {text : "退货总金额(¥)" , width : 150, align : 'center'}            
              ],            
            selType: 'rowmodel'
        });
        
        this.callParent(arguments);
    },
    loadData: function()
    {
        var gridPanel = this;
        
        var startDate = gridPanel.down('field[name=startdt]').getValue();
        var endDate = gridPanel.down('field[name=enddt]').getValue();

        if(endDate.getTime() < startDate.getTime())
        {
            Ext.Msg.alert("请重新选择时间", "  结束日期不能小于开始日期!");
            return;
        }
        
        if((endDate.getFullYear() - startDate.getFullYear()) > 1)
         {
            Ext.Msg.alert("请重新选择时间", "  不支持大于一年的多月报表!");
            return;
        }       
        
        var field = [
                 {name: 'areaName'},
                 {name: 'custName'},
                 {name: 'currencyName'},
                 {name: 'totalAmount', type: 'float'},
                 {name: 'totalAmountInCn', type: 'float'},
                 {name: 'totalRefundAmount', type: 'float'},
                 {name: 'totalRefundAmountInCn', type: 'float'}                 
            ];
        var moneyRendererFun = function(data, cell, record, rowIndex,columnIndex, store)
                            {
                                var currency = record.get('currencyName');
                               
                                if(currency === '美元')
                                    return Ext.util.Format.usMoney(data);
                                    
                                return Ext.util.Format.currency(data, '¥');
                            };
                    
        var columns = [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 50, header: '序号'},
              {text : '客户区域',  dataIndex:'areaName', sortable : true, width : 100, align : 'center'},
              {text : '客户名称',  dataIndex:'custName',filter:true, sortable : true, width : 150, align : 'center'},
              {text : '结算货币',  dataIndex:'currencyName',filter:true, sortable : true, width : 80, align : 'center'},
              {text : "销售总金额" , dataIndex : 'totalAmount', width : 150, align : 'center', renderer:moneyRendererFun},            
              {text : "销售总金额(¥)" , dataIndex : 'totalAmountInCn', width : 150, align : 'center',summaryType: 'sum',
                    renderer:function(value)
                    {
                        return Ext.util.Format.currency(value, '¥');
                    },
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return "<p style='color:red'>"+((value === 0 || value > 1) ?  Ext.util.Format.currency(value, '¥')  : 0)+"</p>";
                    }                      
              },
              {text : "退货总金额" , dataIndex : 'totalRefundAmount', width : 150, align : 'center', renderer:moneyRendererFun},            
              {text : "退货总金额(¥)" , dataIndex : 'totalRefundAmountInCn', width : 150, align : 'center',summaryType: 'sum',
                    renderer:function(value)
                    {
                        return Ext.util.Format.currency(value, '¥');
                    },
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return "<p style='color:red'>"+((value === 0 || value > 1) ?  Ext.util.Format.currency(value, '¥')  : 0)+"</p>";
                    }                      
              }              
              ];        
        
        var index = 0;
        var date = new Date(startDate);
        while(date.getTime() < endDate.getTime())
        {
            var startMonth = date.getMonth();

            if(date.getDate() != 1)
            {
                if(startMonth == 11)
                {
                    date.setFullYear(date.getFullYear()+1);
                    date.setMonth(0);
                }else
                {
                    date.setMonth(startMonth+1);
                }
            }
            
            var dateText = date.getFullYear() + '-' + (date.getMonth()+1);
            var rendererFun =function(value)
                    {
                        return Ext.util.Format.currency(value, '¥');
                    };
            columns.splice(-4,0, {text : dateText+'金额' , dataIndex : 'amount'+index, width : 150, align : 'center', renderer:moneyRendererFun});
            field.push({name: 'amount'+index, type: 'float'});
            
            if(date.getDate() == 1)
            {
                if(startMonth == 11)
                {
                    date.setFullYear(date.getFullYear()+1);
                    date.setMonth(0);
                }else
                {
                    date.setMonth(startMonth+1);
                }    
            }
            index++;
        }
        
        var myStore = Ext.create('Ext.data.Store', {
            fields : field,            
            proxy: {
                type: 'ajax',
                url: this.loadUrl,
                reader: {
                    type: 'json'
                },
                extraParams : {'criteraId':this.criteraId, 'startDate':Ext.util.Format.date(startDate, 'Y-m-d'), 
                'endDate':Ext.util.Format.date(endDate, 'Y-m-d')}                
            },
            autoLoad : false,
            autoSync: false
        }); 
        
        gridPanel.reconfigure(myStore, columns);
        myStore.reload();
    }
    
});