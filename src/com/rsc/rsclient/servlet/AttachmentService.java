package com.rsc.rsclient.servlet;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.log4j.Logger;

import com.rsc.rs.pub.dbUtil.SelRs;
import com.rsc.rs.pub.dbUtil.UIDGenerator;
import com.rsc.rs.pub.net.ftp.FTPClient;
import com.rsc.rs.pub.net.ftp.FTPConnectMode;
import com.rsc.rs.pub.net.ftp.FTPException;
import com.rsc.rs.pub.net.ftp.FTPTransferType;
import com.rsc.rs.pub.util.WebKeys;
import com.rsc.rsclient.MethodMap;
import com.rsc.rsclient.Service;
import com.rsc.rsclient.VariableAbstract;
import com.rsc.rsclient.VariablePool;
import com.rsc.rsclient.ftp.FtpConfig;
import com.rsc.rsclient.ftp.FtpOperatorConfig;

/**
 * 
 * 处理附件的上传下载以及更新删除等操作。
 * 
 * @author changhu
 */
public class AttachmentService extends Service {

    private Logger logger = Logger.getLogger(AttachmentService.class);

    public void registerMethods(MethodMap mm) throws Exception {  

        mm.add("download").addStringParameter("attachmentId")
                          .addStringParameter("attachmentIndex")
                          .addObjectParameter(WebKeys.SelRsKey, SelRs.class)
                          .addStringParameter(WebKeys.CompanyCodeKey)
                          .addStringParameter(WebKeys.UserUniqueIdKey)
                          .addStringParameter(WebKeys.DbType)
                          .setMapReturnValue();

        mm.add("downloadFile").addStringParameter("filepath")
					         .addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					         .addStringParameter(WebKeys.CompanyCodeKey)
					         .addStringParameter(WebKeys.UserUniqueIdKey)
					         .addStringParameter(WebKeys.DbType)
					         .setMapReturnValue();

        mm.add("read").addStringParameter("attachmentId")
                      .addStringParameter("attachmentIndex")
                      .addObjectParameter(WebKeys.SelRsKey, SelRs.class)
                      .addStringParameter(WebKeys.CompanyCodeKey)
                      .addStringParameter(WebKeys.UserUniqueIdKey)
                      .addStringParameter(WebKeys.DbType)
                      .setStringReturnValue();
        
        
        mm.add("preview").addStringParameter("attachmentId")
					     .addStringParameter("attachmentIndex")
					     .addObjectParameter(WebKeys.SelRsKey, SelRs.class)
					     .addStringParameter(WebKeys.CompanyCodeKey)
					     .addStringParameter(WebKeys.UserUniqueIdKey)
					     .addStringParameter(WebKeys.DbType)
					     .setMapReturnValue();

        mm.add("upload").addStringParameter("attachmentId")
                        .addStringParameter("fileDir")
                        .addObjectParameter(WebKeys.SelRsKey, SelRs.class)
                        .addStringParameter(WebKeys.CompanyCodeKey)
                        .addStringParameter(WebKeys.UserUniqueIdKey)
                        .addStringParameter(WebKeys.DbType)
                        .setMapReturnValue();

        mm.add("deleteFile").addStringParameter("attachmentId")
                            .addStringParameter("attachmentIndex")
                            .addObjectParameter(WebKeys.SelRsKey, SelRs.class)
                            .addStringParameter(WebKeys.CompanyCodeKey)
                            .addStringParameter(WebKeys.UserUniqueIdKey)
                            .addStringParameter(WebKeys.DbType)
                            .setMapReturnValue();
    }

