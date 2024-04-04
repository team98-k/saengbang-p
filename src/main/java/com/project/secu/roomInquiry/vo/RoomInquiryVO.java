package com.project.secu.roomInquiry.vo;

import com.project.secu.notification.vo.NotificationVO;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RoomInquiryVO {
	private int roomInquiryNum;
	private int roomNum;
	private int memberNum;
	private String memberId;
	private String roomInquiryTitle;
	private String roomInquiryDetail;
	private String roomInquiryAnswer;
	private String roomInquiryCredat;
	private String roomInquiryStatus;
	private String roomInquiryAnswerDate;
	private byte roomInquiryIspublic;
	private NotificationVO notificationInfo;
	private int currentPage;
	private int pageSize;
}
