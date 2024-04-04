package com.project.secu.notice.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.github.pagehelper.PageInfo;
import com.project.secu.notice.service.NoticeService;
import com.project.secu.notice.vo.NoticeVO;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class NoticeController {
	private final NoticeService noticeService;

	@GetMapping("/notice")
	public PageInfo<NoticeVO> selectNoticeList(NoticeVO notice) {
		return noticeService.selectNoticeList(notice);
	}
	
	@GetMapping("/notice/{noticeNum}")
	public NoticeVO selectNotice(@PathVariable int noticeNum) {
		return noticeService.selectNotice(noticeNum);
	}
	
	@PostMapping("/notice")
	public int insertNotice(@RequestBody NoticeVO notice) {
		return noticeService.insertNotice(notice);
	}
	
	@PatchMapping("/notice/{noticeNum}")
	public int updateNotice(@RequestBody NoticeVO notice, @PathVariable int noticeNum) {
		notice.setNoticeNum(noticeNum);
		return noticeService.updateNotice(notice);
	}
	
	@DeleteMapping("/notice/{noticeNum}")
	public int deleteNotice(@PathVariable int noticeNum) {
		return noticeService.deleteNotice(noticeNum);
	}
}
