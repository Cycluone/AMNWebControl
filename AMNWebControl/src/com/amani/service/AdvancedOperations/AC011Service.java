package com.amani.service.AdvancedOperations;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.sql.rowset.CachedRowSet;

import org.hibernate.Query;
import org.springframework.stereotype.Service;

import com.amani.action.AnlyResultSet;
import com.amani.bean.CallingAdminBean;
import com.amani.bean.CallsWatingBean;
import com.amani.service.AMN_ModuleService;
import com.amani.tools.CommonTool;
@Service
public class AC011Service  extends AMN_ModuleService{
	 public List<CallsWatingBean> cardreturning(String calluserid){
			String strSql;
			strSql=" select billtype='挂失',membername,a.calledon,callhoues,cardreturningcontent,cardreturningdetails,cardreturning.callbillid,cardreturningtime " +
					"from cardreturning  left join callwaiting a on  a.callbillid=cardreturning.callbillid  left join memberinfo on callon=membermphone left join " +
					"callditails on callditails.callon=a.callon " +
					"where cardreturning.calluserid='"+calluserid+"' or '"+calluserid+"'=''" +
					" group by membername,a.calledon,callhoues,cardreturningcontent,cardreturningdetails,cardreturning.callbillid,cardreturningtime  order by cardreturning.callbillid desc";
		   AnlyResultSet<List<CallsWatingBean>> analysis = new AnlyResultSet<List<CallsWatingBean>>() {
				List<CallsWatingBean> ls=new ArrayList<CallsWatingBean>();
				public List<CallsWatingBean> anlyResultSet(ResultSet rs) {
					try {
						while(rs!=null&&rs.next()){
							CallsWatingBean bean=new CallsWatingBean();
							bean.setBilltype(CommonTool.FormatString(rs.getString("billtype")));
							if(CommonTool.FormatString(rs.getString("callhoues")).length()>=8)
							{
								bean.setCallhoues(CommonTool.FormatString(rs.getString("callhoues")).substring(0,8));
							}
							else
							{
								bean.setCallhoues(CommonTool.FormatString(rs.getString("callhoues")));
							}
							bean.setMembername(CommonTool.FormatString(rs.getString("membername")));
							bean.setCardreturningcontent(CommonTool.FormatString(rs.getString("cardreturningcontent")));
							bean.setCardreturningdetails(CommonTool.FormatString(rs.getString("cardreturningdetails")));
							bean.setCallbillid(CommonTool.FormatString(rs.getString("callbillid")));
							bean.setCardreturningtime(getDateMaskss(CommonTool.FormatString(rs.getString("cardreturningtime").replace("_", ""))));
							ls.add(bean);
						}
					} catch (Exception e) {
						e.printStackTrace();
						return null;
					}
					return ls;
				}
			};
			List<CallsWatingBean> ls  =(List<CallsWatingBean> )this.amn_Dao.executeQuery_ex(strSql, analysis);
			analysis=null;
			return ls;
			}
	 

		/**
		 * 投诉报表
		 * @return
		 */
		 public List<CallsWatingBean> peiierbao(String calluserid ){
				String strSql;
				strSql="select billtype='投诉',membername,a.calledon,callhoues,peiiercontent,peiierdetails,peiier.callbillid,peiiertime from peiier " +
						" left join callwaiting a on  a.callbillid=peiier.callbillid  left join memberinfo on callon=membermphone left join" +
						" callditails on callditails.callon=a.callon" +
						" where peiier.calluserid='"+calluserid+"' or '"+calluserid+"'=''" +
						" group by membername,a.calledon,callhoues,peiiercontent,peiierdetails,peiier.callbillid,peiiertime  order by peiier.callbillid desc";
			   AnlyResultSet<List<CallsWatingBean>> analysis = new AnlyResultSet<List<CallsWatingBean>>() {
					List<CallsWatingBean> ls=new ArrayList<CallsWatingBean>();
					public List<CallsWatingBean> anlyResultSet(ResultSet rs) {
						try {
							while(rs!=null&&rs.next()){
								CallsWatingBean bean=new CallsWatingBean();
								bean.setBilltype(CommonTool.FormatString(rs.getString("billtype")));
								bean.setMembername(CommonTool.FormatString(rs.getString("membername")));
								if(CommonTool.FormatString(rs.getString("callhoues")).length()>=8)
								{
									bean.setCallhoues(CommonTool.FormatString(rs.getString("callhoues").substring(0,8)));
								}
								else
								{
									bean.setCallhoues(CommonTool.FormatString(rs.getString("callhoues")));
								}
								bean.setPeiiertime(getDateMaskss(CommonTool.FormatString(rs.getString("peiiertime").replace("_", ""))));
								bean.setPeiiercontent(CommonTool.FormatString(rs.getString("peiiercontent")));
								bean.setPeiierdetails(CommonTool.FormatString(rs.getString("peiierdetails")));
								bean.setCallbillid(CommonTool.FormatString(rs.getString("callbillid")));
								ls.add(bean);
							}
						} catch (Exception e) {
							e.printStackTrace();
							return null;
						}
						return ls;
					}
				};
				List<CallsWatingBean> ls  =(List<CallsWatingBean> )this.amn_Dao.executeQuery_ex(strSql, analysis);
				analysis=null;
				return ls;
				}
		 
