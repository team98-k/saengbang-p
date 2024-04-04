document.querySelector("#refuseBtn").addEventListener("click", function() {
    var divToDisplay = document.querySelector("#refuseReasonForm");
    if(divToDisplay.style.display === "block") {
		divToDisplay.style.display = "none";
	} else {
		divToDisplay.style.display = "block";
	}
});

const urlParams = new URL(location.href).searchParams;
const realtorSignupNum = urlParams.get('signUp');
window.addEventListener('load', async function () {
	const res = await fetch(`/realtor-sign-up/${realtorSignupNum}`);
	const data = await res.json();

	let html = '';
	if (data.realtorSignupStatus !== '확인중') {
		html += '<div class="form-group">';
		html += '    <div class="form-group">';
		html += '        <label>처리 상태</label><br>';
		html += `        <span id="realtorSignupStatus">${data.realtorSignupStatus}</span>`;
		html += '    </div>';
		if (data.realtorSignupStatus === '거부') {
			html += '    <div class="form-group">';
			html += '        <label>거부 사유</label><br>';
			html += `        <span id="realtorRefuseReason">${data.realtorRefuseReason}</span>`;
			html += '    </div>';
		}
		html += '</div>';
		document.querySelector('#signUpForm').innerHTML += html;

		document.querySelector('#approveBtn').remove();
		document.querySelector('#refuseBtn').remove();
	}

	for (const key in data) {
		if (document.querySelector(`#${key}`)) {
			document.querySelector(`#${key}`).innerText = data[key];
		}
	}

	document.querySelector('#realtorImg').src = data.realtorImgPath;
	
	if(document.querySelector('#realtorSignupStatus')) {
		if(document.querySelector('#realtorSignupStatus').innerText === '승인') {
			document.querySelector('#realtorSignupStatus').style.color = 'blue';
			document.querySelector('#realtorSignupStatus').style.fontWeight = 'bold';
		} else if(document.querySelector('#realtorSignupStatus').innerText === '거부') {
			document.querySelector('#realtorSignupStatus').style.color = 'red';
			document.querySelector('#realtorSignupStatus').style.fontWeight = 'bold';
		}
	}
})

async function updateSignUpStatus(status) {
	const res = await fetch('/realtor-sign-up', {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8'
		},
		body: JSON.stringify({
			realtorSignupNum: realtorSignupNum,
			realtorId: document.querySelector('#realtorId').innerText,
			realtorPassword: document.querySelector('#realtorPassword').innerText,
			realtorName: document.querySelector('#realtorName').innerText,
			realtorPhone: document.querySelector('#realtorPhone').innerText,
			realtorOfficeAddress: document.querySelector('#realtorOfficeAddress').innerText,
			realtorOfficeDetailAddress: document.querySelector('#realtorOfficeDetailAddress').innerText,
			realtorOfficeName: document.querySelector('#realtorOfficeName').innerText,
			realtorRegistrationNum: document.querySelector('#realtorRegistrationNum').innerText,
			realtorSignupStatus: status,
			realtorRefuseReason: document.querySelector('#realtorRefuseReason').value,
			realtorImgPath: document.querySelector('#realtorImg').src
		})
	})
	const data = await res.json();
	if (res.ok && data !== 0) {
		alert(`${status}되었습니다.`);
		location.href = '/html/admin/confirm';
	} else {
		alert('요청을 실패하였다.');
	}
}