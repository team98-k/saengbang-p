package com.project.secu.roomImg.vo;

import org.springframework.web.multipart.MultipartFile;

import com.project.secu.common.type.Status;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RoomImgVO {
    private int roomImgNum;
    private int roomNum;
    private String roomImgName;
    private String roomImgPath;
    private int roomImgSequence;
    private MultipartFile file;
    private Status status;
}  
