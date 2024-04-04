package com.project.secu.favorite.mapper;

import java.util.List;

import com.project.secu.favorite.vo.FavoriteVO;

public interface FavoriteMapper {
	int insertFavorite(FavoriteVO fav);
	List<FavoriteVO> selectFavoriteList(FavoriteVO fav);
	List<Integer> selectAlreadyRegisteredRoomNumList(FavoriteVO fav);
	int selectIsRegisteredFavorite(FavoriteVO fav);
	int selectIsRegistered(FavoriteVO fav);
	int deleteFavorites(FavoriteVO fav);
}
