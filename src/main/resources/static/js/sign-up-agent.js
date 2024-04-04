const realtorId = document.querySelector('#realtorId');
const realtorPassword = document.querySelector('#realtorPassword');
const realtorName = document.querySelector('#realtorName');
const realtorPhone = document.querySelector('#realtorPhone');
const realtorOfficeAddress = document.querySelector('#realtorOfficeAddress');
const realtorOfficeDetailAddress = document.querySelector('#realtorOfficeDetailAddress');
const realtorOfficeName = document.querySelector('#realtorOfficeName');
const realtorRegistrationNum = document.querySelector('#realtorRegistrationNum');
const realtorPasswordCheck = document.querySelector('#realtorPasswordCheck');
let isIdChecked = false;
let isRegistrationNumChecked = false;
let passwordCheck = false;

// 아이디 중복 체크 버튼 클릭 이벤트
document.querySelector('#checkDuplicateId').addEventListener('click', checkDuplicateId);

// 우편번호 찾기 버튼 클릭 이벤트
document.querySelector('#findPostBtn').addEventListener('click', findPostCode);

// 중개사 등록 번호 중복 체크 버튼 클릭 이벤트
document.querySelector('#checkDuplicateRegistrationNumBtn').addEventListener('click', checkDuplicateRegistrationNum);

// 가입 신청 버튼 클릭 이벤트
document.querySelector('#signUpBtn').addEventListener('click', realtorSignUp);

// 아이디 중복확인 체크를 성공 하고 다시 아이디를 입력하면 중복확인을 다시 해야해서 추가한 코드
realtorId.addEventListener('input', function () {
    isIdChecked = false;
    document.querySelector('#idCheckResult').innerHTML = '';
    document.querySelector('#idCheckResult').style.display = 'none';
});

// 전화번호 입력시 자동으로 '-' 추가하려고 추가한 코드
realtorPhone.addEventListener('input', function () {
    realtorPhone.value = realtorPhone.value
        .replace(/[^0-9]/g, '')
        .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
});

// 중개사 등록번호 입력시 자동으로 '-' 추가
realtorRegistrationNum.addEventListener('input', function () {
    isRegistrationNumChecked = false;
    document.querySelector('#registrationNumCheckResult').innerHTML = '';
    realtorRegistrationNum.value = realtorRegistrationNum.value
        .replace(/[^0-9]/g, '')
        .replace(/^(\d{5})(\d{4})(\d{5})$/, `$1-$2-$3`);
});

realtorPasswordCheck.addEventListener('input', function () {
    if (realtorPassword.value !== realtorPasswordCheck.value) {
        passwordCheck = false;
        document.querySelector('#passwordCheckResult').innerHTML = '비밀번호가 일치하지 않습니다.';
        document.querySelector('#passwordCheckResult').style.display = 'block';
        document.querySelector('#passwordCheckResult').style.color = 'red';
        document.querySelector('#realtorPasswordCheck').style.border = '1px solid red';
    } else {
        passwordCheck = true;
        document.querySelector('#passwordCheckResult').style.display = 'none';
        document.querySelector('#realtorPasswordCheck').style.border = '1px solid #dadada';
    }
});

// 아이디 중복 체크
async function checkDuplicateId() {
    if (realtorId.value === '') {
        alert('아이디를 입력해주세요.');
        return;
    }
    const res = await fetch(`/check-duplicate/id/${realtorId.value}`);
    const data = await res.json();
    if (res.ok && data === 0) {
        document.querySelector('#idCheckResult').innerHTML = '사용 가능한 아이디입니다.';
        document.querySelector('#idCheckResult').style.display = 'block';
        document.querySelector('#idCheckResult').style.color = 'blue';
        isIdChecked = true;
    } else {
        document.querySelector('#idCheckResult').innerHTML = '이미 사용중인 아이디입니다.';
        document.querySelector('#idCheckResult').style.display = 'block';
        document.querySelector('#idCheckResult').style.color = 'red';
        isIdChecked = false;
    }
}

async function checkDuplicateRegistrationNum() {
    if (realtorRegistrationNum.value === '') {
        alert('공인중개사 등록 번호를 입력해주세요.');
        return;
    }
    const res = await fetch(`/check-duplicate/registration-num/${realtorRegistrationNum.value}`);
    const data = await res.json();
    if (res.ok && data === 0) {
        document.querySelector('#registrationNumCheckResult').innerHTML = '사용 가능한 공인중개사 등록 번호입니다.';
        document.querySelector('#registrationNumCheckResult').style.display = 'block';
        document.querySelector('#registrationNumCheckResult').style.color = 'blue';
        isRegistrationNumChecked = true;
    } else {
        document.querySelector('#registrationNumCheckResult').innerHTML = '이미 사용중인 공인중개사 등록 번호입니다.';
        document.querySelector('#registrationNumCheckResult').style.display = 'block';
        document.querySelector('#registrationNumCheckResult').style.color = 'red';
        isRegistrationNumChecked = false;
    }
}

