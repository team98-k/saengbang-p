package com.project.secu.duplicateCheck.mapper;

public interface DuplicateCheckMapper {
	int selectDuplicateId(String loginId);
	int selectDuplicateRealtorRegistrationNum(String realtorRegistrationNum);
}
