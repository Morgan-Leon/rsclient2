package com.rsc.rsclient.ftp;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;

import com.rsc.rs.pub.net.ftp.FTPClient;
import com.rsc.rs.pub.net.ftp.FTPException;

public class FtpAttachmentOperater {

	public void put(List fileList, String companyCode, String sysCode,
			String attachmentId) throws IOException, FTPException {
		String ftpHost = FtpConfig.getFTPHost();
		int ftpPort = FtpConfig.getFTPPort();
		FTPClient ftpClient = new FTPClient(ftpHost, ftpPort);
		
		String destFilePath = companyCode + "/" + sysCode + "/" + attachmentId;
		Iterator iter = fileList.iterator();
		while (iter.hasNext()) {
			ftpClient.mkdirs(destFilePath);
			ftpClient.chdir(destFilePath);

			File file = (File) iter.next();
			String fileName = file.getName();
			FileInputStream fis = new FileInputStream(file);
			byte[] bytes = new byte[(int) file.length()];
			fis.read(bytes);
			ftpClient.put(bytes, fileName);
			fis.close();
		}
		ftpClient.quit();
	}

}
