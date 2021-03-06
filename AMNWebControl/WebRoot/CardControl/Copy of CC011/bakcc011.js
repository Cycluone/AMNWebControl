
   	var compTree = null;//主明细	
   	var compTreeManager = null;//主明细	
   	var curCompid="";
   	var cc011layout=null;
   	var commoninfodivdetial=null;
   	var commoninfodivdetial_Pro=null;
   	var commoninfodivdetial_Tm=null;
   	var commoninfodivdetial_Dy=null;
   	var commoninfodivthirth = null;
   	var commoninfodivfouth = null;
   	var pageState=3;
   	var chooseItemData = [{ choose: '1', text: '项目' }, { choose: '2', text: '产品'}];
   	var servicetypeChangeData=JSON.parse(parent.loadCommonControlDate_select("FWLB",0));
   	var paymodeChangeData=null;
   	var curRowIndex=0;
   	var lsStaffSelectData=loadCommonDataGridByStaffInfo();
   	var curRecord=null;
   	var curEmpManger=null;
   	var curitemManger=null;
   	var addRecordFlag=0;  //0 允许新增 1 不允许新增
   	var lsDnointernalcardinfo = null;
   	var paramtotiaomacardinfo='';
   	var showDialogmanager=null;
   	//初始化员工下拉表
   	function loadCommonDataGridByStaffInfo()
	{
			try
			{
				var strJson = "";//'{ "name": "cxh", "sex": "man" }';
				var ccount=0;
				if(parent.StaffInfo!=null && parent.StaffInfo.length>0)
				{	
					for(var i=0;i<parent.StaffInfo.length;i++)
					{
							ccount=ccount*1+1;
							if(ccount==1)
							{
								strJson=strJson+'[';
							}
							else
							{
								strJson=strJson+',';
							}
							strJson=strJson+'{ "choose":"'+parent.StaffInfo[i].bstaffno+'", "text": "'+parent.StaffInfo[i].bstaffno+'_'+parent.StaffInfo[i].staffname+'"}';
						
					}
					if(strJson!="")
					{
						strJson=strJson+']';
						return JSON.parse(strJson);
					}
					return null;
					 
				}
			
			}catch(e){alert(e.message);}
	}
	
    $(function ()
   	{
	   try
	   {
	   		  //布局
            cc011layout= $("#cc011layout").ligerLayout({ rightWidth: 280,  allowBottomResize: false, allowLeftResize: false });
             $("#readCurCardInfo").ligerButton(
	         {
	             text: '读取信息', width: 140,
		         click: function ()
		         {
		             editCurDetailInfo();
		         }
	         });
	       
	         $("#ratebutton").ligerButton(
	         {
	             text: '经理打折', width: 70,
		         click: function ()
		         {
		             editCurDetailInfo();
		         }
	         });
            
            commoninfodivdetial=$("#commoninfodivdetial").ligerGrid({
                columns: [
                { display: '类型', 		name: 'bcsinfotype',  		width:60 ,
                	editor: { type: 'select', data: chooseItemData, valueField: 'choose' , edid:"bcsinfotype",onChanged : validateItemType},
                    render: function (item)
                    {
                        if (item.bcsinfotype == '1') return '项目';
                        return '产品';
                    }
                },
                { display: '项目/产品' ,	name: 'csitemname', width:160,align: 'center',
                	editor: { type: 'select', data: null, url:'loadAutoProject',autocomplete: true, valueField: 'choose',onChanged : validateItem,selectBoxWidth:300,selectBoxHeight:300}
                },
                { display: '支付方式', 	name: 'cspaymode', 			width:85,
	             	editor: { type: 'select', data: paymodeChangeData, valueField: 'choose',selectBoxWidth:105,onChanged : validatePaycode},
		            	render: function (item)
		              	{
		              		var lsZw=parent.gainCommonInfoByCode("ZFFS",0);
		              		for(var i=0;i<lsZw.length;i++)
							{
								if(lsZw[i].bparentcodekey==item.cspaymode)
								{	
									return lsZw[i].parentcodevalue;								
							    }
							}
		                    return '';
		                } 
		        },
		        { display: '单价', 		name: 'csunitprice', 		width:50,align: 'right'},
	            { display: '折扣', 		name: 'csdiscount', 		width:50,align: 'right' },
	            { display: '数量', 		name: 'csitemcount', 		width:50,align: 'right', editor: { type: 'int' ,onChanged : validateCostCount}  },
	            { display: '金额', 		name: 'csitemamt', 			width:60,align: 'right', editor: { type: 'float',onChanged : validateCostAmt }  },
	         
	            { display: '大工', 		name: 'csfirstsaler', 		width:80,
	            	editor: { type: 'select', data: lsStaffSelectData, url:'loadAutoStaff',autocomplete: true, valueField: 'choose',selectBoxWidth:150,onChanged : validateFristSaleType},
	            	render: function (item)
	              	{
	              		for(var i=0;i<parent.StaffInfo.length;i++)
						{	
								if(parent.StaffInfo[i].bstaffno==item.csfirstsaler)
								{
									return parent.StaffInfo[i].staffname;
								}
						}
	                    return '';
	                } 
	            },
	            { display: '类型', 		name: 'csfirsttype', 		width:60 ,
	             	editor: { type: 'select', data: servicetypeChangeData, valueField: 'choose',selectBoxHeight:'120'},
		            	render: function (item)
		              	{
		              		var lsZw=parent.gainCommonInfoByCode("FWLB",0);
		              		for(var i=0;i<lsZw.length;i++)
							{
								if(lsZw[i].bparentcodekey==item.csfirsttype)
								{	
									return lsZw[i].parentcodevalue;								
							    }
							}
		                    return '';
		                } 
	            },
	            { display: '分享', 		name: 'csfirstshare', 	width:50,align: 'left', editor: { type: 'float', onChanged : validateFristSaleShare} },
	            { display: '中工', 		name: 'cssecondsaler', 		width:80,
	            	editor: { type: 'select', data: lsStaffSelectData,  url:'loadAutoStaff',autocomplete: true,valueField: 'choose',selectBoxWidth:150,onChanged : validateSecondSaleType},
	            	render: function (item)
	              	{
	              		for(var i=0;i<parent.StaffInfo.length;i++)
						{	
								if(parent.StaffInfo[i].bstaffno==item.cssecondsaler)
								{
									return parent.StaffInfo[i].staffname;
								}
						}
	                    return '';
	                } 
	            },
	            { display: '类型', 		name: 'cssecondtype', 		width:60 ,
	             	editor: { type: 'select', data: servicetypeChangeData, valueField: 'choose',selectBoxHeight:'120'},
		            	render: function (item)
		              	{
		              		var lsZw=parent.gainCommonInfoByCode("FWLB",0);
		              		for(var i=0;i<lsZw.length;i++)
							{
								if(lsZw[i].bparentcodekey==item.cssecondtype)
								{	
									return lsZw[i].parentcodevalue;								
							    }
							}
		                    return '';
		                } 
	            },
	            { display: '分享', 		name: 'cssecondshare', 	width:50,align: 'left', editor: { type: 'float', onChanged : validateSecondSaleShare } },
	            { display: '小工', 		name: 'csthirdsaler', 		width:80,
	            	editor: { type: 'select', data: lsStaffSelectData,url:'loadAutoStaff',autocomplete: true, valueField: 'choose',selectBoxWidth:150,onChanged : validateThirdSaleType},
	            	render: function (item)
	              	{
	              		for(var i=0;i<parent.StaffInfo.length;i++)
						{	
								if(parent.StaffInfo[i].bstaffno==item.csthirdsaler)
								{
									return parent.StaffInfo[i].staffname;
								}
						}
	                    return '';
	                } 
	            },
	            { display: '类型', 		name: 'csthirdtype', 		width:60 ,
	             	editor: { type: 'select', data: servicetypeChangeData, valueField: 'choose',selectBoxHeight:'120'},
		            	render: function (item)
		              	{
		              		var lsZw=parent.gainCommonInfoByCode("FWLB",0);
		              		for(var i=0;i<lsZw.length;i++)
							{
								if(lsZw[i].bparentcodekey==item.csthirdtype)
								{	
									return lsZw[i].parentcodevalue;								
							    }
							}
		                    return '';
		                } 
	            },
	           	{ display: '分享', 		name: 'csthirdshare', 		width:50,align: 'left', editor: { type: 'float' , onChanged : validateThirdSaleShare} },
	           	{ 		name: 'csitemno', 		hide:true,align: 'left'},
	           	{ 		name: 'csproseqno', 		hide:true,align: 'left'}
                ],  pageSize:25, 
                data:{Rows: null,Total:0},      
                width: '100%',
                height:'420',
                enabledEdit: true,   clickToEdit: false,usePager: false,
           		onAfterEdit: comsumAfterEdit,
           		onSelectRow : function (data, rowindex, rowobj)
                {
                    curRecord = data;
                }, 
                toolbar: { items: [
	                { text: '增加', click: itemclick_serviceInfo, img: contextURL+'/common/ligerui/ligerUI/skins/icons/add.gif' },
	           		{ text: '删除', click: itemclick_serviceInfo, img: contextURL+'/common/ligerui/ligerUI/skins/icons/delete.gif' }
	                ]
                }	  
            });
            commoninfodivdetial_Pro=$("#commoninfodivdetial_Pro").ligerGrid({
                columns: [
                { display: '疗程编号', 	name: 'bprojectno',  	width:100,align: 'left' },
                { display: '疗程名称', 	name: 'bprojectname', 		width:153,align: 'left'},
	            { display: '余次', 	name: 'lastcount', 			width:40,align: 'left'},
	            { display: '现取', 	name: 'curcostcount', 			width:40,align: 'center',editor: { type: 'int' }},
	            { display: '备注', 		name: 'proremark', 		width:145,align: 'left'},
	            { 		name: 'bproseqno', 	hide:true, 		width:1},
	            { 		name: 'lastamt', 	hide:true, 		width:1}
                ],  pageSize:25, 
                data:{Rows: null,Total:0},      
                width: '560',
                height:'235',
                enabledEdit: true, checkbox:true,
                rownumbers: false,usePager: false,
                onCheckRow: f_onCheckRow,
                onAfterEdit: comCostProAfterEdit,
                toolbar: { items: [
	                { text: '选定消费疗程', click: itemclick_proInfo, img: contextURL+'/common/ligerui/ligerUI/skins/icons/right.gif' }
	                ]
                }	   
            });
        
      
           //---------------------------------------------右侧面板营业分析 start
				$("#dataAnalysis").ligerTab({ onBeforeSelectTabItem: function (tabid)
	            {
	                dataAnalysis_before( tabid);
	            }, onAfterSelectTabItem: function (tabid)
	            {
	                dataAnalysis_after( tabid);
	            } 
	            });
	        //---------------------------------------------右侧面板营业分析 end
	        //-------------------------日历
				$(".datepicker").datePicker({
					inline:true,
					selectMultiple:false	
					
				}); 
          	$("#pageloading").hide(); 
          	document.getElementById("mainToolTable").width= cc011layout.centerWidth*1-280;
         	addConsumeInfo();
   		}catch(e){alert(e.message);}
    });
    
              
    function loadAutoStaff(curmanager,curWriteStaff)
	{	
		curmanager.setData(loadGridChooseByStaffInfo(parent.StaffInfo,curWriteStaff));
		curmanager.selectBox.show();
		curEmpManger=curmanager;
	 }
    
    function loadAutoProject(curmanager,curWriteitemname)
	{	
		if(curRecord.bcsinfotype==1)
			curmanager.setData(parent.loadProjectControlDate_select(curWriteitemname));
		else
			curmanager.setData(parent.loadGoodsControlDate_select(curWriteitemname));
		curmanager.selectBox.show();
		curitemManger=curmanager;
	}
    
    
   function loadPayModeDate(strSalePayMode)
   {
   		var strpaymode= new Array();
   		if(strSalePayMode!="")
   		{
   			var returnValue='';
   			var paymode="";
   			var paymodename="";
   			strpaymode=strSalePayMode.split(";");
   			for(var i=0;i<strpaymode.length;i++)
   			{
   				paymode=strpaymode[i];
   				paymodename=parent.loadCommonControlValue("ZFFS",0,paymode);
   				if(returnValue!='')
				{
					returnValue=returnValue+',';
				}
				else
				{
					returnValue=returnValue+'[';
				}
				returnValue=returnValue+'{"choose": "'+paymode+'","text": "'+paymode+'_'+paymodename+'"}';
	   		}
	   		if(returnValue!='')
	   		{
				returnValue=returnValue+']';
				commoninfodivdetial.columns[2].editor.data=JSON.parse(returnValue);
			}
   		}
   }
   
    
     //默认新增消费单
    function addConsumeInfo()
    {
    	pageState=1;
     	var requestUrl ="cc011/add.action"; 
		var responseMethod="addMessage";				
		sendRequestForParams_p(requestUrl,responseMethod,"" );
    }
   
   function addMessage(request)
   {
       		try
        	{
        	var responsetext = eval("(" + request.responseText + ")");
    
	   		if(responsetext.lsDconsumeinfos!=null && responsetext.lsDconsumeinfos.length>0)
	   		{
	   			commoninfodivdetial.options.data=$.extend(true, {},{Rows: responsetext.lsDconsumeinfos,Total: responsetext.lsDconsumeinfos.length});
            	commoninfodivdetial.loadData(true);            	
	   		}
	   		else
	   		{
	   			commoninfodivdetial.options.data=$.extend(true, {},{Rows: null,Total:0});
            	commoninfodivdetial.loadData(true);  
	   		}
	   		initDetialGrid();
	   		commoninfodivdetial_Pro.options.data=$.extend(true, {},{Rows: null,Total:0});
            commoninfodivdetial_Pro.loadData(true);  
	        loadCurMaster(responsetext.curMconsumeinfo);
	        document.getElementById("dProjectAmt").innerHTML=0;
	        document.getElementById("dGoodsAmt").innerHTML=0;
	        document.getElementById("dTotalsAmt").innerHTML=0;
	        document.getElementById("paycode1_img").src=contextURL+"/common/funtionimage/paycode1.jpg"
	        document.getElementById("paycode2_div").style.display="none";
			document.getElementById("paycode3_div").style.display="none";
			document.getElementById("paycode4_div").style.display="none";
			document.getElementById("paycode5_div").style.display="none";
			document.getElementById("paycode6_div").style.display="none";
			document.getElementById("payamt1_lb").innerHTML=0;
			document.getElementById("strPayMode1").value="";
			document.getElementById("dPayAmt1").value=0;
			document.getElementById("strPayMode2").value="";
			document.getElementById("dPayAmt2").value=0;
			document.getElementById("strPayMode3").value="";
			document.getElementById("dPayAmt3").value=0;
			document.getElementById("strPayMode4").value="";
			document.getElementById("dPayAmt4").value=0;
			document.getElementById("strPayMode5").value="";
			document.getElementById("dPayAmt5").value=0;
			document.getElementById("strPayMode6").value="";
			document.getElementById("dPayAmt6").value=0;
			loadPayModeDate(responsetext.strSalePayMode);
			addRecordFlag=0;
	   		}catch(e){alert(e.message);}
    }
    
    function loadCurMaster(curMaster)
    {
    
    	document.getElementById("lbBillId").innerHTML=checkNull(curMaster.id.csbillid);
    	document.getElementById("cscompid").value=checkNull(curMaster.id.cscompid);
    	document.getElementById("csbillid").value=checkNull(curMaster.id.csbillid);
    	document.getElementById("cscardno").value=checkNull(curMaster.cscardno);
    	document.getElementById("cscardtype").value=checkNull(curMaster.cscardtype);
    	document.getElementById("cscardtypeName").value=checkNull(curMaster.cscardtypeName);
    	document.getElementById("csname").value=checkNull(curMaster.csname);
    	document.getElementById("cscurkeepamt").value=checkNull(curMaster.cscurkeepamt);
    	document.getElementById("csdate").value=checkNull(curMaster.csdate);
    	document.getElementById("csstarttime").value=checkNull(curMaster.csstarttime); 
    	document.getElementById("cscurdepamt").value=checkNull(curMaster.cscurdepamt);
    	document.getElementById("csmanualno").value=checkNull(curMaster.csmanualno);
    	document.getElementById("tuangoucardno").value=checkNull(curMaster.tuangoucardno);
    	document.getElementById("tiaomacardno").value=checkNull(curMaster.tiaomacardno);
    	document.getElementById("diyongcardno").value=checkNull(curMaster.diyongcardno);
    	document.getElementById("cardpointamt").value=0;
    	document.getElementById("cardHomeSource").value="";
    	document.getElementById("diyongcardnoamt").value="0";
    	handleRadio("curMconsumeinfo.csersex",checkNull(curMaster.csersex));
    	handleRadio("curMconsumeinfo.csertype",checkNull(curMaster.csertype));
		if(pageState==1)
		{
			pageWriteState();
		}
		else
		{
			pageReadState();
		}
    }
    
    function pageWriteState()
    {
	    try
	    {
	    	document.getElementById("cscardno").readOnly="";
	    	document.getElementById("csmanualno").readOnly="";
			document.getElementById("tuangoucardno").readOnly="";
			document.getElementById("tiaomacardno").readOnly="";
			document.getElementById("diyongcardno").readOnly="";
	    	commoninfodivdetial.options.clickToEdit=true;
	    	commoninfodivdetial_Pro.options.clickToEdit=true;
    	}catch(e){alert(e.message);}
	}
    
    function pageReadState()
    {
    	try
	    {
	    	document.getElementById("cscardno").readOnly="readOnly";
	    	document.getElementById("csmanualno").readOnly="readOnly";
	    	document.getElementById("tuangoucardno").readOnly="readOnly";
			document.getElementById("tiaomacardno").readOnly="readOnly";
			document.getElementById("diyongcardno").readOnly="readOnly";
			commoninfodivdetial.options.clickToEdit=false;
			commoninfodivdetial_Pro.options.clickToEdit=false;
    	}catch(e){alert(e.message);}
    }
    function editCurDetailInfo()
    {
    	if(document.getElementById("billflag").value==0)
    	{
    		document.getElementById("cscardno").value="散客";
    		document.getElementById("cscardno").onChange();
    	}
    }
    //-----------------------------------验证卡号
    function validateCscardno(obj)
    {
    	if(obj.value=="")
    	{
    		document.getElementById("cscardtype").value="";
    		document.getElementById("cscardtypeName").value="";
    		document.getElementById("csname").value="";
    		document.getElementById("cscurkeepamt").value=0;
    		document.getElementById("cscurdepamt").value=0;
    		document.getElementById("cardsource").value="";
    		document.getElementById("cardHomeSource").value="";
    	}
    	else if(obj.value=="散客")
    	{
    		document.getElementById("cscardtype").value="";
    		document.getElementById("cscardtypeName").value="无";
    		document.getElementById("csname").value="散客";
    		document.getElementById("cscurkeepamt").value=0;
    		document.getElementById("cscurdepamt").value=0;
    		document.getElementById("cardsource").value="";
    		document.getElementById("cardHomeSource").value="";  
    		handleRadio("curMconsumeinfo.csertype",0); 
    		//initDetialGrid();
	   		commoninfodivdetial_Pro.options.data=$.extend(true, {},{Rows: null,Total:0});
            commoninfodivdetial_Pro.loadData(true);  	
    	}
    	else
    	{
    		var requestUrl ="cc011/validateCscardno.action"; 
			var responseMethod="validateCscardnoMessage";	
			var params="strCardNo="+obj.value;			
			sendRequestForParams_p(requestUrl,responseMethod,params );
    	}
    }
    
    function validateCscardnoMessage(request)
   	{
       	try
        {
        	var responsetext = eval("(" + request.responseText + ")");
    		var strmessage=	checkNull(responsetext.strMessage);
	   		if(strmessage!="")
	   		{
	   			$.ligerDialog.warn(strmessage);
	   			document.getElementById("cscardno").value="";
	   			document.getElementById("cscardtype").value="";
    			document.getElementById("cscardtypeName").value="";
    			document.getElementById("csname").value="";
    			document.getElementById("cscurkeepamt").value=0;
    			document.getElementById("cscurdepamt").value=0;
    			document.getElementById("cardsource").value="";
    			document.getElementById("cardHomeSource").value="";
	   		}
	   		else
	   		{
	   			document.getElementById("cscardtype").value=checkNull(responsetext.curCardinfo.cardtype);
    			document.getElementById("cscardtypeName").value=checkNull(responsetext.curCardinfo.cardtypeName);
    			document.getElementById("csname").value=checkNull(responsetext.curCardinfo.membername);
    			
    			if(checkNull(responsetext.curCardinfo.cardsource)==1)
    			{
    				document.getElementById("cardsource").value="收购卡";
    				document.getElementById("cscurkeepamt").value=checkNull(responsetext.curCardinfo.account5Amt);
    				document.getElementById("cscurdepamt").value=checkNull(responsetext.curCardinfo.account5debtAmt);
    			}
    			else
    			{
    				document.getElementById("cardsource").value="内部卡";
    				document.getElementById("cscurkeepamt").value=checkNull(responsetext.curCardinfo.account2Amt);
    				document.getElementById("cscurdepamt").value=checkNull(responsetext.curCardinfo.account2debtAmt);
    			}
    			document.getElementById("cardHomeSource").value=checkNull(responsetext.curCardinfo.id.cardvesting);
    			handleRadio("curMconsumeinfo.csersex",checkNull(responsetext.curCardinfo.membersex));
  
    			handleRadio("curMconsumeinfo.csertype",1);
    			if(responsetext.lsCardproaccount!=null && responsetext.lsCardproaccount.length>0)
		   		{
		   			commoninfodivdetial_Pro.options.data=$.extend(true, {},{Rows: responsetext.lsCardproaccount,Total: responsetext.lsCardproaccount.length});
	            	commoninfodivdetial_Pro.loadData(true);            	
		   		}
		   		else
		   		{
		   			commoninfodivdetial_Pro.options.data=$.extend(true, {},{Rows: null,Total:0});
	            	commoninfodivdetial_Pro.loadData(true);  
		   		}
	   		}
	   	
	   	}catch(e){alert(e.message);}
    }
    

