package com.project.secu.common.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class KakaoApiController {
    private final String kakaoAPI;

    public KakaoApiController(@Value("${kakao.rest-api-key}") String kakaoAPI){
        this.kakaoAPI = kakaoAPI;
    }

    @GetMapping("/kakao")
    public String getMethodName() {
        return kakaoAPI;
    }
}
