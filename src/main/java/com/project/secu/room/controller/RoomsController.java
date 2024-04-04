package com.project.secu.room.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.pagehelper.PageInfo;
import com.project.secu.common.vo.MsgVO;
import com.project.secu.room.service.RoomsService;
import com.project.secu.room.vo.RoomVO;
import com.project.secu.roomInquiry.vo.RoomInquiryVO;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class RoomsController {
	private final RoomsService roomsService;
	
	@GetMapping("/rooms")
	public List<RoomVO> selectRoomList(RoomVO room){
		return roomsService.selectRoomList(room);
	}
	
	@GetMapping("/rooms/map")
	public List<RoomVO> selectMapRoomList(RoomVO room) {
		return roomsService.selectMapRoomList(room);
	}
	
	@GetMapping("/rooms/realtor/{realtorNum}")
	public PageInfo<RoomVO> selectRealtorRoomList(@PathVariable int realtorNum, RoomVO room) {
		room.setRealtorNum(realtorNum);
		return roomsService.selectRealtorRoomList(room);
	}

	@GetMapping("/rooms/realtor")
	public PageInfo<RoomVO> selectRealtorRoomList(RoomVO room) {
		return roomsService.selectRealtorRoomList(room);
	}

	@GetMapping("/rooms/favorite")
	public List<RoomVO> selsctRoomsRank() {
		return roomsService.selectRoomsRank();
	}

	@GetMapping("/rooms/{roomNum}")
	public MsgVO selectRoom(@PathVariable int roomNum, RoomInquiryVO roomInquiry){
		return roomsService.selectRoom(roomNum, roomInquiry);
	}
	
	@PostMapping("/rooms")
	public int insertRoom(RoomVO room) {
		return roomsService.insertRoom(room);
	}
	
	@PutMapping("/rooms/{roomNum}")
	public int updateRoom(@PathVariable int roomNum, RoomVO room) {
		return roomsService.updateRoom(room);
	}
	
	@PatchMapping("/rooms/{roomNum}")
	public int updateRoomStatus(@PathVariable int roomNum) {
		return roomsService.updateRoomStatus(roomNum);
	}
	
	@DeleteMapping("/rooms/{roomNum}")
	public int deleteRoom(@PathVariable int roomNum) {
		return roomsService.deleteRoom(roomNum);
	}
}
