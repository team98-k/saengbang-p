package com.project.secu.common.listener;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

import com.project.secu.member.service.MemberService;
import com.project.secu.member.vo.MemberVO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {
	
	public static List<Integer> memberNums = Collections.synchronizedList(new ArrayList<>());
	public static List<String> sessionIds = Collections.synchronizedList(new ArrayList<>());
	public static List<MemberVO> members = Collections.synchronizedList(new ArrayList<>());
	public static Map<String, MemberVO> connectedMap = Collections.synchronizedMap(new HashMap<>());
	
	private final SimpMessagingTemplate smt;
	private final MemberService memberService;
	
	@EventListener
	public void connectionListener(SessionConnectedEvent evt) {
		StompHeaderAccessor sha = StompHeaderAccessor.wrap(evt.getMessage());
		GenericMessage<?> gm = (GenericMessage<?>) sha.getHeader(SimpMessageHeaderAccessor.CONNECT_MESSAGE_HEADER);
		SimpMessageHeaderAccessor smha = SimpMessageHeaderAccessor.wrap(gm);
		log.info("smha=>{}", smha);
		int memberNum = Integer.parseInt(smha.getFirstNativeHeader("memberNum"));
		MemberVO connectedUser = memberService.selectMember2(memberNum);
		connectedUser.setLogin(true);
		String sessionId = sha.getSessionId();
		connectedMap.put(sessionId, connectedUser);
		smt.convertAndSend("/topic/enter-chat", connectedUser);
	}

	@EventListener
	public void disconnectionListener(SessionDisconnectEvent evt) {
		StompHeaderAccessor sha = StompHeaderAccessor.wrap(evt.getMessage());
		String sessionId = sha.getSessionId();
		MemberVO disconnectedUser = connectedMap.remove(sessionId);
		smt.convertAndSend("/topic/enter-chat", disconnectedUser);
	}
	
	@EventListener
	public void subscribeListener(SessionSubscribeEvent evt) {
		String destination = (String) evt.getMessage().getHeaders().get("simpDestination");
		if("/topic/enter-chat".equals(destination)) {
			smt.convertAndSend("/topic/enter-chat", connectedMap);
		}
	}
	
	@EventListener
	public void unsubscribeListener(SessionUnsubscribeEvent evt) {
		String destination = (String) evt.getMessage().getHeaders().get("simpDestination");
		if("/topic/enter-chat".equals(destination)) {
			smt.convertAndSend("/topic/enter-chat", members);
		}
	}
	
}
