//<script type="text/javascript">

Ext.define("smartOA.basicElem.EmpGenInfoGridPanel",
{   
    extend : "smartOA.commonClass.RowEditListViewGridPanel",
    title : '员工基本信息',
    constructor : function(conf)
    {             
        var deptStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name'],
            proxy: {
                type: 'ajax',
                url : 'basicElem/loadDeptListForCombo.action',
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
            lazyRender:false,
            editable:false
        });
        
        var posStore = Ext.create('Ext.data.Store',
        {
            autoLoad: true,     
            fields : ['id', 'name', 'description'],
            proxy: {
                type: 'ajax',
                url : 'basicElem/loadPosListForCombo.action',
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
            editable:false
        });        
        
       var comboBoxRenderer = function(combo) {
            return function(value) {
                var idx = combo.store.find(combo.valueField, value);
                var rec = combo.store.getAt(idx);
                return (rec === null ? value : rec.get(combo.displayField) );
        
            };
        };
        
        Ext.define('EmpGenInfo', {
             extend: 'Ext.data.Model',
             fields: [
                 {name: 'id', type: 'int', defaultValue:0},
                 {name: 'name', type: 'string'},
                 {name: 'sortIndex', type: 'string'},
                 {name: 'email',  type: 'string'},
                 {name: 'extNum',  type: 'string'},
                 {name: 'mobileNum',  type: 'string'},
                 {name: 'qq',  type: 'string'},
                 {name: 'deptId',  type: 'int', defaultValue:1},
                 {name: 'posId',  type: 'int', defaultValue:1},
                 {name: 'disabled', type: 'boolean'},
                 {name: 'description'}
             ]
         });  
         
    	Ext.apply(this, {
            dataModel: 'EmpGenInfo',      
            isAutoLoad: false,
            searchField: 'name',
    		columns: [
    		  {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
    		  {text : '', dataIndex:'id', hidden: true},
    		  {text : "姓名" , dataIndex : 'name', sortable : true, width:100, align : 'center',
    		      editor : {
    		      	xtype : 'textfield',
    		      	allowBlank : false
    		      }
    		  },
              {text : "拼音搜索码" , dataIndex : 'sortIndex', sortable : true, width:100, align : 'center',
                  editor : {
                    xtype : 'textfield',
                    allowBlank : true,
                    vtype: 'alpha'
                  }
              },              
              {text : "部门" , dataIndex : 'deptId', sortable : true, width : 150, align : 'center',
                   editor : deptCombo,
                   renderer : comboBoxRenderer(deptCombo)
              },              
              {text : "分机号" , dataIndex : 'extNum', sortable : true, width : 100, align : 'center',
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
              {text : "邮箱" , dataIndex : 'email', sortable : true, width : 200, align : 'center', 
                    editor : {
                    xtype : 'textfield',
                    allowBlank : true                    
                  }
              },              
              {text : "QQ" , dataIndex : 'qq', sortable : true, width : 100, align : 'center',
                  editor : {
                    xtype : 'textfield',
                    allowBlank : true
                  }
              },
              {text : "职位" , dataIndex : 'posId', sortable : true, width : 120, align : 'center',
                   editor : posCombo,
                   renderer : comboBoxRenderer(posCombo)
              },
              {text : "备注" , dataIndex : 'description',  flex: 1, align : 'center',
                    editor : {
                    xtype : 'textfield',
                    allowBlank : true
                  }
              },              
              {text : "停用" , dataIndex : 'disabled', width : 60, 
                    editor : {
                    xtype : 'checkboxfield',
                    allowBlank : false,
                    boxLabel: '停用'
                    },
                    renderer: function(data)
                    {
                        if(data == true)
                            return '是';
                        else
                            return '否';
                    }
              }              
            ],
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
        
        this.callParent(arguments);

        var tbar = this.getDockedItems('toolbar[dock="top"]')[0];
        
        tbar.insert(4, '-');  
        
        tbar.insert(5, {
                    text: '职位管理',
                    handler: this.openPosEdit,
                    scope: this
                });  
        
        tbar.insert(6, '-');    
        
        tbar.insert(7, {
                    text: '停用列表',
                    handler: this.loadDisabled,
                    scope: this
                });
    },
    loadDisabled: function()
    {
        var proxy = this.store.getProxy();
        
        Ext.apply(proxy, {
        url : 'basicElem/loadDisabledEmpGenInfo.action',
        extraParams : {}
        });
        
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
                 Ext.Msg.alert("错误", "请选择正确的部门和职位");
                 return;
            }
    		
            smartOA.util.ajaxRequest(
            {
                url : 'basicElem/saveEmpGenInfo.action',
                params : {'entity.id': emp.id, 'entity.name':emp.name, 'entity.email': emp.email,'entity.sortIndex':emp.sortIndex,
                    'entity.mobileNum' : emp.mobileNum, 'entity.extNum':emp.extNum, 'entity.qq':emp.qq,
                    'entity.dept.id' : emp.deptId, 'entity.position.id' : emp.posId, 'entity.disabled': emp.disabled},
                success : function(r, o)
                {
                    Ext.Msg.alert('成功', '保存成功');
                    this.getCmp().refresh();
                }
            }, this
            );	        	   
        	});
    },
    openPosEdit : function()
    {
             smartOA.util.genWindow({
                    title: '职位管理',
                    loader: {
                            url: 'basicElem/positionList.js',
                            autoLoad: true,
                            scripts:true
                        },
                    height: 400,
                    width: 500,
                    maximizable: true,
                    modal: true,
                    layout   : 'fit',
                    resizable: true
                });                 
    }
});

Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    var deptPanel = Ext.create('smartOA.commonClass.EditTreeViewPanel',{
            loadUrl : 'basicElem/loadDeptTree.action',
            editJs : 'basicElem/editDept.js',
            delUrl : 'basicElem/delDept.action',
            itemName : '部门',
            width: 200,
            resizable : true,
            title : '部门目录'
    });               
            
    var empPanel = Ext.create('smartOA.basicElem.EmpGenInfoGridPanel',
        {            
        loadUrl : 'basicElem/loadAllEmpGenInfo.action',
        saveUrl : 'basicElem/saveEmpGenInfo.action',
        delUrl : 'basicElem/delEmpGenInfo.action',
        flex: 1
        });

    
    deptPanel.on('itemdblclick', function(object,record)
    {
        var data = record.getData();
        
        if(data.leaf == true)
            deptPanel.edit();
    });
    
    deptPanel.on('itemclick', function(object,record)
    {
        var data = record.getData();
        
        var proxy = empPanel.getStore().getProxy();
        
        Ext.apply(proxy, {
        url : 'basicElem/loadEmpGenInfoByDept.action',
        extraParams : {'deptId': data.id}
        });
        
        empPanel.refresh();
    }
    );     
    
    var framePanel = Ext.create('Ext.panel.Panel',
            {
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                items : [deptPanel, empPanel]
            });       
     
    if (mainPanel) {
        mainPanel.getActiveTab().add(framePanel);
        mainPanel.getActiveTab().doLayout();
    } else {
        var vp = new Ext.Viewport({layout:'fit', items:[framePanel]});
    }

});
//</script>