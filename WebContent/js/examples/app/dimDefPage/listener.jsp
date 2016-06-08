<%@ page language="java" contentType="text/html; charset=GB2312"%>

<%@ page import="java.lang.reflect.*"%>
<%@ page import="java.util.*"%>
<%@ page import="java.sql.*"%>
<%@ page import="java.util.Date"%>
<%@ page import="java.util.Calendar"%>

<%@ page import="com.rsc.proxy.*"%>
<%@ page import="com.rsc.proxy.http.*"%>
<%@ page import="com.rsc.proxy.param.*"%>
<%@ page import="com.rsc.proxy.parse.*"%>

<%@ page import="com.rsc.rs.pub.dbUtil.*"%>
<%@ page import="com.rsc.rs.pub.util.*"%>
<%@ page import="com.rsc.rs.pub.util.functions.*"%>

<%
  /**
   * Title:        维成员查询
   * Code:         
   * SubSystem:    opa
   * Description:  根据用户角色查询维成员
   * Copyright:    
   * @author:      常虎
   * @version:     1.0
   * Create date:  
   * Modifier:     
   * Modify date:  
   */
%>
<%!


  /**
  
  1   private Vector getBaseDimMemberId(SelRs rsSr, String userId,String companyCode)
  2   已过时 private Vector getAllDimMemberId(SelRs rsSr, String userId, String companyCode)
  3   private String getTableNameFromDimId(SelRs rsSr, String companyCode,String dimId)
  4   private String getIndicatorIdFromDimMemberId(SelRs rsSr,String companyCode, String dimId, String dimMemberId)
  5   private HashMap getDimAttributeMap(SelRs rsSr, String companyCode,String dimId)
  6   private String getAttributeColumns4Query(HashMap map4Attr)
  7   private boolean isSubDimMember(SelRs rsSr, String companyCode,String dimId, String dimMemberId1, String dimMemberId2)
  8   private Vector getAllBaseDimMemberId(SelRs rsSr, String userId,String companyCode)
  
  9   public List getBaseDimMemberValue(SelRs rsSr, String userId, String companyCode , String isControl)
  10  public void getSubMemberList(IParameter input, IParameter result,SelRs rsSr, String userId, String companyCode, String dbType)
  11  public void searchDimMember(IParameter input, IParameter result, SelRs rsSr, String userId, String companyCode, String dbType)
  12  public void advancedSearchDimMember(IParameter input, IParameter result,SelRs rsSr, String userId, String companyCode, String dbType)
  13  public void getDimDefDetail(IParameter input, IParameter result,SelRs rsSr, String userId, String companyCode, String dbType)
  14  public void getAllDimDef(IParameter input, IParameter result, SelRs rsSr,String userId, String companyCode, String dbType)
  15  public void getDimMemberBaseMsgByDimId(IParameter input, IParameter result,SelRs rsSr, String userId, String companyCode, String dbType)
  16  public void getSubMemberListByPaging(IParameter input, IParameter result,SelRs rsSr, String userId, String companyCode, String dbType)
  17  public void getCurrentYear(IParameter input, IParameter result, SelRs rsSr, String userId, String companyCode, String dbType)
  18  public void getCurrentMonth(IParameter input, IParameter result,SelRs rsSr, String userId, String companyCode, String dbType)
  19  public void getLevelDef(IParameter input, IParameter result,SelRs rsSr, String userId, String companyCode, String dbType)
  20  public void getSibling(IParameter input, IParameter result,SelRs rsSr, String userId, String companyCode, String dbType)
  
  **/
  







