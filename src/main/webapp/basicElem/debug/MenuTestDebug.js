
Ext.namespace("smartOA.basicElem.framework");


Ext.define('smartOA.basicElem.framework.Product', {
     extend: 'Ext.data.Model',
     fields: [
         {name: 'id', type: 'int'},
         {name: 'cost', type: 'number'},
         {name: 'description',  type: 'string'},
         {name: 'maxPrice',  type: 'number'},
         {name: 'minPrice',  type: 'number'},
         {name: 'modelNum',  type: 'string'},
         {name: 'name',  type: 'string'},
         {name: 'category',  type: 'string'},
         {name: 'unit', type: 'string'},
         {name: 'type', type: 'string'}
     ]
 });

Ext.define("smartOA.basicElem.framework.ProductListGridPanel",
{   
    extend : "Ext.grid.Panel",
    mytile : '产品列表',
    constructor : function()
    {              	  	
        var myStore = Ext.create('Ext.data.Store', {
            model : 'smartOA.basicElem.framework.Product',
            data:{'lists':[
                {'id': 1, 'cost': 5.55, 'description':'  ', "maxPrice":6.77,  "minPrice":6.33, 'modelNum':'TR54345435',
                'name' : '米奇三轮车', 'category' : '三轮车', 'unit' : '辆', 'type' : '销售类'}, 
                {'id': 2, 'cost': 5.55, 'description':'  ', "maxPrice":6.77,  "minPrice":6.33, 'modelNum':'TR54345436',
                'name' : '麦昆三轮车', 'category' : '三轮车', 'unit' : '辆', 'type' : '销售类'}, 
                {'id': 3, 'cost': 5.55, 'description':'  ', "maxPrice":6.77,  "minPrice":6.33, 'modelNum':'TR54345437',
                'name' : '老鼠三轮车', 'category' : '三轮车', 'unit' : '辆', 'type' : '销售类'}
            ]},
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        });
               
    	Ext.apply(this, {
    	
    		title : this.mytile,
    		autoScroll:true,
            frame : true,
    		store : myStore,
    		columns: [
    		  {xtype: 'rownumberer'},
    		  {text : '', dataIndex:'id', hidden: true},
    		  {text : "产品型号" , dataIndex : 'modelNum', sortable : true, width : 180, align : 'center'},
    		  {text : "产品名称" , dataIndex : 'name', sortable : true, width : 150, align : 'center'},
              {text : "产品类别" , dataIndex : 'category', sortable : true, width : 150, align : 'center'},
              {text : "产品性质" , dataIndex : 'type', sortable : true, width : 100, align : 'center'},
              {text : "成本" , dataIndex : 'cost', sortable : true, width : 100, align : 'center',
                renderer: Ext.util.Format.cnMoney},
              {text : "最高售价" , dataIndex : 'maxPrice', sortable : true, width : 100, align : 'center',
                renderer: Ext.util.Format.cnMoney},
              {text : "最低售价" , dataIndex : 'minPrice', sortable : true, width : 100, align : 'center',
                renderer: Ext.util.Format.cnMoney},                
              {text : "产品描述" , dataIndex : 'description', sortable : true, flex : true, align : 'center'}
              ],    		
            selType: 'rowmodel',
            tbar: [{
                    text:mbLocale.addNewItem,
                    icon :'images/add.png',
                    iconCls :'add-icon',
                    handler: this.addNew,
                    scope: this
               },{
                    text: mbLocale.editItem,
                    icon :'images/application_edit.png',
                    iconCls :'delete-icon',
                    handler: this.edit,
                    scope: this
                },
                {
                    text: mbLocale.deleteItem,
                    icon :'images/cross.png',
                    iconCls :'save-icon',
                    handler: this.delSelected,
                    scope: this
                },
                {
                    text: mbLocale.refreshPage,
                    icon :'images/arrow_refresh.png',
                    iconCls :'save-icon',
                    handler: this.refresh,
                    scope: this
                }
                ],
                bbar: new Ext.PagingToolbar(
                {
                    store : myStore,
                    pageSize : 1                    
                }),
                features:[
                {
                    ftype : 'searching',
                    minChars : 2,
                    width : 100,
                    position : 'top',
                    iconCls: 'Zoom',
                    menuStyle: 'radio',
                    showSelectAll : false,
                    checkIndexes: ['name'],
                    align : 'right',
                    mode : 'local'
                }
                ]
    	});
    	
    	console.log("constructor");
        this.callParent(arguments);
    },
    addNew : function()
    {
         var win = smartOA.util.genWindow({
                title    : '产品设置',
                loader: {
                        url: 'basicElem/editProduct.js',
                        autoLoad: true,
                        scripts:true
                    },
                width    : 420,
                height   : 540,
                maximizable: true,
                layout   : 'fit',
                resizable: true,
                initId : 0
            });
    },
    edit : function()
    {
        
    },
    delSelected : function()
    {
        var model = this.getSelectionModel( );
        var selection = model.getSelection();
        if(selection.length == 0 )
        {
            Ext.Msg.alert("错误", "请选择要删除的员工信息");
            return;
        }
        
        var emp = selection[0].raw;
        
        var delDeptFun = function(buttonId, text, opt)
        {
            if(buttonId == "yes")
            {
                smartOA.util.ajaxRequest(
                {
                    url : 'basicElem/delEmpGenInfo.action',
                    params : {'id': emp.id},
                    success : function(r, o)
                    {
                        this.store.reload();
                    }
                }, this
                );
                
            }
        };
        
        Ext.Msg.show(
        {
           title : mbLocale.infoMsg,
           msg : mbLocale.delConfirmMsg,
           buttons : Ext.Msg.YESNO,
           scope : this,
           fn  : delDeptFun,
           icon :Ext.MessageBox.QUESTION
        });    	
    },
    refresh: function()
    {
    	this.store.reload();
    }
}
    
);

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side'
    
    console.log("onready" +
            "");

    var toolbar = Ext.create('Ext.toolbar.Toolbar', {
    renderTo: document.body,
    width   : 500,
    items: [
        {
            // xtype: 'button', // default for Toolbars
            text: 'Button'
        },
        {
            xtype: 'splitbutton',
            text : 'Split Button'
        },
        // begin using the right-justified button container
        '->', // same as { xtype: 'tbfill' }
        {
            xtype    : 'textfield',
            name     : 'field1',
            emptyText: 'enter search term'
        },
        // add a vertical separator bar between toolbar items
        '-', // same as {xtype: 'tbseparator'} to create Ext.toolbar.Separator
        'text 1', // same as {xtype: 'tbtext', text: 'text1'} to create Ext.toolbar.TextItem
        { xtype: 'tbspacer' },// same as ' ' to create Ext.toolbar.Spacer
        'text 2',
        { xtype: 'tbspacer', width: 50 }, // add a 50px space
        'text 3'
    ]
   });              
            
    var panel = Ext.create('smartOA.basicElem.framework.ProductListGridPanel');
   
    var vp = new Ext.Viewport({layout:'fit', items:[toolBar, panel]});

});
