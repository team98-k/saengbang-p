package com.project.secu.notification.mapper;

import java.util.List;

import com.project.secu.notification.vo.NotificationVO;

public interface NotificationMapper {
    int insertNotification(NotificationVO noti);
    List<NotificationVO> selectNotificationList(NotificationVO noti);
    List<NotificationVO> isReadNotification(NotificationVO noti);
    int updateNotificationStatus(int notificationNum);
    int deleteNotification(int notiNum);
}