//---------------------------------------------获得服务类型 项目或产品
function validateItemType(record)
{
	var rowdata=commoninfodivdetial.updateRow(curRecord,{csitemname:'',csitemno:'',csitemcount:0,
     				csunitprice:0,csitemamt:0,csdiscount:0,cspaymode:'',csfirstsaler:'',csfirsttype:'',csfirstshare:'',
     				cssecondsaler:'',cssecondtype:'',cssecondshare:'',csthirdsaler:'',csthirdtype:'',csthirdshare:''});  
    showTextByinfoType(rowdata,1);	
}
//---------------------------------------------验证项目编号
function validateItem(record)
{
	var curItemValue="";
	if(curitemManger!=null && curitemManger.inputText.val()!="")
		curItemValue=curitemManger.inputText.val();
	else
		curItemValue=curRecord.csitemname;
	curitemManger=null;	
	var requestUrl ="cc011/validateItem.action"; 
	var responseMethod="validateItemMessage";
	if(curItemValue=="" )
	{
		commoninfodivdetial.updateRow(curRecord,{csitemname:'',csitemno: ''});
		return ;
	}
	if( curItemValue.indexOf('_')!=-1)
	{
		curItemValue=curItemValue.substring(0,curItemValue.indexOf('_'));
	}
	var params="itemType="+curRecord.bcsinfotype;
	var params=params+"&strCurItemId="+curItemValue;	
	sendRequestForParams_p(requestUrl,responseMethod,params );
	
}

