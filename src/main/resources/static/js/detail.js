const roomNum = new URL(location.href).searchParams.get('roomNum');
const roomInquiryNum = new URL(location.href).searchParams.get('roomInquiryNum');
const pageSize = 10;
const blockSize = 5;

//문의 작성 버튼 클릭하면 로그인 했는지 체크하고 비로그인이면 로그인 페이지로 이동
if(document.querySelector('#qnaModalBtn')) {
	document.querySelector('#qnaModalBtn').addEventListener('click', function () {
		if(!localStorage.getItem('token')) {
			alert('로그인 후 이용해주세요.');
			location.href = '/html/saengbang/login';
			return;
		}
	});
}

//문의 등록 버튼 클릭하면 등록
async function addRoomInquiry() {
	let roomInquiryIspublic;
	if(document.querySelector('#secret').checked) {
		roomInquiryIspublic = 0;
	} else {
		roomInquiryIspublic = 1;
	}
	const res = await fetch('/room-inquiry', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8'
		},
		body: JSON.stringify({
			// roomInquiryTitle: document.querySelector('#roomInquiryTitle').value,
			roomInquiryDetail: document.querySelector('#roomInquiryDetail').value,
			roomInquiryIspublic: roomInquiryIspublic,
			roomNum: new URL(location.href).searchParams.get('roomNum')
		})
	});
	
	const data = await res.json();
	if(res.ok && data !== 0) {
		alert('문의 작성 완료');
		getRoomInquiryList();
	} else {
		alert(`문의 작성하는데 오류가 발생했다.\n오류 코드 : ${res.status}`);
		// location.reload();
	}
}

function checkIsIncludeInRecentlyList(roomNum, recentlyList) {
	for (const roomInfo of recentlyList) {
		if (roomInfo.roomNum === roomNum) {
			return true;
		}
	}
	return false;
}

// 숫자가 10000 넘어가면 1억이라서 환산해주는거임
function exchangeToHundredMillionOrNot(num) {
	if (num >= 10000) {
		if (num % 10000 === 0) {
			return `${Math.floor(num / 10000)}억`;
		} else {
			return `${Math.floor(num / 10000)}억 ${num % 10000}`;
		}
	} else {
		return `${num}`;
	}
}

