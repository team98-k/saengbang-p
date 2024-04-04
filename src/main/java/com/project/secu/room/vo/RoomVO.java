package com.project.secu.room.vo;

import java.util.List;

import com.github.pagehelper.PageInfo;
import com.project.secu.roomImg.vo.RoomImgVO;
import com.project.secu.roomInquiry.vo.RoomInquiryVO;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RoomVO {
	private int roomNum;
	private String roomTradeType;
	private int roomDeposit;
	private int roomPrice;
	private int roomMaintenanceCost;
	private String roomParking;
	private String roomType;
	private int	roomFloor;
	private int roomBuildingFloor;
	private int roomSpaceMeter;
	private int roomContractSize;
	private int roomProvisionSize;
	private int roomBedsNum;
	private int roomBathNum;
	private String roomDirection;
	private String roomHeating;
	private String roomElevator;
	private int roomHouseholdNum;
	private int roomSpaceHouseholdNum;
	private int roomParkingNum;
	private String roomEntranceType;
	private String roomMovingDate;
	private String roomBuildingUseType;
	private String roomCredat;
	private String roomRoadAddress;
	private String roomJibunAddress;
	private String roomDetailAddress;
	private String roomDetailTitle;
	private String roomDetail;
	private String roomStatus;
	private double roomLatitude;
	private double roomLongitude;
	private double roomSouthCoord;
	private double roomWestCoord;
	private double roomNorthCoord;
	private double roomEastCoord;
	private int minPrice;
	private int maxPrice;
	private int minRoomSpaceMeter;
	private int maxRoomSpaceMeter;
	private List<String> roomTypeFilterList;
	private List<String> roomTradeTypeFilterList;
	private List<RoomImgVO> roomImgList;
	private String roomImgPath;
	private PageInfo<RoomInquiryVO> roomInquiryList;
	private int realtorNum;
	private String realtorOfficeName;
	private String realtorOfficeAddress;
	private String realtorOfficeDetailAddress;
	private String realtorName;
	private String realtorRegistrationNum;
	private String realtorPhone;
	private String realtorImgPath;
	private int currentPage;
	private int pageSize;
	private int rank;
}
