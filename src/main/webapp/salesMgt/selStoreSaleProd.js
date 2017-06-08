<script type="text/javascript">

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
                 {name: 'qtyInStore',  type: 'float'}
     ]
 });

Ext.define("smartOA.salesMgt.selectCustProdGridPanel",
{   
    extend : "Ext.grid.Panel",
    parentStore : ' ',
    exchangeRate: 1,
    constructor : function()
    {                   
        var myStore = Ext.create('Ext.data.Store', {
            model : 'ProdMtItem',
            proxy: {
                type: 'ajax',
                url: "manuMgt/loadSlbProdMtItemByCtg.action",
                extraParams : {'ctgId': 1},
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
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : '', dataIndex:'mtItemId', hidden: true},
              {text : "产品目录" , dataIndex : 'ctgName', filter:true, sortable : true, width : 100, align : 'center',filterable: true
              },
              {text : "基准售价" , dataIndex : 'stdUnitPrice',  width : 100, align : 'center'             
              },              
              {text : "物料号" , dataIndex : 'mtNum', filter:true, sortable : true, width : 150, align : 'center',filterable: true
              },
              {text : "物料名称" , dataIndex : 'mtName', sortable : true, width : 200, align : 'center',filterable: true}, 
              {text : "单位" , dataIndex : 'unit', sortable : true, width : 80, align : 'center'},    
              {text : "库存数量" , dataIndex : 'qtyInStore', sortable : true, width : 100, align : 'center'},             
              {text : "定制订单号" , dataIndex : 'orderSeqNum',  width : 120, align : 'center', filter:true},
              {text : "定制色号" , dataIndex : 'colorModel',  width : 100, align : 'center'},
              {text : '包装方式', dataIndex : 'packageModel',  width : 150, align : 'center'}
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
               }],
            features:[
            {
                ftype : 'searching',
                minChars : 2,
                width : 100,
                position : 'top',
                iconCls: 'Zoom',
                menuStyle: 'radio',
                showSelectAll : false,
                checkIndexes: ['modelNum'],
                align : 'right',
                mode : 'local'
            },
            {
                ftype: 'filters',
                local: true      
            }]                
        });

        this.callParent(arguments);
    },
    saveAndReturn: function()
    {
        var records = this.getSelectionModel().getSelection();
        if(records.length < 1)
        {
             Ext.Msg.alert('提醒', '请先选择数据行!');
             return;
        }        
        
        var convRecords = new Array();
        for(var rec in records)
        {
            var data = records[rec].data;
            
            for(var i =0; i<this.parentStore.getCount(); i++)
            {
                var oldRec = this.parentStore.getAt(i).getData();
                
                if(data.mtItemId === oldRec.mtItemId)
                {
                    Ext.Msg.alert('提醒', data.name +' 已经存在, 请不要重复选择');
                    return;
                }
            }

            var convRec = {mtItemId:data.mtItemId, modelNum:data.modelNum, subModelNum:data.subModelNum, unit:data.unit, 
                                mtNum:data.mtNum, colorModel:data.colorModel, packageModel:data.packageModel,
                                ctgName:data.ctgName, unitPrice: data.stdUnitPrice/this.exchangeRate};
            convRecords.push(convRec);
        }                
        if(this.parentStore.getCount() == 1 && this.parentStore.getAt(0).data.modelNum == '')
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
    
/*    var ctgPanel = Ext.create('smartOA.Util.GeneTreePanel',{
            loadUrl : 'basicElem/loadProdCtgTree.action',
            editJs : 'basicElem/editProdCtg.js',
            delUrl : 'basicElem/delProdCtg.action',
            itemName : '产品目录',
            region : 'west',
            width: 200,
            collapsible: true,
            resizable : true,
            layout: 'fit',
            title : '产品目录'
    });
    
    var prodListPanel = Ext.create('smartOA.basicElem.selectProductGridPanel',
    {
        region: 'center',
        layout: 'fit'
    });
    
    var framePanel = Ext.create('Ext.panel.Panel',
            {
                layout : 'border',
                items : [ctgPanel, prodListPanel]
            });    
            
    ctgPanel.on('itemclick', function(object,record)
    {
        var data = record.getData();
        
        var proxy = prodListPanel.getStore().getProxy();
        
        Ext.apply(proxy, {
        url : 'basicElem/loadProductByCtg.action',
        extraParams : {'ctgId': data.id}
        });
        
        prodListPanel.refresh();
    }
    );             
*/  
    var win = Ext.WindowMgr.getActive();    
    
    var framePanel = Ext.create('smartOA.salesMgt.selectCustProdGridPanel',
                        {
                            parentStore : win.store,
                            exchangeRate : win.exchangeRate
                        });
//    var vp = new Ext.Viewport({layout:'fit', items:[framePanel]});

    win.add(framePanel);
    win.doLayout(); 

});

</script>