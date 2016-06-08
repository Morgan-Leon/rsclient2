package com.rsc.rsclient.http;

import java.util.Map;

import org.apache.log4j.Logger;

import com.rsc.rs.pub.dbUtil.SelRs;
import com.rsc.rs.pub.util.WebKeys;
import com.rsc.rsclient.MethodMap;
import com.rsc.rsclient.Service;

public class ChartService extends Service {

    private Logger logger = Logger.getLogger(ChartService.class);

    public void registerMethods(MethodMap mm) throws Exception {
        mm.add("read").addMapParameter("params")
                .addObjectParameter(WebKeys.SelRsKey, SelRs.class)
                .addStringParameter(WebKeys.CompanyCodeKey)
                .addStringParameter(WebKeys.UserUniqueIdKey)
                .addStringParameter(WebKeys.DbType).setMapReturnValue();
    }
    
    /**
     * 读取数据
     * 
     * @param params
     *            参数MAP
     * @param rsSr
     *            数据库操作对象
     * @param companyCode
     *            公司号
     * @param userId
     *            用户ID
     * @param dbType
     *            数据库类型
     * @return {@link Map} 返回信息
     */
    public final Map read(Map params, SelRs rsSr, String companyCode,
            String userId, String dbType) {
        ChartStoreData data = new ChartStoreData(params);
        try {
            this.read(data, rsSr, companyCode, userId, dbType);
            data.setSuccess();
        } catch (Exception e) {
            data.setFailure();
            data.setMessage(e.getMessage());
            logger.error(e.getMessage(), e);
        } finally {
            return data.getDataMap() ;
        }
    }
    
    /**
     * 用户要实现的方法，真正的数据读取逻辑。
     * 
     * @param data
     *            Store数据封装对象
     * @param rsSr
     *            数据库操作对象
     * @param companyCode
     *            公司号
     * @param userId
     *            用户ID
     * @param dbType
     *            数据库类型
     * @throws Exception
     */
    public void read(ChartStoreData data, SelRs rsSr, String companyCode,
            String userId, String dbType) throws Exception {
    };
}
