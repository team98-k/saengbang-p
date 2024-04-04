package com.project.secu.common.provider;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.project.secu.admin.vo.AdminVO;
import com.project.secu.common.service.LoginService;
import com.project.secu.member.vo.MemberVO;
import com.project.secu.realtor.vo.RealtorVO;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CustomAuthenticationProvider implements AuthenticationProvider {

	private final LoginService loginService;
	private final PasswordEncoder passwordEncoder;

	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) authentication;
		String userId = token.getName();
		String userPwd = token.getCredentials().toString();
		UserDetails login = loginService.loadUserByUsername(userId);
		if (!passwordEncoder.matches(userPwd, login.getPassword())) {
			throw new BadCredentialsException("login fail");
		}

		if (login instanceof MemberVO) {
			((MemberVO) login).setMemberPassword(null);
		} else if (login instanceof AdminVO) {
			((AdminVO) login).setAdminPassword(null);
		} else if (login instanceof RealtorVO) {
			((RealtorVO) login).setRealtorPassword(null);
		}
		return new UsernamePasswordAuthenticationToken(login, null, login.getAuthorities());
	}

	@Override
	public boolean supports(Class<?> authentication) {
		return authentication.equals(UsernamePasswordAuthenticationToken.class);
	}
}
