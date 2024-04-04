package com.project.secu.roomImg.service;

import java.io.File;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.project.secu.common.service.UploadService;
import com.project.secu.common.type.Status;
import com.project.secu.roomImg.mapper.RoomImgMapper;
import com.project.secu.roomImg.vo.RoomImgVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomImgService {

    private final RoomImgMapper roomImgMapper;
	private final UploadService uploadService;

    public List<RoomImgVO> selectRoomImgList(int roomNum) {
        return roomImgMapper.selectRoomImgList(roomNum);
    }

    public int insertRoomImg(int roomNum, List<RoomImgVO> roomImgs) {
        int result = 0;
        for (RoomImgVO roomImg : roomImgs) {
            MultipartFile file = roomImg.getFile();
			Map<String, String> imgPath = uploadService.upload(file);
            roomImg.setRoomImgName(imgPath.get("fileName"));
            roomImg.setRoomImgPath(imgPath.get("fileURL"));
            roomImg.setRoomNum(roomNum);
            result += roomImgMapper.insertRoomImg(roomImg);
        }
        return result;
    }

	// 업데이트 하는 과정을 원래 매물 사진들 삭제 후 싹다 새로 추가하는 방식으로 바꿔서 이거는 없어도 될 것 같음
    public int updateRoomImg(int roomNum, List<RoomImgVO> roomImgs){
        int result = 0;
        for (RoomImgVO roomImg : roomImgs) {
        	if(roomImg.getFile() != null) {
        		MultipartFile file = roomImg.getFile();
        		if(file != null) {
        			Map<String, String> imgPath = uploadService.upload(file);
                    roomImg.setRoomImgName(imgPath.get("fileName"));
                    roomImg.setRoomImgPath(imgPath.get("fileURL"));
        		}
        		roomImg.setRoomNum(roomNum);
        		if(roomImg.getStatus() == Status.UPDATE) {
        			result += roomImgMapper.updateRoomImg(roomImg);
        		}else{
        			result += roomImgMapper.insertRoomImg(roomImg);
        		}        		
        	}
        	if(roomImg.getRoomImgNum() != 0) {
        		if(roomImg.getStatus() == Status.DELETE) {
        			String fileName = roomImg.getRoomImgPath();
        			int idx = fileName.lastIndexOf("/")+1;
        			fileName = fileName.substring(idx);
        			File f = new File(fileName);
        			if(f.exists()) {
        				f.delete();
        			}
        			result += roomImgMapper.deleteRoomImg(roomImg.getRoomImgNum());
        			continue;
        		}
        	}
        }
        return result;
    }

	public int deleteRoomImg(int roomNum) {
		return roomImgMapper.deleteRoomImg(roomNum);
	}
}
