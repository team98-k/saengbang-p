package com.project.secu.realtor.service;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.project.secu.common.service.UploadService;
import com.project.secu.realtor.mapper.RealtorMapper;
import com.project.secu.realtor.vo.RealtorVO;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class RealtorService{
	private final RealtorMapper realtorMapper;
	private final PasswordEncoder passwordEncoder;
	private final UploadService uploadService;
	
	public List<RealtorVO> selectRealtorInfos(RealtorVO realtor) {
		return realtorMapper.selectRealtorInfos(realtor);
	}
	
	public RealtorVO loadUserByUsername(String username) {
		return realtorMapper.selectRealtorByRealtorId(username);
	}
		
	public RealtorVO selectRealtor() {
		try {
			RealtorVO realtorVO = (RealtorVO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			return realtorMapper.selectRealtor(realtorVO.getRealtorNum());
		}catch(Exception e) {
			return null; 
		}
	}
	
	public RealtorVO selectRealtor(int realtorNum) {
		return realtorMapper.selectRealtor(realtorNum);
	}
	
	public int selectRealtorRegistrationNum(String realtorRegistrationNum) {
		return realtorMapper.selectRealtorRegistrationNum(realtorRegistrationNum);
	}
	
	public int insertRealtor(RealtorVO realtor) {
		realtor.setRealtorPassword(realtor.getRealtorPassword());
		return realtorMapper.insertRealtor(realtor);
	}
	
	public int updateRealtor(RealtorVO realtor) {
		try{
			RealtorVO realtorVO = (RealtorVO) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			String currentRealtorPassword = realtorMapper.selectRealtorByRealtorId(realtorVO.getRealtorId()).getRealtorPassword();
			if(passwordEncoder.matches(realtor.getRealtorCurrentPassword(), currentRealtorPassword)) {
				realtor.setRealtorNum(realtorVO.getRealtorNum());
				realtor.setRealtorPassword(passwordEncoder.encode(realtor.getRealtorPassword()));
				MultipartFile file = realtor.getFile();
				if(file != null && !file.isEmpty()) {
					Map<String, String> uploadResult = uploadService.upload(file);
					realtor.setRealtorImgPath(uploadResult.get("fileURL"));
				}
				return realtorMapper.updateRealtor(realtor);
			}
		}catch(Exception e){
			return 0;
		}
		return 0;
	}
}
