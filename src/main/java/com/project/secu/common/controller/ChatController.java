package com.project.secu.common.controller;

import java.util.List;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.github.pagehelper.PageInfo;
import com.project.secu.common.service.ChatService;
import com.project.secu.common.util.DateUtil;
import com.project.secu.common.vo.MessageVO;
import com.project.secu.member.service.MemberService;
import com.project.secu.member.vo.MemberVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ChatController {
	private final SimpMessagingTemplate smt;
	private final ChatService chatService;
	private final MemberService memberService;
	
	@MessageMapping("/chat/{memberNum}")
	public void chat(@DestinationVariable("memberNum") int memberNum, MessageVO message) {
		log.info("message => {}", message);
		log.info("memberNum => {}", memberNum);
		if(message.getCmiMessage() != null) {
			chatService.insertChatMessageInfo(message);			
		}
		smt.convertAndSend("/topic/chat/" + message.getCmiReceiveUiNum(), message);
	}
	
	@GetMapping("/chat-list/{page}")
	public PageInfo<MessageVO> selectChatMessageInfos(@ModelAttribute MessageVO message, @PathVariable int page) {
		return chatService.selectChatMessageInfos(message, page);
	}
	
	@GetMapping("/chat-member-infos/{memberNum}")
	public List<MemberVO> selectMemberInfosForChat(@PathVariable("memberNum") int memberNum) {
		return memberService.selectMemberInfosForChat(memberNum);
	}
	
	@PutMapping("/message-log")
	public boolean messageLog(@RequestBody MessageVO message) {
		message.setCmiReceivedTime(DateUtil.getToDate());
		return chatService.updateChatMessageInfoReceivedTime(message);
	}
}
