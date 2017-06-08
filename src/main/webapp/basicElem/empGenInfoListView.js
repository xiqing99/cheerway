//<script type="text/javascript">

Ext.define("smartOA.basicElemMgt.EmpGenListViewGridPanel",
{   
    extend : "smartOA.commonClass.ListViewGridPanel",
    title: '员工信息列表',
    constructor : function()
    {                                    
        Ext.define('EmpGenInfo', {
             extend: 'Ext.data.Model',
             fields: [
                 {name: 'id', type: 'int'},
                 {name: 'name', type: 'string'},
                 {name: 'email',  type: 'string'},
                 {name: 'extNum',  type: 'string'},
                 {name: 'mobileNum',  type: 'string'},
                 {name: 'qq',  type: 'string'},
                 {name: 'deptName'},
                 {name: 'posName'},
                 {name: 'disabled', type: 'boolean'},
                 {name: 'description'}
             ]
         });        
        
        Ext.apply(this, {      
            loadUrl: "basicElem/loadAllEmpGenInfo.action",
            dataModel: 'EmpGenInfo', 
            searchField: 'name',
            columns: [
              {xtype: 'rownumberer', align:'center', resizable:true, width: 40, header: '序号'},
              {text : '', dataIndex:'id', hidden: true},
              {text : "姓名" , dataIndex : 'name', sortable : true, width : 100, align : 'center'
              },
              {text : "部门" , dataIndex : 'deptName', sortable : true, width : 120, align : 'center'
            
              },
              {text : "分机号" , dataIndex : 'extNum', filter:true, sortable : true, width : 100, align : 'center'},
              {text : "手机号" , dataIndex : 'mobileNum', sortable : true, width : 150, align : 'center'},
              {text : "邮箱" , dataIndex : 'email', sortable : true, width : 200, align : 'center'},
              {text : "QQ" , dataIndex : 'qq', sortable : true, width : 100, align : 'center'},
              {text : "职位" , dataIndex : 'posName',  sortable : true, filter:true, width : 120, align : 'center'},
              {text : "备注" , dataIndex : 'description', sortable : true, flex:1,align : 'center'},
              {text : "停用" , dataIndex : 'disabled', sortable : true, filter:true, width : 60, align : 'center',
                  renderer: function(data)
                        {
                            if(data == true)
                                return '是';
                            else
                                return '否';
                        }
              }
              ],            
            selType: 'rowmodel'
        });
        
        this.callParent(arguments);
    }
});


Ext.onReady(function() {

    Ext.QuickTips.init();   
    Ext.form.Field.prototype.msgTarget = 'side';
    
    
    var empList = Ext.create('smartOA.basicElemMgt.EmpGenListViewGridPanel',
    {
        flex: 1
    });       
    

    var deptPanel = Ext.create('smartOA.commonClass.TreeListViewPanel',
    {
        width: 200,
        loadUrl: 'basicElem/loadDeptTree.action',
        title: '业务部门列表'
    }    
    );    

    var framePanel = Ext.create('Ext.panel.Panel',
                    {   
                        layout: {
                            type: 'hbox',
                            pack: 'start',
                            align: 'stretch'
                        },
                        items : [deptPanel, empList]
                    });     
    
    deptPanel.on('itemclick', function(object,record)
    {
        var data = record.getData();
        
        var proxy = empList.getStore().getProxy();
        
        Ext.apply(proxy, {
        url : 'basicElem/loadEmpGenInfoByDept.action',
        extraParams : {'deptId': data.id}
        });
        
        empList.refresh();
    }
    );      
    
  if (mainPanel) {
        mainPanel.getActiveTab().add(framePanel);
        mainPanel.getActiveTab().doLayout();
    } else {
        var vp = new Ext.Viewport({layout:'fit', items:[framePanel]});
    }
});
//</script>