		/**
		 * 咨询报表
		 * @return
		 */
		public List<CallsWatingBean> referbao(String calluserid ){
			String strSql;
			strSql="select billtype='咨询' ,membername,callhoues,b.calluserid,b.callbillid,b.refertime,refercomply,refercards,referproject," +
					"referdetails from  refer b  left join callwaiting a on  a.callbillid=b.callbillid  left join memberinfo on " +
					"callon=membermphone  left join callditails on callditails.callon=a.callon   " +
					"where b.calluserid='"+calluserid+"' or '"+calluserid+"'=''" +
					" group by membername,callhoues,a.calledon,a.agentnum,a.offertime, a.callon,b.calluserid,b.callbillid,b.refertime,b.feferstate ,refercomply,refercards,referproject,referdetails  order by callbillid desc";
		   AnlyResultSet<List<CallsWatingBean>> analysis = new AnlyResultSet<List<CallsWatingBean>>() {
				List<CallsWatingBean> ls=new ArrayList<CallsWatingBean>();
				public List<CallsWatingBean> anlyResultSet(ResultSet rs) {
					try {
						while(rs!=null&&rs.next()){
							CallsWatingBean bean=new CallsWatingBean();
							bean.setBilltype(CommonTool.FormatString(rs.getString("billtype")));
							bean.setRefertime(getDateMaskss(CommonTool.FormatString(rs.getString("refertime")).replace("_", "")));
							bean.setMembername(CommonTool.FormatString(rs.getString("membername")));
							bean.setCalluserid(CommonTool.FormatString(rs.getString("calluserid")));
							bean.setCallbillid(CommonTool.FormatString(rs.getString("callbillid")));
							bean.setRefercomply(CommonTool.FormatString(rs.getString("refercomply")));
							bean.setRefercards(CommonTool.FormatString(rs.getString("refercards")));
							bean.setReferproject(CommonTool.FormatString(rs.getString("referproject")));
							bean.setReferdetails(CommonTool.FormatString(rs.getString("referdetails")));
							if(CommonTool.FormatString(rs.getString("callhoues")).length()>=8)
							{
								bean.setCallhoues(CommonTool.FormatString(rs.getString("callhoues")).substring(0,8));
							}
							else
							{
								bean.setCallhoues(CommonTool.FormatString(rs.getString("callhoues")));
							}
							ls.add(bean);
						}
					} catch (Exception e) {
						e.printStackTrace();
						return null;
					}
					return ls;
				}
			};
			List<CallsWatingBean> ls  =(List<CallsWatingBean> )this.amn_Dao.executeQuery_ex(strSql, analysis);
			analysis=null;
			return ls;
			}
		/**
		 * 预约报表
		 * @return
		 */
		public List<CallsWatingBean> orderbao(String calluserid ){
			String strSql;
			strSql="select billtype='预约',membername,callhoues,a.calledon,a.agentnum,a.offertime,a.callon,a.calluserid,b.callbillid,b.ordertime," +
					"b.orderstate,b.orderproject,orderdetail,b.orderusermf, b.orderusertrh,b.orderusermr from  orders b  " +
					"left join callwaiting a on  a.callbillid=b.callbillid    left join memberinfo on callon=membermphone left join callditails " +
					"  on callditails.callon=a.callon  " +
					"where b.calluserid='"+calluserid+"' or '"+calluserid+"'=''" +
					" group by membername,callhoues,a.calledon,a.agentnum,a.offertime,a.callon,a.calluserid,b.callbillid,b.ordertime, b.orderstate,b.orderproject,orderdetail,b.orderusermf,b.orderusertrh,b.orderusermr order by callbillid desc";
		   AnlyResultSet<List<CallsWatingBean>> analysis = new AnlyResultSet<List<CallsWatingBean>>() {
				List<CallsWatingBean> ls=new ArrayList<CallsWatingBean>();
				String strtProject="";
				String strProjectName="";
				public List<CallsWatingBean> anlyResultSet(ResultSet rs) {
					try {
						while(rs!=null&&rs.next()){
							CallsWatingBean bean=new CallsWatingBean();
							bean.setCalled_no(CommonTool.FormatString(rs.getString("calledon")));
							if(CommonTool.FormatString(rs.getString("callhoues")).length()>=8)
							{
								bean.setCallhoues(CommonTool.FormatString(rs.getString("callhoues")).substring(0,8));
							}
							bean.setAgent_num(CommonTool.FormatString(rs.getString("agentnum")));
							bean.setMembername(CommonTool.FormatString(rs.getString("membername")));
							bean.setOffer_time(setTimeMaskes(CommonTool.FormatString(rs.getString("offertime"))));
							bean.setOrdertime(getDateMaskss(CommonTool.FormatString(rs.getString("ordertime").replace("-", ""))));
							bean.setOrdertimes(setTime(CommonTool.FormatString(rs.getString("ordertime")))+setTimes(CommonTool.FormatString(rs.getString("ordertime"))));
							bean.setOrderstate(CommonTool.FormatInteger(rs.getInt("orderstate")));
							bean.setCall_no(CommonTool.FormatString(rs.getString("callon")));
							bean.setBilltype(CommonTool.FormatString(rs.getString("billtype")));
							bean.setCalluserid(CommonTool.FormatString(rs.getString("calluserid")));
							bean.setCallbillid(CommonTool.FormatString(rs.getString("callbillid")));
							strtProject =CommonTool.FormatString(rs.getString("orderproject"));
							bean.setOrderdetail(CommonTool.FormatString(rs.getString("orderdetail")));
							bean.setBillofUser("["+CommonTool.FormatString(rs.getString("orderusermf"))+"]"+"["+CommonTool.FormatString(rs.getString("orderusertrh"))+"]"+"["+CommonTool.FormatString(rs.getString("orderusermr"))+"]");
							strProjectName="";
							if(!strtProject.equals("") && CommonTool.FormatString(rs.getString("billtype")).equals("预约"))
							{
								String[] lsprj=strtProject.split(";");
								
								if(lsprj!=null && lsprj.length>0)
								{
									for(int i=0;i<lsprj.length;i++)
									{
										if(lsprj[i].toString().equals("300"))
										{
											strProjectName=strProjectName+"[美发项目]";
										}
										else if(lsprj[i].toString().equals("600"))
										{
											strProjectName=strProjectName+"[烫染项目]";
										}
										else if(lsprj[i].toString().equals("400"))
										{
											strProjectName=strProjectName+"[美容项目]";
										}

									}
								}
								bean.setOrderproject(CommonTool.FormatString(strProjectName));
							}
							bean.setOrderproject(strtProject);
							ls.add(bean);
						}
					} catch (Exception e) {
						e.printStackTrace();
						return null;
					}
					return ls;
				}
			};
			List<CallsWatingBean> ls  =(List<CallsWatingBean> )this.amn_Dao.executeQuery_ex(strSql, analysis);
			analysis=null;
			return ls;
			}
		
