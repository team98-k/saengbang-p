package com.project.secu.realtorSignUp.vo;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RealtorSignUpVO {
	private int realtorSignupNum;
	private int adminNum;
	private String realtorId;
	private String realtorPassword;
	private String realtorName;
	private String realtorPhone;
	private String realtorOfficeName;
	private String realtorOfficeAddress;
	private String realtorOfficeDetailAddress;
	private String realtorRegistrationNum;
	private String realtorSignupStatus;
	private String realtorRefuseReason;
	private String realtorSignupCredat;
	private String realtorImgPath;
	private MultipartFile file;
	private int currentPage;
	private int pageSize;
}