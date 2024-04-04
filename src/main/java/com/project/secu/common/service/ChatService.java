package com.project.secu.common.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.project.secu.common.mapper.ChatMessageInfoMapper;
import com.project.secu.common.util.DateUtil;
import com.project.secu.common.vo.MessageVO;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ChatService {
	@Autowired
	private ChatMessageInfoMapper messageMapper;
	
	public int insertChatMessageInfo(MessageVO message) {
		message.setCmiSentTime(DateUtil.getToDate());
		message.setCmiReceivedTime(DateUtil.getToDate());
		log.info("message=>{}", message);
		
		return messageMapper.insertChatMessageInfo(message);
	}
	
	public PageInfo<MessageVO> selectChatMessageInfos(MessageVO message, int page) {
		PageHelper.startPage(page, 30);
		return PageInfo.of(messageMapper.selectChatMessageInfos(message));
	}
	
	public boolean updateChatMessageInfoReceivedTime(MessageVO message) {
		return messageMapper.updateChatMessageInfoReceivedTime(message) > 0;
	}
}
