
Ext.namespace("smartOA.basicElem.framework");


Ext.define('smartOA.basicElem.framework.EmpGenInfo', {
     extend: 'Ext.data.Model',
     fields: [
         {name: 'id', type: 'int'},
         {name: 'name', type: 'string'},
         {name: 'email',  type: 'string'},
         {name: 'extNum',  type: 'string'},
         {name: 'mobileNum',  type: 'string'},
         {name: 'qq',  type: 'string'},
         {name: 'deptId',  type: 'int'},
         {name: 'posId',  type: 'int'}
     ]
 });

Ext.define("smartOA.basicElem.framework.EmpGenInfoGridPanel",
{   
    extend : "Ext.grid.Panel",
    mytile : '员工基本信息',
    constructor : function()
    {              	
/*         var myStore = Ext.create('Ext.data.Store', {
             model: 'smartOA.basicElem.framework.EmpGenInfo',
             proxy: {
                 type: 'ajax',
                 url: 'basicElem/loadAllEmpGenInfo.action',
                 reader: {
                     type: 'json',
                     root: 'lists'
                 }
             },
             autoLoad: true
         });    
 */   	
        var myStore = Ext.create('Ext.data.Store', {
            model : 'smartOA.basicElem.framework.EmpGenInfo',
            data:{'lists':[
                {'id': 1, 'name': 'Lisa', 'extNum':'2345', "email":"lisa@simpsons.com",  "mobileNum":"555-111-1224", 'qq':'54345435',
                'deptId' : 2, 'posId' : 2}, 
                {'id': 2, 'name': 'Bart', 'extNum':'2345', "email":"bart@simpsons.com",  "mobileNum":"555-222-1234", 'qq':'54345435' },
                {'id': 3, 'name': 'Homer', 'extNum':'2345',"email":"home@simpsons.com",  "mobileNum":"555-222-1244"  },
                {'id': 4, 'name': 'Marge', 'extNum':'2345', 'email':'marge@simpsons.com', "mobileNum":"555-222-1254"  }
            ]},
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        });
        
    var deptData = {
        lists: [
        {
            id : '1',
            name : '公司'           
        },
         {
            id : '2',
            name : '生产部'
        },
         {
            id : '3',
            name : '业务部'
        }        
        ]};
        
        var deptStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'memory',
                data: deptData,
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        });        
        
        var deptCombo = Ext.create('Ext.form.ComboBox',
        {
            valueField: "id",
            displayField: "name",
            store: deptStore,
            triggerAction :'all',
            lazyRender:false
 //           forceSelection: true,
//            allowBlank:false,
 //           editable:false,
 //           emptyText:'部门'
        });
  
    var posData = {
        lists: [
        {
            id : '1',
            name : '业务员'           
        },
         {
            id : '2',
            name : '业务经理'
        },
         {
            id : '3',
            name : '秘书'
        }        
        ]};
        
        var posStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'memory',
                data: posData,
                reader: {
                    type: 'json',
                    root: 'lists'
                }
            }
        });        
        
        var posCombo = Ext.create('Ext.form.ComboBox',
        {
            valueField: "id",
            displayField: "name",
            store: posStore,
            triggerAction :'all',
            lazyRender:false,
//            forceSelection: true,
            allowBlank:false,
            editable:false
        });        
        
       var comboBoxRenderer = function(combo) {
            return function(value) {
                var idx = combo.store.find(combo.valueField, value);
                var rec = combo.store.getAt(idx);
                return (rec === null ? value : rec.get(combo.displayField) );
        
            };
        };
        
    	Ext.apply(this, {
    	
    		title : this.mytile,
    		autoScroll:true,
    		store : myStore,
    		columns: [
    		  {xtype: 'rownumberer'},
    		  {text : '', dataIndex:'id', hidden: true},
    		  {text : "姓名" , dataIndex : 'name', sortable : true, width : 100, align : 'center',
    		      editor : {
    		      	xtype : 'textfield',
    		      	allowBlank : false
    		      }
    		  },
    		  {text : "邮箱" , dataIndex : 'email', sortable : true, width : 180, align : 'center',
    		        editor : {
                    xtype : 'textfield',
                    allowBlank : true
                  }
    		  },
              {text : "分机号" , dataIndex : 'extNum', sortable : true, width : 80, align : 'center',
                    editor : {
                    xtype : 'textfield',
                    allowBlank : true
                  }
              },
              {text : "手机号" , dataIndex : 'mobileNum', sortable : true, width : 150, align : 'center',
                    editor : {
                    xtype : 'textfield',
                    allowBlank : false
                  }
              },
              {text : "QQ" , dataIndex : 'qq', sortable : true, width : 100, align : 'center',
                    editor : {
                    xtype : 'textfield',
                    allowBlank : true
                  }
              },
              {text : "部门" , dataIndex : 'deptId', sortable : true, width : 150, align : 'center',
                   editor : deptCombo,
                   renderer : comboBoxRenderer(deptCombo)
              },
              {text : "职位" , dataIndex : 'posId', sortable : true, width : 150, align : 'center',
                   editor : posCombo,
                   renderer : comboBoxRenderer(posCombo)
              }],
    		
    		plugins: [
                Ext.create('Ext.grid.plugin.RowEditing', {
                triggerEvent: 'celldblclick',
                autoCancel: false,
                pluginId : 'rowEditPlugin'
                })
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
        this.regSaveFun();
    },
    addNew : function()
    {
    	var rowEditor = this.getPlugin('rowEditPlugin');
    	
    	rowEditor.cancelEdit();
    	
    	var record = Ext.create('smartOA.basicElem.framework.EmpGenInfo', {
    	   id : 0,
    	   name : '',
           deptId: 1,
           posId : 1
    	});
    	
    	this.getStore().insert(0, record);
    	rowEditor.startEdit(0,0);
    },
    edit : function()
    {
        var rowEditor = this.getPlugin('rowEditPlugin');
        
        var selection = this.getSelectionModel().getSelection();
        if(selection.length == 0 )
        {
            Ext.Msg.alert("错误", "请选择要编辑的员工信息");
            return;
        }        
        
        rowEditor.startEdit(selection[0].index, 0);
        
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
    },
    regSaveFun : function()
    {
    	var rowEditor = this.getPlugin('rowEditPlugin');
    	rowEditor.on('edit', function(editor, context, e) {
    		context.record.commit();
    		var emp = context.record.data;
    		
            if(emp.deptId == 0 || emp.posId == 0)
            {
                 Ext.Msg.alert("错误", "请选择要删除的员工信息");
                 return;
            }
    		
            smartOA.util.ajaxRequest(
            {
                url : 'basicElem/updateEmpGenInfo.action',
                params : {'emp.id': emp.id, 'emp.name':emp.name, 'emp.email': emp.email,
                    'emp.mobileNum' : emp.mobileNum, 'emp.extNum':emp.extNum, 'emp.qq':emp.qq,
                    'emp.dept.id' : emp.deptId, 'emp.position.id' : emp.posId},
                success : function(r, o)
                {
                    Ext.Msg.alert('成功', '保存成功');
                }
            }, this
            );	
    	   
    	});
    }

}
    
);

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side'
    
    console.log("onready" +
            "");
    
    var panel = Ext.create('smartOA.basicElem.framework.EmpGenInfoGridPanel');
   
    var vp = new Ext.Viewport({layout:'form', items:[panel]});

});
