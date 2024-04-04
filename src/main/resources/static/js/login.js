
document.querySelector('#loginBtn').addEventListener('click', login);

async function login() {
    if (!document.querySelector('#memberId').value || !document.querySelector('#memberPassword')) {
        alert('아이디와 비밀번호를 입력하세요');
        return;
    }
    const data = {
        "userId": document.querySelector('#memberId').value,
        "userPassword": document.querySelector('#memberPassword').value
    }
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=UTF-8'},
        body: JSON.stringify(data)
    });

    const user = await res.json();
    if (user.jwt) {
        localStorage.setItem('token', user.jwt);
        localStorage.setItem('user', JSON.stringify(user));
        location.href = '/';
    } else {
        alert(user.msg);
    }
}

function enter() {
    if (window.event.keyCode == 13) {
        login();
    }
}