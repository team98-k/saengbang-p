package com.project.secu.common.config;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import com.project.secu.common.filter.CustomAuthenticationFilter;
import com.project.secu.common.filter.CustomAuthorizationFilter;
import com.project.secu.common.handler.AuthFailureHandler;
import com.project.secu.common.provider.CustomAuthenticationProvider;
import com.project.secu.common.provider.JWTProvider;
import com.project.secu.common.service.LoginService;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityBeanConfig {

	private final LoginService loginService;
	private final PasswordEncoder passwordEncoder;
	private final AuthFailureHandler authFailureHandler;
	private final JWTProvider jwtProvider;

	@Bean
	CustomAuthenticationFilter authenticationFilter() {
		CustomAuthenticationFilter authFilter = new CustomAuthenticationFilter(authenticationManager(), jwtProvider);
		authFilter.setFilterProcessesUrl("/api/login");
		authFilter.setAuthenticationFailureHandler(authFailureHandler);
		authFilter.afterPropertiesSet();
		return authFilter;
	}

	@Bean
	CustomAuthenticationProvider authenticationProvider() {
		return new CustomAuthenticationProvider(loginService, passwordEncoder);
	}

	@Bean
	AuthenticationManager authenticationManager() {
		return new ProviderManager(authenticationProvider());
	}

	@Bean
	WebSecurityCustomizer webSecurityCustomizer() {
		return web -> {
			web.ignoring()
					.antMatchers("/css/**", "/js/**", "/imgs/**", "/resources/**", "/favicon.ico", "/assets/**",
							"/bootstrap/**",
							"/api/v2/**",
	                        "/v2/api-docs",
	                        "/swagger-resources",
	                        "/swagger-resources/**",
	                        "/configuration/ui",
	                        "/configuration/security",
	                        "/swagger-ui.html",
	                        "/webjars/**",
	                        /* swagger v3 */
	                        "/v3/api-docs/**",
	                        "/swagger-ui/**"
							); // 얘를 시큐리티필터체인 부분의 antMatchers 에 써도 동작 함
		};
	}

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity hs) throws Exception {
		hs.authorizeHttpRequests(req -> req
				.antMatchers("/join", "/rooms", "/rooms/**", "/realtor-sign-up/**",
						"/realtor/**", "/html/saengbang/**", "/notice", "/room-inquiry/**", "/", "/room-inquiry",
						"/favorite/**", "/notification", "/check-duplicate/**", "/logined", "/chat", "/chat-list", "/html/denied")
				.permitAll()
				.antMatchers("/html/admin/**").hasRole("ADMIN")
				.antMatchers("/html/realtor/**").hasRole("REALTOR")
				.anyRequest().authenticated())
				.formLogin(formLogin -> formLogin.disable())
				.logout(logout -> logout
						.logoutUrl("/api/logout")
						.logoutSuccessUrl("/")
						.deleteCookies("Authorization") // 세션 쿠키 삭제
						.invalidateHttpSession(true) // 세션 무효화
						.clearAuthentication(true) // 인증 정보 지우기
				)
				.csrf(csrf -> csrf.disable())
				.cors(cors->cors.configurationSource(new CorsConfigurationSource() {
					@Override
					public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
						CorsConfiguration ccf = new CorsConfiguration();
						ccf.setAllowCredentials(true);
						ccf.setAllowedOrigins(List.of("http://localhost:3000", "https://localhost:3000", "https://saengbang.xyz", "https://m.saengbang.xyz"));
						ccf.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
						ccf.setAllowedHeaders(List.of("*"));
						return ccf;
					}
				}))
				.exceptionHandling(handling -> handling.accessDeniedPage("/html/denied"))
				.userDetailsService(loginService)
				.addFilterBefore(authenticationFilter(), UsernamePasswordAuthenticationFilter.class)
				.addFilterBefore(new CustomAuthorizationFilter(jwtProvider, loginService),
						UsernamePasswordAuthenticationFilter.class)
				.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		return hs.build();
	}
}
