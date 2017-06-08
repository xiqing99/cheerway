//<script type="text/javascript">

Ext.define("accountMgt.SaleableProdList",
{   
    extend : "Ext.grid.Panel",
    constructor : function()
    {                                    
        Ext.define('ProdMtItem', {
             extend: 'Ext.data.Model',
             fields: [
                 {name: 'mtItemId', type: 'int'},
                 {name: 'mtNum'},
                 {name: 'mtName'},
                 {name: 'unit'},
                 {name: 'mtDscp'},
                 {name: 'stdUnitPrice', type:'float'},                                 
                 {name: 'modelNum',  type: 'string'},
                 {name: 'subModelNum',  type: 'string'},
                 {name: 'orderSeqNum'},
                 {name: 'colorModel'},  
                 {name: 'packageModel'},
                 {name: 'custModelNum'},
                 {name: 'ctgName'},
                 {name: 'qtyInStore',  type: 'float'},
                 {name: 'saleable', type: 'boolean'}
             ]
         });        
 
          var myStore = Ext.create('Ext.data.Store', {
             model: 'ProdMtItem',
             proxy: {
                 type: 'ajax',
                 url: "manuMgt/loadSlbProdMtItemByCtg.action",
                 extraParams : {'ctgId': 1},
                 reader: {
                     type: 'json',
                     root: 'lists'
                 }
             },
             autoLoad: false,
             autoSync: false
         });          
         
         
        Ext.apply(this, {      
            autoScroll:true,
            columnLines : true,
            frame : false, 
            store : myStore,  
            flex:1,
            columns: [            
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},        
              {text : '', dataIndex:'mtItemId', hidden: true},
              {text : "产品目录" , dataIndex : 'ctgName', filter:true, sortable : true, width : 100, align : 'center',filterable: true
              },
              {text : "在售" , dataIndex : 'saleable', width : 80, align : 'center',
                    editor : {
                    xtype : 'checkboxfield',
                    allowBlank : false,
                    name: 'saleable',
                    boxLabel: '可售'
                    },
                    renderer: function(data)
                    {
                        if(data == true)
                            return '是';
                        else
                            return '否';
                    }
              },  
              {text : "基准售价" , dataIndex : 'stdUnitPrice',  width : 100, align : 'center',
                   editor : {
                    xtype : 'numberfield',
                    allowBlank : false,
                    name: 'stdUnitPrice',
                    renderer:function(value)
                    {
                        return Ext.util.Format.currency(value, '¥');

                    }
                   }              
              },              
              {text : "物料号" , dataIndex : 'mtNum', filter:true, sortable : true, width : 150, align : 'center',filterable: true
              },
              {text : "物料名称" , dataIndex : 'mtName', sortable : true, width : 200, align : 'center',filterable: true           
              }, 
              {text : "单位" , dataIndex : 'unit', sortable : true, width : 80, align : 'center'},    
              {text : "库存数量" , dataIndex : 'qtyInStore', sortable : true, width : 100, align : 'center'},             
              {text : "定制订单号" , dataIndex : 'orderSeqNum',  width : 120, align : 'center', filter:true},
              {text : "定制色号" , dataIndex : 'colorModel',  width : 100, align : 'center'},
              {text : '包装方式', dataIndex : 'packageModel',  width : 150, align : 'center'},
              {text : "客户型号" , dataIndex : 'custModelNum',  width : 100, align : 'center'}, 
              {text : "物料说明" , dataIndex : 'mtDscp',  flex:1, align : 'center'}              
              ],    
            plugins: [
                Ext.create('Ext.grid.plugin.RowEditing', {
                triggerEvent: 'celldblclick',
                autoCancel: false,
                pluginId : 'rowEditPlugin'
                })
            ],              
            selType: 'rowmodel',
            features:[
                {
                    ftype : 'searching',
                    minChars : 2,
                    width : 100,
                    position : 'top',
                    iconCls: 'Zoom',
                    menuStyle: 'radio',
                    showSelectAll : false,
                    checkIndexes: ['mtNum'],
                    align : 'right',
                    mode : 'local'
                },
                {
                    ftype: 'filters',
                    local: true      
                } 
            ],
            tbar: [{
                    text: "修改",
                    icon :'images/application_edit.png',
                    iconCls :'delete-icon',
                    handler: this.edit,
                    scope: this
                },
                {
                    text: '在售列表',
                    icon :'images/accept.png',
                    iconCls :'save-icon',
                    handler: this.refresh,
                    scope: this
                },
                {
                    text: '停售列表',
                    icon :'images/cross.png',
                    iconCls :'save-icon',
                    handler: this.loadUnsaleable,
                    scope: this
                },
                {
                    text: '导出到Excel',
                    icon :'images/arrow_refresh.png',
                    iconCls :'save-icon',
                    handler: function(btn)
                    {
                       btn.up('grid').downloadExcelXml(); 
                    }
                },
                {
                    text: '打印表单',
                    icon :'images/printer.png',
                    iconCls :'save-icon',
                    handler: function(btn)
                    {
                       var grid = btn.up('grid');
                       Ext.ux.grid.Printer.printAutomatically = false;
                       Ext.ux.grid.Printer.print(grid);
                    }
                }                
            ]                 
            
        });
        
        this.callParent(arguments);
        this.regSaveFun();
    },
    regSaveFun : function()
    {
        var rowEditor = this.getPlugin('rowEditPlugin');
        
        rowEditor.on('edit', function(editor, context, e) {
            context.record.commit();
            var data = context.record.data;         
            
            smartOA.util.ajaxRequest(
            {
                url : 'manuMgt/updSaleableInfo.action',
                params : {'id': data.mtItemId, 'saleable':data.saleable,'stdUnitPrice':data.stdUnitPrice},
                success : function(r, o)
                {
                    Ext.Msg.alert('成功', '保存成功');
//                    this.getCmp().refresh();
                }
            }, this
            );                 
            });
    },
    edit : function()
    {
        var rowEditor = this.getPlugin('rowEditPlugin');
        
        var selection = this.getSelectionModel().getSelection();
        if(selection.length == 0 )
        {
            Ext.Msg.alert("错误", "请选择要编辑的行");
            return;
        }        
        
        rowEditor.startEdit(selection[0].index, 0);        
    },
    refresh: function()
    {
        var proxy = this.store.getProxy();
        
        Ext.apply(proxy, {
                 url: "manuMgt/loadSlbProdMtItemByCtg.action",
                 extraParams : {'ctgId': 1}
        });
        
        this.store.reload();    
    },
    loadUnsaleable: function()
    {
        var proxy = this.store.getProxy();
        
        Ext.apply(proxy, {
        url : 'manuMgt/loadUnsaleableProdMtItem.action',
        extraParams : {}
        });
        
        this.store.reload();        
    }
});

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';            
 
    var prodListPanel = Ext.create('accountMgt.SaleableProdList');       
    
    if (mainPanel) {
        mainPanel.getActiveTab().add(prodListPanel);
        mainPanel.getActiveTab().doLayout();
    } else {
        var vp = new Ext.Viewport({layout:'fit', items:[prodListPanel]});
    }
         
});
//</script>