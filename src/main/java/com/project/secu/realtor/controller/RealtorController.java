package com.project.secu.realtor.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.project.secu.realtor.service.RealtorService;
import com.project.secu.realtor.vo.RealtorVO;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
public class RealtorController {
	private final RealtorService realtorService;
	
	@GetMapping("/realtor")
	public RealtorVO selectRealtor() {
		return realtorService.selectRealtor();
	}
	
	@GetMapping("/realtor/{realtorNum}")
	public RealtorVO selectRealtor(@PathVariable(required = false) String realtorNum) {
		int isRealtorNum = (realtorNum != null) ? Integer.parseInt(realtorNum) : 0;
		return realtorService.selectRealtor(isRealtorNum);
	}
	
	@PostMapping("/realtor")
	public int insertRealtor(@RequestBody RealtorVO realtor) {
		return realtorService.insertRealtor(realtor);
	}
	
	@PatchMapping("/realtor")
	public int updateRealtor(RealtorVO realtor) {
		return realtorService.updateRealtor(realtor);
	}
}
