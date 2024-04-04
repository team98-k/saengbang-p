package com.project.secu.common.filter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.secu.common.listener.WebSocketEventListener;
import com.project.secu.common.provider.JWTProvider;
import com.project.secu.common.util.DateUtil;
import com.project.secu.common.vo.UserVO;
import com.project.secu.member.vo.MemberVO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CustomAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

	private final JWTProvider jwtProvider;

	public CustomAuthenticationFilter(AuthenticationManager authManager, JWTProvider jwtProvider) {
		setAuthenticationManager(authManager);
		this.jwtProvider = jwtProvider;
	}

	/**
	 * 사용자의 로그인 시도를 처리하는 메서드.
	 */
	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws AuthenticationException {
		if (!request.getMethod().equals("POST")) {
			throw new AuthenticationServiceException("Authentication method not supported: " + request.getMethod());
		}
		try {
			// HTTP 요청의 입력 스트림에서 UserVO 객체로 변환
			ObjectMapper om = new ObjectMapper();
			UserVO login = om.readValue(request.getInputStream(), UserVO.class);

			// 사용자의 인증 토큰 생성
			UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(login.getUserId(),
					login.getUserPassword());
			setDetails(request, authToken);
			// 사용자의 인증 요청을 AuthenticationManager에 전달
			return getAuthenticationManager().authenticate(authToken);
		} catch (Exception e) {
			// 예외 발생 시, BadCredentialsException으로 변환하여 throw
			throw new BadCredentialsException("예외발생");
		}
	}

	/**
	 * 사용자 인증이 성공했을 때 호출되는 메서드.
	 */
	@Override
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
			Authentication authResult) throws IOException, ServletException {
		// Authentication 객체에서 UserDetails 추출
		UserDetails userLogin = (UserDetails) authResult.getPrincipal();

		// UserDetails를 기반으로 JWT 토큰 생성
		String token = jwtProvider.generateToken(userLogin);

		// 사용자 ID를 기반으로 JWT 토큰을 생성하여 응답 헤더에 추가
		ResponseCookie responseCookie = ResponseCookie.from("Authorization", token)
				.httpOnly(true)
				.sameSite("None")
				.secure(true).path("/")
				.maxAge(Math.toIntExact(jwtProvider.getExpire()))
				.build();
		if(userLogin instanceof MemberVO) {
			MemberVO loginMember = (MemberVO) userLogin;
			for(MemberVO tmpMember : WebSocketEventListener.members) {
				log.info("tmpMember=>{}", tmpMember);
				if(loginMember.getMemberNum() == tmpMember.getMemberNum()) {
					tmpMember.setLoginDate(DateUtil.getToDate());					
				}
			}
		}
		response.setHeader("Set-Cookie", responseCookie.toString());
		
		// JWT 토큰을 JSON 형식으로 응답
		response.setContentType("application/json;charset=UTF-8");
		PrintWriter out = response.getWriter();
		ObjectMapper om = new ObjectMapper();
		Map<String, Object> jwt = new HashMap<>();
		jwt.put("jwt", token);
		jwt.put("user", userLogin);
		try {
			out.print(om.writeValueAsString(jwt));
		} catch (Exception e) {
			log.info(e.toString());
		}
		out.flush();
		out.close();
	}
}
