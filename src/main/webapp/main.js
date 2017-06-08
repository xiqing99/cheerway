/*
Ext.Loader.setConfig({
    enabled : true,
    paths : {
//        'myux': 'js-lib/myapp/ux',
//       'Ext.ux': 'js-lib/extjs4.2/src/ux'
    }
});
*/
Ext.require(
['Ext.ux.grid.feature.Searching',
  'Ext.ux.grid.FiltersFeature',
  'Ext.ux.grid.Printer',
  'Ext.ux.grid.VchPrinter'
 ]
);

Ext.Ajax.on('requestcomplete',function(conn, response, options, eOpts){  
            if(response.getResponseHeader == undefined)
                return;
                
            if(response.getResponseHeader("sessionstatus")=='timeout'){  
                alert("登入超时,系统将自动跳转到登陆页面,请重新登入!");  
                window.location = 'j_spring_security_logout'; 
            }  
        });    

Ext.define('smartOA.security.MainPanel',
{
    extend : 'Ext.TabPanel',
    centerPanelText : 'Welcome',
    userEmpName: '',
    userEmpId: 0,
    userDeptId: 0,
    constructor : function()
    {
        Ext.apply(this,
        {
            enableTabScroll : true,
            minTabWidth     : 75,
            activeTab:0,
            closable : false,
            layout: 'fit',
            frame: true
//            items:[{
//                title: this.centerPanelText,
//                autoScroll:true
//            }]

        });
        
        this.callParent(arguments);  
        
        this.loadModuleTab('security/myVoucherList.js', '我的工作', false);
        this.loadUserInfo();
    },   
    loadModuleTab : function(href,tabTitle, closable){
        var tab;
        if(!(tab = this.getComponent(tabTitle))){
            tab = new Ext.Panel({
                id: tabTitle,
                title: tabTitle,
                layout: 'fit',
                closable:closable,
                loader: {
                    url: href,
                    autoLoad: true,
                    scripts:true
                },
                border:false
            });
            this.add(tab);
        }
        this.setActiveTab(tab);               
    },
    loadUserInfo: function()
    {
        var panel = this; 
        
        Ext.Ajax.request(
        {
            url : 'securityMgt/loadUserInfo.action',
            success: function(response, opts)
            {
                var obj = Ext.JSON.decode(response.responseText);
                if(obj.success != true)
                {
                    Ext.Msg.alert("错误", obj.message);
                    return;
                }
                
                panel.userEmpName = obj.data.empName;
                panel.userEmpId = obj.data.empId;
                panel.userDeptId = obj.data.empDeptId;
                
            }
        }, this
        );         
    }
});

Ext.onReady(function()
{
    mainPanel = new smartOA.security.MainPanel();
    
    var framePanel = Ext.create('Ext.Panel',
    {
        layout: 'fit',
        tbar:{
        name: 'menuBar',
        defaultType: 'button',
        items:[
            {
                text:this.homeText,
                tooltip: 'Home',  // <-- i
                iconCls :'home'
            },
            '->',{
                text:'用户设置',
                tooltip: '用户设置',
                iconCls :'user',
                scope: this,
                handler : function() {
                    mainPanel.loadModuleTab('security/userSetting.js', '用户设置', true);
                }
            },'-',{
                text:this.exitText,
                tooltip: '退出系统',
                iconCls :'exit',
                handler : function() {
                    window.location = 'j_spring_security_logout';
                }
            }]
        },
        items: [mainPanel]
    });
    
    
    var viewport = Ext.create('Ext.Viewport', 
    {
       layout : 'fit',
       items : [framePanel]
    });

      Ext.on('resize', function (width, height)
      {
        viewport.setWidth(width);
        viewport.setHeight(height);
      });         
      
    Ext.define('MenuNode',
    {
        extend : 'Ext.data.Model',
        fields: [
            {name : 'nodeId', type : 'String'},
            {name : 'text', type : 'String'},
            {name: 'loadUrl', type : 'String'},
            {name: 'leaf', type : 'Boolean'}       
        ]
    });
    
    var menuStore = Ext.create('Ext.data.Store', {   
        model: 'MenuNode',
        proxy: {
            type: 'ajax',
            url: 'loadMenu.action',
            reader: {
                type: 'json'
            },
            extraParams : {node:'allModulesRoot'}
            },
            autoLoad : true
        });        
 
    menuStore.on('load', function(store, records, successful, eOpts)
    {        
        var menuBar = framePanel.down("[name=menuBar]");
        var menuList = [];
        
        Ext.Array.forEach(records, function(item, index)
        {
            var menu = Ext.create('Ext.menu.Menu',
            {
                data: item.data,
                bodyStyle: {
                                background: '#ffc',
                                padding: '10px'
                            },
                buttonAlign : 'center'
            });

            menuBar.insert(1+index, {text:  '<span style="font-weight: bold;font-size:15px;color:#4A708B">' + item.data.text +'</span>', 
            menu: menu,
            iconCls :'add-icon',
            scale: 'medium' ,
            listeners:
            {
                afterRender: function(btn)
                {
                    loadSubMenu(btn.menu);
                }
            }
            })
        });        
    }); 
    
    var loadSubMenu = function(menu)
    {                               
        Ext.Ajax.request(
        {
            url : 'loadMenu.action',
            params : {node: menu.data.nodeId},
            success: function(response, opts)
            {
                var obj = Ext.JSON.decode(response.responseText);
                var subMenus = [];
                Ext.Array.forEach(obj, function(item, index)
                {
                    var subItem;
                    
                    if(item.leaf == true)
                    {
                        subItem = Ext.create("Ext.menu.Item",
                            {
                                data: item,
                                text:  '<span style="font-weight: bold;color:#36648B">' + item.text +'</span>',
                                icon :'images/grid.png',
                                handler:function(obj)
                                {
                                    console.log('handler');
                                    
                                    if(obj.data.type == 'URL_WIN')
                                    {
                                           smartOA.util.genWindow({
                                                title    : obj.data.text,
                                                loader: {
                                                        url: obj.data.loadUrl,
                                                        autoLoad: true,
                                                        scripts:true
                                                    },
                                                initId : 0
                                            });  
                                            
                                           
                                    }else
                                    {
                                        mainPanel.loadModuleTab(obj.data.loadUrl, obj.data.text, true);   
                                    }                                    
                                }
                            });
                    }else
                    {
                        var subMenu = Ext.create('Ext.menu.Menu',{data:item});
                        subItem = {text: '<span style="font-weight: bold;color:#36648B">' + item.text +'</span>', 
                                    data:item, menu: subMenu,
                                    icon :'images/folder_go.png',
                                    listeners:
                                    {
                                        afterrender : function(obj)
                                        {
                                            loadSubMenu(obj.menu);
                                        }
                                    }                                    
                                   };
                    }
                    
                    subMenus[subMenus.length] = subItem;
                });
                  
                    
                if(subMenus.length > 0)
                {
                    menu.addClass("x-menu-item-arrow");
                    menu.add(subMenus);
                }                        
             }
        }, this);
    }

}); 