    /**
     * 上传附件
     * 
     * @param sysCode
     *            子系统编码
     * @param rsSr
     *            数据库操作对象
     * @param companyCode
     *            公司号
     * @param userId
     *            用户ID
     * @param dbType
     *            数据库类型
     * @return
     * @throws IOException
     * @throws FTPException
     */
    public Map upload(String attachmentId ,String fileDir, SelRs rsSr, String companyCode, String userId,
            String dbType) throws Exception, IOException, FTPException {
        int nextAttachmentId ;
        VariablePool vp = this.getCurrentVariablePool();
        List fileItems = new ArrayList();
        for (Iterator i = vp.variableNameSet().iterator(); i.hasNext();) {
            String name = (String) i.next();
            VariableAbstract v = vp.getVariable(name);
            if (v != null && v.getClazz().isAssignableFrom(DiskFileItem.class)) {
                fileItems.add(v.getValue());
            }
        }
        Map m = new HashMap();
        String subsysCode = fileDir;
        if (fileItems.size() > 0) {
            if(attachmentId == null || "-1".equals(attachmentId)){
                nextAttachmentId = getNextAttachmentId(rsSr, companyCode, userId, dbType);
            } else {
                nextAttachmentId = Integer.parseInt(attachmentId) ;
            }
            if ("DISK".equalsIgnoreCase(FtpOperatorConfig.getOperateMode())) { // 判断是直接存储在硬盘上还是存储在FTP服务器上
                m = this.uploadFileToDisk(nextAttachmentId , fileItems, subsysCode, rsSr,
                        companyCode, userId, dbType);
            } else {
                m = this.uploadFileToFTP(nextAttachmentId , fileItems, subsysCode, rsSr,
                        companyCode, userId, dbType);
            }
        }
        return m;
    }

    /**
     * 将上传的文件存入服务器的硬盘中
     * 
     * @param fileItems
     * @param filename
     * @param fileDir
     * @return
     * @throws IOException
     * @throws FTPException
     */
    private Map uploadFileToDisk(int nextAttachmentId , List fileItems, String subsysCode, SelRs rsSr,
            String companyCode, String userId, String dbType)
            throws IOException, FTPException {
        boolean uploadSuccess = false;
        Map info = new HashMap();
        String fileName = null;
        String attachmentName = null;
        String basePath = null;
        int[] data = null ;
        basePath = FtpOperatorConfig.getRootPath() + File.separator
                + subsysCode + File.separator + companyCode + File.separator
                + getYearMonth("yyyy-MM") ;
        try {
            Iterator iterator = fileItems.iterator();
            while (iterator.hasNext()) {
                FileItem item = (FileItem) iterator.next();
                fileName = getFileName(item) ;
                fileName = item.getName() ;
                String suffix = fileName.substring(fileName.lastIndexOf("."));
                attachmentName = getUUID() + suffix;
                String filePath = basePath + File.separator + attachmentName ;
                File f = new File(basePath);
                if (!f.exists()) {
                    f.mkdirs();
                }
                f = new File(filePath);
                item.write(f);
                data = this.uploadFileSaveDB(nextAttachmentId ,fileName,attachmentName,item.getSize(),filePath,
                        subsysCode, rsSr, companyCode, userId, dbType);
            }
            uploadSuccess = true;
        } catch (Exception e) {
            e.printStackTrace();
            uploadSuccess = false;
        }
        info.put("success", new Boolean(uploadSuccess));
        Integer success = uploadSuccess ? new Integer(0) : new Integer(1);
        info.put("error", success);

        String message = uploadSuccess ? "上传成功" : "上传失败";
        info.put("message", message);
        
        String state = uploadSuccess ? "SUCCESS" : "上传失败" ;
        info.put("state", state);
        
        info.put("url", "/rsc/rsclient/attachment?attachmentId=" + data[0] + "&attachmentIndex=" + data[1]
                + "&Rs-method=read");
        info.put("attachmentId", Integer.valueOf(data[0]));
        info.put("attachmentIndex", Integer.valueOf(data[1]));
        return info;
    }

