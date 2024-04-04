package com.project.secu.favorite.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.github.pagehelper.PageInfo;
import com.project.secu.favorite.service.FavoriteService;
import com.project.secu.favorite.vo.FavoriteVO;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class FavoriteController {
    private final FavoriteService favoriteService;

    // <-- 관심 목록 추가 -->
    @PostMapping("/favorite")
    int insertFavorite(@RequestBody FavoriteVO fav) {
        return favoriteService.insertFavorite(fav);
    }
    
    @GetMapping("/favorite/{roomNum}")
    int selectIsRegistered(@PathVariable(value = "roomNum") int roomNum) {
        return favoriteService.selectIsRegistered(roomNum);
    }

    // <-- 사용자가 이미 등록한 매물인지 확인 -->
    @GetMapping("/favorite/is-already-registered")
    List<Integer> selectAlreadyRegisteredRoomNumList(@ModelAttribute FavoriteVO fav) {
        return favoriteService.selectAlreadyRegisteredRoomNumList(fav);
    }

    // <-- 현재 로그인 한 사용자의 관심 목록 리스트 -->
    @GetMapping("/favorite")
    PageInfo<FavoriteVO> selectFavoriteList(FavoriteVO fav){
        return favoriteService.selectFavoriteList(fav);
    }

    @DeleteMapping("/favorite")
    int deleteFavorites(@RequestBody FavoriteVO fav) {
        return favoriteService.deleteFavorites(fav);
    }  
}
