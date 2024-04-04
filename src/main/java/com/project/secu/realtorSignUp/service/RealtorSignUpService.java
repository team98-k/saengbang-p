package com.project.secu.realtorSignUp.service;

import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.project.secu.common.service.UploadService;
import com.project.secu.common.vo.MsgVO;
import com.project.secu.realtor.service.RealtorService;
import com.project.secu.realtor.vo.RealtorVO;
import com.project.secu.realtorSignUp.mapper.RealtorSignUpMapper;
import com.project.secu.realtorSignUp.vo.RealtorSignUpVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RealtorSignUpService {
	
	private final RealtorSignUpMapper realtorSignupMapper;
	private final RealtorService realtorService;
	private final PasswordEncoder passwordEncoder;
	private final UploadService uploadService;

	public PageInfo<RealtorSignUpVO> selectRealtorSignupList(RealtorSignUpVO realtorSignup) {
		PageHelper.startPage(realtorSignup.getCurrentPage(), realtorSignup.getPageSize());
		return new PageInfo<>(realtorSignupMapper.selectRealtorSignUpList(realtorSignup));
	}
	
	public RealtorSignUpVO selectRealtorSignup(int realtorSignupNum) {
		return realtorSignupMapper.selectRealtorSignUp(realtorSignupNum);
	}
	
	public MsgVO selectRealtorSignUpStatus(RealtorSignUpVO realtorSignup) {
		RealtorSignUpVO realtorSignUpStatus = realtorSignupMapper.selectRealtorSignUpStatus(realtorSignup);
		MsgVO msg = new MsgVO();
		if(realtorSignUpStatus == null) {
			msg.setMsg("오류가 발생");
			msg.setResult(realtorSignUpStatus);
			return msg;
		}
		msg.setMsg("성공");
		msg.setResult(realtorSignUpStatus);
		return msg;
	}
	
	public int selectIsRealtorSignUpConfirming(String realtorRegistrationNum) {
		return realtorSignupMapper.selectIsRealtorSignUpConfirming(realtorRegistrationNum);
	}
	
	public int insertRealtorSignup(RealtorSignUpVO realtorSignup) {
		if(realtorService.loadUserByUsername(realtorSignup.getRealtorId()) != null || realtorService.selectRealtorRegistrationNum(realtorSignup.getRealtorRegistrationNum()) == 1) {
			return 0;
		}
		realtorSignup.setRealtorPassword(passwordEncoder.encode(realtorSignup.getRealtorPassword()));
		MultipartFile file = realtorSignup.getFile();
		Map<String, String> imgPath = uploadService.upload(file);
		realtorSignup.setRealtorImgPath(imgPath.get("fileURL"));
		return realtorSignupMapper.insertRealtorSignUp(realtorSignup);
	}
	
	@Transactional
	public int updateRealtorSignUpStatus(RealtorSignUpVO realtorSignup) {
		String status = realtorSignup.getRealtorSignupStatus();
    	int result = 0;
    	if(status != null && !status.equals("")) {
    		if(status.equals("승인")) {
    			RealtorVO realtor = new RealtorVO();
    			realtor.setRealtorId(realtorSignup.getRealtorId());
    			realtor.setRealtorPassword(realtorSignup.getRealtorPassword());
    			realtor.setRealtorName(realtorSignup.getRealtorName());
    			realtor.setRealtorPhone(realtorSignup.getRealtorPhone());
    			realtor.setRealtorOfficeName(realtorSignup.getRealtorOfficeName());
    			realtor.setRealtorOfficeAddress(realtorSignup.getRealtorOfficeAddress());
    			realtor.setRealtorOfficeDetailAddress(realtorSignup.getRealtorOfficeDetailAddress());
    			realtor.setRealtorRegistrationNum(realtorSignup.getRealtorRegistrationNum());
				realtor.setRealtorImgPath(realtorSignup.getRealtorImgPath());
    			result += realtorSignupMapper.updateRealtorSignUpApprove(realtorSignup);
    			result += realtorService.insertRealtor(realtor);
    			return result;
    		} else if(status.equals("거부")) {
    			result += realtorSignupMapper.updateRealtorSignUpRefuse(realtorSignup);
    			return result;
    		}
    	}
    	return 0;
	}
}