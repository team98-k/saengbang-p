const pageSize = 8;
const blockSize = 5;

async function deleteRealtorRoom(roomNum) {
	const checkRealDelete = confirm('해당 매물을 삭제합니다');
	if (checkRealDelete) {
		const res = await fetch(`/rooms/${roomNum}`, {
			method: 'DELETE'
		});
		const data = await res.json();

		if (data === 1) {
			alert('삭제되었습니다');
			location.reload();
		}
	}
}

async function roomTradeComplete(roomNum) {
	const checkRealComplete = confirm('해당 매물의 거래를 완료합니다.');
	if (checkRealComplete) {
		const res = await fetch(`/rooms/${roomNum}`, {
			method: 'PATCH'
		});
		const data = await res.json();

		if (data === 1) {
			alert('거래 완료 처리되었습니다.');
			getRealtorRoomList();
		}
	}
}

async function getRealtorRoomList(evt, page) {
	if (!page) {
		page = 1;
	}
	const res = await fetch(`/rooms/realtor?currentPage=${page}&pageSize=${pageSize}`);
	const realtorRoomData = await res.json();

	let html = '';

	for (const realtorRoom of realtorRoomData.list) {
		let price = '';
		if (realtorRoom.roomPrice > 9999) {
			if (realtorRoom.roomPrice % 10000 === 0) {
				price = `${Math.floor(realtorRoom.roomPrice / 10000)}억`;
			} else {
				price = `${Math.floor(realtorRoom.roomPrice / 10000)}억 ${realtorRoom.roomPrice % 10000}`;
			}
		} else {
			price = `${realtorRoom.roomPrice}`;
		}
		let deposit = '';
		if (realtorRoom.roomDeposit > 9999) {
			if (realtorRoom.roomDeposit % 10000 === 0) {
				deposit = `${Math.floor(realtorRoom.roomDeposit / 10000)}억`;
			} else {
				deposit = `${Math.floor(realtorRoom.roomDeposit / 10000)}억 ${realtorRoom.roomDeposit % 10000}`;
			}
		} else {
			deposit = `${realtorRoom.roomDeposit}`;
		}

		if (!(realtorRoom.roomStatus === '거래완료')) {
			html += `<div class="col-sm-6 col-md-3 p0">`;
		} else {
			html += `<div class="col-sm-6 col-md-3 p0" style="opacity:0.5">`;
		}
		html += '    <div class="box-two proerty-item">';
		html += `            <span>${realtorRoom.roomStatus}</span>`;
		html += `            <a href="/html/saengbang/detail?roomNum=${realtorRoom.roomNum}"><span>매물 상세</span></a>`;
		if (!(realtorRoom.roomStatus === '거래완료')) {
			html += `            <a href="update-room?roomNum=${realtorRoom.roomNum}"><span>수정</li></a>`;
			html += `            <a href="#" onclick="roomTradeComplete(${realtorRoom.roomNum})"><span>거래완료</span></a>`;
		}
		html += '        <div class="item-thumb">';
		if (!(realtorRoom.roomStatus === '거래완료')) {
			html += `            <a href="/html/saengbang/detail?roomNum=${realtorRoom.roomNum}" class="property-link"><img src="${realtorRoom.roomImgPath}" class="property-image"></a>`;
		} else {
			html += '            <h1 class="image_text" style="font-size:30px">거래된 방.</h1>';
			html += `            <a href="/html/saengbang/detail?roomNum=${realtorRoom.roomNum}" class="property-link"><img src="${realtorRoom.roomImgPath}" class="property-image" style="filter: grayscale(100%);"></a>`;
		}
		html += '        </div>';
		html += '        <div class="item-entry overflow">';
		html += `                <h5>${realtorRoom.roomType}</h5>`
		html += `                   <div class="dot-hr"></div>`
		html += `                   <span>방 ${realtorRoom.roomBedsNum}개, 욕실 ${realtorRoom.roomBathNum}개</span><br/>`;
		if (realtorRoom.roomTradeType === '전세') {
			html += `                <span>${realtorRoom.roomTradeType} ${price}</span><br/>`;
		} else if (realtorRoom.roomTradeType === '월세') {
			html += `                <span>${realtorRoom.roomTradeType} ${price} / ${deposit}</span><br/>`;
		} else if (realtorRoom.roomTradeType === '매매') {
			html += `                <span>${realtorRoom.roomTradeType} ${price}</span><br/>`;
		}
		html += `                <span style= " display: block; overflow:hidden; text-overflow:ellipsis; white-space: nowrap;">${realtorRoom.roomRoadAddress}</span>`;
		html += `                <span style=  "display: block; overflow:hidden; text-overflow:ellipsis; white-space: nowrap;">${realtorRoom.roomDetailTitle}</span>`;
		html += '       </div>';
		html += '    </div>';
		html += '</div>';
	}
	document.querySelector('#list-type').innerHTML = html;

	const totalCount = realtorRoomData.total;
	const pageBlock = Math.ceil(totalCount / pageSize);
	const startBlock = Math.ceil((page / blockSize) - 1) * blockSize + 1;
	let endBlock = startBlock + blockSize - 1;
	let pageHtml = '';

	if (endBlock > pageBlock) {
		endBlock = pageBlock;
	}

	pageHtml += '<ul>';
	pageHtml += '	<span class="previous-btn">이전</span>';
	
	for (let i = startBlock; i <= endBlock; i++) {
		pageHtml += `<li class="page-num-btn-container">`;
		pageHtml += `	<span class="page-num-btn" data-pnum="${i}">${i}</span>`;
		pageHtml += `</li>`;
	}

	pageHtml += '	<span class="next-btn">다음</span>';
	pageHtml += '</ul>';

	if(totalCount > 0) {
		document.querySelector('#page').innerHTML = pageHtml;
	} else {
		document.querySelector('#page').innerHTML = '';
	}

	let preButton = document.querySelector('.previous-btn');
	let nextButton = document.querySelector('.next-btn');

	if(preButton){
		preButton.addEventListener('click', function(){
			if(realtorRoomData.isFirstPage) {
				return;
			}
			getRealtorRoomList(event, realtorRoomData.prePage);
		})
	}

	if(nextButton){
		nextButton.addEventListener('click', function(){
			if(realtorRoomData.isLastPage) {
				return;
			}
			getRealtorRoomList(event, realtorRoomData.nextPage);
		})
	}

	document.querySelectorAll('.page-num-btn').forEach(function(btn){
		btn.addEventListener('click', function(){
			getRealtorRoomList(event, btn.dataset.pnum);
		});
		if(btn.dataset.pnum === `${realtorRoomData.pageNum}`){
			btn.style.color = 'ghostwhite';
			btn.style.backgroundColor = 'teal';
		}
	});
}

