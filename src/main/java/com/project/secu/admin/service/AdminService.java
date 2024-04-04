package com.project.secu.admin.service;

import org.springframework.stereotype.Service;

import com.project.secu.admin.mapper.AdminMapper;
import com.project.secu.admin.vo.AdminVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService{
    private final AdminMapper adminMapper;

    public AdminVO selectAdminByAdminId(String adminId){
        return adminMapper.selectAdminByAdminId(adminId);
    }
}
