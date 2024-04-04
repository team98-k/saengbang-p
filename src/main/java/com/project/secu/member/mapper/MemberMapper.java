package com.project.secu.member.mapper;

import java.util.List;

import com.project.secu.member.vo.MemberVO;

public interface MemberMapper {
	MemberVO selectMemberByMemberId(String uiId);
	MemberVO selectMember(int memberNum);
	List<MemberVO> selectMemberInfos(MemberVO member);
	List<MemberVO> selectMemberInfosForChat(int memberNum);
	int insertMember(MemberVO user);
	int updateMember(MemberVO user);
	int selectMemberIdIsDuplicate(String memberId);
	int deleteMember(int memberNum);
}
