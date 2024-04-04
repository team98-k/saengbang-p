package com.project.secu.notice.mapper;

import java.util.List;

import com.project.secu.notice.vo.NoticeVO;

public interface NoticeMapper {
	int insertNotice(NoticeVO notice);
	List<NoticeVO> selectNoticeList(NoticeVO notice);
	NoticeVO selectNotice(int noticeNum);
	int updateNotice(NoticeVO notice);
	int deleteNotice(int noticeNum);
}