async function getRoomInfo(evt, page) {
	if (!page) {
		page = 1;
	}

	if(localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).user.authorities[0].authority === 'ROLE_REALTOR') {
		document.querySelector('#modalBtnAndModal').remove();
		document.querySelector('.favorite-and-print').remove();
	}

	const roomRes = await fetch(`/rooms/${roomNum}`);
	roomData = await roomRes.json();
	if(roomData.msg === '성공'){
		roomData = roomData.result;
	}else{
		alert(roomData.result);
		history.back();
	}

	// 관심 목록에 추가된 방 목록을 가져오는 함수 호출
	// 이미 관심 목록인지 확인하는 기능은 fetchFavorites 함수 내부에서 처리함
	const favorites = await fetchFavorites();

	// 로컬스토리지에 최근 본 목록으로 추가
	let recentlyList = JSON.parse(localStorage.getItem('recentlyList'));
	if (!recentlyList) {
		recentlyList = [];
	}
	const loginRealtorNum = await fetchLoginRealtorId(); // 현재 접속 중인 realtorNum값 - 공인중개사가 아니면 null
	if(!loginRealtorNum) {
		if (!checkIsIncludeInRecentlyList(roomData.roomNum, recentlyList)) {
			recentlyList.push({
				roomNum: roomData.roomNum,
				roomPrice: roomData.roomPrice,
				roomDeposit: roomData.roomDeposit,
				roomImgPath: roomData.roomImgList[0].roomImgPath,
				roomType: roomData.roomType,
				roomTradeType: roomData.roomTradeType,
				roomFloor: roomData.roomFloor,
				roomSpaceMeter: roomData.roomSpaceMeter,
				roomDetailTitle: roomData.roomDetailTitle,
				roomStatus: roomData.roomStatus,
				roomBedsNum: roomData.roomBedsNum,
				roomBathNum: roomData.roomBathNum,
				roomRoadAddress: roomData.roomRoadAddress
			});
		} else if(checkIsIncludeInRecentlyList(roomData.roomNum, recentlyList)) {
			recentlyList = recentlyList.filter(function (recently) {
				return recently.roomNum !== roomData.roomNum;
			});
			recentlyList.push({
				roomNum: roomData.roomNum,
				roomPrice: roomData.roomPrice,
				roomDeposit: roomData.roomDeposit,
				roomImgPath: roomData.roomImgList[0].roomImgPath,
				roomType: roomData.roomType,
				roomTradeType: roomData.roomTradeType,
				roomFloor: roomData.roomFloor,
				roomSpaceMeter: roomData.roomSpaceMeter,
				roomDetailTitle: roomData.roomDetailTitle,
				roomStatus: roomData.roomStatus,
				roomBedsNum: roomData.roomBedsNum,
				roomBathNum: roomData.roomBathNum,
				roomRoadAddress: roomData.roomRoadAddress
			});
		}
	}
	localStorage.setItem('recentlyList', JSON.stringify(recentlyList));
	
	const pricesDiv = document.querySelector('#prices');
	let html = '';
	pricesDiv.innerHTML = '';
	if (roomData.roomTradeType === '전세') {
		html += `<span class="property-price pull-right" style="margin-left: 1rem">${exchangeToHundredMillionOrNot(roomData.roomPrice)}</span>`;
		html += `<span class="property-price pull-right">전세</span>`;
	} else if (roomData.roomTradeType === '월세') {
		html += `<span class="property-price pull-right">${exchangeToHundredMillionOrNot(roomData.roomPrice)}</span>`;
		html += `<span class="property-price pull-right">/</span>`;		
		html += `<span class="property-price pull-right" style="margin-left: 1rem">${exchangeToHundredMillionOrNot(roomData.roomDeposit)}</span>`;		
		html += `<span class="property-price pull-right">월세</span>`;		
	} else if (roomData.roomTradeType === '매매') {
		html += `<span class="property-price pull-right" style="margin-left: 1rem">${exchangeToHundredMillionOrNot(roomData.roomPrice)}</span>`;
		html += `<span class="property-price pull-right">매매</span>`;		
	}
	pricesDiv.insertAdjacentHTML('afterbegin', html);

	for (const roomKey in roomData) {
		if (document.querySelectorAll(`#${roomKey}`)) {
			for (const roomInfoHtml of document.querySelectorAll(`#${roomKey}`)) {
				roomInfoHtml.innerText = roomData[roomKey];
			}
		}
	}

	document.querySelector('#realtorImg').src = roomData.realtorImgPath;

	if((localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).user.authorities[0].authority !== 'ROLE_REALTOR')
	|| !localStorage.getItem('user')) {
		document.querySelector('#realtorInfo').addEventListener('click', function() {
			location.href = `/html/saengbang/agent-page-show?realtorNum=${roomData.realtorNum}`;
		});
	}

	initMap();

	let roomImgs = roomData.roomImgList;
	let imgHtml = '';
	document.querySelector('#image-gallery').innerHTML = '';

	for(let i=0; i<roomImgs.length; i++) {
		imgHtml += `<li data-thumb="${roomImgs[i].roomImgPath}" class="lslide" style="width:50rem; margin-right:0px; height:50rem;">`;
		imgHtml += `	<img src="${roomImgs[i].roomImgPath}" style="width:100%; height:100%; object-fit: contain;"/>`;
		imgHtml += `</li>`;
	}
	document.querySelector('#image-gallery').insertAdjacentHTML('afterbegin', imgHtml);
	$('#image-gallery').lightSlider({
		gallery: true,
		item: 1,
		thumbItem: 9,
		slideMargin: 0,
		speed: 500,
		auto: true,
		loop: true,
		onSliderLoad: function () {
			$('#image-gallery').removeClass('cS-hidden');
		}
	});
	
	getRoomInquiryList(page);
	
}

