package com.project.secu.member.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.secu.member.mapper.MemberMapper;
import com.project.secu.member.vo.MemberVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService{
	private final MemberMapper memberMapper;
	private final PasswordEncoder passwordEncoder;
	
	public List<MemberVO> selectMemberInfos(MemberVO member) {
		return memberMapper.selectMemberInfos(member);
	}
	
	public List<MemberVO> selectMemberInfosForChat(int memberNum) {
		return memberMapper.selectMemberInfosForChat(memberNum);
	}
	
	public MemberVO loadUserByUsername(String memberId){
		return memberMapper.selectMemberByMemberId(memberId);
	}
	
	public MemberVO selectMember() {
		try{
			MemberVO member = (MemberVO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			return memberMapper.selectMember(member.getMemberNum());
		}catch(Exception e){
			return null;
		}
	}
	
	// 2024-02-06 채팅 수업에서 쓰려고 만든 코드
	public MemberVO selectMember2(int memberNum) {
		return memberMapper.selectMember(memberNum);
	}
	
	public int selectMemberIdIsDuplicate(String memberId) {
		return memberMapper.selectMemberIdIsDuplicate(memberId);
	}

	public int updateMember(MemberVO member) {
		MemberVO memberVO = (MemberVO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String currentMemberPassword = memberMapper.selectMemberByMemberId(memberVO.getMemberId()).getMemberPassword();
		if(passwordEncoder.matches(member.getMemberCurrentPassword(), currentMemberPassword)) {
			member.setMemberNum(memberVO.getMemberNum());
			member.setMemberPassword(passwordEncoder.encode(member.getMemberPassword()));
			return memberMapper.updateMember(member);
		}
		return 0;
	}
	
	public int join(MemberVO member) {
		member.setMemberPassword(passwordEncoder.encode(member.getMemberPassword()));
		return memberMapper.insertMember(member);
	}

	public int deleteMember() {
		MemberVO member = (MemberVO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return memberMapper.deleteMember(member.getMemberNum());
	}
}
