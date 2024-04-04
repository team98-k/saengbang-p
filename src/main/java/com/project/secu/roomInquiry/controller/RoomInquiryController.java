package com.project.secu.roomInquiry.controller;

import javax.websocket.server.PathParam;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.github.pagehelper.PageInfo;
import com.project.secu.roomInquiry.service.RoomInquiryService;
import com.project.secu.roomInquiry.vo.RoomInquiryVO;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class RoomInquiryController {
    private final RoomInquiryService roomInquiryService;

    @PostMapping("/room-inquiry")
    public int insertRoomInquiry(@RequestBody RoomInquiryVO inquiry){
        return roomInquiryService.insertRoomInquiry(inquiry);
    }

    @PatchMapping("/room-inquiry")
	public int updateRoomInquiryAnswer(@RequestBody RoomInquiryVO inquiry){
        return roomInquiryService.updateRoomInquiryAnswer(inquiry);
    }

    @GetMapping("/room-inquiry")
    public PageInfo<RoomInquiryVO> selectRoomInquiryList(@PathParam(value = "roomNum") int roomNum, RoomInquiryVO inquiry){
        inquiry.setRoomNum(roomNum);
        return roomInquiryService.selectRoomInquiryList(inquiry);
    }
}