    /**
     * 将上传的文件存入FTP服务器中
     * 
     * @param fileItems
     * @param filename
     * @param fileDir
     * @return
     * @throws IOException
     * @throws FTPException
     */
    private Map uploadFileToFTP(int nextAttachmentId , List fileItems, String subsysCode, SelRs rsSr,
            String companyCode, String userId, String dbType) throws IOException, FTPException {
        boolean uploadSuccess = false;
        String attachmentName = null;
        String fileName = null ;
        int[] data = null ;
        Map info = new HashMap();  
        try {
            String host = FtpConfig.getFTPHost();
            int port = FtpConfig.getFTPPort();
            FTPClient ftp = new FTPClient(host, port);
            ftp.login(FtpConfig.getFTPUser(), FtpConfig.getFTPPass());
            ftp.setType(FTPTransferType.BINARY);
            ftp.setConnectMode(FTPConnectMode.ACTIVE);
            Iterator iterator = fileItems.iterator();
            while (iterator.hasNext()) {
                FileItem item = (FileItem) iterator.next();
                fileName = item.getName() ;
                String suffix = fileName.substring(fileName.lastIndexOf("."));
                attachmentName = getUUID() + suffix ;
                InputStream s = item.getInputStream();
                byte[] a = new byte[(int) item.getSize()];
                s.read(a);
                String basePath = subsysCode + File.separator + companyCode + File.separator + getYearMonth("yyyy-MM") ;
                String filePath = basePath + File.separator + attachmentName ;
                ftp.mkdirs(basePath);
                ftp.put(a , filePath);
                data = this.uploadFileSaveDB(nextAttachmentId , fileName ,attachmentName ,item.getSize(),filePath,
                        subsysCode, rsSr, companyCode, userId, dbType);
            }
            ftp.quit();
            uploadSuccess = true ;
        } catch (Exception e) {
            e.printStackTrace();
        }
        info.put("success", new Boolean(uploadSuccess));
        Integer success = uploadSuccess ? new Integer(0) : new Integer(1);
        info.put("error", success);
        String message = uploadSuccess ? "上传成功" : "上传失败";
        
        String state = uploadSuccess ? "SUCCESS" : "上传失败" ;
        info.put("state", state);
        
        info.put("message", message);
        info.put("url", "/rsc/rsclient/attachment?attachmentId=" + data[0] + "&attachmentIndex=" + data[1]
                + "&Rs-method=read");
        info.put("attachmentId", Integer.valueOf(data[0]));
        info.put("attachmentIndex", Integer.valueOf(data[1]));
        return info;
    }

    /**
     * 将附件信息保存至数据库中
     * @param fileName 文件名
     * @param size 文件大小
     * @param subsysCode
     * @param rsSr
     * @param companyCode
     * @param userId
     * @param dbType
     * @return
     * @throws SQLException
     * @throws UnsupportedEncodingException
     */
    private int[] uploadFileSaveDB(int attachmentId , String fileName,String attachmentName ,long fileSize,String filePath , String subsysCode,
            SelRs rsSr, String companyCode, String userId, String dbType)
            throws SQLException, UnsupportedEncodingException {
        int nextAttachmentIndex = 0 ;
        String maxIndexSQL = "SELECT nvl(MAX(attachment_index) , 0) FROM SYS_ATTACHMENT"
                    + " WHERE company_code='" + companyCode + "'"
                    + " AND attachment_id =" + attachmentId ;
        ResultSet rs = rsSr.getRs(maxIndexSQL);
        if (rs != null && rs.next()) {
            nextAttachmentIndex = rs.getInt(1) + 1;
        }
        String insertSQL = " INSERT INTO sys_attachment(COMPANY_CODE, ATTACHMENT_ID, ATTACHMENT_INDEX,"
                         + "    ATTACHMENT_NAME, ATTACHMENT_SIZE, ATTACHMENT_STATUS, ATTACHMENT_PATH,"
                         + "    FILE_NAME, CREATOR_ID, CREATE_TIME, SUBSYS_CODE)"
                         + " VALUES('" + companyCode + "', '" + attachmentId + "', '" + nextAttachmentIndex + "', '"
                         + attachmentName+ "', '" + fileSize + "', 'Y', '" + filePath + "', '" + fileName + "', '"
                         + userId + "', '" + getYearMonth("yyyy/MM/dd") + "', '" + subsysCode + "')";
        rsSr.update(insertSQL);
        int[] data = {attachmentId , nextAttachmentIndex};
        return data;
    }

    /**
     * 获取文件，返回文件路径
     * 
     * @param attachmentid
     *            文件路径以及文件名
     * @param rsSr
     *            数据库操作对象
     * @param companyCode
     *            公司号
     * @param userId
     *            用户ID
     * @param dbType
     *            数据库类型
     * @return 文件字节数组
     * @throws Exception
     */
    public String read(String attachmentid , String attachmentIndex, SelRs rsSr, String companyCode,
            String userId, String dbType) throws Exception {
        StringBuffer condition = new StringBuffer();
        String c = "" ; 
        if(attachmentid != null){
            c = " AND attachment_id='" + attachmentid + "'";
        }
        condition.append(c) ;
        if(attachmentIndex != null){
            c = "" ;
            c = " AND attachment_index='" + attachmentIndex + "'";
        }
        condition.append(c) ;
        String querySQL = "SELECT attachment_path FROM SYS_ATTACHMENT WHERE "
                + " company_code='" + companyCode + "'" + condition.toString() ;
        ResultSet rs = rsSr.getRs(querySQL);
        String filePath = null;
        if (rs != null && rs.next()) {
            filePath = rs.getString(1);
        }
        return filePath ;
    }
    