function validateItemMessage(request)
{
	try
	{
     var responsetext = eval("(" + request.responseText + ")");
     if(curRecord.bcsinfotype==1)
     {
     	var curProjectinfo=responsetext.curProjectinfo;
     	if(curProjectinfo==null)
     	{
     		$.ligerDialog.warn("输入的项目编码不存在!");
     		commoninfodivdetial.updateRow(curRecord,{csitemname:'',csitemno: ''});
     	}
     	else
     	{
     		if(document.getElementById("cscardno").value=="散客")
     		{
     				commoninfodivdetial.updateRow(curRecord,{csitemname:curProjectinfo.prjname,csitemno: curProjectinfo.id.prjno,csitemcount:1,
     				csunitprice:curProjectinfo.saleprice,csitemamt:curProjectinfo.saleprice,csdiscount:1,cspaymode:1});
     		}
     		else
     		{
     				commoninfodivdetial.updateRow(curRecord,{csitemname:curProjectinfo.prjname,csitemno: curProjectinfo.id.prjno,csitemcount:1,
     				csunitprice:curProjectinfo.saleprice,csitemamt:curProjectinfo.saleprice,csdiscount:1,cspaymode:4});
     		}
     		//commoninfodivdetial.updateCell(1,curProjectinfo.prjname,curRecord);
     	
     	}
     }
     else
     {
     	var curGoodsinfo=responsetext.curGoodsinfo;
     	if(curGoodsinfo==null)
     	{
     		$.ligerDialog.warn("输入的产品编码不存在!");
     		commoninfodivdetial.updateRow(curRecord,{csitemname:'',csitemno: ''});
     	}
     	else
     	{
     		if(document.getElementById("cscardno").value=="散客")
     		{
     				commoninfodivdetial.updateRow(curRecord,{csitemname: curGoodsinfo.goodsname,csitemno: curGoodsinfo.id.goodsno,csitemcount:1,
     				csunitprice: curGoodsinfo.standprice,csitemamt: curGoodsinfo.standprice,csdiscount:1,cspaymode:1});
     		}
     		else
     		{
     				
     				commoninfodivdetial.updateRow(curRecord,{csitemname: curGoodsinfo.goodsname,csitemno: curGoodsinfo.id.goodsno,csitemcount:1,
     				csunitprice: curGoodsinfo.standprice,csitemamt: curGoodsinfo.standprice,csdiscount:4,cspaymode:1});
     		}
     	
     	}
     }
     handPayList();
     }catch(e){alert(e.message);}
     showTextByinfoType(curRecord,1);
}
  //----------------------------------------------------验证分享员工Start 
