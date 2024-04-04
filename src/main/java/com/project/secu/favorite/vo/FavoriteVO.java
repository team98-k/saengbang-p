package com.project.secu.favorite.vo;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class FavoriteVO {
	private int favoriteNum;
	private int memberNum;
	private int roomNum;
	private String roomTradeType;
	private String roomType;
	private String roomDeposit;
	private int roomPrice; 
	private int roomSpaceMeter;
	private int roomFloor;
	private int roomBuildingFloor;
	private String roomDetailTitle;
	private String roomImgPath;
	private String roomStatus;
	private int roomBedsNum;
	private int roomBathNum;
	private String roomRoadAddress;
	private int currentPage;
	private int pageSize;
	private List<Integer> recentlyViewedRoomNumList;
}
