package com.project.secu.admin.vo;

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
public class AdminVO implements UserDetails{
    private static final long serialVersionUID = 1L;
	private int adminNum;
    private String adminId;
    private String adminPassword;
    private String adminRole;
    @Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Collection<GrantedAuthority> roles = new ArrayList<>();
		if(adminRole != null){
			for(String role: adminRole.split(",")) {
				roles.add(new SimpleGrantedAuthority(role));
			}
		}
		return roles;
	}
	@Override
	public String getPassword() {
		return adminPassword;
	}
	@Override
	public String getUsername() {
		return adminId;
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
