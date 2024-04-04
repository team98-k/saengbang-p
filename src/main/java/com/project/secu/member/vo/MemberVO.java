package com.project.secu.member.vo;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MemberVO implements UserDetails{
	private static final long serialVersionUID = 1L;
	private int memberNum;
	private String memberId;
	private String memberPassword;
	private String memberCurrentPassword;
	private String memberName;
	private String memberPhone;
	private String memberEmail;
	private String memberAddress;
	private String memberRole;
	private String memberImgPath;
	private String credat;
	private String lmodat;
	private String active;
	private boolean login;
	private String sessionId;
	private String loginDate;
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Collection<GrantedAuthority> roles = new ArrayList<>();
		if(memberRole != null){
			String[] memberRolesArr = memberRole.split(",");	// 원래는 문자열 관련 메소드 쓸때 먼저 null인지 아닌지 확인부터 하는게 좋음
			for(String memberRole: memberRolesArr) {
				roles.add(new SimpleGrantedAuthority(memberRole));
			}
		}
		return roles;
	}
	@Override
	public String getPassword() {
		return memberPassword;
	}
	@Override
	public String getUsername() {
		return memberId;
	}
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}
	@Override
	public boolean isEnabled() {
		return true;
	}
}
