function findPostCode() {
	new daum.Postcode({
		oncomplete: function (data) {
			// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

			// 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
			// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
			var roadAddr = data.roadAddress; // 도로명 주소 변수
			var extraRoadAddr = ''; // 참고 항목 변수

			geocoder(roadAddr);
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
			document.querySelector("#roomRoadAddress").value = roadAddr;
			document.querySelector("#roomJibunAddress").value = data.jibunAddress;

			var guideTextBox = document.querySelector("#guide");
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

let squareMeters = document.querySelector(".roomSpaceMeter");
let pyeongs = document.querySelector(".pyeong");
squareMeters.addEventListener("input", meterToPyeong);
pyeongs.addEventListener("input", pyeongToMeter);

function meterToPyeong() {
	let squareMeter = parseFloat(squareMeters.value);
	let pyeong = squareMeter / 3.30578;

	pyeongs.value = pyeong.toFixed(0);
}
function pyeongToMeter() {
	let pyeong = parseFloat(pyeongs.value);
	let squareMeter = pyeong * 3.30578;

	squareMeters.value = squareMeter.toFixed(0);
}
function geocoder(roomRoadAddress) {
	// 주소-좌표 변환 객체를 생성합니다
	var geocoder = new kakao.maps.services.Geocoder();
	geocoder.addressSearch(roomRoadAddress, function (result, status) {
		// 정상적으로 검색이 완료됐으면 
		if (status === kakao.maps.services.Status.OK) {
			var roomLatitude = result[0].y;
			var roomLongitude = result[0].x;
			document.querySelector('#roomLatitude').value = roomLatitude;
			document.querySelector('#roomLongitude').value = roomLongitude;
		}
	}
	)
}

let imgsCount = 0;

function preview(fileInput) {
	let html = '';
	imgsCount++;
	if (fileInput.files[0]) {
		if (!fileInput.files[0].type.includes('image')) {
			alert(`해당 파일은 이미지 파일이 아닙니다.\n이미지 파일을 업로드 해주세요.`);
			fileInput.value = '';
			imgsCount--;
			return;
		}
		if (imgsCount === 15) {
			fileInput.parentNode.classList.remove('no-drag');
			fileInput.parentNode.insertAdjacentHTML('afterbegin', `<button onclick="removeImg(this.parentNode)" style="position: absolute; top: 5px; left: 80%; border: 1px solid">X</button>`);
		}
		if ((imgsCount < 15) && fileInput.parentNode.classList.contains('no-drag')) {
			let uuid = self.crypto.randomUUID();
			if (!fileInput.parentNode.querySelector('.delete')) {
				fileInput.parentNode.insertAdjacentHTML('afterbegin', `<button onclick="removeImg(this.parentNode)" style="position: absolute; top: 5px; left: 80%; border: 1px solid">X</button>`);
			}
			if (fileInput.parentNode.classList.contains('no-drag')) {
				fileInput.parentNode.classList.remove('no-drag');
			}
			html += `<div class="imgDiv no-drag" style="position: relative;">`
			html += `	<div class="img-lable-div"><label for="${uuid}" style="margin-bottom: 0;"><img width="120px" height="85px" src="" onerror="this.onerror=null; this.src='/imgs/plus.png';"></label></div>`;
			html += `	<input type="file" id="${uuid}" name="chooseFile" accept="image/*" onchange="preview(this)">`;
			html += '</div>';
			document.querySelector('#imgList').insertAdjacentHTML('beforeend', html);
		}

		fileInput.parentNode.querySelector('img').src = URL.createObjectURL(fileInput.files[0]);
	}
}

function removeImg(imgDiv) {
	if (imgsCount === 15) {
		let html = '';
		let uuid = self.crypto.randomUUID();
		html += `<div class="imgDiv no-drag" style="position: relative;">`
		html += `	<div class="img-lable-div"><label for="${uuid}" style="margin-bottom: 0;"><img width="120px" height="85px"" src="" onerror="this.onerror=null; this.src='/imgs/plus.png';"></label></div>`;
		html += `	<input type="file" id="${uuid}" name="chooseFile" accept="image/*" onchange="preview(this)">`;
		html += '</div>';
		document.querySelector('#imgList').insertAdjacentHTML('beforeend', html);
	}
	if (document.querySelectorAll('.imgDiv').length === 1) {
		return;
	}
	if (imgDiv.querySelector('.first')) {
		if (document.querySelectorAll('.imgDiv')[1]) {
			document.querySelectorAll('.imgDiv')[1].insertAdjacentHTML('afterbegin', '<div class="first" style="top: 5px; left: 5px;">대표</div>');
		}
	}
	imgsCount--;
	imgDiv.remove();
	if (imgsCount < 0) {
		imgsCount = 0;
	}
}

function changePStatus(e) {
	const value = e.value;
	var noneToFlex = document.querySelector(".hiddenPContent");
	if (value === "가능") {
		noneToFlex.style.display = "flex";
	} else {
		noneToFlex.style.display = "none";
	}
}
function changeDStatus(e) {
	const value = e.value;
	var noneToFlex = document.querySelector(".hiddenDContent");
	if (value === "날짜 선택") {
		noneToFlex.style.display = "flex";
		e.removeAttribute('id');
	} else {
		noneToFlex.style.display = "none";
		e.setAttribute('id', 'roomMovingDate');
	}
}

function changeTradeType(e) {
	const value = e.value;
	let html = '';
	if (value === '월세') {
		document.querySelector('#roomTradeType').value = '월세';
		html += '<div class="box" id="monthPrice">';
		html += '	<div class="roomPrice">';
		html += '		<div class="desc">월 세</div>';
		html += '		<input type="number" class="form-control" id="roomPrice" placeholder="숫자를 입력해주새요">';
		html += '		<div class="manwon" style="text-align: right;">만 원</div>';
		html += '		<div class="desc">보증금</div>';
		html += '		<input type="text" class="form-control" id="roomDeposit" style="width: 100%;">';
		html += '		<div class="manwon" style="text-align: right;">만 원</div>';
		html += '	</div>';
		html += '	<div class="roomMaintenanceCost">';
		html += '		<div class="desc">관리비</div>';
		html += '		<input type="number" class="form-control" id="roomMaintenanceCost" placeholder="숫자를 입력해주세요" style="width: 100%;">';
		html += '		<div class="manwon" style="text-align: right;">만 원</div>';
		html += '	</div>';
		html += '</div>';
		document.querySelector('#price1').innerHTML = html;
	}
	else if (value === '전세') {
		document.querySelector('#roomTradeType').value = '전세';
		html += '<div class="box" id="monthPrice">';
		html += '	<div class="roomPrice">';
		html += '		<div class="desc">전 세</div>';
		html += '		<input type="number" class="form-control" id="roomPrice" placeholder="숫자를 입력해주새요">';
		html += '		<div class="manwon" style="text-align: right;">만 원</div>';
		html += '	</div>';
		html += '	<div class="roomMaintenanceCost">';
		html += '		<div class="desc">관리비</div>';
		html += '		<input type="number" class="form-control" id="roomMaintenanceCost" placeholder="숫자를 입력해주세요" style="width: 100%;">';
		html += '		<div class="manwon" style="text-align: right;">만 원</div>';
		html += '	</div>';
		html += '</div>';
		document.querySelector('#price1').innerHTML = html;
	}
	if (value === '매매') {
		document.querySelector('#roomTradeType').value = '매매';
		html += '<div class="box" id="monthPrice">';
		html += '	<div class="roomPrice">';
		html += '		<div class="desc">매 매</div>';
		html += '		<input type="number" class="form-control" id="roomPrice" placeholder="숫자를 입력해주새요">';
		html += '		<div class="manwon" style="text-align: right;">만 원</div>';
		html += '	</div>';
		html += '	<div class="roomMaintenanceCost">';
		html += '		<div class="desc">관리비</div>';
		html += '		<input type="number" class="form-control" id="roomMaintenanceCost" placeholder="숫자를 입력해주세요" style="width: 100%;">';
		html += '		<div class="manwon" style="text-align: right;">만 원</div>';
		html += '	</div>';
		html += '</div>';
		document.querySelector('#price1').innerHTML = html;
	}
}

async function addRoom() {
	const files = document.querySelectorAll('input[type=file]');
	const formData = new FormData();
	let rejectMsg = '';
	let filesCount = 0;

	for (let i = 0; i < files.length; i++) {
		if (files[i].files[0]) {
			formData.append(`roomImgList[${i}].file`, files[i].files[0]);
			formData.append(`roomImgList[${i}].roomImgSequence`, i + 1);
			formData.append(`roomImgList[${i}].status`, 'INSERT');
			filesCount++;
		}
	}

	if (filesCount < 5) {
		rejectMsg += '사진을 5개 이상 첨부하세요\n';
	}
	if (!document.querySelector('#roomRoadAddress').value) {
		rejectMsg += '주소를 입력하세요\n';
	}
	if(document.querySelector('#roomPrice')) {
		if (!document.querySelector('#roomPrice').value) {
			rejectMsg += `${document.querySelector('#roomTradeType').value} 가격을 입력하세요\n`;
		}
	}
	if (document.querySelector('#roomDeposit')) {
		if (!document.querySelector('#roomDeposit').value) {
			rejectMsg += '보증금을 입력하세요\n';
		}
	}
	if (!document.querySelector('#roomMaintenanceCost').value) {
		rejectMsg += '관리비를 입력하세요\n';
	}
	if (!document.querySelector('#roomSpaceMeter').value) {
		rejectMsg += '전용면적을 입력하세요\n';
	}
	if (!document.querySelector('#roomType').value) {
		rejectMsg += '방 종류를 입력하세요\n';
	}
	if (!document.querySelector('#roomElevator').value) {
		rejectMsg += '엘레베이터 여부를 입력하세요\n';
	}
	if (!document.querySelector('#roomDetailAddress').value) {
		rejectMsg += '상세 주소를 입력하세요\n';
	}
	if (!document.querySelector('#roomBuildingFloor').value) {
		rejectMsg += '건물 층수를 입력하세요\n';
	}
	if (!document.querySelector('#roomFloor').value) {
		rejectMsg += '매물의 층수를 입력하세요\n';
	}
	if (!document.querySelector('#roomBedsNum').value) {
		rejectMsg += '방 개수를 입력하세요\n';
	}
	if (!document.querySelector('#roomBathNum').value) {
		rejectMsg += '화장실 개수를 입력하세요\n';
	}
	if (!document.querySelector('#roomDirection').value) {
		rejectMsg += '방향을 입력하세요\n';
	}
	if (!document.querySelector('#roomHeating').value) {
		rejectMsg += '난방 종류를 입력하세요\n';
	}
	if (!document.querySelector('#roomHouseholdNum').value) {
		rejectMsg += '총 세대 수를 입력하세요\n';
	}
	if (!document.querySelector('#roomParking').value) {
		rejectMsg += '주차 가능 여부 입력하세요\n';
	}
	if (document.querySelector('#roomParking').value === '가능' && !document.querySelector('#roomParkingNum').value) {
		rejectMsg += '주차 가능 수를 입력하세요\n';
	}
	if (!document.querySelector('#roomEntranceType').value) {
		rejectMsg += '현관 유형을 입력하세요\n';
	}
	if (!document.querySelector('#roomMovingDate').value) {
		rejectMsg += '입주 가능일을 입력하세요\n';
	}
	if (!document.querySelector('#roomDetailTitle').value) {
		rejectMsg += '상세 설명 제목을 입력하세요\n';
	}
	if (!document.querySelector('#roomDetail').value) {
		rejectMsg += '상세 설명 내용을 입력하세요\n';
	}
	if (!(rejectMsg === '')) {
		alert('입력 양식을 다시 확인해주세요\n\n등록 실패 사유 : \n' + rejectMsg);
		return;
	}

	formData.append('roomTradeType', document.querySelector('#roomTradeType').value);
	formData.append('roomDetailAddress', document.querySelector('#roomDetailAddress').value);
	formData.append('roomElevator', document.querySelector('#roomElevator').value);
	formData.append('roomType', document.querySelector('#roomType').value);
	formData.append('roomFloor', document.querySelector('#roomFloor').value);
	formData.append('roomBuildingFloor', document.querySelector('#roomBuildingFloor').value);
	formData.append('roomSpaceMeter', document.querySelector('#roomSpaceMeter').value);
	formData.append('roomBedsNum', document.querySelector('#roomBedsNum').value);
	formData.append('roomBathNum', document.querySelector('#roomBathNum').value);
	formData.append('roomDirection', document.querySelector('#roomDirection').value);
	formData.append('roomHeating', document.querySelector('#roomHeating').value);
	formData.append('roomHouseholdNum', document.querySelector('#roomHouseholdNum').value);
	formData.append('roomParking', document.querySelector('#roomParking').value);
	formData.append('roomEntranceType', document.querySelector('#roomEntranceType').value);
	formData.append('roomMovingDate', document.querySelector('#roomMovingDate').value);
	formData.append('roomRoadAddress', document.querySelector('#roomRoadAddress').value);
	formData.append('roomLatitude', document.querySelector('#roomLatitude').value);
	formData.append('roomLongitude', document.querySelector('#roomLongitude').value);
	formData.append('roomDetailTitle', document.querySelector('#roomDetailTitle').value);
	formData.append('roomDetail', document.querySelector('#roomDetail').value);
	
	if(document.querySelector('#roomPrice')) {
		formData.append('roomPrice', document.querySelector('#roomPrice').value);
	}

	if (document.querySelector('#roomDeposit')) {
		formData.append('roomDeposit', document.querySelector('#roomDeposit').value);
	}

	if (document.querySelector('#roomMaintenanceCost').value === '없음') {
		formData.append('roomMaintenanceCost', 0);
	} else {
		formData.append('roomMaintenanceCost', document.querySelector('#roomMaintenanceCost').value);
	}

	if (document.querySelector('#roomParking').value === '불가능') {
		formData.append('roomParkingNum', 0);
	} else if (document.querySelector('#roomParking').value === '가능') {
		formData.append('roomParkingNum', document.querySelector('#roomParkingNum').value);
	}

	if (document.querySelector('#roomJibunAddress').value) {
		formData.append('roomJibunAddress', document.querySelector('#roomJibunAddress').value);
	} else if (!document.querySelector('#roomJibunAddress').value) {
		if (document.querySelector('#guide').innerText) {
			formData.append('roomJibunAddress', document.querySelector('#guide').innerText.slice(12, -1));
		}
	}

	document.querySelector('#addBtn').setAttribute('disabled', 'disabled');
	document.querySelector('#addBtn').style.backgroundColor = 'gray';
	document.querySelector('#addBtn').style.cursor = 'not-allowed';
	document.querySelector('#addBtn').value = '업로드 중...잠시만 기다려주세요';

	

	const res = await fetch('/rooms', {
		method: 'POST',
		body: formData
	});
	const data = await res.json();
	if (res.ok && data !== 0) {
		alert('업로드가 완료 되었습니다.');
		location.href = '/html/realtor/agent-page';
	} else {
		alert('업로드 실패');
		document.querySelector('#addBtn').removeAttribute('disabled');
		document.querySelector('#addBtn').value = '등록';
	}
}

function sortable() {
	const imgList = document.querySelector('#imgList');
	let sortable = new Sortable(imgList, {
		group: 'shared',
		animation: 150,
		filter: '.no-drag',
		onEnd: function (evt) {
			let uuid = self.crypto.randomUUID();
			// document.querySelector('.first').remove();
			// document.querySelectorAll('.imgDiv')[0].insertAdjacentHTML('afterbegin', '<div class="first" style="top: 5px; left: 5px;">대표</div>');
			if(imgsCount < 15) {
				document.querySelector('.no-drag').remove();
				imgList.insertAdjacentHTML('beforeend', '<div class="imgDiv no-drag" style="position: relative;">' +
					`	<div class="img-lable-div"><label for="${uuid}" style="margin-bottom: 0;"><img width="120px" height="85px" src="" onerror="this.onerror=null; this.src='/imgs/plus.png';"></label></div>` +
					`	<input type="file" id="${uuid}" name="chooseFile" accept="image/*" onchange="preview(this)">` +
					'</div>');
			}
		}
	});
}

window.addEventListener('load', sortable);	
