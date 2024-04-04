package com.project.secu.common.provider;

import java.security.Key;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.project.secu.admin.vo.AdminVO;
import com.project.secu.member.vo.MemberVO;
import com.project.secu.realtor.vo.RealtorVO;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JWTProvider {
    private final String jwtSecret;
    private final int jwtExpire;

    public JWTProvider(@Value("${jwt.secret}") String jwtSecret, @Value("${jwt.expire}") int jwtExpire){
        this.jwtSecret = jwtSecret;
        this.jwtExpire = jwtExpire;
    }

    public int getExpire(){
        return this.jwtExpire;
    }

    public String generateToken(UserDetails user){
        Map<String, Object> claims = new HashMap<>();
        if(user instanceof MemberVO){
            MemberVO member = (MemberVO) user;
            claims.put("memberId", member.getMemberId());
            claims.put("memberName", member.getMemberName());
            claims.put("memberNum", member.getMemberNum());
        }
        else if(user instanceof RealtorVO){
            RealtorVO realtor = (RealtorVO) user;
            claims.put("realtorId", realtor.getRealtorId());
            claims.put("realtorName", realtor.getRealtorName());
            claims.put("realtorNum", realtor.getRealtorNum());
        }
        else if(user instanceof AdminVO){
            AdminVO admin = (AdminVO) user;
            claims.put("adminId", admin.getAdminId());
            claims.put("adminNum", admin.getAdminNum());
        }
        
        Calendar c = Calendar.getInstance();
		c.add(Calendar.MILLISECOND, jwtExpire);
		Key key = new SecretKeySpec(DatatypeConverter.parseBase64Binary(jwtSecret), SignatureAlgorithm.HS256.getJcaName());
		JwtBuilder jb = Jwts.builder()
				.setClaims(claims)
				.signWith(SignatureAlgorithm.HS256, key)
				.setExpiration(c.getTime());
		return jb.compact();
    }

    public Claims getClaims(String token) {
		Claims claims = Jwts.parser().setSigningKey(DatatypeConverter.parseBase64Binary(jwtSecret))
				.parseClaimsJws(token).getBody();
		return claims;
	}

    public String getLoginUserInfo(String token){
       try {
			Claims claims = getClaims(token);
            if(claims.containsKey("memberId")){
                return claims.get("memberId").toString();
            }
            else if(claims.containsKey("realtorId")){
                return claims.get("realtorId").toString();
            }
            else if(claims.containsKey("adminId")){
                return claims.get("adminId").toString();
            }
		}catch(Exception e) {
			e.setStackTrace(null);
		}
		return null;
    }
}
