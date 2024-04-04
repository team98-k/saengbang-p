package com.project.secu.member.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.project.secu.common.util.SessionUtil;
import com.project.secu.member.service.MemberService;
import com.project.secu.member.vo.MemberVO;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MemberController {
	private final MemberService memberService;
	
	@GetMapping("/logined")
	public boolean isLogined() {
		return SessionUtil.isLogin();
	}
	
	@PostMapping("/join")
	public MemberVO join(@RequestBody MemberVO member) {
		if(memberService.join(member) == 1) {
			member =  memberService.loadUserByUsername(member.getMemberId());
		}
		return member;
	}
	
	@GetMapping("/members")
	public List<MemberVO> selectMemberInfos() {
		return memberService.selectMemberInfos(null);
	}
	
	@GetMapping("/member")
	public MemberVO selectMember() {
		return memberService.selectMember();
	}
	
	@GetMapping("/member/{memberId}")
	public int selectMemberIdIsDuplicate(@PathVariable String memberId) {
		return memberService.selectMemberIdIsDuplicate(memberId);
	}
	
	@PatchMapping("/member")
	public int updateMember(@RequestBody MemberVO member) {
		return memberService.updateMember(member);
	}

	@DeleteMapping("/member")
	public int deleteMember() {
		return memberService.deleteMember();
	}
}