		/**
		 * 电话报表
		 */
		public List<CallingAdminBean> callbao(String calltype,String calluserid){
			String strSql="";
			if(calltype.equals("0")){
				strSql=strSql+"  select calluserid,callbillids,callons,calledons,starttime,endtime,agentnum,agentnums,recordname,recordstate from recordinfos left join callwaiting on agentnums =agentnum   where" +
				              " substring(callons,0,6)='29999' and (calluserid='"+calluserid+"' or '"+calluserid+"'='' )  group by  callbillids,callons,calledons,starttime,endtime,agentnum,agentnums,recordname,recordstate,calluserid order by  starttime desc";
					}
			if(calltype.equals("1")){
				strSql=strSql+"  select calluserid,callbillids,callons,calledons,starttime,endtime,agentnum,agentnums,recordname,recordstate from recordinfos left join callwaiting on agentnums =agentnum   where" +
						" substring(callons,0,6)<>'29999' and (calluserid='"+calluserid+"' or '"+calluserid+"'='' )  group by  callbillids,callons,calledons,starttime,endtime,agentnum,agentnums,recordname,recordstate,calluserid order by  starttime desc";
					}
			else{
				strSql=strSql +"  select calluserid,callbillids,callons,calledons,starttime,endtime,agentnum,agentnums,recordname,recordstate from recordinfos left join callwaiting on agentnums =agentnum " +
						" where calluserid= '"+calluserid+"' or  '"+calluserid+"'='' group by calluserid,callbillids,callons,calledons,starttime,endtime,agentnum,agentnums,recordname,recordstate" +
								" order by  starttime desc";
				}
			AnlyResultSet<List<CallingAdminBean>> analysis = new AnlyResultSet<List<CallingAdminBean>>() {
				List<CallingAdminBean> ls=new ArrayList<CallingAdminBean>();
				public List<CallingAdminBean> anlyResultSet(ResultSet rs) {
					try {
						while(rs!=null&&rs.next()){
							CallingAdminBean bean=new CallingAdminBean();
							bean.setCalluserid(CommonTool.FormatString(rs.getString("calluserid")));
							bean.setCallbillid(CommonTool.FormatString(rs.getString("callbillids")));
							bean.setCalltime(CommonTool.FormatString(rs.getString("recordname").substring(0,9).replace("-", "")));
							bean.setCalltimes(CommonTool.FormatString(rs.getString("recordname").substring(0,4)+"年"+rs.getString("recordname").substring(4,6)+"日")); 
							bean.setCallon(CommonTool.FormatString(rs.getString("callons")));
							bean.setCalledon(CommonTool.FormatString(rs.getString("agentnums")));
							bean.setVallend(CommonTool.FormatString(rs.getString("calledons")));
							bean.setStarttime(CommonTool.FormatString(rs.getString("starttime")));
							bean.setEndtime(CommonTool.FormatString(rs.getString("endtime")));
							SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
					    	java.util.Date now = df.parse(CommonTool.FormatString(rs.getString("starttime")));
					        java.util.Date date=df.parse(CommonTool.FormatString(rs.getString("endtime")));
					    	long l=date.getTime()-now.getTime();
					    	long day=l/(24*60*60*1000);
					    	long hour=(l/(60*60*1000)-day*24);
					    	long min=((l/(60*1000))-day*24*60-hour*60);
					    	long s=(l/1000-day*24*60*60-hour*60*60-min*60);
					    	long q=(hour*3600+min*60+s);
					    	bean.setHours(q+"秒");
						    bean.setCallhoues(hour+"小时"+min+"分钟"+s+"秒");
							bean.setCallall(CommonTool.FormatString(rs.getString("recordname")));
							ls.add(bean);
						}
					} catch (Exception e) {
						e.printStackTrace();
						return null;
					}
					return ls;
				}
			};
			List<CallingAdminBean> ls  =(List<CallingAdminBean> )this.amn_Dao.executeQuery_ex(strSql, analysis);
				analysis=null;
				return ls;
			}
		
