const memberId = document.querySelector('#memberId');
const memberPassword = document.querySelector('#memberPassword');
const memberPasswordCheck = document.querySelector('#memberPasswordCheck');
const memberName = document.querySelector('#memberName');
const memberEmail = document.querySelector('#memberEmail');
const memberPhone = document.querySelector('#memberPhone');
const memberAddress = document.querySelector('#memberAddress');
let isIdChecked = false;
let passwordCheck = false;

// 우편번호 버튼 누르면 우편번호 선택
document.querySelector('#findPostBtn').addEventListener('click', findPostCode);

// 중복 체크 버튼 누르면 중복 체크
document.querySelector('#checkDuplicateId').addEventListener('click', checkDuplicateId);

// 가입 버튼 누르면 가입
document.querySelector('#signUpBtn').addEventListener('click', join);

// 아이디 중복확인 체크를 성공 하고 다시 아이디를 입력하면 중복확인을 다시 해야해서 추가한 코드
memberId.addEventListener('input', function () {
    isIdChecked = false;
    document.querySelector('#idCheckResult').innerHTML = '';
    document.querySelector('#idCheckResult').style.display = 'none';
});

// 전화번호 입력시 자동으로 '-' 추가하려고 추가한 코드
memberPhone.addEventListener('input', function () {
    memberPhone.value = memberPhone.value
        .replace(/[^0-9]/g, '')
        .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
});

// 이메일 입력 값이 이메일 형식에 맞지 않으면 아래에 경고 메세지를 띄우려고 추가한 코드
memberEmail.addEventListener('input', function () {
    memberEmail.value = memberEmail.value.trim();
    const emailRegExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    if (!emailRegExp.test(memberEmail.value) && memberEmail.value !== '') {
        document.querySelector('#emailCheckResult').innerHTML = '이메일 형식이 옳지 않습니다.';
        document.querySelector('#emailCheckResult').style.display = 'block';
        document.querySelector('#emailCheckResult').style.color = 'red';
    } else {
        document.querySelector('#emailCheckResult').innerHTML = '';
    }
});

memberPasswordCheck.addEventListener('input', function () {
    if (memberPassword.value !== memberPasswordCheck.value) {
        passwordCheck = false;
        document.querySelector('#passwordCheckResult').innerHTML = '비밀번호가 일치하지 않습니다.';
        document.querySelector('#passwordCheckResult').style.display = 'block';
        document.querySelector('#passwordCheckResult').style.color = 'red';
        document.querySelector('#memberPasswordCheck').style.border = '1px solid red';
    } else {
        passwordCheck = true;
        document.querySelector('#passwordCheckResult').style.display = 'none';
        document.querySelector('#memberPasswordCheck').style.border = '1px solid #dadada';
    }
});

async function checkDuplicateId() {
    if (memberId.value === '') {
        alert('아이디를 입력해주세요.');
        return;
    }
    const res = await fetch(`/check-duplicate/id/${memberId.value}`);
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

async function join() {
    // 요청하기 전에 입력 다 했는지 확인
    let errorMsg = '';
    if (memberId.value === '') {
        errorMsg += '아이디를 입력해주세요.\n';
    }
    if (!isIdChecked) {
        errorMsg += '아이디 중복확인을 해주세요.\n';
    }
    if (memberPassword.value === '') {
        errorMsg += '비밀번호를 입력해주세요.\n';
    }
    if (memberPasswordCheck.value === '') {
        errorMsg += '비밀번호 확인을 입력해주세요.\n';
    }
    if (!passwordCheck) {
        errorMsg += '비밀번호가 일치하지 않습니다.\n';
    }
    if (memberName.value === '') {
        errorMsg += '이름을 입력해주세요.\n';
    }
    if (memberEmail.value === '') {
        errorMsg += '이메일을 입력해주세요.\n';
    }
    if (memberPhone.value === '') {
        errorMsg += '전화번호를 입력해주세요.\n';
    }
    if (memberAddress.value === '') {
        errorMsg += '주소를 입력해주세요.\n';
    }

    if (errorMsg !== '') {
        alert('아래 내용을 다시 확인해주세요\n\n' + errorMsg);
        return;
    }

    const res = await fetch('/join', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({
            memberId: memberId.value,
            memberPassword: memberPassword.value,
            memberName: memberName.value,
            memberPhone: memberPhone.value,
            memberEmail: memberEmail.value,
            memberAddress: memberAddress.value
        })
    });

    const data = await res.json();
    if (res.ok && data !== 0) {
        alert('회원가입이 완료되었습니다.');
        location.href = '/html/saengbang/login';
    } else {
        alert('회원가입에 실패하였습니다.');
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
            document.querySelector("#memberAddress").value = roadAddr;

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
