package com.project.secu.roomImg.mapper;

import java.util.List;

import com.project.secu.roomImg.vo.RoomImgVO;

public interface RoomImgMapper {
    List<RoomImgVO> selectRoomImgList(int roomNum); // 매물 사진 가져오기
    int insertRoomImg(RoomImgVO roomImg); // 매물 사진 저장
    int updateRoomImg(RoomImgVO roomImg); // 매물 사진 순서 또는 파일 변경!
    int deleteRoomImg(int roomNum); // 해당 매물의 사진 모두 삭제
}