		public List<CallingAdminBean> selectalluser(){
			String strSql;
			strSql="select calluserid,staffname from callwaiting,staffinfo where calluserid=staffno group by calluserid,staffname";
		   AnlyResultSet<List<CallingAdminBean>> analysis = new AnlyResultSet<List<CallingAdminBean>>() {
				List<CallingAdminBean> ls=new ArrayList<CallingAdminBean>();
				public List<CallingAdminBean> anlyResultSet(ResultSet rs) {
					try {
						while(rs!=null&&rs.next()){
							CallingAdminBean bean=new CallingAdminBean();
							bean.setCalluserid(CommonTool.FormatString(rs.getString("calluserid")));
							bean.setStaffname(CommonTool.FormatString(rs.getString("staffname")));
							ls.add(bean);
						}
					} catch (Exception e) {
						e.printStackTrace();
						return null;
					}
					return ls;
				}
			};
			List<CallingAdminBean> ls  =(List<CallingAdminBean> )this.amn_Dao.executeQuery_ex(strSql, analysis);
			analysis=null;
			return ls;
			}
		@Override
		protected boolean deleteDetail(Object curMaster) {
			// TODO Auto-generated method stub
			return false;
		}

		@Override
		protected boolean deleteMaster(Object curMaster) {
			// TODO Auto-generated method stub
			return false;
		}