    /**
     * 获取文件，返回文件路径
     * 
     * @param attachmentid
     *            文件路径以及文件名
     * @param rsSr
     *            数据库操作对象
     * @param companyCode
     *            公司号
     * @param userId
     *            用户ID
     * @param dbType
     *            数据库类型
     * @return 文件字节数组
     * @throws Exception
     */
    public List read(String attachmentid , SelRs rsSr, String companyCode,
            String userId, String dbType) throws Exception {
        String querySQL = "SELECT attachment_path FROM SYS_ATTACHMENT WHERE "
                + " company_code='" + companyCode + "'"
                + " AND attachment_id='" + attachmentid + "'" ;
        ResultSet rs = rsSr.getRs(querySQL);
        List filePath = new ArrayList();
        while (rs != null && rs.next()) {
            filePath.add(rs.getString(1));
        }
        return filePath ;
    }
    
    /**
     * 获取上传文件的文件名
     * 
     * @param item
     * @return
     * @throws UnsupportedEncodingException
     */
    public String getFileName(FileItem item)
            throws UnsupportedEncodingException {
        String fileName = item.getName();
        logger.debug(fileName);
        fileName = replace(fileName, "\\", "/");
        fileName = fileName.substring(fileName.lastIndexOf("/") + 1);
        logger.debug(fileName);
        fileName = new String(fileName.getBytes("GB2312"), "GBK");
        logger.debug(fileName);
        return fileName;
    }

    /**
     * 字符串替换
     * 
     * @param source
     * @param oldString
     * @param newString
     * @return
     */
    public static String replace(String source, String oldString,
            String newString) {
        StringBuffer output = new StringBuffer();
        int lengthOfSource = source.length();
        int lengthOfOld = oldString.length();
        int posStart = 0;
        int pos;
        while ((pos = source.indexOf(oldString, posStart)) >= 0) {
            output.append(source.substring(posStart, pos));
            output.append(newString);
            posStart = pos + lengthOfOld;
        }
        if (posStart < lengthOfSource) {
            output.append(source.substring(posStart));
        }
        return output.toString();
    }

    /**
     * 下载文件
     * 
     * @param filepath
     *            文件路径以及文件名
     * @param rsSr
     *            数据库操作对象
     * @param companyCode
     *            公司号
     * @param userId
     *            用户ID
     * @param dbType
     *            数据库类型
     * @return 文件字节数组
     * @throws Exception
     */
    public byte[] download(String attachmentid, String attachmentindex , SelRs rsSr, String companyCode,
            String userId, String dbType) throws Exception {
        String filepath = read(attachmentid , attachmentindex , rsSr, companyCode, userId, dbType);
        // 判断是直接存储在硬盘上还是存储在FTP服务器上
        if ("DISK".equalsIgnoreCase(FtpOperatorConfig.getOperateMode())) {
            return getBytesFromFile(new File(filepath));
        } else {
            FTPClient ftp = new FTPClient(FtpConfig.getFTPHost(), FtpConfig.getFTPPort());
            ftp.login(FtpConfig.getFTPUser(), FtpConfig.getFTPPass());
            ftp.setType(FTPTransferType.BINARY);
            ftp.setConnectMode(FTPConnectMode.ACTIVE);
            byte[] fbyte = ftp.get(filepath);
            return fbyte;
        }
    }
    /**
     * 下载文件
     * 
     * @param filepath
     *            文件路径以及文件名
     * @param rsSr
     *            数据库操作对象
     * @param companyCode
     *            公司号
     * @param userId
     *            用户ID
     * @param dbType
     *            数据库类型
     * @return 文件字节数组
     * @throws Exception
     */
    public byte[] downloadFile(String filepath , SelRs rsSr, String companyCode,
            String userId, String dbType) throws Exception {
         // 判断是直接存储在硬盘上还是存储在FTP服务器上
        if ("DISK".equalsIgnoreCase(FtpOperatorConfig.getOperateMode())) {
            return getBytesFromFile(new File(filepath));
        } else {
            FTPClient ftp = new FTPClient(FtpConfig.getFTPHost(), FtpConfig.getFTPPort());
            ftp.login(FtpConfig.getFTPUser(), FtpConfig.getFTPPass());
            ftp.setType(FTPTransferType.BINARY);
            ftp.setConnectMode(FTPConnectMode.ACTIVE);
            byte[] fbyte = ftp.get(filepath);
            return fbyte;
        }
    }
    /**
     * 将文件转换为字节流
     * @param file
     *          文件
     * @return  文字字节数组
     * @throws IOException
     */
    private byte[] getBytesFromFile(File file) throws IOException {
        InputStream is = new FileInputStream(file);
        long length = file.length();
        if (length > Integer.MAX_VALUE) {
            // 文件太大，无法读取
            throw new IOException("File is to large " + file.getName());
        }
        // 创建一个数据来保存文件数据
        byte[] bytes = new byte[(int) length];
        // 读取数据到byte数组中
        int offset = 0;
        int numRead = 0;
        while (offset < bytes.length && (numRead = is.read(bytes, offset, bytes.length - offset)) >= 0) {
            offset += numRead;
        }
        // 确保所有数据均被读取
        if (offset < bytes.length) {
            throw new IOException("Could not completely read file " + file.getName());
        }
        is.close();
        return bytes;
    }

