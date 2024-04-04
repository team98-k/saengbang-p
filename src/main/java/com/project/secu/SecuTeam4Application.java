package com.project.secu;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan
public class SecuTeam4Application {

	public static void main(String[] args) {
		SpringApplication.run(SecuTeam4Application.class, args);
	}

}
