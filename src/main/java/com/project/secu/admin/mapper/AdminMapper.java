package com.project.secu.admin.mapper;

import com.project.secu.admin.vo.AdminVO;

public interface AdminMapper {
    AdminVO selectAdminByAdminId(String adminId);
}
