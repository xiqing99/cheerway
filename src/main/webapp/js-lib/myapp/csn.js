Ext.ns('smartOA.csn');
smartOA.csn = function() {
    
    var constants={
        ORDER_AUDITOR_GROUP_ID: 1,
        ORDER_ACOUNT_AUDITOR_GROUP_ID: 2,
        STORESALE_AUDITOR_GROUP_ID:3,
        MANU_LINE_MNG_GROUP_ID:4,
        PROD_STOCKIN_AUDITOR_GROUP_ID:5,
        PROD_STOCKOUT_AUDITOR_GROUP_ID:6,
        PROD_RET_AUDITOR_GROUP_ID:7,
        PROD_TSF_AUDITOR_GROUP_ID:8,
        PROD_STOCKTAKEN_AUDITOR_GROUP_ID:9,
        ACCOUNT_AUDITOR_GROUP_ID:10,
        
        DEPT_SALES_ROOT_ID: 2,
        DEPT_STOCK_ROOT_ID: 23,
        DEPT_MANU_ROOT_ID: 3,
        DEPT_ACCOUNT_ROOT_ID: 4,
        
        CUST_AREA_ROOT_ID: 1,
        CUST_AREA_ABOARD_ID: 2,
        CUST_AREA_DOMESTIC_ID: 3
    }
    
     return {
        getValue:function(name){
            return constants[name];
        }
     };
}();

