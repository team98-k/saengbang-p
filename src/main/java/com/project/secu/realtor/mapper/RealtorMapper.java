package com.project.secu.realtor.mapper;

import java.util.List;

import com.project.secu.realtor.vo.RealtorVO;

public interface RealtorMapper {
	List<RealtorVO> selectRealtorInfos(RealtorVO realtor);
    RealtorVO selectRealtorByRealtorId(String realtorId);
    RealtorVO selectRealtor(int realtorNum);
    int selectRealtorRegistrationNum(String realtorRegistrationNum);
    int insertRealtor(RealtorVO realtor);
    int updateRealtor(RealtorVO realtor);
}
