package com.project.secu.notice.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.project.secu.admin.vo.AdminVO;
import com.project.secu.notice.mapper.NoticeMapper;
import com.project.secu.notice.vo.NoticeVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NoticeService {
	private final NoticeMapper noticeMapper;

	public PageInfo<NoticeVO> selectNoticeList(NoticeVO notice) {
		PageHelper.startPage(notice.getCurrentPage(), notice.getPageSize());
		return new PageInfo<>(noticeMapper.selectNoticeList(notice));
	}
	
	public NoticeVO selectNotice(int noticeNum) {
		return noticeMapper.selectNotice(noticeNum);
	}
	
	public int insertNotice(NoticeVO notice) {
		try{
			AdminVO admin = (AdminVO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			notice.setAdminNum(admin.getAdminNum());
		}catch(Exception e){
			e.setStackTrace(null);
			return 0;
		}
		return noticeMapper.insertNotice(notice);
	}
	
	public int updateNotice(NoticeVO notice) {
		return noticeMapper.updateNotice(notice);
	}
	
	public int deleteNotice(int noticeNum) {
		return noticeMapper.deleteNotice(noticeNum);
	}
}
