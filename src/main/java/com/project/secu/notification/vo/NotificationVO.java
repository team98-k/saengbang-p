package com.project.secu.notification.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class NotificationVO {
    private int notificationNum;
    private int roomInquiryNum;
    private byte notificationStatus;
    private String notificationCredat;
    private String notificationMsg;
    private String notificationReceiverType;
    private int notificationReceiverNum;
    private String notificationType;
    private String roomDetailAddress;
    private String realtorOfficeName;
    private String memberId;
    private int roomNum;
    private int currentPage;
	private int pageSize;
}
