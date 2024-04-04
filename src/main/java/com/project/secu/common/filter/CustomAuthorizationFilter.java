package com.project.secu.common.filter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.secu.admin.vo.AdminVO;
import com.project.secu.common.provider.JWTProvider;
import com.project.secu.common.service.LoginService;
import com.project.secu.member.vo.MemberVO;
import com.project.secu.realtor.vo.RealtorVO;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CustomAuthorizationFilter extends OncePerRequestFilter {

	private final JWTProvider jwtProvider;
	private final LoginService loginService;

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
		// "/api/**" 경로를 제외한 모든 요청에 대해 필터를 적용
		String[] excludePath = { "/api/**", "/html/denied" };
		String path = request.getRequestURI();
		return Arrays.stream(excludePath).anyMatch(path::startsWith);

		// 여기는 2024 01 16 수업시간에 추가했던 코드임
//		return "none".equals(request.getHeader("sec-fetch-site")) || "same-origin".equals(request.getHeader("sec-fetch-site"));
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		// 토큰 추출
		String token = extractToken(request);
		Map<String, Object> error = new HashMap<>();
		String msg = null;
		if (token == null) {
			// 토큰이 없으면 다음 필터로 전달
			filterChain.doFilter(request, response);
			return;
		}
		try {
			// 토큰이 유효한지 확인하고, 유효하면 인증 처리
			token = token.replace("Bearer ", "");
			jwtProvider.getClaims(token);
			String userId = jwtProvider.getLoginUserInfo(token);
			UserDetails user = loginService.loadUserByUsername(userId);
			handleAuthentication(request, user);
		} catch (ExpiredJwtException e) {
			msg = "토큰 유효기간 만료";
		} catch (UnsupportedJwtException e) {
			msg = "지원하지 않는 토큰입니다.";
		} catch (SignatureException | MalformedJwtException e) {
			msg = "토큰 형식이 맞지 않습니다.";
		}
		if (msg != null) {
			error.put("msg", msg);
			handleException(response, error, HttpStatus.SC_FORBIDDEN);
		} else {
			filterChain.doFilter(request, response);
		}
	}

	private String extractToken(HttpServletRequest request) {
		// 요청 헤더 또는 쿠키에서 토큰 추출
		String token = request.getHeader(HttpHeaders.AUTHORIZATION);
		if (token == null || token.isEmpty()) {
			Cookie[] cookies = request.getCookies();
			if (cookies != null) {
				for (Cookie cookie : cookies) {
					if ("Authorization".equals(cookie.getName())) {
						token = cookie.getValue();
						break;
					}
				}
			}
		}
		return token;
	}

	private void handleAuthentication(HttpServletRequest request, UserDetails user) {
		// 유저 타입에 따른 인증 처리
		if (user instanceof MemberVO) {
			((MemberVO) user).setMemberPassword(null);
		} else if (user instanceof RealtorVO) {
			((RealtorVO) user).setRealtorPassword(null);
		} else if (user instanceof AdminVO) {
			((AdminVO) user).setAdminPassword(null);
		}
		UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(user, null,
				user.getAuthorities());
		authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
		SecurityContextHolder.getContext().setAuthentication(authenticationToken);
	}

	private void handleException(HttpServletResponse response, Map<String, Object> error, int scForbidden)
			throws IOException {
		// 예외 발생 시 클라이언트에게 오류 응답
		response.sendRedirect("/html/denied");
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json");
		response.setStatus(HttpServletResponse.SC_FORBIDDEN);
		ObjectMapper om = new ObjectMapper();
		PrintWriter out = response.getWriter();
		out.print(om.writeValueAsString(error));
		out.flush();
		out.close();
	}
}
