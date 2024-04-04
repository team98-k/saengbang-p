package com.project.secu.notification.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.github.pagehelper.PageInfo;
import com.project.secu.notification.service.NotificationService;
import com.project.secu.notification.vo.NotificationVO;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class NotificationController {
	private final NotificationService notificationService;
	
	@GetMapping("/notification")
	public PageInfo<NotificationVO> selectNotificationList(NotificationVO notification) {
		return notificationService.selectNotificationList(notification);
	}

	@GetMapping("/notification/is-read")
	public boolean isReadNotification(NotificationVO notification) {
		return notificationService.isReadNotification(notification);
	}
	
	@PatchMapping("/notification/{notificationNum}")
	public int updateNotificationStatus(@PathVariable int notificationNum) {
		return notificationService.updateNotificationStatus(notificationNum);
	}
	
	@DeleteMapping("/notification/{notificationNum}")
	public int deleteNotification(@PathVariable int notificationNum) {
		return notificationService.deleteNotification(notificationNum);
	}
}
