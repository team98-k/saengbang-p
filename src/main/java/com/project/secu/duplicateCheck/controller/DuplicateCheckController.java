package com.project.secu.duplicateCheck.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.project.secu.duplicateCheck.service.DuplicateCheckService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class DuplicateCheckController {
	private final DuplicateCheckService duplicateCheckService;
	
	@GetMapping("/check-duplicate/id/{loginId}")
	public int selectDuplicateId(@PathVariable String loginId) {
		return duplicateCheckService.selectDuplicateId(loginId);
	}
	
	@GetMapping("/check-duplicate/registration-num/{realtorRegistrationNum}")
	public int selectDuplicateRealtorRegistrationNum(@PathVariable String realtorRegistrationNum) {
		return duplicateCheckService.selectDuplicateRealtorRegistrationNum(realtorRegistrationNum);
	}
}
