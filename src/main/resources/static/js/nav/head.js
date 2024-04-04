// 링크 엘리먼트 생성
const link = document.createElement('a');
link.setAttribute('class', 'menuList');

// 페이지 로드 시 checkCookie 함수 실행
window.addEventListener('load',
    // 쿠키에서 토큰이 있는지 확인
    async function () {
		const token = localStorage.getItem('token');
		const user = localStorage.getItem('user')
        let html = '';
        if(token && user) {
			// 로그인 했는지 확인하는건데 이건 좀 아닌것 같은데 일단 이 방법밖에 생각이 안남;
			const res = await fetch('/logined', {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			const data = await res.json();
			
			if(!res.ok) {
				if(data.msg) {
					alert(data.msg);
					clearItem();
					location.href='/api/logout';
				}				
			}
			
			// 토큰에 문제가 생겼을 경우에 로컬 스토리지에 있는 토큰, 사용자 정보 삭제하고 로그아웃처리
			
            const userRole = JSON.parse(user).user.authorities[0].authority
            // 역할이 MEMBER면
            if(userRole === 'ROLE_MEMBER') {
                html += '<li><a class="menu" href="/html/saengbang/map">지도</a></li>';
                html += '<li id="favorite">';
                html += '   <a class="menu" href="/html/saengbang/recently">최근 본 목록</a>';
                html += '</li>';
                html += '<li><a class="menu" href="/html/saengbang/notice">공지사항</a></li>';
                html += '<li style="cursor: pointer;" onclick="getAlarmList()">';
                html += '   <a class="menu" data-toggle="modal" data-target="#alarmStaticBackdrop" id="alarm">알림</a>';
                html += '</li>';
                html += '<li id="myPage">';
                html += '   <a href="/html/member/my-page">마이페이지</a>';
                html += '</li>';
            } else if(userRole === "ROLE_REALTOR") {    // 역할이 중개사면
                html += '<li><a class="menu" href="/html/saengbang/notice">공지사항</a></li>';
                html += '<li style="cursor: pointer;" onclick="getAlarmList()">';
                html += '   <a class="menu" data-toggle="modal" data-target="#alarmStaticBackdrop" id="alarm">알림</a>';
                html += '</li>';
                html += '<li id="myPage">';
                html += '   <a href="/html/realtor/agent-page">마이페이지</a>';
                html += '</li>';
            } else if(userRole === 'ROLE_ADMIN') {
                html += '<li><a class="menu" href="/html/admin/admin-notice">공지사항</a></li>';
            }
            link.setAttribute('href', '/api/logout');
            link.setAttribute('onclick', 'clearItem()');
            link.textContent = '로그아웃';
            document.querySelector('#loginHead').appendChild(link);
            if (location.href == '/html/saengbang/login') {
                this.location.href = '/';
            }
            if(document.querySelector('#favorite .menu')) {
                document.querySelector('#favorite .menu').innerHTML = '관심 목록';				
            }
		} else {
            // 토큰이 존재하지 않는 경우
            html += '<li><a class="menu" href="/html/saengbang/map">지도</a></li>';
            html += '<li id="favorite">';
            html += '   <a class="menu" href="/html/saengbang/recently">최근 본 목록</a>';
            html += '</li>';
            html += '<li><a class="menu" href="/html/saengbang/notice">공지사항</a></li>';
            link.setAttribute('href', '/html/saengbang/login');
            link.textContent = '로그인';
            document.querySelector('#loginHead').appendChild(link);			
		}
		
        document.querySelector('#headerNavList').insertAdjacentHTML('afterbegin', html);
    }
);

function clearItem() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}