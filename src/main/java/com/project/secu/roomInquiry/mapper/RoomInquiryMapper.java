package com.project.secu.roomInquiry.mapper;

import java.util.List;

import com.project.secu.roomInquiry.vo.RoomInquiryVO;

public interface RoomInquiryMapper {
	//<-- 사용자 -->
	int insertRoomInquiry(RoomInquiryVO inquiry);
	List<RoomInquiryVO> selectRoomInquiryList(RoomInquiryVO inquiry);
	//<-- 관리자 -->
	int updateRoomInquiryAnswer(RoomInquiryVO inquiry);
	RoomInquiryVO selectRoomInquiry(int roomInquiryNum);
}
