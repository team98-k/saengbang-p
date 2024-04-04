package com.project.secu.room.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.project.secu.common.vo.MsgVO;
import com.project.secu.realtor.vo.RealtorVO;
import com.project.secu.room.mapper.RoomsMapper;
import com.project.secu.room.vo.RoomVO;
import com.project.secu.roomImg.service.RoomImgService;
import com.project.secu.roomImg.vo.RoomImgVO;
import com.project.secu.roomInquiry.service.RoomInquiryService;
import com.project.secu.roomInquiry.vo.RoomInquiryVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomsService {
	private final RoomsMapper roomsMapper;
	private final RoomImgService roomImgService;
	private final RoomInquiryService roomInquiryService;
	
	// <-- 공통 사용 -->
	public List<RoomVO> selectRoomList(RoomVO room){ // 매물 정보들 가져오기
		return roomsMapper.selectRoomList(room);
	}
	
	public List<RoomVO> selectMapRoomList(RoomVO room) {
		return roomsMapper.selectMapRoomList(room);
	}
	
	public PageInfo<RoomVO> selectRealtorRoomList(RoomVO room) {
		try {			
			RealtorVO realtor = (RealtorVO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			room.setRealtorNum(realtor.getRealtorNum());
			PageHelper.startPage(room.getCurrentPage(), room.getPageSize());
			return new PageInfo<>(roomsMapper.selectRealtorRoomList(room.getRealtorNum()));
		}catch(Exception e) {
			PageHelper.startPage(room.getCurrentPage(), room.getPageSize());
			return new PageInfo<>(roomsMapper.selectRealtorRoomList(room.getRealtorNum()));
		}
	}
	// 상세 정보 
	public MsgVO selectRoom(int roomNum, RoomInquiryVO roomInquiry) {
		MsgVO msg = new MsgVO();
		RoomVO room = roomsMapper.selectRoom(roomNum);
		try {
			List<RoomImgVO> roomImgs = roomImgService.selectRoomImgList(roomNum); // 매물 이미지 불러오기!
			roomInquiry.setRoomNum(roomNum);
			room.setRoomInquiryList(roomInquiryService.selectRoomInquiryList(roomInquiry));
			room.setRoomImgList(roomImgs); // 불러온 이미지 정보 저장
			msg.setMsg("성공");
			msg.setResult(room);
			RealtorVO realtor = (RealtorVO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			if(room.getRealtorNum() != realtor.getRealtorNum()) {
				msg.setMsg("실패");
				msg.setResult("등록한 매물이 아닙니다!");
				return msg;
			};
		}catch(Exception e){
			if(room.getRoomStatus().equals("거래완료")){
				msg.setMsg("실패");
				msg.setResult("거래가 완료된 매물입니다.");
			}
			return msg;
		}
		return msg;
	}

	// 관심 목록에 저장된 방 순위 위에서부터 5개
	public List<RoomVO> selectRoomsRank(){
		return roomsMapper.selectRoomsRank();
	}
	
	public int selectRoomRealtorNum(int roomNum) {
		return roomsMapper.selectRoomRealtorNum(roomNum);
	}
	
	// <-- 공인중개사 -->
	public int insertRoom(RoomVO room) { // 매물 저장
		RealtorVO realtor = (RealtorVO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		room.setRealtorNum(realtor.getRealtorNum());
		int result = roomsMapper.insertRoom(room); // insert 후에 parameter 생성
		result += roomImgService.insertRoomImg(room.getRoomNum(), room.getRoomImgList()); // 매물 저장에 필요한 이미지 저장하기
		return result;
	}
	
	public int updateRoom(RoomVO room) { // 매물 수정
		int result = roomsMapper.updateRoom(room);
		if(room.getRoomImgList() != null) {
			result += roomImgService.deleteRoomImg(room.getRoomNum());
			result += roomImgService.insertRoomImg(room.getRoomNum(), room.getRoomImgList());
		}
		return result;
	}
	
	public int updateRoomStatus(int roomNum) {
		return roomsMapper.updateRoomStatus(roomNum);
	}
	
	public int deleteRoom(int roomNum) {
		return roomsMapper.deleteRoom(roomNum);
	}
}
