package com.project.secu.common.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.project.secu.admin.mapper.AdminMapper;
import com.project.secu.admin.vo.AdminVO;
import com.project.secu.member.mapper.MemberMapper;
import com.project.secu.member.vo.MemberVO;
import com.project.secu.realtor.mapper.RealtorMapper;
import com.project.secu.realtor.vo.RealtorVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoginService implements UserDetailsService{
    private final MemberMapper memberMapper;
	private final AdminMapper adminMapper;
	private final RealtorMapper realtorMapper;

    @Override
	public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
		MemberVO member = memberMapper.selectMemberByMemberId(userId);
		AdminVO admin = adminMapper.selectAdminByAdminId(userId);
		RealtorVO realtor = realtorMapper.selectRealtorByRealtorId(userId);

		if(admin != null) return admin; // 관리자가 있으면 관리자로 리턴
		if(member != null) return member;	// 멤버가 있으면 멤버로 리턴
		if(realtor != null) return realtor;	// 공인중개사가 있으면 공인중개사로 리턴

		// 유저를 찾을 수 없다면 UsernameNotFoundException 실행
		throw new UsernameNotFoundException(userId + "는 존재하지 않습니다.");
	}
}
