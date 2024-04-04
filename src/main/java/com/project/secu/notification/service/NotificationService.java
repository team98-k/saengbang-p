package com.project.secu.notification.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.project.secu.member.vo.MemberVO;
import com.project.secu.notification.mapper.NotificationMapper;
import com.project.secu.notification.vo.NotificationVO;
import com.project.secu.realtor.vo.RealtorVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationMapper notificationMapper;
    
    public int insertNotification(NotificationVO noti){
        return notificationMapper.insertNotification(noti);
    }

    public PageInfo<NotificationVO> selectNotificationList(NotificationVO noti){
    	if(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof MemberVO) {
    		MemberVO member = (MemberVO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    		noti.setNotificationReceiverType("사용자");
    		noti.setNotificationReceiverNum(member.getMemberNum());
    	} else if(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof RealtorVO) {
    		RealtorVO realtor = (RealtorVO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    		noti.setNotificationReceiverType("중개사");
    		noti.setNotificationReceiverNum(realtor.getRealtorNum());
    	}
        PageHelper.startPage(noti.getCurrentPage(), noti.getPageSize());
        return new PageInfo<>(notificationMapper.selectNotificationList(noti));
    }

    public Boolean isReadNotification(NotificationVO noti){
    	if(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof MemberVO) {
    		MemberVO member = (MemberVO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    		noti.setNotificationReceiverType("사용자");
    		noti.setNotificationReceiverNum(member.getMemberNum());
    	} else if(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof RealtorVO) {
    		RealtorVO realtor = (RealtorVO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    		noti.setNotificationReceiverType("중개사");
    		noti.setNotificationReceiverNum(realtor.getRealtorNum());
    	}
        List<NotificationVO> notiList = notificationMapper.isReadNotification(noti);
        for(NotificationVO notiStatus : notiList){
            if(notiStatus.getNotificationStatus() == 0){
                return false;
            }
        }
        return true;
    }

    public int updateNotificationStatus(int notificationNum){
        return notificationMapper.updateNotificationStatus(notificationNum);
    }

    public int deleteNotification(int notiNum){
        return notificationMapper.deleteNotification(notiNum);
    }
}