    /**
     * 删除附件
     * 
     * @param attachmentid
     *            附件列表ID
     * @param attachmentindex
     *            附件列表附件序号
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
    public Map deleteFile(String attachmentid ,String attachmentindex , SelRs rsSr, String companyCode,
            String userId, String dbType) throws Exception {
        Map map = new HashMap();
        try {
            String filepath = read(attachmentid, attachmentindex , rsSr, companyCode, userId, dbType);
            // 判断是直接存储在硬盘上还是存储在FTP服务器上
            if ("DISK".equalsIgnoreCase(FtpOperatorConfig.getOperateMode())) {
                deleteFileToDisk(filepath);
            } else {
                deleteFileToFTP(filepath);
            }
            deleteFileToDB(attachmentid, attachmentindex , rsSr, companyCode, userId, dbType);
            map.put("success" , Boolean.valueOf(true));
        } catch (Exception e) {
            map.put("success" , Boolean.valueOf(false));
            map.put("message" , "删除文件失败");
        }
        return map ;
    }
    
    /**
     * 删除附件
     * 
     * @param attachmentid
     *            附件列表ID
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
    public Map deleteFile(String attachmentid , SelRs rsSr, String companyCode,
            String userId, String dbType) throws Exception {
        Map map = new HashMap();
        try {
            List filepath = read(attachmentid, rsSr, companyCode, userId, dbType);
            // 判断是直接存储在硬盘上还是存储在FTP服务器上
            if ("DISK".equalsIgnoreCase(FtpOperatorConfig.getOperateMode())) {
                for (int i = 0 , len=filepath.size(); i < len; i++) {
                    deleteFileToDisk((String)filepath.get(i));
                }
            } else {
                for (int i = 0 , len=filepath.size(); i < len; i++) {
                    deleteFileToFTP((String)filepath.get(i));
                }
            }
            deleteFileToDB(attachmentid, rsSr, companyCode, userId, dbType);
            map.put("success" , Boolean.valueOf(true));
        } catch (Exception e) {
            map.put("success" , Boolean.valueOf(false));
            map.put("message" , "删除文件失败");
        }
        return map ;
    }
    
    /**
     * 根据附件路径删除附件
     * 
     * @param filepath  附件路径列表
     */
    public void deleteFileDiskOrFTP(List filepath) throws Exception {
        // 判断是直接存储在硬盘上还是存储在FTP服务器上
        if ("DISK".equalsIgnoreCase(FtpOperatorConfig.getOperateMode())) {
            for (int i = 0 , len=filepath.size(); i < len; i++) {
                deleteFileToDisk((String)filepath.get(i));
            }
        } else {
            for (int i = 0 , len=filepath.size(); i < len; i++) {
                deleteFileToFTP((String)filepath.get(i));
            }
        }   
    }
    
    /**
     * 从数据库中删除附件信息
     * @param attachmentid 附件编码
     * @param rsSr
     * @param companyCode
     * @param userId
     * @param dbType
     */
    private void deleteFileToDB(String attachmentid,String attachmentindex , SelRs rsSr,
            String companyCode, String userId, String dbType) {
        String deleteSql = "DELETE FROM sys_attachment WHERE "
                        + " company_code='" + companyCode + "'"
                        + " AND attachment_id = " + attachmentid
                        + " AND attachment_index=" + attachmentindex;
        rsSr.update(deleteSql) ;
    }
    
