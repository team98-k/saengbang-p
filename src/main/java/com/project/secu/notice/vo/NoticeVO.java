package com.project.secu.notice.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class NoticeVO {
	private int noticeNum;
	private int adminNum;
	private String noticeTitle;
	private String noticeDetail;
	private String noticeCredat;
	private int currentPage;
	private int pageSize;
}
