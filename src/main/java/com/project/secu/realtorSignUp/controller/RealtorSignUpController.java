package com.project.secu.realtorSignUp.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.pagehelper.PageInfo;
import com.project.secu.admin.vo.AdminVO;
import com.project.secu.common.vo.MsgVO;
import com.project.secu.realtorSignUp.service.RealtorSignUpService;
import com.project.secu.realtorSignUp.vo.RealtorSignUpVO;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class RealtorSignUpController {
    private final RealtorSignUpService realtorSignupService;

    @GetMapping("/realtor-sign-up")
    public PageInfo<RealtorSignUpVO> selectRealtorSignupInfos(RealtorSignUpVO realtorSignup) {
    	return realtorSignupService.selectRealtorSignupList(realtorSignup);
    }

    @GetMapping("/realtor-sign-up/{realtorSignupNum}")
    public RealtorSignUpVO selectRealtorSignupInfo(@PathVariable int realtorSignupNum) {
    	return realtorSignupService.selectRealtorSignup(realtorSignupNum);
    }
    
    @GetMapping("/realtor-sign-up/status")
    public MsgVO selectRealtorSignUpStatus(@ModelAttribute RealtorSignUpVO realtorSignup) {
    	return realtorSignupService.selectRealtorSignUpStatus(realtorSignup);
    }
    
    @GetMapping("/realtor-sign-up/status/confirming")
    public int selectIsRealtorSignUpConfirming(@RequestParam String realtorRegistrationNum) {
    	return realtorSignupService.selectIsRealtorSignUpConfirming(realtorRegistrationNum);
    }
    
    @PostMapping("/realtor-sign-up")
    public int insertRealtorSignup(RealtorSignUpVO realtorSignup) {
    	return realtorSignupService.insertRealtorSignup(realtorSignup);
    }
    
    @PatchMapping("/realtor-sign-up")
    public int updateRealtorSignUpStatus(@RequestBody RealtorSignUpVO realtorSignup, @AuthenticationPrincipal AdminVO admin) {
    	realtorSignup.setAdminNum(admin.getAdminNum());
		  return realtorSignupService.updateRealtorSignUpStatus(realtorSignup);
    }

}