
Ext.define("salesMgt.SalesReportPerProdPanel",
{   
    extend : "smartOA.commonClass.DateRangeGridPanel",
    constructor : function()
    {                                    
        
        Ext.apply(this, {      
            startDateByMonth: true,
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : "产品类别" , dataIndex : 'prodCtgName', sortable : true, width : 120, align : 'center'},
              {text : "产品型号" , dataIndex : 'prodModelNum', filter:true, sortable : true, width : 120, align : 'center', filterable: true},
              {text : "子型号" , dataIndex : 'subModelNum', filter:true, sortable : true, width : 120, align : 'center', filterable: true},
              {text : "产品单位" , dataIndex : 'prodUnit', width : 100, align : 'center'},
              {text : "总数量" , dataIndex : 'totalAmount', sortable : true, width : 150, align : 'center',filterable: true
              },
              {text : "总金额(¥)" , dataIndex : 'priceTotalAmount', sortable : true, filter:true, width : 150, align : 'center'
              }
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
                 {name: 'prodCtgName'},
                 {name: 'prodModelNum'},
                 {name: 'subModelNum'},
                 {name: 'prodUnit'},
                 {name: 'totalAmount', type: 'float'},
                 {name: 'priceTotalAmount', type: 'float'}
            ];
  
        var columns = [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : "产品类别" , dataIndex : 'prodCtgName', sortable : true, width : 100, align : 'center'},
              {text : "产品型号" , dataIndex : 'prodModelNum', filter:true, sortable : true, width : 100, align : 'center', filterable: true},
              {text : "子型号" , dataIndex : 'subModelNum', filter:true, sortable : true, width : 150, align : 'center', filterable: true},              
              {text : "产品单位" , dataIndex : 'prodUnit', width : 80, align : 'center'},
              {text : "总数量" , dataIndex : 'totalAmount', sortable : true, width : 150, align : 'center',filterable: true, summaryType: 'sum',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return "<p style='color:red'>"+ value +"</p>";
                    }               
              },
              {text : "总金额(¥)" , dataIndex : 'priceTotalAmount', sortable : true, filter:true, width : 150, align : 'center',summaryType: 'sum',
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
            columns.splice(-2,0, {text : dateText+'数量' , dataIndex : 'amount'+index, width : 150, summaryType: 'sum', align : 'center',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return "<p style='color:red'>"+ value +"</p>";
                    } 
            });
            columns.splice(-2,0, {text : dateText+'金额(¥)' , dataIndex : 'priceAmount'+index, width : 150, summaryType: 'sum', align : 'center',
                        renderer:function(value)
                        {
                            return Ext.util.Format.currency(value, '¥');
                        },
                        summaryRenderer: function(value, summaryData, dataIndex) {
                            return "<p style='color:red'>"+((value === 0 || value > 1) ?  Ext.util.Format.currency(value, '¥')  : 0)+"</p>";
                        }
                    });
            field.push({name: 'amount'+index, type: 'float'});
            field.push({name: 'priceAmount'+index, type: 'float'});
            
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
                extraParams : {'startDate':Ext.util.Format.date(startDate, 'Y-m-d'), 
                'endDate':Ext.util.Format.date(endDate, 'Y-m-d')}                
            },
            autoLoad : false,
            autoSync: false
        }); 
        
        gridPanel.reconfigure(myStore, columns);
        myStore.reload();
    }
    
});