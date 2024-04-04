package com.project.secu.common.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.auth.Credentials;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

@Service
public class UploadService {
    @Value("${firebase.bucket}")
	private String firebaseBucket;
	
	@Value("${firebase.configure-file}")
	private String configureFile;

	private String uploadFile(File file, String fileName) throws IOException {
		BlobId blobId = BlobId.of(firebaseBucket, fileName);
		BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType("media").build();
		InputStream inputStream = UploadService.class.getClassLoader().getResourceAsStream(configureFile);																									
		Credentials credentials = GoogleCredentials.fromStream(inputStream); // google 인증
		Storage storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();
		storage.create(blobInfo, Files.readAllBytes(file.toPath()));
		String DOWNLOAD_URL = "https://firebasestorage.googleapis.com/v0/b/"+firebaseBucket+"/o/%s?alt=media"; // 이미지가 저장된 URL
		return String.format(DOWNLOAD_URL, URLEncoder.encode(fileName, StandardCharsets.UTF_8));
	}

	private File convertToFile(MultipartFile multipartFile, String fileName) throws IOException {
		File tempFile = new File(fileName); // fileName 파일 생성.
		try (FileOutputStream fos = new FileOutputStream(tempFile)) {
			fos.write(multipartFile.getBytes()); // multipartFile를 FileOutputStream을 이용하여 File로 변환.
			fos.close();
		}
		return tempFile;
	}

	private String getExtension(String fileName) {
		return fileName.substring(fileName.lastIndexOf("."));
	}

	public Map<String, String> upload(MultipartFile multipartFile) {
		Map<String, String> imgPath = new HashMap<>();
		imgPath.put("msg", "파일 업로드 실패! 오류가 발생했습니다.");
		try {
			String fileName = multipartFile.getOriginalFilename(); // 파일 이름.
			imgPath.put("fileName", fileName);
			fileName = UUID.randomUUID().toString().concat(this.getExtension(fileName)); // storage에 저장될 file 이름.
			File file = this.convertToFile(multipartFile, fileName); // Multipart file을 File로 변환.
			String URL = this.uploadFile(file, fileName); // upload 파일 주소.
			imgPath.put("fileURL", URL);
			file.delete(); // 변환한 파일 삭제.
			imgPath.put("msg", "이미지 저장성공!");
			return imgPath;
		} catch (Exception e) {
			e.printStackTrace();
			return imgPath;
		}
	}
}