function preview(fileInput) {
	if(fileInput.files && fileInput.files[0]) {
		if (!fileInput.files[0].type.includes('image')) {
			alert(`해당 파일은 이미지 파일이 아닙니다.\n이미지 파일을 업로드 해주세요.`);
			fileInput.value = '';
			return;
		}
		document.querySelector('#realtorImgChange').src = URL.createObjectURL(fileInput.files[0]);
	}
}

async function getRealtorInfo() {
	const res = await fetch('/realtor');
	const realtorInfoData = await res.json();

	document.querySelector('#realtorImgChange').src = realtorInfoData.realtorImgPath;
	document.querySelector('#realtorImgView').src = realtorInfoData.realtorImgPath;

	for (const realtorInfoKey in realtorInfoData) {
		if (document.querySelector(`#${realtorInfoKey}`)) {
			document.querySelector(`#${realtorInfoKey}`).innerHTML = realtorInfoData[realtorInfoKey];
		}

		if (document.querySelector(`#ch${realtorInfoKey}`)) {
			document.querySelector(`#ch${realtorInfoKey}`).value = realtorInfoData[realtorInfoKey];
		}
	}

	const realtorPhone = document.querySelector('#chrealtorPhone');

	// 전화번호 입력시 자동으로 '-' 추가하려고 추가한 코드
	realtorPhone.addEventListener('input', function() {
		realtorPhone.value = realtorPhone.value
			.replace(/[^0-9]/g, '')
			.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
	});

	document.querySelector('#realtorOfficeAddress').innerHTML += ` ${realtorInfoData.realtorOfficeDetailAddress}`;
}

function loadRealtorInfo() {
	getRealtorInfo();
	getRealtorRoomList();
}

window.addEventListener('load', loadRealtorInfo)

function findPostCode() {
	new daum.Postcode({
		oncomplete: function(data) {
			// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

			// 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
			// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
			var roadAddr = data.roadAddress; // 도로명 주소 변수
			var extraRoadAddr = ''; // 참고 항목 변수

			// 법정동명이 있을 경우 추가한다. (법정리는 제외)
			// 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
			if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
				extraRoadAddr += data.bname;
			}
			// 건물명이 있고, 공동주택일 경우 추가한다.
			if (data.buildingName !== '' && data.apartment === 'Y') {
				extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
			}
			// 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
			if (extraRoadAddr !== '') {
				extraRoadAddr = ' (' + extraRoadAddr + ')';
			}

			// 우편번호와 주소 정보를 해당 필드에 넣는다.
			document.querySelector('#postCode').value = data.zonecode;
			document.querySelector("#chrealtorOfficeAddress").value = roadAddr;

			var guideTextBox = document.getElementById("guide");
			// 사용자가 '선택 안함'을 클릭한 경우, 예상 주소라는 표시를 해준다.
			if (data.autoRoadAddress) {
				var expRoadAddr = data.autoRoadAddress + extraRoadAddr;
				guideTextBox.innerHTML = '(예상 도로명 주소 : ' + expRoadAddr + ')';
				guideTextBox.style.display = 'block';

			} else if (data.autoJibunAddress) {
				var expJibunAddr = data.autoJibunAddress;
				guideTextBox.innerHTML = '(예상 지번 주소 : ' + expJibunAddr + ')';
				guideTextBox.style.display = 'block';
			} else {
				guideTextBox.innerHTML = '';
				guideTextBox.style.display = 'none';
			}
		}
	}).open();
}