function validateFristSaleType(obj)
{
	var curempValue="";
	if(curEmpManger!=null && curEmpManger.inputText.val()!="")
		curempValue=curEmpManger.inputText.val();
	else
		curempValue=obj.value;
	curEmpManger=null;
	if(curempValue!="")
	{
		if(curempValue!="" && curempValue.indexOf('_')==-1)
    	{

    		var exists=0;
	    	for(var i=0;i<parent.StaffInfo.length;i++)
	    	{
	    		if(curempValue==parent.StaffInfo[i].bstaffno)
	    		{
	    			commoninfodivdetial.updateRow(curRecord,{csfirstsaler: parent.StaffInfo[i].bstaffno});
	    			exists=1;
	    			break;
	    		}
	    			
	    	}
	    	if(exists==0)
	    	{
	    		commoninfodivdetial.updateRow(curRecord,{csfirstsaler:''});
	    	}
	    }
		if(curRecord.bcsinfotype==1)
		{
			commoninfodivdetial.updateRow(curRecord,{csfirsttype:2});
		}
		else
		{
			commoninfodivdetial.updateRow(curRecord,{csfirsttype:""});
		}
	}
	else
	{
		commoninfodivdetial.updateRow(curRecord,{csfirsttype:''});
	}
	//initDetialGrid();
}
function validateSecondSaleType(obj)
{
	var curempValue="";
	if(curEmpManger!=null && curEmpManger.inputText.val()!="")
		curempValue=curEmpManger.inputText.val();
	else
		curempValue=obj.value;
	curEmpManger=null;
	if(curempValue!="")
	{
		if(curempValue!="" && curempValue.indexOf('_')==-1)
    	{

    		var exists=0;
	    	for(var i=0;i<parent.StaffInfo.length;i++)
	    	{
	    		if(curempValue==parent.StaffInfo[i].bstaffno)
	    		{
	    			commoninfodivdetial.updateRow(curRecord,{cssecondsaler: parent.StaffInfo[i].bstaffno});
	    			exists=1;
	    			break;
	    		}
	    			
	    	}
	    	if(exists==0)
	    	{
	    		commoninfodivdetial.updateRow(curRecord,{cssecondsaler:''});
	    	}
	    }
		if(curRecord.bcsinfotype==1)
		{
			commoninfodivdetial.updateRow(curRecord,{cssecondtype:2});
		}
		else
		{
			commoninfodivdetial.updateRow(curRecord,{cssecondtype:""});
		}
	}
	else
	{
		commoninfodivdetial.updateRow(curRecord,{cssecondtype:''});
	}
	//initDetialGrid();
}
function validateThirdSaleType(obj)
{
	var curempValue="";
	if(curEmpManger!=null && curEmpManger.inputText.val()!="")
		curempValue=curEmpManger.inputText.val();
	else
		curempValue=obj.value;
	curEmpManger=null;
	if(curempValue!="")
	{
		if(curempValue!="" && curempValue.indexOf('_')==-1)
    	{

    		var exists=0;
	    	for(var i=0;i<parent.StaffInfo.length;i++)
	    	{
	    		if(curempValue==parent.StaffInfo[i].bstaffno)
	    		{
	    			commoninfodivdetial.updateRow(curRecord,{csthirdsaler: parent.StaffInfo[i].bstaffno});
	    			exists=1;
	    			break;
	    		}
	    			
	    	}
	    	if(exists==0)
	    	{
	    		commoninfodivdetial.updateRow(curRecord,{csthirdsaler:''});
	    	}
	    }
		if(curRecord.bcsinfotype==1)
		{
			commoninfodivdetial.updateRow(curRecord,{csthirdtype:2});
		}
		else
		{
			commoninfodivdetial.updateRow(curRecord,{csthirdtype:""});
		}
	}
	else
	{
		commoninfodivdetial.updateRow(curRecord,{csthirdtype:''});
	}
	//initDetialGrid();
}
  //----------------------------------------------------验证分享员工End 
//------------------------------------------------------验证分享金额Start
function validateFristSaleShare(obj)
{
	if(obj.value!="" && obj.value*1!=0 && obj.value>curRecord.csitemamt)
	{
		$.ligerDialog.warn("大工的分享金额超过了   "+curRecord.csitemname+"   的总金额!");
		commoninfodivdetial.updateRow(curRecord,{csfirstshare:""});
	}
}
function validateSecondSaleShare(obj)
{
	if(obj.value!="" && obj.value*1!=0 && obj.value>curRecord.csitemamt)
	{
		$.ligerDialog.warn("中工的分享金额超过了   "+curRecord.csitemname+"   的总金额!");
		commoninfodivdetial.updateRow(curRecord,{cssecondshare:""});
	}
}
function validateThirdSaleShare(obj)
{
	if(obj.value!="" && obj.value*1!=0 && obj.value>curRecord.csitemamt)
	{
		$.ligerDialog.warn("中工的分享金额超过了   "+curRecord.csitemname+"   的总金额!");
		commoninfodivdetial.updateRow(curRecord,{csthirdshare:""});
	}
}
//------------------------------------------------------验证分享金额End
//------------------------------------------------------验证数量Start
function validateCostCount(obj)
{
	var costPrice=checkNull(curRecord.csunitprice)*1;
	var costdiscount=checkNull(curRecord.csdiscount)*1;
	commoninfodivdetial.updateRow(curRecord,{csitemamt:ForDight(checkNull(obj.value)*1*costPrice*costdiscount,1)});
	handPayList();
}
//------------------------------------------------------验证数量End
//------------------------------------------------------验证金额Start
function validateCostAmt(obj)
{
	handPayList();
}
//------------------------------------------------------验证金额End
//------------------------------------------------------验证支付方式Start
function validatePaycode(obj)
{
	var curItem=checkNull(curRecord.csitemname);
	if(obj.value!="" && curItem=="")
	{
		commoninfodivdetial.updateRow(curRecord,{cspaymode: ""});
		$.ligerDialog.warn("选择支付方式前请先确定消费项目 !");
	}
	if(obj.value=="11" || obj.value=="12" || obj.value=="13")
	{
		commoninfodivdetial.updateRow(curRecord,{cspaymode: ""});
		$.ligerDialog.warn("该支付方式不能手动选择,请重新输入!");
	}
	handPayList();
}