// 가입 신청 처리하기 전에 이미 가입 신청 중인 아이디인지 확인
async function checkIsRealtorSignUpConfirming() {
    const res = await fetch(`/realtor-sign-up/status/confirming?realtorRegistrationNum=${realtorRegistrationNum.value}`);
    const data = await res.json();
    if (res.ok) {
        return data;
    } else {
        alert(`오류가 발생했다.\n오류 코드 : ${res.status}`);
    }
}


function preview(fileInput) {
    if(fileInput.files && fileInput.files[0]) {
        // const reader = new FileReader();
        // reader.onload = function(e) {
        //     document.querySelector('#realtorImgPreview').setAttribute('src', e.target.result);
        // }
        // reader.readAsDataURL(fileInput.files[0]);
        document.querySelector('#realtorImgPreview').src = URL.createObjectURL(fileInput.files[0]);
    }
}

async function realtorSignUp() {
    // 요청하기 전에 입력 다 했는지 확인
    const formData = new FormData();
    let errorMsg = '';
    if(document.querySelector('#realtorImg').files.length === 0) {
        errorMsg += '사진을 첨부해주세요.\n';
    }
    if (realtorId.value === '') {
        errorMsg += '아이디를 입력해주세요.\n';
    }
    if (!isIdChecked) {
        errorMsg += '아이디 중복확인을 해주세요.\n';
    }
    if (!isRegistrationNumChecked) {
        errorMsg += '공인중개사 등록 번호 중복확인을 해주세요.\n';
    }
    if (realtorPassword.value === '') {
        errorMsg += '비밀번호를 입력해주세요.\n';
    }
    if (realtorPasswordCheck.value === '') {
        errorMsg += '비밀번호 확인을 입력해주세요.\n';
    }
    if (!passwordCheck) {
        errorMsg += '비밀번호가 일치하지 않습니다.\n';
    }
    if (realtorName.value === '') {
        errorMsg += '이름을 입력해주세요.\n';
    }
    if (realtorPhone.value === '') {
        errorMsg += '전화번호를 입력해주세요.\n';
    }
    if (realtorOfficeAddress.value === '') {
        errorMsg += '사무소 주소를 입력해주세요.\n';
    }
    if (realtorOfficeDetailAddress.value === '') {
        errorMsg += '사무소 상세 주소를 입력해주세요.\n';
    }
    if (realtorOfficeName.value === '') {
        errorMsg += '사무소 이름을 입력해주세요.\n';
    }
    if (realtorRegistrationNum.value === '') {
        errorMsg += '공인중개사 등록 번호를 입력해주세요.\n';
    }

    if (errorMsg !== '') {
        alert('아래 내용을 다시 확인해주세요\n\n' + errorMsg);
        return;
    }
    // 가입 신청 처리하기 전에 이미 가입 신청 중인 아이디인지 확인
    const isRealtorSignUpConfirming = await checkIsRealtorSignUpConfirming();
    if (isRealtorSignUpConfirming !== 0) {
        alert('이미 가입 신청 후 승인 대기중인 중개사입니다.');
        return;
    }

    formData.append('file', document.querySelector('#realtorImg').files[0]);
    formData.append('realtorId', realtorId.value);
    formData.append('realtorPassword', realtorPassword.value);
    formData.append('realtorName', realtorName.value);
    formData.append('realtorPhone', realtorPhone.value);
    formData.append('realtorOfficeAddress', realtorOfficeAddress.value);
    formData.append('realtorOfficeDetailAddress', realtorOfficeDetailAddress.value);
    formData.append('realtorOfficeName', realtorOfficeName.value);
    formData.append('realtorRegistrationNum', realtorRegistrationNum.value);

    const res = await fetch('/realtor-sign-up', {
        method: 'POST',
        body: formData
    });
    const data = await res.json();
    if (res.ok && data !== 0) {
        alert('회원가입 신청 완료, 관리자 승인 후 로그인 가능합니다.');
        location.href = '/html/saengbang/main';
    } else {
        alert('회원가입 신청 실패');
    }
}

function findPostCode() {
    new daum.Postcode({
        oncomplete: function (data) {
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
            document.querySelector('#input').value = data.zonecode;
            document.querySelector("#realtorOfficeAddress").value = roadAddr;

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