		@Override
		protected boolean postMaster(Object curMaster) {
			// TODO Auto-generated method stub
			return false;
		}

		@Override
		protected boolean postDetail(Object details) {
			// TODO Auto-generated method stub
			return false;
		}
		public static String getDateMask(String strCurrDate) {
			return strCurrDate.substring(0, 4) + "-"
					+ strCurrDate.substring(4, 6) + "-"
					+ strCurrDate.substring(6, 8).replace("-", " ")+" "+ strCurrDate.substring(9, 11)+":"
					+ strCurrDate.substring(11, 13)+":"+ strCurrDate.substring(13, 15);
		}
		public static String getDateMasks(String strCurrDate) {
			return strCurrDate.substring(0, 4) + "-"
					+ strCurrDate.substring(4, 6) + "-";
		}
		public static String getDateMaskss(String strCurrDate) {
			return strCurrDate.substring(0, 4) + "年"
					+ strCurrDate.substring(4, 6) + "月";
		}
		public static String getDateMas(String strCurrDate) {
			return  strCurrDate.substring(4, 6) + "-"
					+ strCurrDate.substring(6, 8).replace("-", " ")+" "+ strCurrDate.substring(9, 11)+":"
					+ strCurrDate.substring(11, 13)+":"+ strCurrDate.substring(13, 15);
		}
		@Override
		public List loadMasterDataSet(int pageSize, int startRow) {
			// TODO Auto-generated method stub
			return null;
		}
		
		public String loadBillIdByRule(String CompId,String TblName,String FieldName,String strRuleParam)
		{
			String Date=CommonTool.getCurrDate();
			String FormatStr=CommonTool.FormatString(this.loadSysParam(CompId,strRuleParam));
			String InputStr="";
			StringBuffer RNo=new StringBuffer();
			String CompIdFieldName="";
			this.AutoKey(Date, TblName, FieldName, FormatStr, CompId, InputStr, RNo, CompIdFieldName);
			return RNo.toString();
		}
		public String loadSysParam(String strCompId,String strValue)
		{
			
			String strField = "";
			String strSql = "";
			String strReturnValue = "";
			if(strValue == null || strValue.equals(""))
			{
				return strReturnValue;
			}
			else
			{
				strSql = "select paramid,paramvalue from sysparaminfo where compid = '"+strCompId+"' and paramid = "+CommonTool.quotedStr(strValue);
				AnlyResultSet<String> analysis = new AnlyResultSet<String>() 
				{
					public String anlyResultSet(ResultSet rs) 
					{
						String bReturnValue = "";
						try 
						{
							if( rs != null && rs.next())
							{
								bReturnValue =  CommonTool.FormatString(rs.getString("paramvalue"));
							}
						} catch (Exception e) {
							e.printStackTrace();
							bReturnValue = "";
						}
						return bReturnValue;
					}
				};
				return (String) this.amn_Dao.executeQuery_ex(strSql, analysis);
			}
		
		}
		
