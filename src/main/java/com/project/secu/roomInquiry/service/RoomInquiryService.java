package com.project.secu.roomInquiry.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.project.secu.member.vo.MemberVO;
import com.project.secu.notification.service.NotificationService;
import com.project.secu.notification.vo.NotificationVO;
import com.project.secu.realtor.vo.RealtorVO;
import com.project.secu.room.mapper.RoomsMapper;
import com.project.secu.roomInquiry.mapper.RoomInquiryMapper;
import com.project.secu.roomInquiry.vo.RoomInquiryVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomInquiryService {
    private final RoomInquiryMapper roomInquiryMapper;
    private final NotificationService notificationService;
    private final RoomsMapper roomMapper;
    private SecurityContext context = SecurityContextHolder.getContext();
    private Authentication auth = context.getAuthentication();
    
    // 사용자가 문의사항 입력
    public int insertRoomInquiry(RoomInquiryVO inquiry){
    	MemberVO member = (MemberVO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    	inquiry.setMemberNum(member.getMemberNum());
    	int result = roomInquiryMapper.insertRoomInquiry(inquiry);
    	int realtorNum = roomMapper.selectRoomRealtorNum(inquiry.getRoomNum());
    	NotificationVO notification = new NotificationVO();
    	notification.setRoomInquiryNum(inquiry.getRoomInquiryNum());
    	notification.setNotificationReceiverType("중개사");
    	notification.setNotificationReceiverNum(realtorNum);
    	notification.setNotificationType("문의 작성");
    	notification.setNotificationMsg("사용자가 매물 문의를 작성하였다.");
    	result += notificationService.insertNotification(notification);
        return result;
    }

    // 사용자가 질문한 목록
	public PageInfo<RoomInquiryVO> selectRoomInquiryList(RoomInquiryVO inquiry){
        PageHelper.startPage(inquiry.getCurrentPage(), inquiry.getPageSize());
        if(auth != null){
            if(auth.getPrincipal() instanceof RealtorVO){
               return new PageInfo<>(roomInquiryMapper.selectRoomInquiryList(inquiry));
            }
        }
        if(inquiry.getRoomInquiryIspublic() == 0){
            inquiry.setRoomInquiryAnswer("비공개");
        }
		return new PageInfo<>(roomInquiryMapper.selectRoomInquiryList(inquiry));
    }

    // 공인중개사가 등록된 질문에 답볍 작성
	public int updateRoomInquiryAnswer(RoomInquiryVO inquiry){
        int result = roomInquiryMapper.updateRoomInquiryAnswer(inquiry);
        NotificationVO notification = new NotificationVO();
        if(inquiry.getRoomInquiryAnswer() != null) {
        	notification.setRoomInquiryNum(inquiry.getRoomInquiryNum());
        	notification.setNotificationReceiverType("사용자");
    		notification.setNotificationReceiverNum(inquiry.getMemberNum());
            notification.setNotificationType("문의 답변");
            notification.setNotificationMsg("중개사가 매물 문의에 답변하였다.");
            result += notificationService.insertNotification(notification);
        }
        return result;
    }

    // 등록된 질문의 상세 내용
	public RoomInquiryVO selectRoomInquiry(int roomInquiryNum){
        RoomInquiryVO roomInquiry = roomInquiryMapper.selectRoomInquiry(roomInquiryNum);
        if(auth.getPrincipal() != null){
            if(auth.getPrincipal() instanceof MemberVO){
                MemberVO member = (MemberVO) auth.getPrincipal();
                if(roomInquiry.getMemberNum() != member.getMemberNum()){
                    roomInquiry.setRoomInquiryDetail("비공개");
                }
            }
        }else{
            roomInquiry.setRoomInquiryDetail("비공개");
        }
        return roomInquiry;
    }
}
