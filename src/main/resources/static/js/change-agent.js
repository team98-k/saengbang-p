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

async function updateRealtorInfo() {
	if(!document.querySelector('#chrealtorOfficeAddress').value 
	|| !document.querySelector('#chrealtorPassword').value 
	|| !document.querySelector('#chrealtorPhone').value
	|| !document.querySelector('#chrealtorOfficeDetailAddress').value) {
		alert('입력칸을 다 채워야 한다.');
		return;
	}
	const res = await fetch('/realtor', {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8'
		},
		body: JSON.stringify({
			realtorOfficeAddress: document.querySelector('#chrealtorOfficeAddress').value,
			realtorOfficeDetailAddress: document.querySelector('#chrealtorOfficeDetailAddress').value,
			realtorOfficeName: document.querySelector('#chrealtorOfficeName').value,
			realtorPassword: document.querySelector('#chrealtorPassword').value,
			realtorPhone: document.querySelector('#chrealtorPhone').value
		})
	});
	if(res.ok) {
		const data = await res.json();
		if(data !== 0) {
			opener.getRealtorInfo();
			alert('수정 완료되었다.');
			window.close();
		}		
	} else {
		alert('수정 실패');
	}
}

window.addEventListener('load', async function() {
	const res = await fetch('/realtor');
	const realtorInfoData = await res.json();

	for(const key in realtorInfoData) {
		if(document.querySelector(`#ch${key}`)) {
			document.querySelector(`#ch${key}`).value = realtorInfoData[key];
		}
	}
});

const realtorPhone = document.querySelector('#chrealtorPhone');

// 전화번호 입력시 자동으로 '-' 추가하려고 추가한 코드
realtorPhone.addEventListener('input', function() {
	realtorPhone.value = realtorPhone.value
		.replace(/[^0-9]/g, '')
		.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
});