function handPayList()
{
	var paycode1="";
	var payamt1=0;
	var paycode2="";
	var payamt2=0;
	var paycode3="";
	var payamt3=0;
	var paycode4="";
	var payamt4=0;
	var paycode5="";
	var payamt5=0;
	var paycode6="";
	var payamt6=0;
	var curPaycode="";
	var curPayamt=0;
	var curProjectAmt=0;
	var curGoodsAmt=0;
	for (var rowid in commoninfodivdetial.records)
	{
		var row =commoninfodivdetial.records[rowid]; 
		curPaycode=checkNull(row.cspaymode);
		curPayamt=checkNull(row.csitemamt)*1;
		if(checkNull(row.csitemname)!="" && curPaycode!="" && curPayamt!=0)
		{
			if(paycode1=="" || paycode1==curPaycode)
			{
				paycode1=curPaycode;
				payamt1=payamt1*1+curPayamt;
			}
			else if( paycode2=="" || paycode2==curPaycode )
			{
				paycode2=curPaycode;
				payamt2=payamt2*1+curPayamt;
			}
			else if( paycode3=="" || paycode3==curPaycode )
			{
				paycode3=curPaycode;
				payamt3=payamt3*1+curPayamt;
			}
			else if( paycode4=="" || paycode4==curPaycode )
			{
				paycode4=curPaycode;
				payamt4=payamt4*1+curPayamt;
			}
			else if( paycode5=="" || paycode5==curPaycode )
			{
				paycode5=curPaycode;
				payamt5=payamt5*1+curPayamt;
			}
			else if( paycode6=="" || paycode6==curPaycode )
			{
				paycode6=curPaycode;
				payamt6=payamt6*1+curPayamt;
			}
			if(checkNull(row.bcsinfotype)==1)
			 	curProjectAmt=curProjectAmt*1+curPayamt*1;
			 else
			 	curGoodsAmt=curGoodsAmt*1+curPayamt*1;
		}
	}
	//第一支付
	if(paycode1!="")
	{
		document.getElementById("paycode1_div").style.display="block";
		document.getElementById("paycode1_img").src=contextURL+"/common/funtionimage/paycode"+paycode1+".jpg"
		document.getElementById("payamt1_lb").innerHTML=ForDight(payamt1*1,1);
		document.getElementById("strPayMode1").value=paycode1;
		document.getElementById("dPayAmt1").value=payamt1;
	}
	else
	{
		document.getElementById("paycode1_div").style.display="none";
		document.getElementById("paycode1_img").src=contextURL+"/common/funtionimage/paycode"+paycode1+".jpg"
		document.getElementById("payamt1_lb").innerHTML=0;
		document.getElementById("strPayMode1").value="";
		document.getElementById("dPayAmt1").value=0;
	}
	//第二支付
	if(paycode2!="")
	{
		document.getElementById("paycode2_div").style.display="block";
		document.getElementById("paycode2_img").src=contextURL+"/common/funtionimage/paycode"+paycode2+".jpg"
		document.getElementById("payamt2_lb").innerHTML=ForDight(payamt2*1,1);
		document.getElementById("strPayMode2").value=paycode2;
		document.getElementById("dPayAmt2").value=payamt2;
	}
	else
	{
		document.getElementById("paycode2_div").style.display="none";
		document.getElementById("paycode2_img").src=contextURL+"/common/funtionimage/paycode"+paycode2+".jpg"
		document.getElementById("payamt2_lb").innerHTML=0;
		document.getElementById("strPayMode2").value="";
		document.getElementById("dPayAmt2").value=0;
	}
	//第三支付
	if(paycode3!="")
	{
		document.getElementById("paycode3_div").style.display="block";
		document.getElementById("paycode3_img").src=contextURL+"/common/funtionimage/paycode"+paycode3+".jpg"
		document.getElementById("payamt3_lb").innerHTML=ForDight(payamt3*1,1);
		document.getElementById("strPayMode3").value=paycode3;
		document.getElementById("dPayAmt3").value=payamt3;
	}
	else
	{
		document.getElementById("paycode3_div").style.display="none";
		document.getElementById("paycode3_img").src=contextURL+"/common/funtionimage/paycode"+paycode3+".jpg"
		document.getElementById("payamt3_lb").innerHTML=0;
		document.getElementById("strPayMode3").value="";
		document.getElementById("dPayAmt3").value=0;
	}
	//第四支付
	if(paycode4!="")
	{
		document.getElementById("paycode4_div").style.display="block";
		document.getElementById("paycode4_img").src=contextURL+"/common/funtionimage/paycode"+paycode4+".jpg"
		document.getElementById("payamt4_lb").innerHTML=ForDight(payamt4*1,1);
		document.getElementById("strPayMode4").value=paycode4;
		document.getElementById("dPayAmt4").value=payamt4;
	}
	else
	{
		document.getElementById("paycode4_div").style.display="none";
		document.getElementById("paycode4_img").src=contextURL+"/common/funtionimage/paycode"+paycode4+".jpg"
		document.getElementById("payamt4_lb").innerHTML=0;
		document.getElementById("strPayMode4").value="";
		document.getElementById("dPayAmt4").value=0;
	}
	//第五支付
	if(paycode5!="")
	{
		document.getElementById("paycode5_div").style.display="block";
		document.getElementById("paycode5_img").src=contextURL+"/common/funtionimage/paycode"+paycode5+".jpg"
		document.getElementById("payamt5_lb").innerHTML=ForDight(payamt5*1,1);
		document.getElementById("strPayMode5").value=paycode5;
		document.getElementById("dPayAmt5").value=payamt5;
	}
	else
	{
		document.getElementById("paycode5_div").style.display="none";
		document.getElementById("paycode5_img").src=contextURL+"/common/funtionimage/paycode"+paycode5+".jpg"
		document.getElementById("payamt5_lb").innerHTML=0;
		document.getElementById("strPayMode5").value="";
		document.getElementById("dPayAmt5").value=0;
	}
	//第六支付
	if(paycode6!="")
	{
		document.getElementById("paycode6_div").style.display="block";
		document.getElementById("paycode6_img").src=contextURL+"/common/funtionimage/paycode"+paycode6+".jpg"
		document.getElementById("payamt6_lb").innerHTML=ForDight(payamt6*1,1);
		document.getElementById("strPayMode6").value=paycode6;
		document.getElementById("dPayAmt6").value=payamt6;
	}
	else
	{
		document.getElementById("paycode6_div").style.display="none";
		document.getElementById("paycode6_img").src=contextURL+"/common/funtionimage/paycode"+paycode6+".jpg"
		document.getElementById("payamt6_lb").innerHTML=0;
		document.getElementById("strPayMode6").value="";
		document.getElementById("dPayAmt6").value=0;
	}
	document.getElementById("dProjectAmt").innerHTML=ForDight(curProjectAmt*1,1);
	document.getElementById("dGoodsAmt").innerHTML=ForDight(curGoodsAmt*1,1);
	document.getElementById("dTotalsAmt").innerHTML=ForDight(curGoodsAmt*1+curProjectAmt*1,1);
	
}
//------------------------------------------------------验证支付方式End
//------------------------------------------------------获取疗程明细
  	function f_onCheckRow(checked, data)
  	{
       	if (checked) 
       	{
          	addCheckedBcodekey(data.bproseqno);
      	}
	 	else 
	 	{
         	removeCheckedBcodekey(data.bproseqno);
  		}
	}
   	var checkedBcodekey= [];
        
   	function findCheckedBcodekey(bproseqno)
   	{
    	for(var i =0;i<checkedBcodekey.length;i++)
       	{
       		if(checkedBcodekey[i] == bproseqno) return i;
       	}
     	return -1;
  	}
    function addCheckedBcodekey(bproseqno)
    {
     	if(findCheckedBcodekey(bproseqno) == -1)
         	checkedBcodekey.push(bproseqno);
    }
    function removeCheckedBcodekey(bproseqno)
    {
    	var i = findCheckedBcodekey(bproseqno);
  		if(i==-1) return;
    		checkedBcodekey.splice(i,1);
    }
   	function itemclick_proInfo(item)
    {
    	try
    	{
    		var detiallength=commoninfodivdetial.rows.length*1;
	    	for (var rowid in commoninfodivdetial_Pro.records)
			{
				if(findCheckedBcodekey(commoninfodivdetial_Pro.records[rowid]['bproseqno'])!=-1)
				{	
					var row =commoninfodivdetial_Pro.records[rowid]; 
					if(checkNull(row.curcostcount)=="" || row.curcostcount==0)
					{
						continue;
					}
					if(detiallength==0)
					{
						addRecord();
						detiallength=detiallength+1;
					}
					else if( commoninfodivdetial.getRow(0)['csitemname']!="")
					{
						addRecord();
						detiallength=detiallength+1;
					}
					var curlastcount=ForDight(row.lastcount,1);
					var curlastamt=ForDight(row.lastamt,1);
					var curprice=ForDight(curlastamt/curlastcount,1)
					var curcostamt=ForDight(curprice*1*row.curcostcount*1,1);
					curRecord=commoninfodivdetial.getRow(detiallength-1);
					var rowdata=commoninfodivdetial.updateRow(curRecord,{csitemname: row.bprojectname,csitemno:row.bprojectno,csitemcount:ForDight(row.curcostcount,1),
     				csunitprice:curprice,csitemamt:curcostamt,csdiscount:1,cspaymode:'9',csfirstsaler:'',csfirsttype:'',csfirstshare:'',
     				cssecondsaler:'',cssecondtype:'',cssecondshare:'',csthirdsaler:'',csthirdtype:'',csthirdshare:'',csproseqno:row.bproseqno});  
   	 				
				}
			}
			var detialprolen=commoninfodivdetial_Pro.rows.length*1;
			for (var i=0;i<detialprolen;i++)
			{
				if(findCheckedBcodekey(commoninfodivdetial_Pro.getRow(i)['bproseqno'])!=-1)
				{
					if(checkNull(commoninfodivdetial_Pro.getRow(i)['curcostcount'])=="" || checkNull(commoninfodivdetial_Pro.getRow(i)['curcostcount'])==0)
					{
						continue;
					}
					commoninfodivdetial_Pro.deleteRow(i);
					detialprolen=detialprolen-1;
				}
			}
			initDetialGrid();
			handPayList();
		}catch(e){alert(e.message);}
    }    
    
      
    function comCostProAfterEdit(e)
	{
		if(e.record.curcostcount!="" && e.record.lastcount *1 < e.record.curcostcount)
		{
			$.ligerDialog.warn("当次疗程消耗次数不能超过剩余次数!");
			commoninfodivdetial_Pro.updateRow(e.record,{curcostcount: 0}); 
		}
		
		

	}



function initDetialGrid()
{
	for (var rowid in commoninfodivdetial.records)
	{
		var row =commoninfodivdetial.records[rowid];
		if(checkNull(row.cspaymode)==9 || checkNull(row.cspaymode)==16 || checkNull(row.cspaymode)==13 || checkNull(row.cspaymode)==11)
			showTextByinfoType(row,2);     
		else
			showTextByinfoType(row,1);   		 
	}
}
function comsumAfterEdit(e)
{

	initDetialGrid();
	
}