async function getRoomInquiryList(evt, page) {
	if (!page) {
		page = 1;
    }
    const res = await fetch(`/room-inquiry?roomNum=${roomNum}&currentPage=${page}&pageSize=${pageSize}`);
	const roomQNAList = await res.json();
	let html = '';

	const loginMemberNum = await fetchLoginMemberId(); // 현재 접속 중인 memberNum값 - 사용자가 아니면 null
	const loginRealtorNum = await fetchLoginRealtorId(); // 현재 접속 중인 realtorNum값 - 공인중개사가 아니면 null

	const currentRoomRealtorNum = roomData.realtorNum; // 매물 올린 realotrNum값

	for (const roomQNA of roomQNAList.list) {
		if (roomQNA.roomInquiryIspublic === 1) {	// 비공개 설정을 하지 않았을 때(공개된 문의일때)
			if(roomInquiryNum && (roomInquiryNum == roomQNA.roomInquiryNum)) {
				html += `<li class="qna-li" style="background-color: rgb(255, 255, 230);">`;
			} else {
				html += `<li class="qna-li">`;
			}
			html += `	<div class="qna-inquiry-container">`;
			html += `		<p>${roomQNA.roomInquiryDetail}</p>`;
			html += `		<div>`;
			html += `			<span>${roomQNA.roomInquiryStatus}</span>`;
			html += `			<span class="qna-span">${roomQNA.memberId}</span>`;
			html += `			<span class="qna-span">${roomQNA.roomInquiryCredat}</span>`;
			html += `		</div>`;
			html += `	</div>`;
			// 답변완료 상태인거면 답변 보이게
			if (roomQNA.roomInquiryStatus === '답변완료') {
				html+= `<div class="qna-answer">`;
				html+= `	<p class="qna-answer-p">`;
				html+= `		<span class="qna-answer-realtor">중개사</span>`;
				html+= `		<span>${roomQNA.roomInquiryAnswer}</span>`;
				html+= `	</p>`;
				html+= `	<div class="qna-answer-date-container">`;
				html+= `		<span class="qna-span">${roomQNA.roomInquiryAnswerDate}</span>`;
				html+= `	</div>`;
				html+= `</div>`;
			}
			// 해당 방을 올린 중개사가 로그인한 중개사와 일치하고 문의 상태가 미답변이면
			if(loginRealtorNum == currentRoomRealtorNum && roomQNA.roomInquiryStatus === '미답변') {
				html += `<div class="qna-answer">`;
				html += `	<div class="textArea" id="textArea${roomQNA.roomInquiryNum}">`;
				html += `		<textarea id="roomInquiryAnswer${roomQNA.roomInquiryNum}"></textarea>`;
				html += '	</div>';
				html += `	<br>`;
				html += `	<button onclick="addRoomInquiryAnswer(${roomQNA.roomInquiryNum}, ${roomQNA.memberNum})">답변 작성</button>`;
				html += '</div>';
			}
			html += `</li>`;
		} else {	// roomQNA.roomInquiryIspublic === 0		// 비공개 설정을 했을 때
			if (loginMemberNum == roomQNA.memberNum || loginRealtorNum == currentRoomRealtorNum) {	// 로그인 한 회원이 문의글을 올린 회원일 때 또는 로그인 한 공인중개사가 매물을 올린 공인중개사일 때 
				if(roomInquiryNum && (roomInquiryNum == roomQNA.roomInquiryNum)) {
					html += `<li class="qna-li" style="background-color: rgb(255, 255, 230);">`;
				} else {
					html += `<li class="qna-li">`;
				}
				html += `	<div class="qna-inquiry-container">`;
				html += `		<p>${roomQNA.roomInquiryDetail}</p>`;
				html += `		<div>`;
				html += `			<span>${roomQNA.roomInquiryStatus}</span>`;
				html += `			<span class="qna-span">${roomQNA.memberId}</span>`;
				html += `			<span class="qna-span">${roomQNA.roomInquiryCredat}</span>`;
				html += `		</div>`;
				html += `	</div>`;
				// 답변완료 상태인거면 답변 보이게
				if (roomQNA.roomInquiryStatus === '답변완료') {
					html+= `<div class="qna-answer">`;
					html+= `	<p class="qna-answer-p">`;
					html+= `		<span class="qna-answer-realtor">중개사</span>`;
					html+= `		<span>${roomQNA.roomInquiryAnswer}</span>`;
					html+= `	</p>`;
					html+= `	<div class="qna-answer-date-container">`;
					html+= `		<span class="qna-span">${roomQNA.roomInquiryAnswerDate}</span>`;
					html+= `	</div>`;
					html+= `</div>`;
				}
				// 해당 방을 올린 중개사가 로그인한 중개사와 일치하고 문의 상태가 미답변이면
				if(loginRealtorNum == currentRoomRealtorNum && roomQNA.roomInquiryStatus === '미답변') {
					html += `<div class="qna-answer">`;
					html += `	<div class="textArea" id="textArea${roomQNA.roomInquiryNum}">`;
					html += `		<textarea id="roomInquiryAnswer${roomQNA.roomInquiryNum}"></textarea>`;
					html += '	</div>';
					html += `	<br>`;
					html += `	<button onclick="addRoomInquiryAnswer(${roomQNA.roomInquiryNum}, ${roomQNA.memberNum})">답변 작성</button>`;
					html += '</div>';
				}
				html += `</li>`;
			} else {// 문의글을 올린 회원이나 매물을 올린 공인중개사로 로그인하지 않았을 경우 비공개된 문의로 뜨게 된다
				html += `<li class="qna-li">`;
				html += `	<div class="qna-inquiry-container">`;
				html += `		<p id="roomInquiryDetail" style="color: #999999;">`;
				html += `			비공개 문의입니다.`;
				html += `			<svg xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14">`
				html += `				<g fill="#AAA" fill-rule="evenodd">`;
				html += `					<path d="M1 12.99h11v-7H1v7zM4 4C4 2.346 4.848.99 6.502.99 8.157.99 9 2.346 9 4v1H4V4zm5.998 1V4c0-2.206-1.292-4.01-3.498-4.01C4.294-.01 2.998 1.794 2.998 4v1H0v9h13V5H9.998z"></path>`;
				html += `					<path d="M6 11h1V8H6z"></path>`;
				html += `				</g>`;
				html += `			</svg>`;
				html += `		</p>`;
				html += `		<div>`;
				html += `			<span>${roomQNA.roomInquiryStatus}</span>`;
				html += `			<span class="qna-span">${roomQNA.memberId}</span>`;
				html += `			<span class="qna-span">${roomQNA.roomInquiryCredat}</span>`;
				html += `		</div>`;
				html += `	</div>`;
				html += `</li>`;
			}
		}
	}
	document.querySelector('#qnaList').innerHTML = html;

	const totalCount = roomQNAList.total;
	const pageBlock = Math.ceil(totalCount / pageSize);
	const startBlock = Math.ceil((page / blockSize) - 1) * blockSize + 1;
	let endBlock = startBlock + blockSize - 1;
	let pageHtml = '';

	if (endBlock > pageBlock) {
		endBlock = pageBlock;
	}
	pageHtml += '<div class="pagination" style="text-align: center; display: block">';
	pageHtml += '	<ul>';
	pageHtml += '		<span class="previous-btn">이전</span>';

	for (let i = startBlock; i <= endBlock; i++) {
		pageHtml += `<li class="page-num-btn-container">`;
		pageHtml += `	<span class="page-num-btn" data-pnum="${i}">${i}</span>`;
		pageHtml += `</li>`;
	}
	
	pageHtml += '		<span class="next-btn">다음</span>';
	pageHtml += '	</ul>';
	pageHtml += '</div>';

	document.querySelector('#qnaList').innerHTML += pageHtml;

	let preButton = document.querySelector('.previous-btn');
	let nextButton = document.querySelector('.next-btn');

	if(preButton){
		preButton.addEventListener('click', function(){
			if(roomQNAList.isFirstPage) {
				return;
			}
			getRoomInquiryList(event, roomQNAList.prePage);
		})
	}

	if(nextButton){
		nextButton.addEventListener('click', function(){
			if(roomQNAList.isLastPage) {
				return;
			}
			getRoomInquiryList(event, roomQNAList.nextPage);
		})
	}

	document.querySelectorAll('.page-num-btn').forEach(function(btn){
		btn.addEventListener('click', function(){
			getRoomInquiryList(event, btn.dataset.pnum);
		});
		if(btn.dataset.pnum === `${roomQNAList.pageNum}`){
			btn.style.color = 'ghostwhite';
			btn.style.backgroundColor = 'teal';
		}
	});

	// "qna-inquiry-container" 클래스 요소들을 가져와서 각각에 이벤트 리스너를 추가합니다
	const qnaInquiryContainers = document.querySelectorAll(".qna-inquiry-container");

	qnaInquiryContainers.forEach(function(qnaInquiryContainer) {
		qnaInquiryContainer.addEventListener("click", function() {
			// 현재 클릭한 "qna-inquiry-container" 요소의 다음 형제 요소인 "qna-answer"을 찾습니다
			const qnaAnswerElement = this.nextElementSibling;

			if(qnaAnswerElement) {
				// 현재 클릭한 "qna-inquiry-container" 요소의 다음 형제 요소를 열고, 나머지 "naeyong" 요소들을 닫습니다
				if (qnaAnswerElement.style.display === "none" || qnaAnswerElement.style.display === "") {
					qnaAnswerElement.style.display = "block";
				} else {
					qnaAnswerElement.style.display = "none";
				}

			}
		});
	});

	if(roomInquiryNum) {
		window.scrollTo({
			top: document.querySelector('#roomInquirySection').offsetTop + 200,
			behavior: 'smooth'
		})
	}
}