    /**
     * 从数据库中删除附件信息
     * @param attachmentid 附件编码
     * @param rsSr
     * @param companyCode
     * @param userId
     * @param dbType
     */
    private void deleteFileToDB(String attachmentid , SelRs rsSr,
            String companyCode, String userId, String dbType) {
        String deleteSql = " DELETE FROM sys_attachment"
                         + " WHERE  company_code='" + companyCode + "'"
                         + "   AND attachment_id = " + attachmentid ;
        rsSr.update(deleteSql) ;
    }

    /**
     * 删除FTP服务器附件
     * @param filepath 
     * @throws Exception
     */
    private void deleteFileToFTP(String filepath) throws Exception {
        FTPClient ftp;
        ftp = new FTPClient(FtpConfig.getFTPHost(), FtpConfig.getFTPPort());
        ftp.login(FtpConfig.getFTPUser(), FtpConfig.getFTPPass());
        ftp.setType(FTPTransferType.BINARY);
        ftp.setConnectMode(FTPConnectMode.ACTIVE);
        ftp.delete(filepath);
        ftp.quit()  ;
    }

    /**
     * 删除硬盘附件
     * @param filepath 一个绝对路径
     * @throws Exception
     */
    private void deleteFileToDisk(String filepath)  throws Exception {
        try {
            File file = new File(filepath);
            if(file.exists()){
                file.delete() ;
            }
        } catch (RuntimeException e) {
            e.printStackTrace();
        }
    }
    
    /**
     * 
     * @param attachmentid
     * @param attachmentIndex
     * @param rsSr
     * @param companyCode
     * @param userId
     * @param dbType
     * @return
     * @throws Exception
     */
    public Map preview(String attachmentid , String attachmentIndex, SelRs rsSr, String companyCode,
            String userId, String dbType) throws Exception {
    	Map m = new HashMap() ;
    	String filePath = read(attachmentid, attachmentIndex, rsSr, companyCode, userId, dbType) ; //返回文件的路径
    	String ext = filePath.substring(filePath.lastIndexOf(".") + 1); //获得文件后缀
    	String contentType = getFileContentType(ext); //获取ContentType
    	String fileName = filePath.substring(filePath.lastIndexOf(File.separator) + 1) ;
    	
    	m.put("contentType", contentType) ;
    	m.put("filePath", filePath) ;
    	return m ;
    }
    
    /**
     *  获取当前系统时间的年月
     * @return
     */
    private String getYearMonth(String format){
        Date now = new Date(); 
        SimpleDateFormat dateFormat = new SimpleDateFormat(format);
        return dateFormat.format(now) ;
    }
    
    
    /**
     * 获取唯一的UUID
     * @return
     */
    private String getUUID(){
        return UIDGenerator.generate() ;
    }
    
    /**
     * 获取下一个附件ID
     * @param rsSr
     * @param companyCode
     * @param userId
     * @param dbType
     * @return
     * @throws SQLException
     */
    private int getNextAttachmentId(SelRs rsSr, String companyCode,
            String userId, String dbType) throws SQLException{
        int nextAttachmentId = 0;
        String maxIdSQL = " SELECT nvl(MAX(attachment_id) , 0) FROM SYS_ATTACHMENT"
                        + "  WHERE company_code='" + companyCode + "'" ;
        ResultSet rs = rsSr.getRs(maxIdSQL);
        if (rs != null && rs.next()) {
            nextAttachmentId = rs.getInt(1) + 1;
        }
        return nextAttachmentId ;
    }
    
    /**
     * 根据文件类型获取对应的ContentType
     * @param ext 文件后缀
     * @return 返回ContentType
     */
    private String getFileContentType(String ext){
    	Map type = getSupportContentType();
    	String contentType = (String) type.get(ext.toUpperCase());
    	return contentType ;
    }
    