function comsumbeforeEdit(e)
{
	
}
function showTextByinfoType(rowdata,readType)
{
	try
	{
	
	var column  =null ;

	if(rowdata.bcsinfotype==1)
	{
		column=commoninfodivdetial.columns[9];
		commoninfodivdetial.setCellEditing(rowdata, column, true);
		column=commoninfodivdetial.columns[12];
		commoninfodivdetial.setCellEditing(rowdata, column, true);
		column=commoninfodivdetial.columns[15];
		commoninfodivdetial.setCellEditing(rowdata, column, true);
		
		/*column=commoninfodivdetial.columns[9];
		commoninfodivdetial.toggleCol(column, true);
		column=commoninfodivdetial.columns[12];
		commoninfodivdetial.toggleCol(column, true);
		column=commoninfodivdetial.columns[15];
		commoninfodivdetial.toggleCol(column, true);
		column=commoninfodivdetial.columns[8];
		commoninfodivdetial.toggleCol(column, false);
		column=commoninfodivdetial.columns[11];
		commoninfodivdetial.toggleCol(column, false);
		column=commoninfodivdetial.columns[14];
		commoninfodivdetial.toggleCol(column, false);*/

	}
	else
	{
	
		/*column=commoninfodivdetial.columns[9];
		commoninfodivdetial.toggleCol(column, false);
		column=commoninfodivdetial.columns[12];
		commoninfodivdetial.toggleCol(column, false);
		column=commoninfodivdetial.columns[15];
		commoninfodivdetial.toggleCol(column, false);
		column=commoninfodivdetial.columns[8];
		commoninfodivdetial.toggleCol(column, true);
		column=commoninfodivdetial.columns[11];
		commoninfodivdetial.toggleCol(column, true);
		column=commoninfodivdetial.columns[14];
		commoninfodivdetial.toggleCol(column, true);*/
		column=commoninfodivdetial.columns[8];
		commoninfodivdetial.setCellEditing(rowdata, column, true);
		column=commoninfodivdetial.columns[11];
		commoninfodivdetial.setCellEditing(rowdata, column, true);
		column=commoninfodivdetial.columns[14];
		commoninfodivdetial.setCellEditing(rowdata, column, true);
		
	}
	
		if(readType==2)//项目,支付方式,数量金额屏蔽
		{
			column=commoninfodivdetial.columns[0];
			commoninfodivdetial.setCellEditing(rowdata, column, true);
			column=commoninfodivdetial.columns[1];
			commoninfodivdetial.setCellEditing(rowdata, column, true);
			column=commoninfodivdetial.columns[2];
			commoninfodivdetial.setCellEditing(rowdata, column, true);
			column=commoninfodivdetial.columns[5];
			commoninfodivdetial.setCellEditing(rowdata, column, true);
			column=commoninfodivdetial.columns[6];
			commoninfodivdetial.setCellEditing(rowdata, column, true);
		}
	}
	catch(e){alert(e.message);}
}

