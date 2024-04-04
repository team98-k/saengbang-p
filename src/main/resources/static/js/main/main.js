async function getRoomList() {
	document.querySelector('#main-list-name').innerText = '관심 등록 상위권';
	const res = await fetch('/rooms/favorite')
	const data = await res.json();
	if (data != null) {
		buildHtml(data);
	}
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

async function buildHtml(data) {
	let html = '';
	const recentlyListRoomNums = [];
	const alreadyRegisteredRoomNums = [];
	let isAlreadyRegistered = 0;

	console.log('list', data);

	for(let i=0; i<data.length; i++) {
		if(localStorage.getItem('token') && localStorage.getItem('user')) {
			recentlyListRoomNums.push(data[i].roomNum);
		}
	}

	if(localStorage.getItem('token') && localStorage.getItem('user')) {
		const res = await fetch(`/favorite/is-already-registered?recentlyViewedRoomNumList=${recentlyListRoomNums}`);
		const data = await res.json();
		console.log('data', data);
		data.forEach(function(roomNum) {
			alreadyRegisteredRoomNums.push(roomNum);
		});
		console.log('alreadyRegisteredRoomNums', alreadyRegisteredRoomNums);
	}
	for (let i=0; i<data.length; i++) {
		let price = exchangeToHundredMillionOrNot(data[i].roomPrice);
		let deposit = exchangeToHundredMillionOrNot(data[i].roomDeposit);
		html += '<div class="col-sm-6 col-md-3 p0">';
		html += '	<div class="box-two proerty-item">';
		html += '		<div class="item-thumb">';
		html += `			<a href="/html/saengbang/detail?roomNum=${data[i].roomNum}"><img src="${data[i].roomImgPath}" style="height: 400px"/></a>`;
		html += '		</div>';
		if (localStorage.getItem('user') && localStorage.getItem('token')) {
			if (alreadyRegisteredRoomNums.includes(data[i].roomNum)) {
				html += `<input type="checkbox" class="like" id="like${data[i].roomNum}" data-rnum="${data[i].roomNum}" checked>`;
				html += `<label for="like${data[i].roomNum}"></label>`;
			} else {
				html += `<input type="checkbox" class="like" id="like${data[i].roomNum}" data-rnum="${data[i].roomNum}">`;
				html += `<label for="like${data[i].roomNum}"></label>`;
			}
		}
		html += `		<div class="item-entry overflow" style="cursor: pointer;" onclick="location.href='/html/saengbang/detail?roomNum=${data[i].roomNum}'">`;
		html += `			<h5>${data[i].roomTradeType}</h5>`;
		html += '			<div class="dot-hr"></div>';
		html += `                   <span class="text-wrap">방 ${data[i].roomBedsNum}개, 욕실 ${data[i].roomBathNum}개</span>`;
		if (data[i].roomTradeType === '전세') {
			html += `                <span class="text-wrap">${data[i].roomTradeType} ${price}</span>`;
		} else if (data[i].roomTradeType === '월세') {
			html += `                <span class="text-wrap">${data[i].roomTradeType} ${price} / ${deposit}</span>`;
		} else if (data[i].roomTradeType === '매매') {
			html += `                <span class="text-wrap">${data[i].roomTradeType} ${price}</span>`;
		}
		html += `                <span class="text-wrap">${data[i].roomRoadAddress}</span>`;
		html += `                <span class="text-wrap">${data[i].roomDetailTitle}</span>`;
		html += '		</div>';
		html += '	</div>';
		html += '</div>';
	}
	document.querySelector('#list-type').innerHTML = html;
	const likes = document.querySelectorAll(".like");
	likes.forEach(function (checkbox) {
		checkbox.addEventListener("click", async function () {
			if (checkbox.checked === false) {
				if (confirm('관심목록에서 삭제하시겠습니까?')) {
					const res = await fetch(`/favorite`, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json;charset=utf-8'
						},
						body: JSON.stringify({
							roomNum: checkbox.dataset.rnum
						})
					});
					if (res.ok) {
						alert('관심목록에서 삭제되었습니다.');
					}
				} else {
					checkbox.checked = true;
				}
			} else {
				if (confirm('관심목록에 추가하시겠습니까?')) {
					const res = await fetch('/favorite', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json;charset=UTF-8'
						},
						body: JSON.stringify({
							roomNum: checkbox.dataset.rnum
						})
					});
					if (res.ok) {
						alert('관심목록에 추가되었습니다.');
					} else {
						alert('관심목록 추가 실패');
						checkbox.checked = false;
					}
				} else {
					checkbox.checked = false;
				}
			}
		})
	});
}

function enter() {
	if (window.event.keyCode == 13) {
		goMap();
	}
}

function goMap() {
	var mainSearchBar = document.querySelector('#mainSearchBar');
	if (mainSearchBar) {
		// 키워드로 장소를 검색합니다
		searchPlaces(mainSearchBar.value);
	}
}

// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places();


// 키워드 검색을 요청하는 함수입니다
function searchPlaces(mainSearchBar) {

	// if (!mainSearchBar.replace(/^\s+|\s+$/g, '')) {
	//     alert('키워드를 입력해주세요!');
	//     return false;
	// }

	// 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
	ps.keywordSearch(mainSearchBar, placesSearchCB);
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagenation) {
	if (status === kakao.maps.services.Status.OK) {
		let html = '';
		for (let i = 0; i < 5; i++) {
			html += `<li class="list-group-item list-group-item-action" onclick="location.href='/html/saengbang/map?place=${data[i].place_name}'">`
			html += `<p style="margin: 0;padding: 0 1rem">주소 : ${data[i].address_name}</p>`;
			// html += '<p>카테고리 : ' + data[i].category_group_name + '</p>';
			html += '<p style="margin: 0;padding: 0 1rem">장소 이름 : ' + data[i].place_name + '</p>'
			html += '</li>';
		}
		document.querySelector('#placesList').innerHTML = html;
		displayPagination(pagenation);
	} else if (status === kakao.maps.services.Status.ZERO_RESULT) {
		alert('검색 결과가 존재하지 않습니다.');
		return;
	} else if (status === kakao.maps.services.Status.ERROR) {
		alert('검색 결과 중 오류가 발생했습니다.');
		return;
	}
}


// 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
function displayPagination(pagination) {
	var paginationEl = document.getElementById('pagination'),
		fragment = document.createDocumentFragment(),
		i;

	// 기존에 추가된 페이지번호를 삭제합니다
	while (paginationEl.hasChildNodes()) {
		paginationEl.removeChild(paginationEl.lastChild);
	}

	for (i = 1; i <= pagination.last; i++) {
		var el = document.createElement('a');
		el.href = "#";
		el.innerHTML = i;

		if (i === pagination.current) {
			el.className = 'on';
		} else {
			el.onclick = (function (i) {
				return function () {
					pagination.gotoPage(i);
				}
			})(i);
		}

		fragment.appendChild(el);
	}
	paginationEl.appendChild(fragment);
}

window.addEventListener('load', getRoomList);