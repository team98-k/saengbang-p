const checkArea = document.querySelector("#checkArea");
const realtorName = document.querySelector("#realtorName");
const realtorPhone = document.querySelector("#realtorPhone");
const realtorRegistrationNum = document.querySelector("#realtorRegistrationNum");
const realtorSignupStatus = document.querySelector("#realtorSignupStatus");
const realtorNameSection = document.querySelector('#realtorNameSection');
const realtorPhoneSection = document.querySelector('#realtorPhoneSection');
const realtorRegistrationNumSection = document.querySelector('#realtorRegistrationNumSection');
const nameEmptyMsg = document.querySelector('#nameEmptyMsg');
const phoneEmptyMsg = document.querySelector('#phoneEmptyMsg');
const registrationNumEmptyMsg = document.querySelector('#registrationNumEmptyMsg');
const realtorRefuseReason = document.querySelector("#realtorRefuseReason");
const realtorRefuseReasonContainer = document.querySelector("#realtorRefuseReasonContainer");

// 엔터 누르면 조회되게 하려고 추가한 코드
document.querySelectorAll('.form-control').forEach((input) => {
	input.addEventListener('keyup', enter);
	input.addEventListener('input', function () {
		input.classList.remove('input-value-error');
		input.nextElementSibling.style.display = 'none';
	})
})

// 전화번호 입력시 자동으로 '-' 추가하려고 추가한 코드
realtorPhone.addEventListener('input', function() {
	realtorPhone.value = realtorPhone.value
	.replace(/[^0-9]/g, '')
	.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
});

// 중개사 등록번호 입력시 자동으로 '-' 추가하려고 추가한 코드
realtorRegistrationNum.addEventListener('input', function() {
	realtorRegistrationNum.value = realtorRegistrationNum.value
	.replace(/[^0-9]/g, '')
	.replace(/^(\d{5})(\d{4})(\d{5})$/, `$1-$2-$3`);
});

document.querySelector('#checkSignupBtn').addEventListener('click', check);

function check() {
	// 이름 미입력시 경고
	if(!realtorName.value) {
		realtorName.classList.add('input-value-error');
		nameEmptyMsg.style.display = 'block';
		nameEmptyMsg.innerHTML = '이름을 입력하세요';
	} else {
		realtorName.classList.remove('input-value-error');
		nameEmptyMsg.style.display = 'none';
	}

	// 전화번호 미입력시 경고
	if(!realtorPhone.value) {
		realtorPhone.classList.add('input-value-error');
		phoneEmptyMsg.style.display = 'block';
		phoneEmptyMsg.innerHTML = '전화번호를 입력하세요';
	} else {
		realtorPhone.classList.remove('input-value-error');
		phoneEmptyMsg.style.display = 'none';
	}

	// 중개사 등록번호 미입력시 경고
	if(!realtorRegistrationNum.value) {
		realtorRegistrationNum.classList.add('input-value-error');
		registrationNumEmptyMsg.style.display = 'block';
		registrationNumEmptyMsg.innerHTML = '중개사 등록번호를 입력하세요';
	} else {
		realtorRegistrationNum.classList.remove('input-value-error');
		registrationNumEmptyMsg.style.display = 'none';
	}
	
	if (realtorName.value && realtorPhone.value && realtorRegistrationNum.value) {
		getRealtorSignUpStatus();
	}
}

function enter() {
	if (window.event.keyCode == 13) {
		check();
	}
}

async function getRealtorSignUpStatus() {
	const res = await fetch(`/realtor-sign-up/status?realtorName=${realtorName.value}
	&realtorPhone=${realtorPhone.value}
	&realtorRegistrationNum=${realtorRegistrationNum.value}`);
	const data = await res.json();
	if(res.ok) {
		if(data.result) {
			const realtorSignUp = data.result;
			checkArea.style.display = "block";
			realtorSignupStatus.innerText = realtorSignUp.realtorSignupStatus;
//			if(realtorSignUp.realtorSignupStatus === '승인') {
//				document.querySelector('#checkArea').insertAdjacentHTML('beforeend', '<a href="/html/saengbang/login">로그인하기</a>');
//			}
			if (realtorSignupStatus.innerText == "거부") {
				realtorRefuseReasonContainer.style.display = "block";
				realtorRefuseReason.innerText = realtorSignUp.realtorRefuseReason;
			} else {
				realtorRefuseReasonContainer.style.display = "none";
				realtorRefuseReason.innerText = '';
			}
		} else {
			alert('조회된 정보가 없습니다.');
			return;
		}		
	} else {
		alert(`요청하는 중에 오류가 발생했다.\n오류 코드 : ${res.status}`);
		return;
	}
}