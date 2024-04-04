package com.project.secu.common.util;

import org.springframework.security.core.context.SecurityContextHolder;

import com.project.secu.admin.vo.AdminVO;
import com.project.secu.member.vo.MemberVO;
import com.project.secu.realtor.vo.RealtorVO;

public class SessionUtil {
	public static Object getSessionUser() {
		if(SecurityContextHolder.getContext().getAuthentication() == null) {
			return "Non-session";
		}
		return SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	}
	
	// 로그 아웃 했는데도 true로 나옴;;
	public static boolean isLogin() {
		if(getSessionUser() instanceof MemberVO || 
			getSessionUser() instanceof RealtorVO || 
			getSessionUser() instanceof AdminVO) {
			return true;
		}
		return false;
	}
}
