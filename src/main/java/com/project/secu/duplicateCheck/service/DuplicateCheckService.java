package com.project.secu.duplicateCheck.service;

import org.springframework.stereotype.Service;

import com.project.secu.duplicateCheck.mapper.DuplicateCheckMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DuplicateCheckService {
	private final DuplicateCheckMapper duplicateCheckMapper;
	
	public int selectDuplicateId(String loginId) {
		return duplicateCheckMapper.selectDuplicateId(loginId);
	}

	public int selectDuplicateRealtorRegistrationNum(String realtorRegistrationNum) {
		return duplicateCheckMapper.selectDuplicateRealtorRegistrationNum(realtorRegistrationNum);
	}
}