//-----------------------------------项目明细按钮
    function itemclick_serviceInfo(item)
    {
    	try
    	{
	    	if(item.text=="增加")
		    {
		       addRecord();
		    }
		    else if(item.text=="删除")
		    {
		       deleteCurRecord();
		    } 	
		       
    	}
    	catch(e){alert(e.message);}
    }
    
    function addRecord()
    {
    		if(addRecordFlag==1)
    		{
    			$.ligerDialog.warn("明细不可新增,请确认!");
    			return ;
    		}
    		var row = commoninfodivdetial.getSelectedRow();
			//参数1:rowdata(非必填)
			//参数2:插入的位置 Row Data 
			//参数3:之前或者之后(非必填)
			commoninfodivdetial.addRow({ 
				bcsinfotype: "1",
				csitemno:"",
				csitemunit:"",
				csitemcount:0,
				csunitprice:0,
				csdiscount:0,
				csdisprice:0,
				csitemamt:0,
				cspaymode:"",
				csfirstsaler:"",
				csfirsttype:"",
				csfirstinid:"",
				csfirstshare:"",
				cssecondsaler:"",
				cssecondtype:"",
				cssecondinid:"",
				cssecondshare:"",
				csthirdsaler:"",
				csthirdtype:"",
				csthirdinid:"",
				csthirdshare:"",
				csitemname: "" ,
				csproseqno:""              
				}, row, false);
		initDetialGrid();
		curEmpManger=null;
		curitemManger=null;
    }
    
   
    function deleteCurRecord()
    {
    	$.ligerDialog.confirm('确认删除当前选中行?', function (result)
		{
		    if( result==true)
           	{
				commoninfodivdetial.deleteSelectedRow();
			}
		});  
    	
    }
    
    //-----------------------------------保存消费信息
    function editCurRecord()
    {
    	if(parent.hasFunctionRights( "CC011",  "UR_POST")!=true)
        {
        	$.ligerDialog.warn("该用户没有修改权限,请确认!");
        	return;
        }
   		if(pageState==3)
   		{
   			$.ligerDialog.warn("非新增单据,不可保存!");
   			return;
   		}
   		else
   		{
   			
   			$.ligerDialog.confirm('确认保存当前消费单?', function (result)
			{
			    if( result==true)
	           	{
	   				var queryStringTmp=$('#consumCenterForm').serialize();//serialize('#detailForm');
	
					var requestUrl ="cc011/post.action";
					var params=queryStringTmp;
					var strJsonParam_five="";
					var curjosnparam ="";
					var needReplaceStr="";
					var keepPayamt=0;
					var diyongPayamt=0;
					var jifenPayamt=0;
					for (var rowid in commoninfodivdetial.records)
					{
						 	var row =commoninfodivdetial.records[rowid];
						 	if(row['cspaymode']=="4" || row['cspaymode']=='5')
						 	{
						 		keepPayamt=keepPayamt*1+row['csitemamt']*1;
						 	}
						 	else if(row['cspaymode']=="12" )
						 	{
						 		diyongPayamt=diyongPayamt*1+row['csitemamt']*1;
						 	}
						 	else if(row['cspaymode']=="7" )
						 	{
						 		jifenPayamt=jifenPayamt*1+row['csitemamt']*1;
						 	}
						 	curjosnparam=JSON.stringify(row);
							if(curjosnparam.indexOf("_id")>-1)
						  	{
						     	needReplaceStr=curjosnparam.substring(curjosnparam.indexOf("_id")-3,curjosnparam.length-1);
						      	curjosnparam=curjosnparam.replace(needReplaceStr,"");
						    }	            		   
						    if(strJsonParam_five!="")
						      	strJsonParam_five=strJsonParam_five+",";
						    strJsonParam_five= strJsonParam_five+curjosnparam;        		 
					 }	
					 if(ForDight(keepPayamt*1,1)>ForDight(document.getElementById("cscurkeepamt").value*1,1))
					 {
					 	$.ligerDialog.warn("消耗账户金额不能超过现有账户余额!");
					 	return ;
					 }
					 if(ForDight(jifenPayamt*1,1)>ForDight(document.getElementById("cardpointamt").value*1,1))
					 {
					 	$.ligerDialog.warn("消耗积分金额不能超过现有积分余额!");
					 	return ;
					 }
					 if(ForDight(diyongPayamt*1,1)>ForDight(document.getElementById("diyongcardnoamt").value*1,1))
					 {
					 	$.ligerDialog.warn("消耗抵用券金额不能超过现有抵用券额度!");
					 	return ;
					 }
					 if(strJsonParam_five!="")
					 {
					 	 params = params+"&strJsonParam=["+strJsonParam_five+"]";
					 }
					 if(paramtotiaomacardinfo!="")
					 {
					 	 params = params+"&paramtotiaomacardinfo=["+paramtotiaomacardinfo+"]";
					 }
					 var responseMethod="editMessage";		
					 showDialogmanager = $.ligerDialog.waitting('正在保存中,请稍候...');	
					 sendRequestForParams_p(requestUrl,responseMethod,params ); 
				}
			}); 
   		}
    }
    
     function editMessage(request)
     {
    		
        	try
			{
				showDialogmanager.close();
	        	var responsetext = eval("(" + request.responseText + ")");
	        	var strMessage=responsetext.strMessage;
	        	if(checkNull(strMessage)=="")
	        	{	        		 
	        		 $.ligerDialog.success("保存成功!");
	        		addConsumeInfo();
	        	}
	        	else
	        	{
	        		$.ligerDialog.warn(strMessage);
	        	}
        	}
			catch(e)
			{
				alert(e.message);
			}
      }
   
   	//刷新界面
   	function freshCurRecord()
   	{
   		addConsumeInfo();
   	}
	//查询单据
	function searchCurRecord()
	{
		if(document.getElementById("strSearchBillId").value!="")
		{
			var requestUrl ="cc011/searchCurRecord.action"; 
			var responseMethod="searchCurRecordMessage";	
			var params="strSearchBillId="+document.getElementById("strSearchBillId").value;			
			sendRequestForParams_p(requestUrl,responseMethod,params );
		}
	}
	function searchCurRecordMessage(request)
     {
    		
        	try
			{
	        	var responsetext = eval("(" + request.responseText + ")");
	        	commoninfodivdetial_Pro.options.data=$.extend(true, {},{Rows: null,Total:0});
	            commoninfodivdetial_Pro.loadData(true);  
	        	var curMconsumeinfo=responsetext.curMconsumeinfo;
	        	if(curMconsumeinfo==null)
	        	{	        		 
	        		 $.ligerDialog.success("无相关数据!");
	        		commoninfodivdetial.options.data=$.extend(true, {},{Rows: null,Total:0});
            		commoninfodivdetial.loadData(true);  
	        	}
	        	else
	        	{
	        		pageState=3;
	        		loadCurMaster(responsetext.curMconsumeinfo);
	        		if(responsetext.lsDconsumeinfos!=null && responsetext.lsDconsumeinfos.length>0)
			   		{
			   			commoninfodivdetial.options.data=$.extend(true, {},{Rows: responsetext.lsDconsumeinfos,Total: responsetext.lsDconsumeinfos.length});
		            	commoninfodivdetial.loadData(true);            	
			   		}
			   		commoninfodivdetial.options.clickToEdit=false;
			   		document.getElementById("dProjectAmt").innerHTML=ForDight(responsetext.DProjectAmt,1);
	        		document.getElementById("dGoodsAmt").innerHTML=ForDight(responsetext.DGoodsAmt,1);
	        		document.getElementById("dTotalsAmt").innerHTML=ForDight(responsetext.DProjectAmt*1,1)+ForDight(responsetext.DGoodsAmt*1,1);
			        handPayList();
			        
			        addRecordFlag=1;
	        	}
        	}
			catch(e)
			{
				alert(e.message);
			}
      }
      
      function validateDiyongcardno(obj)
      {
      		if(obj.value=="")
	      	{
	      		return ;
	      	}
	      	var requestUrl ="cc011/validateDiyongcardno.action"; 
			var responseMethod="validateDiyongcardnoMessage";	
			var params="strDiYongCardNo="+obj.value;			
			sendRequestForParams_p(requestUrl,responseMethod,params );
      }
      function validateDiyongcardnoMessage(request)
      {
    		
        	try
			{
	        	var responsetext = eval("(" + request.responseText + ")");
	        	var strMessage=responsetext.strMessage;
	        	if(checkNull(strMessage)=="")
	        	{	        		 
	        		lsDnointernalcardinfo=responsetext.lsDnointernalcardinfo;
	        		if(lsDnointernalcardinfo!=null && lsDnointernalcardinfo.length>0)
	        		{
	        			document.getElementById("diyongcardnoamt").value=0;
	        			$.ligerDialog.open({ url: contextURL+'/CC/CC011/showDiyongCardItems.jsp', title:'项目抵用券疗程明细',height: 500,width: 650, buttons: [ { text: '确定', onclick: function (item, dialog) { loadDiyongCardInfo(dialog); } }, { text: '取消', onclick: function (item, dialog) { paramtotiaomacardinfo="";dialog.close(); } } ] });
					}
					else
					{
						document.getElementById("diyongcardnoamt").value=ForDight(responsetext.DDiyongAmt,1);
					}
	        	}
	        	else
	        	{
	        		document.getElementById("diyongcardno").value="";
	        		$.ligerDialog.warn(strMessage);
	        	}
        	}
			catch(e)
			{
				alert(e.message);
			}
      }
      
      function validateTiaomacardno(obj)
      {	
      		if(obj.value=="")
	      	{
	      		return ;
	      	}
	      	var requestUrl ="cc011/validateTiaoMaCardNo.action"; 
			var responseMethod="validateTiaoMaCardNoMessage";	
			var params="strTiaoMaCardNo="+obj.value;			
			sendRequestForParams_p(requestUrl,responseMethod,params );
      }
      function validateTiaoMaCardNoMessage(request)
      {
    		
        	try
			{
	        	var responsetext = eval("(" + request.responseText + ")");
	        	var strMessage=responsetext.strMessage;
	        	if(checkNull(strMessage)=="")
	        	{	        		 
	        		lsDnointernalcardinfo=responsetext.lsDnointernalcardinfo;
	        		if(lsDnointernalcardinfo!=null)
	        		{
	        			$.ligerDialog.open({ url: contextURL+'/CC/CC011/showTiaoMaCardItems.jsp', title:'条码卡疗程明细',height: 500,width: 750, buttons: [ { text: '确定', onclick: function (item, dialog) { loadTiaoMaCardInfo(dialog); } }, { text: '取消', onclick: function (item, dialog) { paramtotiaomacardinfo="";dialog.close(); } } ] });
					}
	        	}
	        	else
	        	{
	        		document.getElementById("tiaomacardno").value="";
	        		$.ligerDialog.warn(strMessage);
	        	}
        	}
			catch(e)
			{
				alert(e.message);
			}
      }
      
        function loadDiyongCardInfo(dialog)
        {
        	document.getElementById("diyongcardno").readOnly="readOnly";
        	var row=commoninfodivfouth.getSelected();
        	if(row!=null)
        	{	
        		var lastCount=row.lastcount;
            	var lastAmt=row.lastamt;
            	var curprice=ForDight(lastAmt/lastCount,1)
        		var detiallength=commoninfodivdetial.rows.length*1;
        		if(detiallength==0)
				{
					addRecord();
					detiallength=detiallength+1;
				}
				else if( commoninfodivdetial.getRow(0)['csitemname']!="")
				{
					addRecord();
					detiallength=detiallength+1;
				}
        		curRecord=commoninfodivdetial.getRow(detiallength-1);
				commoninfodivdetial.updateRow(curRecord,{bcsinfotype:1,csitemname: row.ineritemname,csitemno: row.ineritemno,csitemcount:ForDight(lastCount,1),
     				csunitprice:curprice,csitemamt: lastAmt,csdiscount:1,cspaymode:'11',csfirstsaler:'',csfirsttype:'',csfirstshare:'',
     				cssecondsaler:'',cssecondtype:'',cssecondshare:'',csthirdsaler:'',csthirdtype:'',csthirdshare:''});  
   	 		}
        	dialog.close();
            initDetialGrid();
        }
    	function loadTiaoMaCardInfo(dialog)
    	{
    		document.getElementById("tiaomacardno").readOnly="readOnly";
    		paramtotiaomacardinfo="";
    		var curjosnparam ="";
			var needReplaceStr="";
			var rows = commoninfodivthirth.getCheckedRows();
            var str = "";
            var lastCount=0;
			var lastAmt=0;
			var costCount=0;
			var curprice = 0;
			var curcostamt=0;
			var detiallength=commoninfodivdetial.rows.length*1;
            $(rows).each(function ()
            {
            	lastCount=this.lastcount;
            	lastAmt=this.lastamt;
            	costcount=this.costcount;
            	if(costcount*1>lastCount*1)
            	{
            		$.ligerDialog.warn("取用疗程数量不能超过该疗程的剩余数量！");
            		paramtotiaomacardinfo="";
            		document.getElementById("tiaomacardno").value="";
            		document.getElementById("tiaomacardno").readOnly="";
            		return;
            	}
            	
            	if(detiallength==0)
				{
						addRecord();
						detiallength=detiallength+1;
				}
				else if( commoninfodivdetial.getRow(0)['csitemname']!="")
				{
						addRecord();
						detiallength=detiallength+1;
				}
				curprice=ForDight(lastAmt/lastCount,1)
				curcostamt=ForDight(curprice*1*costcount*1,1);
				commoninfodivthirth.updateRow(this,{costamt:ForDight(curcostamt*1,1)});
				curRecord=commoninfodivdetial.getRow(detiallength-1);
				commoninfodivdetial.updateRow(curRecord,{bcsinfotype:1,csitemname: this.ineritemname,csitemno:this.ineritemno,csitemcount:ForDight(costcount,1),
     				csunitprice:curprice,csitemamt:curcostamt,csdiscount:1,cspaymode:'13',csfirstsaler:'',csfirsttype:'',csfirstshare:'',
     				cssecondsaler:'',cssecondtype:'',cssecondshare:'',csthirdsaler:'',csthirdtype:'',csthirdshare:''});  
   	 				
   	 			curjosnparam=JSON.stringify(this);
                if(curjosnparam.indexOf("_id")>-1)
				{
					needReplaceStr=curjosnparam.substring(curjosnparam.indexOf("_id")-3,curjosnparam.length-1);
					curjosnparam=curjosnparam.replace(needReplaceStr,"");
				}
				 if(paramtotiaomacardinfo!="")
					paramtotiaomacardinfo=paramtotiaomacardinfo+",";
				paramtotiaomacardinfo= paramtotiaomacardinfo+curjosnparam; 	 
            });
            dialog.close();
            initDetialGrid();
    	}
      function validateTuangoucardno(obj)
      {
	      	if(obj.value=="")
	      	{
	      		return ;
	      	}
	      	var requestUrl ="cc011/validateTuanGouCardNo.action"; 
			var responseMethod="validateTuanGouCardNoMessage";	
			var params="strTuanGouCardNo="+obj.value;			
			sendRequestForParams_p(requestUrl,responseMethod,params );
      }
     function validateTuanGouCardNoMessage(request)
     {
    		
        	try
			{
	        	var responsetext = eval("(" + request.responseText + ")");
	        	var strMessage=responsetext.strMessage;
	        	if(checkNull(strMessage)=="")
	        	{	        		 
	        		var curCorpsbuyinfo=responsetext.curCorpsbuyinfo;
	        		commoninfodivdetial.options.data=$.extend(true, {},{Rows: null,Total:0});
            		commoninfodivdetial.loadData(true);  
            		addRecord();
            		curRecord=commoninfodivdetial.getRow(0);
            		commoninfodivdetial.updateRow(curRecord,{bcsinfotype:1,csitemname:curCorpsbuyinfo.corpspicname,csitemno: curCorpsbuyinfo.corpspicno,csitemcount:1,
     				csunitprice:curCorpsbuyinfo.corpsamt,csitemamt:curCorpsbuyinfo.corpsamt,csdiscount:1,cspaymode:16});
	        		document.getElementById("tuangoucardno").readOnly="readOnly";
	        	
	        		var column=commoninfodivdetial.columns[0];
					commoninfodivdetial.setCellEditing(curRecord, column, true);
					column=commoninfodivdetial.columns[1];
					commoninfodivdetial.setCellEditing(curRecord, column, true);
					column=commoninfodivdetial.columns[2];
					commoninfodivdetial.setCellEditing(curRecord, column, true);
					column=commoninfodivdetial.columns[5];
					commoninfodivdetial.setCellEditing(curRecord, column, true);
					column=commoninfodivdetial.columns[6];
					commoninfodivdetial.setCellEditing(curRecord, column, true);
					commoninfodivdetial_Pro.options.clickToEdit=false;
					addRecordFlag=1;
					handPayList();
	        	}
	        	else
	        	{
	        		document.getElementById("tuangoucardno").value="";
	        		$.ligerDialog.warn(strMessage);
	        	}
        	}
			catch(e)
			{
				alert(e.message);
			}
      }
      
      //---------------------------------------------回车事件
		function hotKeyOfSelf(key)
		{
			if(key==13)//回车
			{
				hotKeyEnter();
			}
			else if(key==114)//F3
			{
				addRecord();
			}
			else if(key==115)//F4
			{
				 deleteCurRecord();
			}
			else if( key == 83 &&  event.altKey)
			{
				editCurRecord();
			}
	
		}
		
		function  hotKeyEnter()
		{
		
			try
			{
					var fieldName = document.activeElement.name;
					var fieldId = document.activeElement.id ;
					if(fieldId=="cscardno" && document.getElementById("cscardno").value=="散客")
					{
						document.forms["consumCenterForm"].elements["csname"].select();
					}
					else if(fieldId=="cscardno" && document.getElementById("cscardno").value!="散客")
					{
						document.forms["consumCenterForm"].elements["csmanualno"].select();
					}
					else if(fieldId=="csname")
					{
						document.forms["consumCenterForm"].elements["csmanualno"].select();
					}
					else if(fieldId=="csmanualno")
					{
						document.forms["consumCenterForm"].elements["tuangoucardno"].select();
					}
					else if(fieldId=="tuangoucardno")
					{
						document.forms["consumCenterForm"].elements["tiaomacardno"].select();
					}
					else
					{
						window.event.keyCode=9; //tab
						window.event.returnValue=true;
					}
					if(curEmpManger!=null)
					{
						curEmpManger.selectBox.hide();
					}
					if(curitemManger!=null)
					{
						curitemManger.selectBox.hide();
					}
				
			}
			catch(e){alert(e.message);}
				
		}   

    //-----------------------------------右侧面板营业分析 start
    		function dataAnalysis_before(tabid)
			{
				
				
			}
			function dataAnalysis_after(tabid)
			{
				if(tabid=="tabitem1")//点击营业分析显示事件
				{
					
				}
				else//点击单据分析显示事件
				{
					
				}
			}
    //---------------------------------------------右侧图形报表 start
				
				function drawBarChart(cTitle, cXTitle, cYTitle, cXValue, cYValue,topdiv) {
				// cTitle 标题；cXTitle x轴标题, cYTitle y轴标题, cXValue x轴值, cYValue y轴值；
				var yValues = cYValue.split(',');
				var yArray = new Array();
				for (i = 0; i < yValues.length; i++) {
					yArray[i] = formatFloat(Number(yValues[i]), 2);
				};
	
				var chart = new Highcharts.Chart({
							chart : {
								renderTo : 'pic_div',
								defaultSeriesType : 'bar'
							},
							title : {
								text : cTitle
							},
							xAxis : {
								categories : cXValue.split(','),
								title : {
									text : cXTitle
								}
							},
							yAxis : {
								min : 0,
								title : {
									text : cYTitle,
									align : 'high'
								}
							},
							tooltip : {
								formatter : function() {
									return '' + this.series.name + ': ' + this.y;
								}
							},
							plotOptions : {
								bar : {
									dataLabels : {
										enabled : true
									}
								}
							},
							legend : {
								enabled : false
							},
							credits : {
								enabled : false
							},
							series : [{
										name : cYTitle,
										data : yArray
									}]
						});
			
				
			}
			
			function formatFloat(src, pos) {
				return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
			}
			
		
			
			function changeBarChartByDate(date)
			{	
				var strYear=date.getFullYear();
				var strMonth=date.getMonth()*1+1;
				if(strMonth*1<10)
					strMonth="0"+strMonth;
				var strDay=date.getDate();
				if(strDay*1<10)
					strDay="0"+strDay;
			
				var requestUrl ="cc011/loadTradeAmt.action"; 
				var responseMethod="loadTradeAmtMessage";	
				var params="strSearchDate="+strYear+strMonth+strDay;			
				 showDialogmanager = $.ligerDialog.waitting('正在加载中,请稍候...');
				sendRequestForParams_p(requestUrl,responseMethod,params );
				
			}	
			
			 function loadTradeAmtMessage(request)
		     {
		    		
		        	try
					{
						showDialogmanager.close();
			        	var responsetext = eval("(" + request.responseText + ")");
			        	var curTradeAnalysis=responsetext.curTradeAnalysis;
			        	if(curTradeAnalysis==null)
			        	{	     
			        		    		 
			        		 $.ligerDialog.success("无记录");
			        		
			        	}
			        	else
			        	{
			        		drawBarChart('', '', '金额', '现金,银行卡,指付通,Ok卡,团购卡,储值消费,疗程消费,项目-券,现金-券,条码卡,美容业绩,美发业绩,烫染业绩,美甲业绩,总虚业绩,总实业绩', 
							''+curTradeAnalysis.tradecashamt+','+curTradeAnalysis.tradebankamt+','+curTradeAnalysis.tradefingeramt+','+
							''+curTradeAnalysis.tradeokcardamt+','+curTradeAnalysis.tradetgcardamt+','+curTradeAnalysis.tradeczcardamt+','+
							''+curTradeAnalysis.tradelccardamt+','+curTradeAnalysis.tradeprojdyamt+','+curTradeAnalysis.tradecashdyamt+','+
							''+curTradeAnalysis.tradetmcardamt+','+curTradeAnalysis.trademrfakeamt+','+curTradeAnalysis.trademffakeamt+','+
							''+curTradeAnalysis.tradetrfakeamt+','+curTradeAnalysis.tradefgfakeamt+','+curTradeAnalysis.tradetotalamt+','+curTradeAnalysis.traderealtotalamt+'','#pic_show_div');
			        	}
		        	}
					catch(e)
					{
						alert(e.message);
					}
		      } 
			function initload()
			{
				try
				{
					drawBarChart('', '', '金额', '现金,银行卡,指付通,Ok卡,团购卡,储值消费,疗程消费,项目-券,现金-券,条码卡,美容业绩,美发业绩,烫染业绩,美甲业绩,总虚业绩,总实业绩', 
					'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0','#pic_show_div');
				}
				catch(e)
				{
					alert(e.message);
				}
			
			}
//---------------------------------------------右侧图形报表 end