/**
   * 查询当前登录用户有权限的维成员的dim_id & dim_member_id  并将其保存到Vector中
   */
  private Vector getBaseDimMemberId(SelRs rsSr, String userId,
      String companyCode) throws Exception {

    String sql4BaseDimMemberId = "select dim_id ,dim_member_id "
        + "from opa_role_dim_member "
        + "where company_code = '"
        + companyCode
        + "' "
        + "and role_id in ( "
        + "select role_id from opa_role_logger where company_code = '"
        + companyCode
        + "' and  user_unique_id = '"
        + userId
        + "') "
        + "group by dim_id , dim_member_id order by dim_id ,dim_member_id ";
    Vector vct4BaseDimMemberId = new Vector();
    ResultSet rs4BaseDimMemberId = rsSr.getRs(sql4BaseDimMemberId);
    while (rs4BaseDimMemberId.next()) {
      String dim_id = (String) rs4BaseDimMemberId.getString(1);
      dim_id = dim_id == null ? "" : dim_id;
      String dim_member_id = (String) rs4BaseDimMemberId.getString(2);
      dim_member_id = dim_member_id == null ? "" : dim_member_id;
      String[] record = new String[2];
      record[0] = dim_id;
      record[1] = dim_member_id;

      vct4BaseDimMemberId.add(record);
    }
    rs4BaseDimMemberId.close();

    Vector result = new Vector();
    if(vct4BaseDimMemberId.size()>0){
       result.add(vct4BaseDimMemberId.get(0));
    }

    for (int i = 1; i < vct4BaseDimMemberId.size(); i++) {
      String[] record = (String[]) vct4BaseDimMemberId.get(i);
      String dim_id = record[0];
      String dim_member_id = record[1];

      int cor = 0;
      for (int j = 0; j < result.size(); j++) {
        String[] record2 = (String[]) result.get(j);
        String dim_id2 = record2[0];
        String dim_member_id2 = record2[1];

        if (dim_id.equals(dim_id2)
            && this.isSubDimMember(rsSr, companyCode, dim_id,
                dim_member_id2, dim_member_id)) {
          cor = -1;
          break;
        } else {
          cor++;
        }
      }
      if (cor == result.size()) {
        result.add(record);
      }
    }
    return result;
  }

  /**
   * 查询出所有就userId有权限的维成员
   */
  private Vector getAllDimMemberId(SelRs rsSr, String userId,
      String companyCode) throws Exception {

    Vector vct4AllDimMemberId = new Vector();

    Vector vct4BaseDimMemberId = this.getBaseDimMemberId(rsSr, userId,
        companyCode);
    Iterator iter = vct4BaseDimMemberId.iterator();
    while (iter.hasNext()) {
      String[] record = (String[]) iter.next();
      String dim_id = record[0];
      String dim_member_id = record[1];

      vct4AllDimMemberId.add(record);

      String table_name = this.getTableNameFromDimId(rsSr, companyCode,
          dim_id);
      /**
       * 查询该维成员的级别
       */
      String sql4LevelNo = "select level_no from " + table_name
          + " where company_code = '" + companyCode + "' and id = "
          + dim_member_id;
      int level_no = 0;
      ResultSet rs4LevelNo = rsSr.getRs(sql4LevelNo);
      if (rs4LevelNo.next()) {
        level_no = Integer.parseInt(rs4LevelNo.getString(1));
      }
      rs4LevelNo.close();

      /**
       * 查询该维成员的所有的level_1 值
       */
      HashMap map4LevelValue = new HashMap();
      if (level_no >= 1) {
        StringBuffer sb = new StringBuffer("id");
        for (int i = 1; i <= level_no; i++) {
          sb.append(", level_" + i);
        }
        String sql4LevelValue = "select " + sb.toString() + " from "
            + table_name + " where company_code = '" + companyCode
            + "' and id = " + dim_member_id;

        ResultSet rs4LevelValue = rsSr.getRs(sql4LevelValue);
        if (rs4LevelValue.next()) {
          for (int i = 1; i < level_no; i++) {
            String tempLevelValue = ""
                + rs4LevelValue.getString("level_" + i);
            map4LevelValue.put("level_" + i, tempLevelValue);
          }
        }
        rs4LevelValue.close();
      }

      String sql4DimMemberId = "";
      if (level_no == 0) {
        sql4DimMemberId = "select id from " + table_name
            + " where company_code = '" + companyCode
            + "' and id != " + dim_member_id;

      } else {
        StringBuffer sb = new StringBuffer("company_code ="
            + companyCode);

        Set set4LevelValue = map4LevelValue.keySet();
        Iterator inter4LevelValue = set4LevelValue.iterator();
        while (inter4LevelValue.hasNext()) {
          String key = (String) inter4LevelValue.next();
          sb.append(" and " + key + " = '" + map4LevelValue.get(key)
              + "'");
        }

        sql4DimMemberId = "select id from " + table_name + " where "
            + sb.toString();
      }
      System.out.println("查询id" + sql4DimMemberId);

      ResultSet rs4DimMemberId = rsSr.getRs(sql4DimMemberId);
      while (rs4DimMemberId.next()) {
        String dimMemberId = "" + rs4DimMemberId.getString(1);
        String[] newRecord = new String[2];
        newRecord[0] = dim_id;
        newRecord[1] = dimMemberId;

        vct4AllDimMemberId.add(newRecord);
      }
      rs4DimMemberId.close();
    }
    return vct4AllDimMemberId;
  }

  /**
   * 根据dim_id 查询对应的维成员表表名
   */

  private String getTableNameFromDimId(SelRs rsSr, String companyCode,
      String dimId) throws Exception {

    /**
     * 查询dim_code
     */
    String sql4DimCode = "select dim_code from opa_dimension_def where company_code = '"
        + companyCode + "' and dim_id = " + dimId;

    ResultSet rs4DimCode = rsSr.getRs(sql4DimCode);
    rs4DimCode.next();
    String dim_code = (String) rs4DimCode.getString(1);
    rs4DimCode.next();
    dim_code = dim_code == null ? "" : dim_code;

    /**
     * 查询table_name
     */
    String sqlForTableName = "select opa_name_mgr.get_pub_dim_table('"
        + dim_code + "') from dual";
    ResultSet rsTableName = rsSr.getRs(sqlForTableName);
    rsTableName.next();
    String table_name = rsTableName.getString(1);
    rsTableName.close();
    table_name = table_name == null ? "" : table_name;

    return table_name;
  }

  /**
   * 查询某个dim_id ,dim_member_id 所对应的指标Id，以字符串的形式返回用逗号隔开
   */

  private String getIndicatorIdFromDimMemberId(SelRs rsSr,
      String companyCode, String dimId, String dimMemberId)
      throws Exception {

    String str4IndicatorId = "";
    /**
     * 权限查询 ：查询当前维成员所具有的指标
     */
    StringBuffer sb4Indicator = new StringBuffer();
    String sql4IndicatorId = "select indicator_id from opa_indicator_dim_member where company_code = '"
        + companyCode
        + "' and  dim_id = "
        + dimId
        + " and dim_member_id = " + dimMemberId;

    ResultSet rs4IndicatorId = rsSr.getRs(sql4IndicatorId);
    while (rs4IndicatorId.next()) {
      String indicator_id = (String) rs4IndicatorId.getString(1);
      indicator_id = indicator_id == null ? "" : indicator_id;
      sb4Indicator.append(indicator_id + ",");
    }
    rs4IndicatorId.close();

    str4IndicatorId = sb4Indicator.toString().endsWith(",") ? sb4Indicator
        .toString().substring(0, sb4Indicator.toString().length() - 1)
        : sb4Indicator.toString();
    return str4IndicatorId;
  }

  /**
   * 查询某个维度定义的属性，将其存入一个HashMap中，key 为属性id value 为属性名称
   */
  private HashMap getDimAttributeMap(SelRs rsSr, String companyCode,
      String dimId) throws Exception {

    HashMap map4Attr = new HashMap();
    String sql4Attr = "select dim_attribute_id ,dim_attribute_name "
        + "from opa_dimension_attribute " + "where company_code = '"
        + companyCode + "' " + "and dim_id =  " + dimId
        + "and dim_attribute_name is not null "
        + "order by dim_attribute_id ";
    ResultSet rs4Attr = rsSr.getRs(sql4Attr);
    while (rs4Attr.next()) {
      String dim_attribute_id = "" + rs4Attr.getString(1);
      String dim_attribute_name = "" + rs4Attr.getString(2);
      if (!"".equals(dim_attribute_id) && !"".equals(dim_attribute_name)) {
        map4Attr.put(dim_attribute_id, dim_attribute_name);
      }
    }
    rs4Attr.close();
    return map4Attr;
  }

  /**
   * 根据维度属性MAP获取该维度可查的属性列
   */
  private String getAttributeColumns4Query(HashMap map4Attr) {

    StringBuffer sb = new StringBuffer();
    Set set4AttrId = map4Attr.keySet();
    Iterator iter = set4AttrId.iterator();
    while (iter.hasNext()) {
      String attrId = "" + iter.next();
      sb.append(", attribute_" + attrId);
    }
    return sb.toString();
  }

  /**
   * 判断维成员dimMemberId2 是否是维成员dimMeberId1 的子项 dimId 为这两个维成员所属的维度dimId 
   */
  private boolean isSubDimMember(SelRs rsSr, String companyCode,
      String dimId, String dimMemberId1, String dimMemberId2)
      throws Exception {
    boolean result = false;
    String table_name = this
        .getTableNameFromDimId(rsSr, companyCode, dimId);

    /*
    String sql4IsSubDimMeber = "select count(t1.id) "
                               +"from "+table_name+" t1 , "+table_name+" t2 "
                               +"where t1.company_code = '"+companyCode+"' and t2.company_code = '"+companyCode+"' "
                               +"and t1.id = "+dimMemberId1+" and t2.id = "+dimMemberId2+" "
                               +"and decode ( "
                               +"(select level_no from "+table_name+" "
                               +"where company_code = '"+companyCode+"' "
                               +"and  id = "+dimMemberId1+" ), "
                               +"0,'level_0', "
                               +"1,t1.level_1, "
                               +"2,t1.level_2, "
                               +"3,t1.level_3, "
                               +"4,t1.level_4, "
                               +"5,t1.level_5 "
                               +") = decode ( "
                               +"(select level_no  from "+table_name+" "
                               +"where company_code = '"+companyCode+"' "
                               +"and  id = "+dimMemberId1+" ), "
                               +"0,'level_0', "
                               +"1,t2.level_1, "
                               +"2,t2.level_2, "
                               +"3,t2.level_3, "
                               +"4,t2.level_4, "
                               +"5,t2.level_5 "
                               +")";
    
     */

    String sql4IsSubDimMeber = "select distinct count(a.id) from  "
        + "(select * from "
        + table_name
        + " where company_code = '"
        + companyCode
        + "' and id = "
        + dimMemberId1
        + ") a , "
        + "(select * from "
        + table_name
        + " where company_code = '"
        + companyCode
        + "' and id = "
        + dimMemberId2
        + ") b  "
        + " where opa_util.nvl(nvl(a.level_1, b.level_1)) = opa_util.nvl(b.level_1) "
        + " and opa_util.nvl(nvl(a.level_2, b.level_2)) = opa_util.nvl(b.level_2) "
        + " and opa_util.nvl(nvl(a.level_3, b.level_3)) = opa_util.nvl(b.level_3) "
        + " and opa_util.nvl(nvl(a.level_4, b.level_4)) = opa_util.nvl(b.level_4) "
        + " and opa_util.nvl(nvl(a.level_5, b.level_5)) = opa_util.nvl(b.level_5) order by a.id ";

    ResultSet rs4IsSubDimMeber = rsSr.getRs(sql4IsSubDimMeber);
    if (rs4IsSubDimMeber.next()) {
      int cou = (int) rs4IsSubDimMeber.getInt(1);
      if (cou > 0) {
        result = true;
      }
    }
    rs4IsSubDimMeber.close();
    return result;
  }
   
   
   /**
    * 读取所有的定义维度的和对应维度下的根维成员  Vector 中保存的
    * record[0] = dim_id;
    * record[1] = dim_member_id;
    * vct4BaseDimMemberId.add(record);
    */
   private Vector getAllBaseDimMemberId(SelRs rsSr, String userId,String companyCode) throws Exception{
        
        Vector result = new Vector();
        
        Vector vct4DimDef = new Vector();
        String sql4DimDef = "select dim_id , dim_code  from opa_dimension_def where company_code = '"+companyCode+"'";
        ResultSet rs4DimDef = rsSr.getRs(sql4DimDef);
        while(rs4DimDef.next()){
          String dim_id = "" + rs4DimDef.getString(1);
          String dim_code = "" + rs4DimDef.getString(2);
          
          String[] record = new String[2];
          record[0] = dim_id;
          record[1] = dim_code;
          
          vct4DimDef.add(record);
        }
        rs4DimDef.close();
        
        Iterator iter4DimDef = vct4DimDef.iterator();
        while(iter4DimDef.hasNext()){
            String[] record = (String[])iter4DimDef.next();
            String dim_id = record[0];
            String dim_code = record[1];
            
            String tableName = this.getTableNameFromDimId(rsSr, companyCode, dim_id);
            
            String dim_member_id = "";
            String sql4DimMemberId = "select id from "
                                    +tableName
                                    +" where company_code = '"
                                    +companyCode
                                    +"' and level_no = 0";
            ResultSet rs4DimMemberId = rsSr.getRs(sql4DimMemberId);
            if(rs4DimMemberId.next()){
                dim_member_id = ""+rs4DimMemberId.getString(1);
            }
            rs4DimMemberId.close();

            if(!"".equals(dim_member_id)){
               String[] record2 = new String[2]; 
               record2[0] = dim_id;
               record2[1] = dim_member_id;
               
               result.add(record2);
            }
         }
         
         return result;
   }
   
   
  /**
   *  查询当前登录用户有权限的的维成员
   */
  public List getBaseDimMemberValue(SelRs rsSr, String userId,
      String companyCode , String isControl ) throws Exception {

    List memberList = new ArrayList();

    Vector vct4BaseDimMemberId ; 

    if(isControl.equals("false")){                                  //不错权限控制 读取所有的维度的根节点
        vct4BaseDimMemberId = this.getAllBaseDimMemberId(rsSr, userId,companyCode);
    }else{                                                          //权限控制 ，读取该用户有权限的维度的维成员
        vct4BaseDimMemberId = this.getBaseDimMemberId(rsSr, userId,companyCode);
    }
    
    /**
     * 查找根节点维成员
     */
    
    Iterator iter = vct4BaseDimMemberId.iterator();
    while (iter.hasNext()) {
      String[] record = (String[]) iter.next();
      String dim_id = record[0];
      String dim_member_id = record[1];

      String table_name = this.getTableNameFromDimId(rsSr, companyCode,
          dim_id);

      /**
       *获取可查询的属性列名字符串
       */
      HashMap map4Attr = this.getDimAttributeMap(rsSr, companyCode,
          dim_id);
      String attrColumns = this.getAttributeColumns4Query(map4Attr);
      /**
       * 查询dim_desc and level_no
       */
      String sql4BaseDimMember = "select dim_desc , level_no "
          + attrColumns + " from " + table_name
          + " where company_code = '" + companyCode + "' and id = "
          + dim_member_id;

      ResultSet rs4BaseDimMember = rsSr.getRs(sql4BaseDimMember);
      String dim_desc = "";
      int level_no = 0;

      IParameter attributes = new Parameter("attributes"); //返回对像的属性

      if (rs4BaseDimMember.next()) {
        dim_desc = (String) rs4BaseDimMember.getString(1);
        level_no = Integer.parseInt(rs4BaseDimMember.getString(2));

        Set set4AttrId = map4Attr.keySet();
        Iterator iter4Attr = set4AttrId.iterator();
        while (iter4Attr.hasNext()) {
          String attrId = "" + iter4Attr.next();
          String attrName = "" + map4Attr.get(attrId);
          String attributeValue = rs4BaseDimMember
              .getString("attribute_" + attrId);

          attributes.setAttribute(attrId, attributeValue);
          //attributes.setAttribute(attrName,attributeValue);
        }
      }
      rs4BaseDimMember.close();

      /**
       * 查询path
       */
      String path = "";
      String level_no_value = ""; //如果leve_no 是2 那么level_no_value 就是leve_2 对应的值
      if (level_no >= 1) {
        StringBuffer sb = new StringBuffer();
        for (int j = 1; j < level_no; j++) {
          sb.append("level_" + j + ", ");
        }
        sb.append("level_" + level_no + " ");

        String sql4Path = "select " + sb.toString() + " from "
            + table_name + " where company_code = '" + companyCode
            + "' and id = " + dim_member_id;
        ResultSet rs4Path = rsSr.getRs(sql4Path);
        StringBuffer sb4Path = new StringBuffer("/");
        rs4Path.next();
        for (int k = 1; k < level_no; k++) {
          String temp4Path = (String) rs4Path.getString(k);
          temp4Path = temp4Path == null ? "" : temp4Path + "/";
          sb4Path.append(temp4Path);
        }
        level_no_value = (String) rs4Path.getString(level_no);
        sb4Path.append(level_no_value);
        path = sb4Path.toString();
        rs4Path.close();
      }

      /**
       * 查询 is_final 
       */
      boolean is_final = true;
      String sql4IsFinal = "";
      if (level_no >= 1) {
        StringBuffer sb = new StringBuffer();
        String[] pathArray = path.split("/");
        for (int i = 1; i <= level_no; i++) {
          sb.append(" level_" + i + " = '" + pathArray[i] + "' and");
        }
        sql4IsFinal = "select nvl(count(id),0) from "
            + table_name
            + " where level_no = "
            + (level_no + 1)
            + " and company_code = '"
            + companyCode
            + "'"
            + " and "
            + ((sb.toString().endsWith("and")) ? (sb.toString()
                .substring(0, sb.toString().length() - 3)) : sb
                .toString());
      } else {
        sql4IsFinal = "select nvl(count(id),0) from " + table_name
            + " where level_no = " + (level_no + 1)
            + " and company_code = '" + companyCode + "'";
      }
      ResultSet rs4IsFinal = rsSr.getRs(sql4IsFinal);
      rs4IsFinal.next();
      int countId = rs4IsFinal.getInt(1);
      rs4IsFinal.close();
      if (countId > 0) {
        is_final = false;
      }

      /**
       * 查询有关联的指标id
       */
      String str4IndicatorId = this.getIndicatorIdFromDimMemberId(rsSr,
          companyCode, dim_id, dim_member_id);

      /**
       * 构造数据
       */
      IParameter aMember = new Parameter("dimMember");
      aMember.setAttribute("id", "" + dim_member_id);
      aMember.setAttribute("dimType", "" + dim_id);
      aMember.setAttribute("identifier", level_no_value); //设置标识符 如果leve_no 是2 那么level_no_value 就是leve_2 对应的值
      aMember.setAttribute("desc", dim_desc);
      aMember.setAttribute("level", level_no);
      aMember.setAttribute("path", path);
      aMember.setAttribute("final", is_final);
      aMember.setAttribute("indicator", str4IndicatorId);

      for (int i = 1; i <= 5; i++) {
        aMember.setAttribute("" + i, ("".equals(aMember.getString(""
            + i))) ? "" : aMember.getString("" + i));
      }

      //aMember.addChild(attributes);

      /**
       * 删除有层次关系的维成员
       */

      /*
      Iterator iterList = memberList.iterator();
      boolean flag = false;
      while(iterList.hasNext()){
         IParameter temp = (IParameter)iterList.next();
         if(temp.getInt("level") < level_no 
             && path.startsWith(temp.getString("path")) 
             && dim_id.equals(temp.getString("dimType")) ){
            flag = true;
            break;
         }
      }
      
      if(!flag){
       */
      memberList.add(aMember);
      /*
      }
       */
    }//end while
    return memberList;
  }

  /**
   *  定义一个内部类 继承 FormulaParam
   */
  private class DimMember extends FormulaParam {

    SelRs rsSr;
    String userId;
    String companyCode;

    private DimMember(IParameter source, SelRs rsSr, String userId,
        String companyCode) {
      super(source);
      this.rsSr = rsSr;
      this.userId = userId;
      this.companyCode = companyCode;
    }

    private boolean isFinal() {
      return this.getBoolean("final");
    }

    private int getLevel() {
      return this.getInt("level");
    }

    private String getPath() {
      return this.getString("path");
    }

    private String getId() {
      return this.getString("id");
    }

    private String getDesc() {
      return this.getString("desc");
    }

    private String getDimType() {
      return this.getString("dimType");
    }

    /**
     * 获取对应的表名
     */
    private String getTableName() throws Exception {
      return getTableNameFromDimId(rsSr, companyCode, this.getDimType());
    }

    /**
     * 获取该DimMember 的下一级 DimMember
     */
    private List getMemberList(int atLevel) {
      List dimMemberList = new ArrayList();
      try {
        if (!this.isFinal()) { //该维成员不是叶子节点
          String sql = "";
          /**
           *获取可查询的属性列名字符串
           */
          HashMap map4Attr = getDimAttributeMap(rsSr, companyCode,
              this.getDimType());
          String attrColumns = getAttributeColumns4Query(map4Attr);
          if (this.getLevel() >= 1) {
            StringBuffer sb = new StringBuffer();
            String[] pathArray = this.getPath().split("/");
            for (int i = 1; i <= this.getLevel(); i++) {
              sb.append(" level_" + i + " = '" + pathArray[i]
                  + "' and");
            }
            sql = "select id, level_1, level_2, level_3, level_4, level_5 , dim_desc , level_no, dim_path_desc "
                + attrColumns
                + " from "
                + this.getTableName()
                + " where level_no = "
                + atLevel
                + " and company_code = '"
                + companyCode
                + "'"
                + " and "
                + ((sb.toString().endsWith("and")) ? (sb.toString().substring(0, sb.toString().length() - 3)) : sb.toString())
                + " order by id";
          } else {
            sql = "select id, level_1, level_2, level_3, level_4, level_5 ,dim_desc , level_no , dim_path_desc " + attrColumns
                + " from " + this.getTableName()
                + " where level_no = " + (atLevel)
                + " and company_code = '" + companyCode + "'" + " order by id";
          }

          System.out.println("查询子节点--->" + sql);

          ResultSet rsDimMemberList = rsSr.getRs(sql);

          Vector vctDimMemberList = new Vector();
          while (rsDimMemberList.next()) {
            String id = rsDimMemberList.getString(1);
            StringBuffer path = new StringBuffer();
            for(int l=1;l<6;l++){
              String lv = rsDimMemberList.getString("level_" + l);
              if(lv!=null) path.append("/" + lv);
              else break;
            }
            String levelValue = rsDimMemberList.getString(atLevel + 3);
            String dim_desc = rsDimMemberList.getString(7);
            String level_no = rsDimMemberList.getString(8);
			String dim_path_desc = rsDimMemberList.getString(9);
            IParameter attributes = new Parameter("attributes"); //返回对像的属性

            Set set4AttrId = map4Attr.keySet();
            Iterator iter4Attr = set4AttrId.iterator();
            while (iter4Attr.hasNext()) {
              String attrId = "" + iter4Attr.next();
              String attrName = "" + map4Attr.get(attrId);
              String attributeValue = rsDimMemberList
                  .getString("attribute_" + attrId);

              attributes.setAttribute(attrId, attributeValue);
              //attributes.setAttribute(attrName,attributeValue);
            }

            HashMap record = new HashMap();
            record.put("id", id);
            record.put("path", path.toString());
            record.put("levelValue", levelValue);
            record.put("dim_desc", dim_desc);
            record.put("level_no", level_no);
            record.put("attributes", attributes);
            record.put("dim_path_desc", dim_path_desc);

            /*
            String[] record =  new String[4];
                     record[0] = id;
                     record[1] = level;
                     record[2] = dim_desc;
                     record[3] = level_no;
             */

            vctDimMemberList.add(record);
          }
          rsDimMemberList.close();
          Iterator iter = vctDimMemberList.iterator();
          while (iter.hasNext()) {
            /*
            String[] values=(String[])iter.next();  
            String id = values[0];
            String levelValue = values[1];
            String dim_desc = values[2];
            int level_no = Integer.parseInt(values[3]);
             */

            HashMap record = (HashMap) iter.next();
            String id = (String) record.get("id");
            String levelValue = (String) record.get("levelValue");
            String path = (String)record.get("path");
            String dim_desc = (String) record.get("dim_desc");
            int level_no = atLevel;
            IParameter attributes = (IParameter) record
                .get("attributes");

            /**
             * 查询 is_final 
             */
            boolean is_final = true;
            String sql4IsFinal = "";
            if (level_no >= 1) {
              StringBuffer sb = new StringBuffer();
              String[] pathArray = path.split("/");
              for (int i = 1; i <= level_no; i++) {
                sb.append(" level_" + i + " = '" + pathArray[i]
                    + "' and");
              }
              sql4IsFinal = "select nvl(count(id),0) from "
                  + this.getTableName()
                  + " where level_no = "
                  + (level_no + 1)
                  + " and company_code = '"
                  + companyCode
                  + "'"
                  + " and "
                  + ((sb.toString().endsWith("and")) ? (sb
                      .toString().substring(0, sb
                      .toString().length() - 3)) : sb
                      .toString());
            } else {
              sql4IsFinal = "select nvl(count(id),0) from "
                  + this.getTableName()
                  + " where level_no = " + (level_no + 1)
                  + " and company_code = '" + companyCode
                  + "'";
            }
            ResultSet rs4IsFinal = rsSr.getRs(sql4IsFinal);
            rs4IsFinal.next();
            int countId = rs4IsFinal.getInt(1);
            rs4IsFinal.close();
            if (countId > 0) {
              is_final = false;
            }

            /**
             * 有关联的指标id
             */
            String str4IndicatorId = getIndicatorIdFromDimMemberId(
                rsSr, companyCode, this.getDimType(), id);

            /**
             * 构造维成员对象
             */
            IParameter aMember = new Parameter("dimMember");
            aMember.setAttribute("final", is_final);
            aMember.setAttribute("level", level_no);
            aMember.setAttribute("path", path);
            aMember.setAttribute("id", id);
            aMember.setAttribute("identifier", levelValue); //设置标识符 如果leve_no 是2 那么level_no_value 就是leve_2 对应的值           
            aMember.setAttribute("desc", dim_desc);
            aMember.setAttribute("dimType", this.getDimType());
            aMember.setAttribute("indicator", str4IndicatorId);
            aMember.setAttribute("pathDesc", record.get("dim_path_desc"));

            for (int i = 1; i <= 5; i++) {
              aMember.setAttribute("" + i, ("".equals(aMember
                  .getString("" + i))) ? "" : aMember
                  .getString("" + i));
            }

            //aMember.addChild(attributes);

            dimMemberList.add(aMember);
          }
        }
      } catch (Exception ee) {
        ee.printStackTrace();
      }
      return dimMemberList;
    }
  }

  /**
   * 获取某个维度节点的子节点
   *  
   */
  public void getSubMemberList(IParameter input, IParameter result,
      SelRs rsSr, String userId, String companyCode, String dbType)
      throws Exception {
    DimMember dimMember = new DimMember((IParameter) input.getChildren(
        "dimMember").get(0), rsSr, userId, companyCode);
    String isControl = ""+input.getAttribute("isControl");
    int level;
    Object l = input.getAttribute("level");
    if(l!=null){
      level = ((Integer)l).intValue();
    }else {
    	level = dimMember.getLevel() + 1;
    }
    switch (level) {
    /**
     * 0 表示子点为根节点
     */
    case 0: {
      List baseDimMemberList = this.getBaseDimMemberValue(rsSr, userId,
          companyCode , isControl);
      Iterator it = baseDimMemberList.iterator();
      while (it.hasNext()) {
        IParameter member = (IParameter) it.next();
        result.addChild(member);
      }
      break;
    }
    default: {
      List subDimMemberList = dimMember.getMemberList(level);
      Iterator it = subDimMemberList.iterator();
      while (it.hasNext()) {
        IParameter member = (IParameter) it.next();
        result.addChild(member);
      }
      break;
    }
    }
  }

  /**
   * 查询
   * 传入参数：一个维度对象id 和一个名称 (dimId , dimMemberName)
   * 返回一组维成员 在维度树上对展开这些维成员 
   */
  public void searchDimMember(IParameter input, IParameter result,
      SelRs rsSr, String userId, String companyCode, String dbType)
      throws Exception {

    if (input instanceof QueryParam) {
      QueryParam query = (QueryParam) input;

      int offset = query.getOffset();
      int length = query.getLength();

      String dimId = "" + input.getAttribute("dimId");
      String dimMemberName = "" + input.getAttribute("dimMemberName");

      /**
       * 查询条件 有权限的维成员Id
       */
      Vector vct4BaseDimMemberId = this.getBaseDimMemberId(rsSr, userId,
          companyCode);
      StringBuffer sb4DimMemberId = new StringBuffer();
      Iterator iter = vct4BaseDimMemberId.iterator();
      while (iter.hasNext()) {
        String[] record = (String[]) iter.next();
        String dim_id = record[0];
        String dim_member_id = record[1];

        if (dimId.equals(dim_id)) {
          sb4DimMemberId.append("," + dim_member_id);
        }
      }
      String str4DimMemberId = sb4DimMemberId.toString().startsWith(",") ? sb4DimMemberId
          .toString().substring(1)
          : sb4DimMemberId.toString();

      /**
       * 表名
       */
      String table_name = this.getTableNameFromDimId(rsSr, companyCode,
          dimId);

      /**
       * 查询总数
       */
      int count = 0;
      String sql4Count = "select count(b.id) from "
          + "(select * from "
          + table_name
          + " where company_code = '"
          + companyCode
          + "' and id in("
          + str4DimMemberId
          + ")) a , "
          + "(select * from "
          + table_name
          + " where company_code = '"
          + companyCode
          + "') b "
          + "where opa_util.nvl(nvl(a.level_1, b.level_1)) = opa_util.nvl(b.level_1) "
          + " and opa_util.nvl(nvl(a.level_2, b.level_2)) = opa_util.nvl(b.level_2) "
          + " and opa_util.nvl(nvl(a.level_3, b.level_3)) = opa_util.nvl(b.level_3) "
          + " and opa_util.nvl(nvl(a.level_4, b.level_4)) = opa_util.nvl(b.level_4) "
          + " and opa_util.nvl(nvl(a.level_5, b.level_5)) = opa_util.nvl(b.level_5) "
          + " and b.dim_desc like '" + dimMemberName + "%' "
          + "order by b.id  ";

      ResultSet rs4Count = rsSr.getRs(sql4Count);
      if (rs4Count.next()) {
        count = rs4Count.getInt(1);
      }
      rs4Count.close();

      /**
       * 查询数据
       */
      String sql4DimMember = "select id , level_no , dim_desc , attribute_1 , attribute_2 , attribute_3 , attribute_4 , attribute_5, dim_path_desc from ( "
          + "select rownum r , b.id id , b.level_no level_no , b.dim_desc dim_desc ,b.attribute_1 attribute_1 ,b.attribute_2 attribute_2 ,b.attribute_3 attribute_3 ,b.attribute_4 attribute_4 ,b.attribute_5 attribute_5, b.dim_path_desc dim_path_desc from  "
          + "(select * from "
          + table_name
          + " where company_code = '"
          + companyCode
          + "' and id in("
          + str4DimMemberId
          + ")) a , "
          + "(select * from "
          + table_name
          + " where company_code = '"
          + companyCode
          + "') b "
          + "where opa_util.nvl(nvl(a.level_1, b.level_1)) = opa_util.nvl(b.level_1) "
          + " and opa_util.nvl(nvl(a.level_2, b.level_2)) = opa_util.nvl(b.level_2) "
          + " and opa_util.nvl(nvl(a.level_3, b.level_3)) = opa_util.nvl(b.level_3) "
          + " and opa_util.nvl(nvl(a.level_4, b.level_4)) = opa_util.nvl(b.level_4) "
          + " and opa_util.nvl(nvl(a.level_5, b.level_5)) = opa_util.nvl(b.level_5)  "
          + " and b.dim_desc like '"
          + dimMemberName
          + "%' "
          + " order by b.id , r  "
          + ") where (r > "
          + offset
          + " and r < " + (offset + length) + ") ";

      ResultSet rs4DimMember = rsSr.getRs(sql4DimMember);
      Vector vct4DimMember = rsSr.getRsVct(rs4DimMember, false);
      Iterator iter4DimMember = vct4DimMember.iterator();
      while (iter4DimMember.hasNext()) {
        String[] record = (String[]) iter4DimMember.next();
        String id = record[0];
        int level_no = Integer.parseInt(record[1]);
        String dim_desc = record[2];
        String attribute_1 = record[3];
        String attribute_2 = record[4];
        String attribute_3 = record[5];
        String attribute_4 = record[6];
        String attribute_5 = record[7];
        String dim_path_desc = record[8];

        /**
         * 查询path
         */
        String path = "";
        String level_no_value = ""; //如果leve_no 是2 那么level_no_value 就是leve_2 对应的值
        if (level_no >= 1) {
          StringBuffer sb = new StringBuffer();
          for (int j = 1; j < level_no; j++) {
            sb.append("level_" + j + ", ");
          }
          sb.append("level_" + level_no + " ");
          String sql4Path = "select " + sb.toString() + " from "
              + table_name + " where company_code = '"
              + companyCode + "' and id = " + id;
          ResultSet rs4Path = rsSr.getRs(sql4Path);
          StringBuffer sb4Path = new StringBuffer("/");
          rs4Path.next();
          for (int k = 1; k < level_no; k++) {
            String temp4Path = (String) rs4Path.getString(k);
            temp4Path = temp4Path == null ? "" : temp4Path + "/";
            sb4Path.append(temp4Path);
          }
          level_no_value = (String) rs4Path.getString(level_no);
          sb4Path.append(level_no_value);
          path = sb4Path.toString();
          rs4Path.close();
        }

        /**
         * 查询 is_final 
         */
        boolean is_final = true;
        String sql4IsFinal = "";
        if (level_no >= 1) {
          StringBuffer sb = new StringBuffer();
          String[] pathArray = path.split("/");
          for (int i = 1; i <= level_no; i++) {
            sb.append(" level_" + i + " = '" + pathArray[i]
                + "' and");
          }
          sql4IsFinal = "select nvl(count(id),0) from "
              + table_name
              + " where level_no = "
              + (level_no + 1)
              + " and company_code = '"
              + companyCode
              + "'"
              + " and "
              + ((sb.toString().endsWith("and")) ? (sb.toString()
                  .substring(0, sb.toString().length() - 3))
                  : sb.toString());
        } else {
          sql4IsFinal = "select nvl(count(id),0) from " + table_name
              + " where level_no = " + (level_no + 1)
              + " and company_code = '" + companyCode + "'";
        }

        ResultSet rs4IsFinal = rsSr.getRs(sql4IsFinal);
        rs4IsFinal.next();
        int countId = rs4IsFinal.getInt(1);
        rs4IsFinal.close();
        if (countId > 0) {
          is_final = false;
        }

        /**
         * 有关系的指标
         */
        String str4IndicatorId = getIndicatorIdFromDimMemberId(rsSr,
            companyCode, dimId, id);

        /**
         * 构造维成员对象
         */
        IParameter aMember = new Parameter("dimMember");
        aMember.setAttribute("final", is_final);
        aMember.setAttribute("level", level_no);
        aMember.setAttribute("path", path);
        aMember.setAttribute("id", id);
        aMember.setAttribute("identifier", level_no_value); //设置标识符 如果leve_no 是2 那么level_no_value 就是leve_2 对应的值           
        aMember.setAttribute("desc", dim_desc);
        aMember.setAttribute("dimType", dimId);
        aMember.setAttribute("pathDesc", dim_path_desc);
        aMember.setAttribute("indicator", str4IndicatorId);
        aMember.setAttribute("1", attribute_1);
        aMember.setAttribute("2", attribute_2);
        aMember.setAttribute("3", attribute_3);
        aMember.setAttribute("4", attribute_4);
        aMember.setAttribute("5", attribute_5);

        result.addChild(aMember);
      }//end while
      result.setAttribute("total", count);
      result.setAttribute("offset", offset);
      result.setAttribute("length", length);
    } else {

    }
  }

  /**
   * 高级查询
   * 传入参数：一个维度对象id ,一个维成员名字 和一个该维度的属性Map
   * 返回一组维成员 在维度树上对展开这些维成员
   */
  public void advancedSearchDimMember(IParameter input, IParameter result,
      SelRs rsSr, String userId, String companyCode, String dbType)
      throws Exception {

    if (input instanceof QueryParam) {
      QueryParam query = (QueryParam) input;

      int offset = query.getOffset();
      int length = query.getLength();

      String dimId = "" + input.getAttribute("dimId");
      String dimMemberName = "" + input.getAttribute("dimMemberName");

      Vector vct4Attributes = (Vector) input.getChildren("attributes");
      IParameter ip4QueryAttrs = (IParameter) (vct4Attributes.get(0));

      /**
       * 属性关键字查询条件
       */
      StringBuffer sb4Attribute = new StringBuffer();
      for (Enumeration e = ip4QueryAttrs.getAttributeNames(); e
          .hasMoreElements();) {
        String attrName = "" + (String) e.nextElement();
        String attrValue = ""
            + (String) ip4QueryAttrs.getAttribute(attrName);
        if (("1".equals(attrName) || "2".equals(attrName)
            || "3".equals(attrName) || "4".equals(attrName) || "5"
            .equals(attrName))
            && !"".equals(attrValue)) {
          sb4Attribute.append("and b.attribute_" + attrName
              + " like '" + attrValue + "%' ");
        }
      }

      /**
       * 查询条件 有权限的维成员Id
       */
      Vector vct4BaseDimMemberId = this.getBaseDimMemberId(rsSr, userId,
          companyCode);
      StringBuffer sb4DimMemberId = new StringBuffer();
      Iterator iter = vct4BaseDimMemberId.iterator();
      while (iter.hasNext()) {
        String[] record = (String[]) iter.next();
        String dim_id = record[0];
        String dim_member_id = record[1];

        if (dimId.equals(dim_id)) {
          sb4DimMemberId.append("," + dim_member_id);
        }
      }
      String str4DimMemberId = sb4DimMemberId.toString().startsWith(",") ? sb4DimMemberId
          .toString().substring(1)
          : sb4DimMemberId.toString();

      /**
       * 表名
       */
      String table_name = this.getTableNameFromDimId(rsSr, companyCode,
          dimId);

      /**
       * 查询总数
       */
      int count = 0;
      String sql4Count = "select count(b.id) from "
          + "(select * from "
          + table_name
          + " where company_code = '"
          + companyCode
          + "' and id in("
          + str4DimMemberId
          + ")) a , "
          + "(select * from "
          + table_name
          + " where company_code = '"
          + companyCode
          + "') b "
          + "where opa_util.nvl(nvl(a.level_1, b.level_1)) = opa_util.nvl(b.level_1) "
          + " and opa_util.nvl(nvl(a.level_2, b.level_2)) = opa_util.nvl(b.level_2) "
          + " and opa_util.nvl(nvl(a.level_3, b.level_3)) = opa_util.nvl(b.level_3) "
          + " and opa_util.nvl(nvl(a.level_4, b.level_4)) = opa_util.nvl(b.level_4) "
          + " and opa_util.nvl(nvl(a.level_5, b.level_5)) = opa_util.nvl(b.level_5) "
          + " and b.dim_desc like '" + dimMemberName + "%' "
          + sb4Attribute.toString() + "order by b.id  ";
      System.out.println("查询总数的sql --->" + sql4Count);
      ResultSet rs4Count = rsSr.getRs(sql4Count);
      if (rs4Count.next()) {
        count = rs4Count.getInt(1);
      }
      rs4Count.close();

      /**
       * 查询数据
       */
      String sql4DimMember = "select id , level_no , dim_desc , attribute_1 , attribute_2 , attribute_3 , attribute_4 , attribute_5 from ( "
          + "select rownum r , b.id id , b.level_no level_no , b.dim_desc dim_desc ,b.attribute_1 attribute_1 ,b.attribute_2 attribute_2 ,b.attribute_3 attribute_3 ,b.attribute_4 attribute_4 ,b.attribute_5 attribute_5 from  "
          + "(select * from "
          + table_name
          + " where company_code = '"
          + companyCode
          + "' and id in("
          + str4DimMemberId
          + ")) a , "
          + "(select * from "
          + table_name
          + " where company_code = '"
          + companyCode
          + "') b "
          + "where opa_util.nvl(nvl(a.level_1, b.level_1)) = opa_util.nvl(b.level_1) "
          + " and opa_util.nvl(nvl(a.level_2, b.level_2)) = opa_util.nvl(b.level_2) "
          + " and opa_util.nvl(nvl(a.level_3, b.level_3)) = opa_util.nvl(b.level_3) "
          + " and opa_util.nvl(nvl(a.level_4, b.level_4)) = opa_util.nvl(b.level_4) "
          + " and opa_util.nvl(nvl(a.level_5, b.level_5)) = opa_util.nvl(b.level_5)  "
          + " and b.dim_desc like '"
          + dimMemberName
          + "%' "
          + sb4Attribute.toString()
          + " order by b.id , r  "
          + ") where (r > "
          + offset
          + " and r < "
          + (offset + length) + ") ";
      System.out.println("查询数据的sql --->" + sql4DimMember);

      ResultSet rs4DimMember = rsSr.getRs(sql4DimMember);
      Vector vct4DimMember = rsSr.getRsVct(rs4DimMember, false);
      Iterator iter4DimMember = vct4DimMember.iterator();
      while (iter4DimMember.hasNext()) {
        String[] record = (String[]) iter4DimMember.next();
        String id = record[0];
        int level_no = Integer.parseInt(record[1]);
        String dim_desc = record[2];
        String attribute_1 = record[3];
        String attribute_2 = record[4];
        String attribute_3 = record[5];
        String attribute_4 = record[6];
        String attribute_5 = record[7];

        /**
         * 查询path
         */
        String path = "";
        String level_no_value = ""; //如果leve_no 是2 那么level_no_value 就是leve_2 对应的值
        if (level_no >= 1) {
          StringBuffer sb = new StringBuffer();
          for (int j = 1; j < level_no; j++) {
            sb.append("level_" + j + ", ");
          }
          sb.append("level_" + level_no + " ");
          String sql4Path = "select " + sb.toString() + " from "
              + table_name + " where company_code = '"
              + companyCode + "' and id = " + id;
          ResultSet rs4Path = rsSr.getRs(sql4Path);
          StringBuffer sb4Path = new StringBuffer("/");
          rs4Path.next();
          for (int k = 1; k < level_no; k++) {
            String temp4Path = (String) rs4Path.getString(k);
            temp4Path = temp4Path == null ? "" : temp4Path + "/";
            sb4Path.append(temp4Path);
          }
          level_no_value = (String) rs4Path.getString(level_no);
          sb4Path.append(level_no_value);
          path = sb4Path.toString();
          rs4Path.close();
        }

        /**
         * 查询 is_final 
         */
        boolean is_final = true;
        String sql4IsFinal = "";
        if (level_no >= 1) {
          StringBuffer sb = new StringBuffer();
          String[] pathArray = path.split("/");
          for (int i = 1; i <= level_no; i++) {
            sb.append(" level_" + i + " = '" + pathArray[i]
                + "' and");
          }
          sql4IsFinal = "select nvl(count(id),0) from "
              + table_name
              + " where level_no = "
              + (level_no + 1)
              + " and company_code = '"
              + companyCode
              + "'"
              + " and "
              + ((sb.toString().endsWith("and")) ? (sb.toString()
                  .substring(0, sb.toString().length() - 3))
                  : sb.toString());
        } else {
          sql4IsFinal = "select nvl(count(id),0) from " + table_name
              + " where level_no = " + (level_no + 1)
              + " and company_code = '" + companyCode + "'";
        }

        ResultSet rs4IsFinal = rsSr.getRs(sql4IsFinal);
        rs4IsFinal.next();
        int countId = rs4IsFinal.getInt(1);
        rs4IsFinal.close();
        if (countId > 0) {
          is_final = false;
        }

        /**
         * 有关系的指标
         */
        String str4IndicatorId = getIndicatorIdFromDimMemberId(rsSr,
            companyCode, dimId, id);

        /**
         * 构造维成员对象
         */
        IParameter aMember = new Parameter("dimMember");
        aMember.setAttribute("final", is_final);
        aMember.setAttribute("level", level_no);
        aMember.setAttribute("path", path);
        aMember.setAttribute("id", id);
        aMember.setAttribute("identifier", level_no_value); //设置标识符 如果leve_no 是2 那么level_no_value 就是leve_2 对应的值           
        aMember.setAttribute("desc", dim_desc);
        aMember.setAttribute("dimType", dimId);
        aMember.setAttribute("indicator", str4IndicatorId);
        aMember.setAttribute("1", attribute_1);
        aMember.setAttribute("2", attribute_2);
        aMember.setAttribute("3", attribute_3);
        aMember.setAttribute("4", attribute_4);
        aMember.setAttribute("5", attribute_5);

        result.addChild(aMember);
      }//end while
      result.setAttribute("total", count);
      result.setAttribute("offset", offset);
      result.setAttribute("length", length);
    } else {

    }
    //end 
  }
  
  
  /**
   * 高级查询
   * 传入参数：一个维度对象id ,一个维成员名字 和一个该维度的属性Map
   * 返回一组维成员 在维度树上对展开这些维成员
   */
  public void searchDimMemberByAttribute(IParameter input, IParameter result,
      SelRs rsSr, String userId, String companyCode, String dbType)
      throws Exception {

    if (input instanceof QueryParam) {
      QueryParam query = (QueryParam) input;

      int offset = query.getOffset();
      int length = query.getLength();

      String dimId = "" + input.getAttribute("dimId");
      String attributeCase = "" + input.getAttribute("attributeCase");

      /**
       * 查询条件 有权限的维成员Id
       */
      Vector vct4BaseDimMemberId = this.getBaseDimMemberId(rsSr, userId,
          companyCode);
      StringBuffer sb4DimMemberId = new StringBuffer();
      Iterator iter = vct4BaseDimMemberId.iterator();
      while (iter.hasNext()) {
        String[] record = (String[]) iter.next();
        String dim_id = record[0];
        String dim_member_id = record[1];

        if (dimId.equals(dim_id)) {
          sb4DimMemberId.append("," + dim_member_id);
        }
      }
      String str4DimMemberId = sb4DimMemberId.toString().startsWith(",") ? sb4DimMemberId
          .toString().substring(1)
          : sb4DimMemberId.toString();

      /**
       * 表名
       */
      String table_name = this.getTableNameFromDimId(rsSr, companyCode,
          dimId);

      /**
       * 查询总数
       */
      int count = 0;
      String sql4Count = "select count(id) from "
          + table_name
          + " where company_code = '"
          + companyCode
          + "' and " + attributeCase;
      System.out.println("查询总数的sql --->" + sql4Count);
      ResultSet rs4Count = rsSr.getRs(sql4Count);
      if (rs4Count.next()) {
        count = rs4Count.getInt(1);
      }
      rs4Count.close();

      /**
       * 查询数据 Lulu
       */
      String sql4DimMember = "select id , level_no , dim_desc , attribute_1 , attribute_2 , attribute_3 , attribute_4 , attribute_5, dim_path_desc from "
       		+ table_name
          + " where company_code = '"
          + companyCode
          + "' and " + attributeCase
          + " order by id" ;
      System.out.println("查询数据的sql --->" + sql4DimMember);

      ResultSet rs4DimMember = rsSr.getRs(sql4DimMember);
      Vector vct4DimMember = rsSr.getRsVct(rs4DimMember, false);
      Iterator iter4DimMember = vct4DimMember.iterator();
      while (iter4DimMember.hasNext()) {
        String[] record = (String[]) iter4DimMember.next();
        String id = record[0];
        int level_no = Integer.parseInt(record[1]);
        String dim_desc = record[2];
        String attribute_1 = record[3];
        String attribute_2 = record[4];
        String attribute_3 = record[5];
        String attribute_4 = record[6];
        String attribute_5 = record[7];
        String pathDesc = record[8];//Lulu

        /**
         * 查询path
         */
        String path = "";
        String level_no_value = ""; //如果leve_no 是2 那么level_no_value 就是leve_2 对应的值
        if (level_no >= 1) {
          StringBuffer sb = new StringBuffer();
          for (int j = 1; j < level_no; j++) {
            sb.append("level_" + j + ", ");
          }
          sb.append("level_" + level_no + " ");
          String sql4Path = "select " + sb.toString() + " from "
              + table_name + " where company_code = '"
              + companyCode + "' and id = " + id;
          ResultSet rs4Path = rsSr.getRs(sql4Path);
          StringBuffer sb4Path = new StringBuffer("/");
          rs4Path.next();
          for (int k = 1; k < level_no; k++) {
            String temp4Path = (String) rs4Path.getString(k);
            temp4Path = temp4Path == null ? "" : temp4Path + "/";
            sb4Path.append(temp4Path);
          }
          level_no_value = (String) rs4Path.getString(level_no);
          sb4Path.append(level_no_value);
          path = sb4Path.toString();
          rs4Path.close();
        }

        /**
         * 查询 is_final 
         */
        boolean is_final = true;
        String sql4IsFinal = "";
        if (level_no >= 1) {
          StringBuffer sb = new StringBuffer();
          String[] pathArray = path.split("/");
          for (int i = 1; i <= level_no; i++) {
            sb.append(" level_" + i + " = '" + pathArray[i]
                + "' and");
          }
          sql4IsFinal = "select nvl(count(id),0) from "
              + table_name
              + " where level_no = "
              + (level_no + 1)
              + " and company_code = '"
              + companyCode
              + "'"
              + " and "
              + ((sb.toString().endsWith("and")) ? (sb.toString()
                  .substring(0, sb.toString().length() - 3))
                  : sb.toString());
        } else {
          sql4IsFinal = "select nvl(count(id),0) from " + table_name
              + " where level_no = " + (level_no + 1)
              + " and company_code = '" + companyCode + "'";
        }

        ResultSet rs4IsFinal = rsSr.getRs(sql4IsFinal);
        rs4IsFinal.next();
        int countId = rs4IsFinal.getInt(1);
        rs4IsFinal.close();
        if (countId > 0) {
          is_final = false;
        }

        /**
         * 有关系的指标
         */
        String str4IndicatorId = getIndicatorIdFromDimMemberId(rsSr,
            companyCode, dimId, id);

        /**
         * 构造维成员对象
         */
        IParameter aMember = new Parameter("dimMember");
        aMember.setAttribute("final", is_final);
        aMember.setAttribute("level", level_no);
        aMember.setAttribute("path", path);
        aMember.setAttribute("id", id);
        aMember.setAttribute("identifier", level_no_value); //设置标识符 如果leve_no 是2 那么level_no_value 就是leve_2 对应的值           
        aMember.setAttribute("desc", dim_desc);
        aMember.setAttribute("dimType", dimId);
        aMember.setAttribute("indicator", str4IndicatorId);
        aMember.setAttribute("1", attribute_1);
        aMember.setAttribute("2", attribute_2);
        aMember.setAttribute("3", attribute_3);
        aMember.setAttribute("4", attribute_4);
        aMember.setAttribute("5", attribute_5);
        aMember.setAttribute("pathDesc", pathDesc); //Lulu

        result.addChild(aMember);
      }//end while
      result.setAttribute("total", count);
      result.setAttribute("offset", offset);
      result.setAttribute("length", length);
    } else {

    }
    //end 
  }

  /** 
   * 查询一个维度定义的详细信息：
   * 传入参数：一个维度id
   */
  public void getDimDefDetail(IParameter input, IParameter result,
      SelRs rsSr, String userId, String companyCode, String dbType)
      throws Exception {

    String dimId = "" + input.getAttribute("dimId");

    Vector vct4BaseDimMemberId = this.getAllBaseDimMemberId(rsSr, userId,
        companyCode);
    Iterator iter = vct4BaseDimMemberId.iterator();
    while (iter.hasNext()) {
      String[] record = (String[]) iter.next();
      String dim_id = record[0];
      String dim_member_id = record[1];

      if (dim_id.equals(dimId)) {

        IParameter aDim = new Parameter("data");

        String sql4DimDetail = "select dim_code , dim_name from opa_dimension_def where company_code = '"
            + companyCode + "' and dim_id = " + dimId;
        ResultSet rs4DimDetail = rsSr.getRs(sql4DimDetail);
        if (rs4DimDetail.next()) {
          String dim_code = "" + rs4DimDetail.getString(1);
          String dim_name = "" + rs4DimDetail.getString(2);

          aDim.setAttribute("dimCode", dim_code);
          aDim.setAttribute("dimName", dim_name);
        }
        rs4DimDetail.close();

        IParameter aDimAttributes = new Parameter("attributes");
        String sql4DimAttr = "select dim_attribute_id , dim_attribute_name from opa_dimension_attribute  "
            + "where company_code = '"
            + companyCode
            + "' "
            + "and dim_id = "
            + dimId
            + " and dim_attribute_name is not null "
            + "order by dim_attribute_id ";

        ResultSet rs4DimAttr = rsSr.getRs(sql4DimAttr);
        while (rs4DimAttr.next()) {
          String dim_attribute_id = "" + rs4DimAttr.getString(1);
          String dim_attribute_name = "" + rs4DimAttr.getString(2);

          aDimAttributes.setAttribute(dim_attribute_id,
              dim_attribute_name);
        }
        rs4DimAttr.close();

        aDim.addChild(aDimAttributes);
        result.addChild(aDim);
        break;
      }
    }
  }

  /**
   * 查询所有定义的维度
   * 注意权限控制
   */
  public void getAllDimDef(IParameter input, IParameter result, SelRs rsSr,
      String userId, String companyCode, String dbType) throws Exception {

    Vector vct4BaseDimMemberId = this.getBaseDimMemberId(rsSr, userId,
        companyCode);

    for (int i = 0; i < vct4BaseDimMemberId.size(); i++) {
      String[] record = (String[]) vct4BaseDimMemberId.get(i);
      String dim_id = record[0];
      String dim_member_id = record[1];

      String dimId = "";
      if (i > 0) {
        dimId = "" + ((String[]) vct4BaseDimMemberId.get(i - 1))[0];
      } else {
        dimId = "" + ((String[]) vct4BaseDimMemberId.get(0))[0];
      }

      if (i == 0 || !dim_id.equals(dimId)) {
        IParameter aDim = new Parameter("data");
        String sql4DimDetail = "select dim_code , dim_name from opa_dimension_def where company_code = '"
            + companyCode + "' and dim_id = " + dim_id;
        ResultSet rs4DimDetail = rsSr.getRs(sql4DimDetail);
        if (rs4DimDetail.next()) {
          String dim_code = "" + rs4DimDetail.getString(1);
          String dim_name = "" + rs4DimDetail.getString(2);

          aDim.setAttribute("dimId", dim_id);
          aDim.setAttribute("dimCode", dim_code);
          aDim.setAttribute("dimName", dim_name);
        }
        rs4DimDetail.close();

        IParameter aDimAttributes = new Parameter("attributes");
        String sql4DimAttr = "select dim_attribute_id , dim_attribute_name from opa_dimension_attribute  "
            + "where company_code = '"
            + companyCode
            + "' "
            + "and dim_id = "
            + dim_id
            + " and dim_attribute_name is not null "
            + "order by dim_attribute_id ";

        ResultSet rs4DimAttr = rsSr.getRs(sql4DimAttr);
        while (rs4DimAttr.next()) {
          String dim_attribute_id = "" + rs4DimAttr.getString(1);
          String dim_attribute_name = "" + rs4DimAttr.getString(2);

          aDimAttributes.setAttribute(dim_attribute_id,
              dim_attribute_name);
        }
        rs4DimAttr.close();

        aDim.addChild(aDimAttributes);
        result.addChild(aDim);
      }
    }
  }

  /**
   * 根据维度ID 查找该维度的基本信息（根节点 属性MAP） 用于维度定义页面
   * 传入参数：dim_id 维度id 
   */
  public void getDimMemberBaseMsgByDimId(IParameter input, IParameter result,
      SelRs rsSr, String userId, String companyCode, String dbType)
      throws Exception {

    /**
     * 传入参数维度ID
     */
    String dimId = "" + input.getAttribute("dimId");

    /**
     * 表名
     */
    String tableName = this.getTableNameFromDimId(rsSr, companyCode, dimId);

    /**
     *根据dimId 查询出该维度的根节点
     */
    String sql4BaseDimMember = " select id , dim_desc from " + tableName
        + " where company_code = '" + companyCode
        + "' and level_no = 0";

    String baseDimMemberId = "";
    String baseDimMemberDesc = "";
    ResultSet rs4BaseDimMember = rsSr.getRs(sql4BaseDimMember);
    if (rs4BaseDimMember.next()) {
      baseDimMemberId = (String) rs4BaseDimMember.getString(1);
      baseDimMemberDesc = (String) rs4BaseDimMember.getString(2);
    }
    rs4BaseDimMember.close();

    /**
     * 根据dimId 查询出该维度的属性
     */
    IParameter attributes = new Parameter("attributes");

    HashMap map4Attr = this.getDimAttributeMap(rsSr, companyCode, dimId);
    Set set4Attr = map4Attr.keySet();
    Iterator iter4Attr = set4Attr.iterator();
    while (iter4Attr.hasNext()) {
      String key = (String) iter4Attr.next();
      String value = (String) map4Attr.get(key);

      attributes.setAttribute(key, value);
    }

    /**
     * 查询条件 这里不做权限控制，读取所有的定义的维度
     */
    Vector vct4BaseDimMemberId = this.getAllBaseDimMemberId(rsSr, userId,
        companyCode);
    Iterator iter = vct4BaseDimMemberId.iterator();
    while (iter.hasNext()) {
      String[] record = (String[]) iter.next();
      String dim_id = record[0];
      String dim_member_id = record[1];

      /**
       * 如果当前用户具有查看该维度根目录的权限则查询出该
       */
      if (dimId.equals(dim_id.trim())
          && baseDimMemberId.equals(dim_member_id.trim())) {

        /**
         * 构造维成员对象
         */
        IParameter dimMember = new Parameter("dimMember");
        dimMember.setAttribute("final", false);
        dimMember.setAttribute("level", 0);
        dimMember.setAttribute("path", "");
        dimMember.setAttribute("id", baseDimMemberId);
        dimMember.setAttribute("identifier", "");
        dimMember.setAttribute("desc", baseDimMemberDesc);
        dimMember.setAttribute("dimType", dimId);

        IParameter dimMemberBaseMsg = new Parameter("dimMemberBaseMsg");
        dimMemberBaseMsg.addChild(dimMember);
        dimMemberBaseMsg.addChild(attributes);

        result.addChild(dimMemberBaseMsg);
        break;
      }
    }
  }

  /**
   * 分页查询某个维成员的子节点
   * 传入参数维成员dimMember 
   */
  public void getSubMemberListByPaging(IParameter input, IParameter result,
      SelRs rsSr, String userId, String companyCode, String dbType)
      throws Exception {

    if (input instanceof QueryParam) {
      QueryParam query = (QueryParam) input;

      int offset = query.getOffset();
      int length = query.getLength();

      DimMember dimMember = new DimMember((IParameter) input.getChildren(
          "dimMember").get(0), rsSr, userId, companyCode);
      String dimId = dimMember.getDimType(); //维度类型就是维度ID
      String dimMemberId = dimMember.getId(); //维度类型就是维度ID

      /**
       * 表名
       */
      String tableName = this.getTableNameFromDimId(rsSr, companyCode,
          dimId);

      /**
       *根据dimId 查询出该维度的根节点
       */
      String sql4BaseDimMember = " select id , dim_desc from "
          + tableName + " where company_code = '" + companyCode
          + "' and level_no = 0";

      String baseDimMemberId = "";
      String baseDimMemberDesc = "";
      ResultSet rs4BaseDimMember = rsSr.getRs(sql4BaseDimMember);
      if (rs4BaseDimMember.next()) {
        baseDimMemberId = (String) rs4BaseDimMember.getString(1);
        baseDimMemberDesc = (String) rs4BaseDimMember.getString(2);
      }
      rs4BaseDimMember.close();

      /**
       * 是否查询
       */

      boolean isQuery = false;

      /**
       * 查询条件 有权限的维成员Id
       */
      Vector vct4BaseDimMemberId = this.getAllBaseDimMemberId(rsSr, userId,
          companyCode);
      Iterator iter = vct4BaseDimMemberId.iterator();
      while (iter.hasNext()) {
        String[] record = (String[]) iter.next();
        String dim_id = record[0];
        String dim_member_id = record[1];

        if (dimId.equals(dim_id)
            && baseDimMemberId.equals(dim_member_id.trim())) {
          isQuery = true;
          break;
        }
      }

      if (isQuery) {
        //开始查询

        /**
         * 查询总数
         */
        int count = 0;
        String sql4Count = "select count(*) "
            + "from  "
            + "(select * from "
            + tableName
            + " where company_code = '"
            + companyCode
            + "' and id = "
            + dimMemberId
            + " ) a , "
            + "(select * from "
            + tableName
            + " where company_code = '"
            + companyCode
            + "') b  "
            + "where (a.level_no + 1) = b.level_no  "
            + "and opa_util.nvl(nvl(a.level_1, b.level_1)) = opa_util.nvl(b.level_1)  "
            + "and opa_util.nvl(nvl(a.level_2, b.level_2)) = opa_util.nvl(b.level_2)  "
            + "and opa_util.nvl(nvl(a.level_3, b.level_3)) = opa_util.nvl(b.level_3)  "
            + "and opa_util.nvl(nvl(a.level_4, b.level_4)) = opa_util.nvl(b.level_4)  "
            + "and opa_util.nvl(nvl(a.level_5, b.level_5)) = opa_util.nvl(b.level_5)  ";

        ResultSet rs4Count = rsSr.getRs(sql4Count);
        if (rs4Count.next()) {
          count = rs4Count.getInt(1);
        }
        rs4Count.close();

        /**
         * 查询数据
         */
        String sql4DimMember = "select id , level_no , dim_desc , attribute_1 , attribute_2 , attribute_3 , attribute_4 , attribute_5, dim_path_desc  "
            + "from  "
            + "(select rownum r , b.id id , b.level_no level_no , b.dim_desc dim_desc ,b.attribute_1 attribute_1 ,b.attribute_2 attribute_2 ,b.attribute_3 attribute_3 ,b.attribute_4 attribute_4 ,b.attribute_5 attribute_5, b.dim_path_desc dim_path_desc   "
            + "from   " + "(select * from "
            + tableName
            + "  where company_code = '"
            + companyCode
            + "' and id = "
            + dimMemberId
            + " ) a ,  "
            + "(select * from "
            + tableName
            + "  where company_code = '"
            + companyCode
            + "') b  "
            + "where (a.level_no + 1) = b.level_no  "
            + "and opa_util.nvl(nvl(a.level_1, b.level_1)) = opa_util.nvl(b.level_1)  "
            + "and opa_util.nvl(nvl(a.level_2, b.level_2)) = opa_util.nvl(b.level_2)  "
            + "and opa_util.nvl(nvl(a.level_3, b.level_3)) = opa_util.nvl(b.level_3)  "
            + "and opa_util.nvl(nvl(a.level_4, b.level_4)) = opa_util.nvl(b.level_4)  "
            + "and opa_util.nvl(nvl(a.level_5, b.level_5)) = opa_util.nvl(b.level_5)  "
            + "order by b.id , r   "
            + ") "
            + "where (r > "
            + offset + " and r < " + (offset + length) + ") ";

        ResultSet rs4DimMember = rsSr.getRs(sql4DimMember);
        Vector vct4DimMember = rsSr.getRsVct(rs4DimMember, false);
        Iterator iter4DimMember = vct4DimMember.iterator();
        while (iter4DimMember.hasNext()) {
          String[] record = (String[]) iter4DimMember.next();
          String id = record[0];
          int level_no = Integer.parseInt(record[1]);
          String dim_desc = record[2];
          String attribute_1 = record[3];
          String attribute_2 = record[4];
          String attribute_3 = record[5];
          String attribute_4 = record[6];
          String attribute_5 = record[7];
	      String dim_path_desc = record[8];
          /**
           * 查询path
           */
          String path = "";
          String level_no_value = ""; //如果leve_no 是2 那么level_no_value 就是leve_2 对应的值
          if (level_no >= 1) {
            StringBuffer sb = new StringBuffer();
            for (int j = 1; j < level_no; j++) {
              sb.append("level_" + j + ", ");
            }
            sb.append("level_" + level_no + " ");
            String sql4Path = "select " + sb.toString() + " from "
                + tableName + " where company_code = '"
                + companyCode + "' and id = " + id;
            ResultSet rs4Path = rsSr.getRs(sql4Path);
            StringBuffer sb4Path = new StringBuffer("/");
            rs4Path.next();
            for (int k = 1; k < level_no; k++) {
              String temp4Path = (String) rs4Path.getString(k);
              temp4Path = temp4Path == null ? "" : temp4Path
                  + "/";
              sb4Path.append(temp4Path);
            }
            level_no_value = (String) rs4Path.getString(level_no);
            sb4Path.append(level_no_value);
            path = sb4Path.toString();
            rs4Path.close();
          }

          /**
           * 查询 is_final 
           */
          boolean is_final = true;
          String sql4IsFinal = "";
          if (level_no >= 1) {
            StringBuffer sb = new StringBuffer();
            String[] pathArray = path.split("/");
            for (int i = 1; i <= level_no; i++) {
              sb.append(" level_" + i + " = '" + pathArray[i]
                  + "' and");
            }
            sql4IsFinal = "select nvl(count(id),0) from "
                + tableName
                + " where level_no = "
                + (level_no + 1)
                + " and company_code = '"
                + companyCode
                + "'"
                + " and "
                + ((sb.toString().endsWith("and")) ? (sb
                    .toString().substring(0, sb.toString()
                    .length() - 3)) : sb.toString());
          } else {
            sql4IsFinal = "select nvl(count(id),0) from "
                + tableName + " where level_no = "
                + (level_no + 1) + " and company_code = '"
                + companyCode + "'";
          }

          ResultSet rs4IsFinal = rsSr.getRs(sql4IsFinal);
          rs4IsFinal.next();
          int countId = rs4IsFinal.getInt(1);
          rs4IsFinal.close();
          if (countId > 0) {
            is_final = false;
          }

          /**
           * 有关系的指标
           */
          String str4IndicatorId = getIndicatorIdFromDimMemberId(
              rsSr, companyCode, dimId, id);

          /**
           * 构造维成员对象
           */
          IParameter aMember = new Parameter("dimMember");
          aMember.setAttribute("final", is_final);
          aMember.setAttribute("level", level_no);
          aMember.setAttribute("path", path);
          aMember.setAttribute("id", id);
          aMember.setAttribute("identifier", level_no_value); //设置标识符 如果leve_no 是2 那么level_no_value 就是leve_2 对应的值           
          aMember.setAttribute("desc", dim_desc);
          aMember.setAttribute("dimType", dimId);
          aMember.setAttribute("pathDesc", dim_path_desc);
          aMember.setAttribute("indicator", str4IndicatorId);
          aMember.setAttribute("1", attribute_1);
          aMember.setAttribute("2", attribute_2);
          aMember.setAttribute("3", attribute_3);
          aMember.setAttribute("4", attribute_4);
          aMember.setAttribute("5", attribute_5);

          result.addChild(aMember);
        }//end while

        result.setAttribute("total", count);
        result.setAttribute("offset", offset);
        result.setAttribute("length", length);
      }
    }
  }

  public void getCurrentYear(IParameter input, IParameter result, SelRs rsSr,
      String userId, String companyCode, String dbType) throws Exception {
    Calendar calendar = Calendar.getInstance();
    int year = calendar.get(Calendar.YEAR);
    ResultSet rs = rsSr
        .getRs("select opa_name_mgr.get_pub_dim_table('time') from dual");
    if (rs.next()) {
      String tableName = rs.getString(1);
      rs = rsSr.getRs("select id, dim_desc, level_no, dim_path_desc from " + tableName
          + " where " + " level_1='" + year + "' and "
          + " level_2 is null and " + " level_3 is null and "
          + " level_4 is null and " + " level_5 is null");
      if (rs.next()) {
        IParameter member = new Parameter("dimMember");
        member.setAttribute("final", false);
        member.setAttribute("level", 1);
        member.setAttribute("path", "/" + year);
        member.setAttribute("id", rs.getString("id"));
        member.setAttribute("desc", rs.getString("dim_desc"));
        member.setAttribute("pathDesc", rs.getString("dim_path_desc"));
        member.setAttribute("dimType", "1");
        result.addChild(member);
      }
    }
  }

  public void getCurrentMonth(IParameter input, IParameter result,
      SelRs rsSr, String userId, String companyCode, String dbType)
      throws Exception {
    Calendar calendar = Calendar.getInstance();
    int year = calendar.get(Calendar.YEAR);
    int month = calendar.get(Calendar.MONTH);
    ResultSet rs = rsSr
        .getRs("select opa_name_mgr.get_pub_dim_table('time') from dual");
    if (rs.next()) {
      String tableName = rs.getString(1);
      rs = rsSr.getRs("select id, dim_desc, level_no, dim_path_desc from " + tableName
          + " where " + " level_1='" + year + "' and " + " level_2='"
          + ((month) / 6 + 1) + "' and " + " level_3='"
          + ((month) / 3 + 1) + "' and " + " level_4='" + (month + 1)
          + "' and " + " level_5 is null");
      if (rs.next()) {
        IParameter member = new Parameter("dimMember");
        member.setAttribute("final", true);
        member.setAttribute("level", 1);
        member.setAttribute("path", "/" + year);
        member.setAttribute("id", rs.getString("id"));
        member.setAttribute("desc", rs.getString("dim_desc"));
        member.setAttribute("pathDesc", rs.getString("dim_path_desc"));
        member.setAttribute("dimType", "1");
        result.addChild(member);
      }
    }
  }
  
  public void getLevelDef(IParameter input, IParameter result,
      SelRs rsSr, String userId, String companyCode, String dbType) throws Exception {
    String dimType = input.getString("dimType");
    ResultSet rs = rsSr.getRs("select dim_level_id, dim_level_name from opa_dimension_level where dim_id = " + dimType +
                  " and dim_level_name is not null order by dim_level_id");
    while(rs.next()){
      IParameter level = new Parameter("level");
      level.setAttribute("level", rs.getInt("dim_level_id"));
      level.setAttribute("name", rs.getString("dim_level_name"));
      result.addChild(level);
    }
  }
  
  