		public boolean AutoKey(String Date,
				String TblName,
	            String FieldName,
	            String FormatStr,
	            String CompId,
	            String InputStr,
	            StringBuffer RNo,
	            String CompIdFieldName)
			{
			String sql;
			RNo.reverse();
			RNo.append("");
			CompId = CompId.trim();
			if(!InputStr.equals(""))
			{
			    sql="SELECT " +  FieldName+ " FROM " +TblName
			        + " WHERE "+FieldName+ "="+ CommonTool.quotedStr(InputStr);
			    if((!CompIdFieldName.equals(""))&&(!CompId.equals("")))// type
			        sql+=" AND "+CompIdFieldName +" = "+ CommonTool.quotedStr(CompId);
			}
			char[] out= new char[100];
			if(CommonTool.ifAutoKeyByComp(FormatStr) && CompId.equals(""))
			    return false;
			
			if(CommonTool.ifAutoKeyByDate(FormatStr) && Date.equals(""))
			    return false;
			
			//inputstr
			int nXXX=CommonTool.checkAutoKey(FormatStr);
			if(nXXX==-1)
			    return false;
			else if(nXXX>0)
			{
			    if(InputStr.length()<nXXX)
			        return false;
			    else
			        InputStr=InputStr.substring(InputStr.indexOf("x"),nXXX);
			}
			char[] ord= new char[50];
			int cc=0,c9=0,cy=0,cm=0,cx=0,cd=0,ci=0;
			int ordpos=0;
			int i=0;
			char[] szFormatStr= new char[100];
			char[] buf= new char[100];
			
			
			System.arraycopy(FormatStr.toCharArray(),0,szFormatStr,0,FormatStr.length());
			System.arraycopy(FormatStr.toCharArray(),0,buf,0,FormatStr.length());		
			FormatStr=FormatStr.toLowerCase();
			while(buf[i] !='\0')
			{
			    if(buf[i]=='C')
			    {
			        if(cc==0)
			            ord[ordpos++]='C';
			        cc++;
			    }
			    else if(buf[i]=='Y')
			    {
			        if(cy==0)
			            ord[ordpos++]='Y';
			        cy++;
			    }
			    else if(buf[i]=='M')
			    {
			        if(cm==0)
			            ord[ordpos++]='M';
			        cm++;
			    }
			    else if(buf[i]=='D')
			    {
			        if(cd==0)
			            ord[ordpos++]='D';
			        cd++;
			    }
			    else if(buf[i]=='9')
			    {
			        if(c9==0)
			            ord[ordpos++]='9';
			        c9++;
			    }
			    else
			    {
			        ord[ordpos++]=szFormatStr[i];
			    }
			    i++;
			}
			//
			for(int j=i;j<50;j++)
			{
				ord[j] ='\0';
				j++;
			}
			//compid
			if(cc>0 && CompId.length()==0)
			    return false;
			if(cy>4 || cm>2 || cd>2)
			    return false;
			
			char inputstr[] = new char[100];
			System.arraycopy(InputStr.toCharArray(), 0, inputstr, 0, InputStr.length());
			String strCurrDate;
			char year[] = new char[5];
			char month[] = new char[3];
			char day[] = new char[3];
			
			if(Date=="")
			    strCurrDate = CommonTool.getCurrDate();
			else
			    strCurrDate=Date;
			int nDateType = 1;
			String strTmpYear = strCurrDate.substring(4-cy,4);
			String strTmpMonth = strCurrDate.substring(4,6);
			String strTmpDay = strCurrDate.substring(6,8);
			
			
			System.arraycopy(strTmpYear.toCharArray(), 0, year, 0, strTmpYear.length());
			System.arraycopy(strTmpMonth.toCharArray(), 0, month, 0, strTmpMonth.length());
			System.arraycopy(strTmpDay.toCharArray(), 0, day, 0, strTmpDay.length());
			ord[ordpos]=0;
			//write string
			int outpos=0;
			ordpos=0;
			while(ord[ordpos]!='\0')
			{
			    switch(ord[ordpos])
			    {
			        case 'C':
			            for(i=0;i<CompId.length();i++)
			            	out[outpos++] = CompId.charAt(i);
			            break;
			
			        case 'X':
			            for(i=0;i<cx;i++)
			                if(inputstr[i] !='\0')
			                    out[outpos++]=inputstr[i];
			                else
			                    out[outpos++]=inputstr[0];
			            break;
			
			        case 'Y':
			            for(i=0;i<cy;i++)
			                if(year[i] !='\0')
			                    out[outpos++]=year[i];
			                else
			                    out[outpos++]=year[0];
			            break;
			        case 'M':
			            switch(cm)
			            {
			                case 1:
			                    if(month[0]=='0')
			                        out[outpos++]=month[1];
			                    else 
			                    	out[outpos++]= 'A';
			                        //    out[outpos++]=month[1]-'0'+'A';
			                    break;
			                case 2:
			                    for(i=0;i<2;i++)
			                        out[outpos++]=month[i];
			            }
			            break;
			        case 'D':
			            for(i=0;i<cd;i++)
			                if(day[i] !='\0')
			                    out[outpos++]=day[i];
			                else
			                    out[outpos++]=day[0];
			            break;
			        case '9':
			            break;
			        default :
			            out[outpos++]=ord[ordpos];
			            break;
			    }
			    ordpos++;
			}
			
			out[outpos]=0;
			
			//seq no
			Query qryTmp;
			sql="SELECT mn=MAX("+FieldName+") FROM "+TblName;
			sql+=" WHERE "+FieldName+ " LIKE "+ CommonTool.quotedStr( new String(out).trim()+"%");
			if((!CompIdFieldName.equals(""))&&(!CompId.equals("")))// type
			    sql+=" AND "+CompIdFieldName +" = "+ CommonTool.quotedStr(CompId);
			ResultSet rs = null;
			try
			{
				rs = this.amn_Dao.executeSqlNoTran(sql);
				if(rs != null && rs.next())
				{
					
				    char maxno[] = new char[50];
				    int l1,l2,l3;
				    if(rs.getString("mn") != null && !rs.getString("mn").equals(""))
				    {
				    	int tmplenght = new String(out).trim().length();   
				    	String strEmpBill =  "";
				    	strEmpBill =  rs.getString("mn");
				    	strEmpBill =  strEmpBill.substring(0, tmplenght+c9);	
				    	System.arraycopy(strEmpBill.toCharArray(), 0, maxno, 0, strEmpBill.length());
				    
				    	l1 = new String(out).trim().length();
				    	l2 = new String(maxno).trim().length();
				    	if(l2<=l1)
				    	{
				    		return false;
				    	}
				    	int tmp = Integer.parseInt(new String(maxno).trim().substring(l1, new String(maxno).trim().length()));
				    	if(tmp==0)
				    	{
				    		return false;
				    	}
				    	tmp++;//自动增加
				    	char buffer[] = new char[20];
				    	System.arraycopy(String.valueOf(tmp).toCharArray(), 0, buffer, 0, String.valueOf(tmp).length());
				    	if( new String(buffer).trim().length() > c9)//have 999
				    	{
				    		return false;
				    	}
				    	l3=c9-new String(buffer).trim().length();
				    	int j1=0,j2=0;
				    	for(j1=l1;j1<l3+l1;j1++)
				    		out[j1]='0';
				    	while(buffer[j2]!='\0')
				    	{
				    		out[j1]=buffer[j2];
				    		j1++;
				    		j2++;
				    	}
				    	out[j1]=0;
				    }
				    else
					{
					    int l5;
					    l5 = new String(out).trim().length();
					    int j1;
					    for(j1=l5;j1<l5+c9-1;j1++)
					        out[j1]='0';
					    out[j1++]='1';
					    out[j1]=0;
					}
				}
				else
				{
				    int l5;
				    l5 = new String(out).trim().length();
				    int j1;
				    for(j1=l5;j1<l5+c9-1;j1++)
				        out[j1]='0';
				    out[j1++]='1';
				    out[j1]=0;
				}
			} 
			catch (Exception e) 
			{
				e.printStackTrace();
			}
			finally
			{
				try
				{
					((CachedRowSet)rs).release();
					rs.close();
				}
				catch(Exception e)
				{
					e.printStackTrace();
				}
			}
			RNo.append(new String(out).trim());
			return true;
		}
		public static String setTimeMaskes(String strTime) {
			if (strTime == null || strTime.equals("")) {
				return "";
			} else {
				if(strTime.length()!=19)
				{
					return strTime;
				}
				return  strTime.substring(0, 4) +"-"+ strTime.substring(5, 7)
				+"-"+strTime.substring(8, 10)+"  "+strTime.substring(11,13)
						+":"+strTime.substring(14,16)+":"+strTime.substring(17,19);
				}
			}
		public static String setTime(String strTime) {
			if (strTime == null || strTime.equals("")) {
				return "";
			} else {
				if(strTime.length()!=19)
				{
					return strTime;
				}
				return  strTime.substring(0, 4) +"-"+ strTime.substring(5, 7)
				+"-"+strTime.substring(8, 10);
				}
			}
		public static String setTimes(String strTime) {
			if (strTime == null || strTime.equals("")) {
				return "";
			} else {
				if(strTime.length()!=19)
				{
					return strTime;
				}
				return  "  "+strTime.substring(11,13)
						+":"+strTime.substring(14,16)+":"+strTime.substring(17,19);
				}
			}
		}
	
