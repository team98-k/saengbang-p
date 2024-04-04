const modal = document.querySelector('#staticBackdrop');

function findPostCode() {
	new daum.Postcode({
		oncomplete: function (data) {
			// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

			// 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
			// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
			let roadAddr = data.roadAddress; // 도로명 주소 변수
			let extraRoadAddr = ''; // 참고 항목 변수

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
			modal.querySelector("#memberAddress").value = roadAddr;

			const guideTextBox = document.getElementById("guide");
            // 사용자가 '선택 안함'을 클릭한 경우, 예상 주소라는 표시를 해준다.
            if (data.autoRoadAddress) {
                let expRoadAddr = data.autoRoadAddress + extraRoadAddr;
                guideTextBox.innerHTML = '(예상 도로명 주소 : ' + expRoadAddr + ')';
                guideTextBox.style.display = 'block';

            } else if (data.autoJibunAddress) {
                let expJibunAddr = data.autoJibunAddress;
                guideTextBox.innerHTML = '(예상 지번 주소 : ' + expJibunAddr + ')';
                guideTextBox.style.display = 'block';
            } else {
                guideTextBox.innerHTML = '';
                guideTextBox.style.display = 'none';
            }
		}
	}).open();
}
// 전화번호 입력시 자동으로 '-' 추가하려고 추가한 코드
modal.querySelector('#memberPhone').addEventListener('input', function () {
	modal.querySelector('#memberPhone').value = modal.querySelector('#memberPhone').value
		.replace(/[^0-9]/g, '')
		.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
});

modal.querySelector('#memberPasswordCheck').addEventListener('input', function () {
	if (modal.querySelector('#memberPassword').value !== modal.querySelector('#memberPasswordCheck').value) {
		document.querySelector('#memberPasswordCheck').style.border = '1px solid red';
		document.querySelector('#passwordCheckResult').innerText = '비밀번호가 일치하지 않습니다.';
		document.querySelector('#passwordCheckResult').style.display = 'block';
	} else {
		document.querySelector('#memberPasswordCheck').style.border = '1px solid #dadada';
		document.querySelector('#passwordCheckResult').style.display = 'none';
	}
});

modal.querySelector('#memberPassword').addEventListener('input', function () {
	if (modal.querySelector('#memberPassword').value !== modal.querySelector('#memberPasswordCheck').value) {
		document.querySelector('#memberPasswordCheck').style.border = '1px solid red';
		document.querySelector('#passwordCheckResult').innerText = '비밀번호가 일치하지 않습니다.';
		document.querySelector('#passwordCheckResult').style.display = 'block';
	} else {
		document.querySelector('#memberPasswordCheck').style.border = '1px solid #dadada';
		document.querySelector('#passwordCheckResult').style.display = 'none';
	}
});

async function updateMemberInfo() {
	if (!modal.querySelector('#memberAddress').value || !modal.querySelector('#memberPassword').value
		|| !modal.querySelector('#memberPhone').value || !modal.querySelector('#memberEmail').value
		|| !modal.querySelector('#memberName').value || !modal.querySelector('#memberCurrentPassword').value
		|| !modal.querySelector('#memberPasswordCheck').value) {
		alert('입력칸을 다 채워야 합니다.');
		return;
	} else if(modal.querySelector('#memberPassword').value !== modal.querySelector('#memberPasswordCheck').value){
		alert('새 비밀번호가 일치하지 않습니다.');
		return;
	}
	const res = await fetch(`/member`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8'
		},
		body: JSON.stringify({
			memberAddress: modal.querySelector('#memberAddress').value,
			memberCurrentPassword: modal.querySelector('#memberCurrentPassword').value,
			memberPassword: modal.querySelector('#memberPassword').value,
			memberPhone: modal.querySelector('#memberPhone').value,
			memberEmail: modal.querySelector('#memberEmail').value,
			memberName: modal.querySelector('#memberName').value
		})
	});
	if (res.ok) {
		const data = await res.json();
		if (data !== 0) {
			alert('수정이 완료되었습니다.');
			clearInput();
			$('#staticBackdrop').modal('hide');
			getMemberInfo();
		} else {
			alert('수정 실패하였습니다. 현재 비밀번호를 확인해주세요.');
			$('#staticBackdrop').modal('show');
		}
	} else {
		alert('수정 실패');
	}
}


async function getMemberInfo() {
	const res = await fetch('/member');
	if (res.ok) {
		const memberInfoData = await res.json();
		for (const key in memberInfoData) {
			// 이건 그냥 조회만 하는 부분에서 값 넣을려고 쓴 코드고
			if (document.querySelector(`#${key}`)) {
				document.querySelector(`#${key}`).innerText = memberInfoData[key];
			}
			// 이건 모달창으로 수정하는 부분에서 값 넣을려고 쓴 코드
			if (modal.querySelector(`#${key}`)) {
				modal.querySelector(`#${key}`).value = memberInfoData[key];
			}
		}
	} else {
		alert(`사용자 정보를 가져오는 중에 문제가 발생했다.\n(${res.status}번 오류)`);
	}
}

async function deleteUser() {
	if (confirm('회원 탈퇴 하시겠습니까?')) {
		const res = await fetch('/member', {
			method: 'DELETE'
		});
		const data = await res.json();

		if (res.ok && data !== 0) {
			alert('회원 탈퇴가 완료되었습니다.');
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			location.href = '/api/logout';
		} else {
			alert('회원 탈퇴에 실패하였습니다.');
		}
	} else {
		alert('취소되었습니다.');
	}
}

function clearInput() {
	modal.querySelector('#memberCurrentPassword').value = '';
	modal.querySelector('#memberPassword').value = '';
	modal.querySelector('#memberPasswordCheck').value = '';
}

window.addEventListener('load', getMemberInfo);