    private Map getSupportContentType(){
    	Map type = new HashMap();
		type.put("BAS" ,"text/plain;chartset=gb2312");
    	type.put("C" ,"text/plain;chartset=gb2312");
    	type.put("CPP" ,"text/plain;chartset=gb2312");
    	type.put("DEF" ,"text/plain;chartset=gb2312");
    	type.put("H" ,"text/plain;chartset=gb2312");
    	type.put("INI" ,"text/plain;chartset=gb2312");
    	type.put("RC" ,"text/plain;chartset=gb2312");
    	type.put("TEXT" ,"text/plain;chartset=gb2312");
    	type.put("TXT" ,"text/plain;chartset=gb2312");
    	type.put("HTM" ,"text/html;chartset=gb2312");
    	type.put("HTML" ,"text/html;chartset=gb2312");
    	type.put("STM" ,"text/html;chartset=gb2312");
    	type.put("CSS" ,"text/css;chartset=gb2312");
    	type.put("JAVA" ,"text/x-java-source;chartset=gb2312");
    	type.put("SCT" ,"text/scriptlet;chartset=gb2312");
    	type.put("ULS" ,"text/iuls;chartset=gb2312");
    	type.put("XML" ,"text/xml;chartset=gb2312");
    	type.put("BMP" ,"image/bmp;chartset=gb2312");
    	type.put("GIF" ,"image/gif;chartset=gb2312");
    	type.put("ICO" ,"image/x-icon;chartset=gb2312");
    	type.put("JFIF" ,"image/pipeg;chartset=gb2312");
    	type.put("JPE" ,"image/jpeg;chartset=gb2312");
    	type.put("JPEG" ,"image/jpeg;chartset=gb2312");
    	type.put("JPG" ,"image/jpeg;chartset=gb2312");
    	type.put("PNG" ,"image/png;chartset=gb2312");
    	type.put("PPM" ,"image/x-portable-pixmap;chartset=gb2312");
    	type.put("RGB" ,"image/x-rgb;chartset=gb2312");
    	type.put("TIF" ,"image/tiff;chartset=gb2312");
    	type.put("TIFF" ,"image/tiff;chartset=gb2312");
    	type.put("CGI" ,"wwwserver/shellcgi;chartset=gb2312");
    	type.put("HTML_SSI" ,"wwwserver/html-ssi;chartset=gb2312");
    	type.put("IHTML" ,"wwwserver/isapi;chartset=gb2312");
    	type.put("ISA" ,"wwwserver/isapi;chartset=gb2312");
    	type.put("PLX" ,"wwwserver/isapi;chartset=gb2312");
    	type.put("SERVLET" ,"wwwserver/wsapi;chartset=gb2312");
    	type.put("MAP" ,"wwwserver/imagemap;chartset=gb2312");
    	type.put("SHTML" ,"wwwserver/html-ssi;chartset=gb2312");
    	type.put("URL" ,"wwwserver/redirection;chartset=gb2312");
    	type.put("WCGI" ,"wwwserver/wincgi;chartset=gb2312");
    	type.put("EML" ,"message/rfc822;chartset=gb2312");
    	type.put("MHT" ,"message/rfc822;chartset=gb2312");
    	type.put("MHTML" ,"message/rfc822;chartset=gb2312");
    	type.put("MIME" ,"message/rfc822;chartset=gb2312");
    	type.put("NWS" ,"message/rfc822;chartset=gb2312");
    	type.put("BIN" ,"application/octet-stream;chartset=gb2312");
    	type.put("CLASS" ,"application/x-java-class;chartset=gb2312");
    	type.put("DIR" ,"application/x-director;chartset=gb2312");
    	type.put("DLL" ,"application/x-msdownload;chartset=gb2312");
    	type.put("DOC" ,"application/msword;chartset=gb2312");
    	type.put("DOT" ,"application/msword;chartset=gb2312");
    	type.put("POT" ,"application/vnd.ms-powerpoint;chartset=gb2312");
    	type.put("PPS" ,"application/vnd.ms-powerpoint;chartset=gb2312");
    	type.put("PPT" ,"application/vnd.ms-powerpoint;chartset=gb2312");
    	type.put("PPZ" ,"application/vnd.ms-powerpoint;chartset=gb2312");
    	type.put("MPP" ,"application/vnd.ms-project;chartset=gb2312");
    	type.put("XLA" ,"application/vnd.ms-excel;chartset=gb2312");
    	type.put("XLC" ,"application/vnd.ms-excel;chartset=gb2312");
    	type.put("XLS" ,"application/vnd.ms-excel;chartset=gb2312");
    	type.put("XLM" ,"application/vnd.ms-excel;chartset=gb2312");
    	type.put("XLT" ,"application/vnd.ms-excel;chartset=gb2312");
    	type.put("XLW" ,"application/vnd.ms-excel;chartset=gb2312");
    	type.put("MDB" ,"application/x-msaccess;chartset=gb2312");
    	type.put("MVB" ,"application/x-msmediaview;chartset=gb2312");
    	type.put("DUMP" ,"application/octet-stream;chartset=gb2312");
    	type.put("DVI" ,"application/x-dvi;chartset=gb2312");
    	type.put("EPS" ,"application/postscript;chartset=gb2312");
    	type.put("EXE" ,"application/octet-stream;chartset=gb2312");
    	type.put("GTAR" ,"application/x-gtar;chartset=gb2312");
    	type.put("GZ" ,"application/x-gzip;chartset=gb2312");
    	type.put("HLP" ,"application/winhlp;chartset=gb2312");
    	type.put("JS" ,"application/x-javascript;chartset=gb2312");
    	type.put("LS" ,"application/x-javascript;chartset=gb2312");
    	type.put("LNK" ,"application/x-ms-shortcut;chartset=gb2312");
    	type.put("LWP" ,"application/vnd.lotus-wordpro;chartset=gb2312");
    	type.put("LZH" ,"application/x-lzh;chartset=gb2312");
    	type.put("NC" ,"application/x-netcdf;chartset=gb2312");
    	type.put("PDF" ,"application/pdf;chartset=gb2312");
    	type.put("PS" ,"application/postscript;chartset=gb2312");
    	type.put("PUB" ,"application/x-mspublisher;chartset=gb2312");
    	type.put("RTF" ,"application/rtf;chartset=gb2312");
    	type.put("SH" ,"application/x-sh;chartset=gb2312");
    	type.put("TAR" ,"application/x-tar;chartset=gb2312");
    	type.put("TGZ" ,"application/x-compressed;chartset=gb2312");
    	type.put("VND" ,"application/vnd.visio;chartset=gb2312");
    	type.put("WMD" ,"application/x-ms-wmd;chartset=gb2312");
    	type.put("WMF" ,"application/x-msmetafile;chartset=gb2312");
    	type.put("WPS" ,"application/vnd.ms-works;chartset=gb2312");
    	type.put("WRI" ,"application/x-mswrite;chartset=gb2312");
    	type.put("ZIP" ,"application/zip;chartset=gb2312");
    	type.put("Z" ,"application/x-compress;chartset=gb2312");
    	type.put("MID" ,"audio/mid;chartset=gb2312");
    	type.put("RMI" ,"audio/mid;chartset=gb2312");
    	type.put("MP3" ,"audio/mpeg;chartset=gb2312");
    	type.put("WAX" ,"audio/x-ms-wax;chartset=gb2312");
    	type.put("WMA" ,"audio/x-ms-wma;chartset=gb2312");
    	type.put("AVI" ,"video/avi;chartset=gb2312");
    	type.put("MOV" ,"video/quicktime;chartset=gb2312");
    	type.put("QT" ,"video/quicktime;chartset=gb2312");
    	type.put("MOVIE" ,"video/x-sgi-movie;chartset=gb2312");
    	type.put("MP2" ,"video/mpeg;chartset=gb2312");
    	type.put("MPA" ,"video/mpeg;chartset=gb2312");
    	type.put("MPE" ,"video/mpeg;chartset=gb2312");
    	type.put("MPEG" ,"video/mpeg;chartset=gb2312");
    	type.put("MPG" ,"video/mpeg;chartset=gb2312");
    	type.put("MPV2" ,"video/mpeg;chartset=gb2312");
    	type.put("WM" ,"video/x-ms-wm;chartset=gb2312");
    	
    	type.put("DOCX" ,"application/vnd.openxmlformats-officedocument.wordprocessingml.document;chartset=gb2312");
    	type.put("DOTX" ,"application/vnd.openxmlformats-officedocument.wordprocessingml.template;chartset=gb2312");
    	type.put("PPTX" ,"application/vnd.openxmlformats-officedocument.presentationml.presentation;chartset=gb2312");
    	type.put("PPSX" ,"application/vnd.openxmlformats-officedocument.presentationml.slideshow;chartset=gb2312");
    	type.put("POTX" ,"application/vnd.openxmlformats-officedocument.presentationml.template;chartset=gb2312");
    	type.put("XLSX" ,"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;chartset=gb2312");
    	type.put("XLTX" ,"application/vnd.openxmlformats-officedocument.spreadsheetml.template;chartset=gb2312");
    	
    	return type ;
    }
}
