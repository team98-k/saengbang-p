async function readAlarm(notificationNum, roomNum, notificationReceiverType, roomInquiryNum) {
	const res = await fetch(`/notification/${notificationNum}`, {
		method: 'PATCH'
	});
	const data = await res.json();
	if (res.ok && data !== 0) {
		location.href = `/html/saengbang/detail?roomNum=${roomNum}&roomInquiryNum=${roomInquiryNum}`;
	}
}

async function deleteAlarm(notificationNum) {
	const res = await fetch(`/notification/${notificationNum}`, {
		method: 'DELETE'
	});
	const data = await res.json();
	if (res.ok && data !== 0) {
		alert('알림이 삭제되었습니다.');
		getAlarmList();
	}
}

async function getAlarmList() {
	if (localStorage.getItem('token')) {
		let currentPage = 1;
		let pageSize = 10;
		const res = await fetch(`/notification?currentPage=${currentPage}&pageSize=${pageSize}`);
		let notificationList = await res.json();
		notificationList = notificationList.list;
		console.log(notificationList);
		let html = '';
		html += '<div>';
		html += '	<p style="margin: 10px 15px;">※최근 알림 10개만 표시됩니다※</p>';
		html += '</div>'
		if (notificationList.length === 0) {
			html += '<div class="text-center mb-0 h3 display-2">알림이 없습니다.</div>';
		}
		for (const notification of notificationList) {
			html += '<div class="alarm-li" style="display:flex; padding :10px 10px">';
			html += `<li style="cursor: pointer; width: 100%" onclick="readAlarm(${notification.notificationNum}, ${notification.roomNum}, '${notification.notificationReceiverType}', ${notification.roomInquiryNum})">`;
			html += `	<div class="alarm-container" style="padding : 0;">`;
			html += '		<div style="display: flex; margin: 0;">';
			html += `       	<span class="alarm-detail" id="alarmContent">${notification.notificationMsg}</span>`;
			html += '		</div>';
			html += `       <div>`;
			// 알림 받는 사람이 사용자면 알림 보낸 사람이 중개사 이름으로 나와야 함
			// 알림 받는 사람이 중개사면 알림 보낸 사람이 사용자 아이디로 나와야 함
			if (notification.notificationReceiverType === '사용자') {
				html += `           <p>${notification.realtorOfficeName}</p>`;
			} else {
				html += `           <p>${notification.memberId}</p>`;
			}
			html += `           <span id="alarmStatus" style="font-weight: bold;color:${notification.notificationStatus === 1 ? 'green' : 'red'}">${notification.notificationStatus === 1 ? '읽음' : '안읽음'}</span>`;
			html += `           <span class="alarm-span" id="alarmDate">${notification.notificationCredat}</span>`;
			html += `       </div>`;
			html += `   </div>`;
			html += `</li>`;
			html += `<button style="justify-content: flex-end; margin-top: 2" class="delete" onclick="deleteAlarm(${notification.notificationNum})">X</button>`;
			html += '</div>';
		}
		if (document.querySelector('#alarmList')) {
			document.querySelector('#alarmList').innerHTML = html;
		}
	}
}

async function getIsRead() {
	if (localStorage.getItem('token')) {
		const res = await fetch(`/notification/is-read`);
		const data = await res.json();
		if(data==false){
			console.log(data);
			document.querySelector('#alarm').insertAdjacentHTML('beforeend', '<img src="/imgs/alarmBell.png" style="width: 20px">');
		}
	}
}

window.addEventListener('load', getIsRead);