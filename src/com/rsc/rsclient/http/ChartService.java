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
     * ��ȡ����
     * 
     * @param params
     *            ����MAP
     * @param rsSr
     *            ���ݿ��������
     * @param companyCode
     *            ��˾��
     * @param userId
     *            �û�ID
     * @param dbType
     *            ���ݿ�����
     * @return {@link Map} ������Ϣ
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
     * �û�Ҫʵ�ֵķ��������������ݶ�ȡ�߼���
     * 
     * @param data
     *            Store���ݷ�װ����
     * @param rsSr
     *            ���ݿ��������
     * @param companyCode
     *            ��˾��
     * @param userId
     *            �û�ID
     * @param dbType
     *            ���ݿ�����
     * @throws Exception
     */
    public void read(ChartStoreData data, SelRs rsSr, String companyCode,
            String userId, String dbType) throws Exception {
    };
}
