<%@ page language="java" contentType="text/html;charset=gbk" pageEncoding="gbk"%>
<%@include file="../../pubservice.jsp"%>

<%!
	public void jspInit(){
		this.service = ServiceFactory.getService(this,MyService.class) ;
	}

	public class MyService extends StoreService {
		public void create (StoreData data, List items,SelRs rsSr,String companyCode,String userId,String dbType) throws Exception{
			System.out.println("这是新增方法");
		}
	}

	//删除
	public void destroy(StoreData data, List items, SelRs rsSr,
			String companyCode, String userId, String dbType)
			throws Exception {

	}

	//修改
	public void update(StoreData data, List items, SelRs rsSr,
			String companyCode, String userId, String dbType)
			throws Exception {
   
	}

	//读取
	public void read(StoreData data, SelRs rsSr, String companyCode,
			String userId, String dbType) throws Exception {
        String sql = "" ;

        String sqlSum = "" ;

        String sortInfo = data.getSortInfo();

        if(sortInfo != null){
        	sql += " order by " + sortInfo ; 
    	}

        Integer start = data.getStart();
		Integer limit = data.getLimit();

    	sql = SQLUtil.pagingSql(sql,dbType,start,limit) ;

    	List items = new ArrayList() ;

    	ResultSet rs = rsSr.getRs(sql) ;
    	while(rs != null && rs.next()){
    		Map map = new HashMap();
    	}

    	data.setData(items) ;

    	int count ;

    	rs = rsSr.getRs(sqlSum);
	}

%>