%><%
  IInteractionProxy proxy = (IInteractionProxy) new HttpRemoteProxy(
      request, response);
  try {
    SelRs rsSr = (SelRs) request.getAttribute("rsSr");
    String companyCode = (String) request
        .getAttribute("companyCode");
    String userId = (String) request.getAttribute("userId");
    String dbType = (String) request.getAttribute("dbType");

    IParameter param = proxy.getParameter();
    IParameter result = new Parameter("result");

    String methodName = (String) param.getAttribute("method");
    if (!"".equals(methodName) && methodName != null) {
      Method method = this.getClass().getMethod(
          methodName,
          new Class[] { IParameter.class, IParameter.class,
              SelRs.class, String.class, String.class,
              String.class });
      method.invoke(this, new Object[] { param, result, rsSr,
          userId, companyCode, dbType });
      RespondParam respondParam = new RespondParam(result);
      respondParam.setSuccessful(true);
      proxy.respond(respondParam);
    } else
      throw new IllegalArgumentException("method: " + methodName);
  } catch (Exception e) {
    if(e.getCause()!=null)
      e.getCause().printStackTrace();
    else e.printStackTrace();
    RespondParam respondParam = new RespondParam(new Parameter(
        "respond"));
    respondParam.setSuccessful(false);
    respondParam.setMsg(e.getMessage());
    proxy.respond(respondParam);
  }
%>