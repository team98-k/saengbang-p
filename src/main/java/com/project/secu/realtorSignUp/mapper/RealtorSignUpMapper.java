package com.project.secu.realtorSignUp.mapper;

import java.util.List;

import com.project.secu.realtorSignUp.vo.RealtorSignUpVO;

public interface RealtorSignUpMapper {
    int insertRealtorSignUp(RealtorSignUpVO realtorSignup);
    int updateRealtorSignUpApprove(RealtorSignUpVO realtorSignup);
    int updateRealtorSignUpRefuse(RealtorSignUpVO realtorSignup);
    List<RealtorSignUpVO> selectRealtorSignUpList(RealtorSignUpVO realtorSignup);
    RealtorSignUpVO selectRealtorSignUp(int realtorSignupNum);
    RealtorSignUpVO selectRealtorSignUpStatus(RealtorSignUpVO realtorSignup);
    int selectIsRealtorSignUpConfirming(String realtorRegistrationNum);
}