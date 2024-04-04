package com.project.secu.common.controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.project.secu.admin.vo.AdminVO;
import com.project.secu.realtor.vo.RealtorVO;


@Controller
public class HTMLController {
	@GetMapping("/")
	public String goHome(Authentication auth) {
		if(auth != null) {
			if(auth.getPrincipal() instanceof RealtorVO){
				return "html/realtor/realtor";
			}else if(auth.getPrincipal() instanceof AdminVO){
				return "html/admin/admin";
			} else {
				return "html/saengbang/main";
			}
		} else {
			return "html/saengbang/main";		
		}
	}
	
	@GetMapping("/html/**")
	public void goPage() {}

	@GetMapping("/denied")
	public String denied() {
		return "html/denied";
	}
	
}
