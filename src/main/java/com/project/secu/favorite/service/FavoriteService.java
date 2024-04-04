package com.project.secu.favorite.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.project.secu.favorite.mapper.FavoriteMapper;
import com.project.secu.favorite.vo.FavoriteVO;
import com.project.secu.member.vo.MemberVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FavoriteService {
    private final FavoriteMapper favoriteMapper;
    
    public int insertFavorite(FavoriteVO fav) {
        MemberVO member = (MemberVO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        fav.setMemberNum(member.getMemberNum());
        if(favoriteMapper.selectIsRegisteredFavorite(fav) == 0){
            return favoriteMapper.insertFavorite(fav);
        } else {
            throw new RuntimeException("등록 실패");
        }
    }
    
    public int selectIsRegistered(int roomNum) {
    	try{
            MemberVO member = (MemberVO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	        FavoriteVO fav = new FavoriteVO();
	        fav.setMemberNum(member.getMemberNum());
	        fav.setRoomNum(roomNum);
	        return favoriteMapper.selectIsRegistered(fav);
    	}catch(Exception e){
            return 0;
        }	
    }

    // 현재 로그인한 계정의 pk를 이용한 조회
    public PageInfo<FavoriteVO> selectFavoriteList(FavoriteVO fav) {
    	try{
            MemberVO member = (MemberVO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            fav.setMemberNum(member.getMemberNum());
            PageHelper.startPage(fav.getCurrentPage(), fav.getPageSize());
			return new PageInfo<>(favoriteMapper.selectFavoriteList(fav));
        }catch(Exception e) {
    		return null;
    	}
    }

    public int deleteFavorites(FavoriteVO fav) {
        try{
            MemberVO member = (MemberVO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            fav.setMemberNum(member.getMemberNum());
            return favoriteMapper.deleteFavorites(fav);
        }catch(Exception e){
            return 0;
        }
    }

    public List<Integer> selectAlreadyRegisteredRoomNumList(FavoriteVO fav) {
    	try{
            MemberVO member = (MemberVO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	        fav.setMemberNum(member.getMemberNum());
	        return favoriteMapper.selectAlreadyRegisteredRoomNumList(fav);
    	}catch(Exception e){
            return null;
        }	
    }
}