async function addFavorite() {
	const res = await fetch('/favorite', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8'
		},
		body: JSON.stringify({
			roomNum: roomData.roomNum
		})
	});
	if (res.ok) {
		alert('관심목록 등록 완료');
		fetchFavorites();
	}
}

async function deleteFavorite() {
	const res = await fetch('/favorite', {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8'
		},
		body: JSON.stringify({
			roomNum: roomData.roomNum
		})
	});
	if (res.ok) {
		alert('관심목록 삭제 완료');
		fetchFavorites();
	}

}

async function addRoomInquiryAnswer(roomInquiryNum, memberNum) {
	if(!document.querySelector(`#roomInquiryAnswer${roomInquiryNum}`).value) {
		alert('답변을 입력하세요');
		return;
	}
	const res = await fetch('/room-inquiry', {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8'
		},
		body: JSON.stringify({
			roomInquiryAnswer: document.querySelector(`#roomInquiryAnswer${roomInquiryNum}`).value,
			roomInquiryNum: roomInquiryNum,
			memberNum: memberNum
		})
	});
	const data = await res.json();

	if (res.ok && data !== 0) {
		alert('답변 완료 되었다.');
		getRoomInquiryList();
	}
}

// 관심 목록 추가 여부를 가져오는 함수
async function fetchFavorites() {
	const response = await fetch(`/favorite/${roomNum}`);
	const data = await response.json();
	// "관심등록", "관심등록취소" 버튼 엘리먼트를 가져오기
	const likeButton = document.querySelector('#like');
	const likeCancelButton = document.querySelector('#likeCalcel');

	if(likeButton && likeCancelButton) {
		// 비로그인 시 관심등록 버튼 숨기기, 이미 관심 목록에 추가되어 있으면 관심등록 버튼 숨기기
		if (!localStorage.getItem('token')) {
			likeButton.style.display = 'none';
			likeCancelButton.style.display = 'none';
		} else if (data > 0) {
			likeButton.style.display = 'none';
			likeCancelButton.style.display = 'block';
		} else {
			likeCancelButton.style.display = 'none';
			likeButton.style.display = 'block';
		}
	}
	return data;
}

function isLogined() {
	const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

	if (!token) {
		//likeButton.style.display = 'none';
		//likeCancelButton.style.display = 'none';
		return 'non logined';
	}
}

async function fetchLoginMemberId() {				// 현재 접속 중인 memberNum값을 가져오는 함수

	try {
		const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

		if (!token) {
			return null;
		}

		const response = await fetch('/member', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
		});

		if (response.ok) {
			const data = await response.json();
			return data.memberNum;
		} else {
			return null;
		}
	} catch (error) {
		return null;
	}

}

async function fetchLoginRealtorId() {				// 현재 접속 중인 realtorNum값을 가져오는 함수

	try {
		const token = localStorage.getItem('token'); // localStorage에서 토큰을 가져옴

		if (!token) {
			return null;
		}

		const response = await fetch('/realtor', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
		});

		if (response.ok) {
			const data = await response.json();
			return data.realtorNum;
		} else {
			return null;
		}
	} catch (error) {
		return null;
	}

}

window.addEventListener('load', getRoomInfo);