package com.project.secu.common.mapper;

import java.util.List;

import com.project.secu.common.vo.MessageVO;

public interface ChatMessageInfoMapper {
	int insertChatMessageInfo(MessageVO message);
	List<MessageVO> selectChatMessageInfos(MessageVO message);
	int updateChatMessageInfoReceivedTime(MessageVO message);
}
