package com.project.secu.realtor.vo;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RealtorVO implements UserDetails {
    private static final long serialVersionUID = 1L;
	private int realtorNum;
    private String realtorId;
	private String realtorCurrentPassword;
    private String realtorPassword;
    private String realtorName;
    private String realtorPhone;
    private String realtorOfficeAddress;
    private String realtorOfficeDetailAddress;
    private String realtorOfficeName;
    private String realtorRegistrationNum;
	private String realtorImgPath;
    private String realtorRole;
	private MultipartFile file;
    private String sessionId;
    private boolean login;

    @Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Collection<GrantedAuthority> roles = new ArrayList<>();
		if(realtorRole != null){
			for(String role: realtorRole.split(",")) {
				roles.add(new SimpleGrantedAuthority(role));
			}
		}
		return roles;
	}
	@Override
	public String getPassword() {
		return realtorPassword;
	}
	@Override
	public String getUsername() {
		return realtorId;
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
