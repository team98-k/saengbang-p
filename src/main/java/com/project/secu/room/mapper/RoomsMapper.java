package com.project.secu.room.mapper;

import java.util.List;

import com.project.secu.room.vo.RoomVO;

public interface RoomsMapper {
	List<RoomVO> selectRoomList(RoomVO room); /* 매물 정보중 약식 정보만 가져오도록 함(ex: 
		매물번호,
		중개사번호,
		거래종류,
		보증금,
		가격,
		방종류,
		전용면적,
		방 수,
		입주가능일,
		건축물용도,
		도로명주소,
		지번주소
	 )*/
	List<RoomVO> selectMapRoomList(RoomVO room);
	RoomVO selectRoom(int roomNum); // 매물 상세 정보
	List<RoomVO> selectRealtorRoomList(int realtorNum);
	List<RoomVO> selectRoomsRank();
	int selectRoomRealtorNum(int roomNum);
	int insertRoom(RoomVO room); // 매물 정보 저장
	int updateRoom(RoomVO room); // 매물 정보 수정 및 매물 판매 완료
	int updateRoomStatus(int roomNum);
	int deleteRoom(int roomNum);
}