document.querySelector('#realtorPasswordCheck').addEventListener('input', function() {
	if (document.querySelector('#realtorPassword').value !== document.querySelector('#realtorPasswordCheck').value) {
		document.querySelector('#realtorPasswordCheck').style.border = '1px solid red';
		document.querySelector('#passwordCheckResult').innerText = '비밀번호가 일치하지 않습니다.';
		document.querySelector('#passwordCheckResult').style.display = 'block';
	} else {
		document.querySelector('#realtorPasswordCheck').style.border = '1px solid #dadada';
		document.querySelector('#passwordCheckResult').innerText = '';
		document.querySelector('#passwordCheckResult').style.display = 'none';
	}
});

document.querySelector('#realtorPassword').addEventListener('input', function() {
	if (document.querySelector('#realtorPassword').value !== document.querySelector('#realtorPasswordCheck').value) {
		document.querySelector('#realtorPasswordCheck').style.border = '1px solid red';
		document.querySelector('#passwordCheckResult').innerText = '비밀번호가 일치하지 않습니다.';
		document.querySelector('#passwordCheckResult').style.display = 'block';
	} else {
		document.querySelector('#realtorPasswordCheck').style.border = '1px solid #dadada';
		document.querySelector('#passwordCheckResult').innerText = '';
		document.querySelector('#passwordCheckResult').style.display = 'none';
	}
});

async function updateRealtorInfo() {
	const formData = new FormData();
	if (!document.querySelector('#chrealtorOfficeAddress').value
		|| !document.querySelector('#realtorCurrentPassword').value
		|| !document.querySelector('#realtorPassword').value
		|| !document.querySelector('#realtorPasswordCheck').value
		|| !document.querySelector('#chrealtorPhone').value
		|| !document.querySelector('#chrealtorOfficeDetailAddress').value
		|| !document.querySelector('#chrealtorOfficeName').value) {
		alert('입력칸을 다 채워야 한다.');
		return;
	} else if(document.querySelector('#realtorPassword').value !== document.querySelector('#realtorPasswordCheck').value) {
		alert('새 비밀번호가 일치하지 않습니다.');
		return;
	}
	
	if(document.querySelector('#realtorImg').files[0]){
		formData.append('file', document.querySelector('#realtorImg').files[0]);
	} else if(document.querySelector('#realtorImgChange').src) {
		formData.append('realtorImgPath', document.querySelector('#realtorImgChange').src);
	}

	formData.append('realtorOfficeAddress', document.querySelector('#chrealtorOfficeAddress').value);
	formData.append('realtorOfficeDetailAddress', document.querySelector('#chrealtorOfficeDetailAddress').value);
	formData.append('realtorOfficeName', document.querySelector('#chrealtorOfficeName').value);
	formData.append('realtorCurrentPassword', document.querySelector('#realtorCurrentPassword').value);
	formData.append('realtorPassword', document.querySelector('#realtorPassword').value);
	formData.append('realtorPhone', document.querySelector('#chrealtorPhone').value);

	const res = await fetch('/realtor', {
		method: 'PATCH',
		body: formData
	});
	
	if (res.ok) {
		const data = await res.json();
		if (data !== 0) {
			alert('수정이 완료되었습니다.');
			clearInput();
			$('#staticBackdrop').modal('hide');
			loadRealtorInfo();
		} else {
			alert('수정이 실패하였습니다. 현재 비밀번호를 확인해주세요.');
			$('#staticBackdrop').modal('show');
		}
	} else {
		alert('수정 실패');
	}
}

function clearInput() {
	document.querySelector('#realtorCurrentPassword').value = '';
	document.querySelector('#realtorPassword').value = '';
	document.querySelector('#realtorPasswordCheck').value = '';
}

async function urlToFile(url, fileName, mimeType) {
	const res = await fetch(url);
	const ab = await res.arrayBuffer();
	return new File([ab], fileName, { type: mimeType });
}