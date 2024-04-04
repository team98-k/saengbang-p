const pageSize = 8;

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

function goToRecently() {
	location.href = '/html/saengbang/recently';
}

let page = 1;
async function getFavoriteList(evt, page) {
	if(!page) {
		page = 1;
	} else {
		page = page;
	}
	const res = await fetch(`/favorite?currentPage=${page}&pageSize=${pageSize}`);
	const favoriteList = await res.json();
	setPageBtn(favoriteList);
	setPageData(favoriteList.list);
	
	document.querySelector('#favoriteCount').innerHTML = `총 <b>${favoriteList.total}개</b>의 관심매물이 있습니다.`;
}

// 페이지네이션 버튼 생성
function setPageBtn(data) {
	// 페이지 그룹 당 페이지 수
	const blockSize = 5;
	// 총 페이지 수
	const pageBlock = data.pages;
	const startBlock = Math.ceil((page / blockSize) - 1) * blockSize + 1;
	let endBlock = startBlock + blockSize - 1;

	if (endBlock > pageBlock) {
		endBlock = pageBlock;
	}

	let html = '';
	
	if(data.isFirstPage) {
		html += '<span class="previous-btn-disabled">이전</span>';
	} else {
		html += '<span class="previous-btn">이전</span>';
	}
	for (let i = startBlock; i <= endBlock; i++) {
		html += `<li class="page-num-btn-container">`;
		html += `	<span class="page-num-btn" data-pnum="${i}">${i}</span>`;
		html += `</li>`;
	}
	if(data.isLastPage) {
		html += '<span class="next-btn-disabled">다음</span>';
	} else {
		html += '<span class="next-btn">다음</span>';
	}
	
	document.querySelector('.pagination ul').innerHTML = html;

	const preButton = document.querySelector('.previous-btn');
	const nextButton = document.querySelector('.next-btn');

	if(preButton) {
		preButton.addEventListener('click', function(){
			if(data.isFirstPage) {
				return;
			}
			page--;
			getFavoriteList(event, data.prePage);
		})
	}

	if(nextButton) {
		nextButton.addEventListener('click', function(){
			if(data.isLastPage) {
				return;
			}
			page++;
			getFavoriteList(event, data.nextPage);
		})
	}

	document.querySelectorAll('.page-num-btn').forEach(function (btn) {
		btn.addEventListener('click', function(){
			page = parseInt(btn.dataset.pnum);
			getFavoriteList(event, page);
		});
		if(btn.dataset.pnum === `${data.pageNum}`){
			btn.classList.add('page-num-btn-selected');
		}
	});
}


// 페이지네이션 클릭하면 거기에 맞는 데이터 출력
function setPageData(data) {
	const favoriteListUl = document.querySelector('#list-type');
	favoriteListUl.innerHTML = '';
	let html = '';
	if (data.length === 0) {
		html += '<div class="text-center mb-0 h1 display-2">관심 매물이 없습니다.</div>';
		favoriteListUl.innerHTML = html;
		return
	}
	for (let i = 1; i <= data.length; i++) {
		let price = exchangeToHundredMillionOrNot(data[i - 1].roomPrice);
		let deposit = exchangeToHundredMillionOrNot(data[i - 1].roomDeposit);
		if (data[i - 1].roomStatus === '판매중') {
			html = `<div class="col-sm-6 col-md-3 p0">`;
			html += `    <div class="box-two proerty-item">`;
			html += `        <div class="item-thumb">`;
			html += `            <a href="/html/saengbang/detail?roomNum=${data[i - 1].roomNum}"><img src="${data[i - 1].roomImgPath}"></a>`;
			html += `        </div>`;
		} else {
			html = `    <div class="col-sm-6 col-md-3 p0" style="opacity:0.5">`;
			html += `    <div class="box-two proerty-item">`;
			html += `        <div class="item-thumb">`;
			html += `            <h1 class="image_text" style="font-size:30px">거래 완료</h1>`;
			html += `            <img src="${data[i - 1].roomImgPath}" style="filter: grayscale(100%)">`;
			html += `        </div>`;
		}
		if (data[i - 1].isAlreadyRegistered === 1) {
			html += `            <input type="checkbox" class="like" id="like${i}" data-rnum="${data[i - 1].roomNum}">`;
		} else {
			html += `            <input type="checkbox" class="like" id="like${i}" data-rnum="${data[i - 1].roomNum}" checked>`;
		}
		html += `            <label for="like${i}"></label>`;
		html += `        <div class="item-entry overflow" style="cursor: pointer;" onclick="location.href='/html/saengbang/detail?roomNum=${data[i - 1].roomNum}'">`;
		html += `            <h5>${data[i - 1].roomType}</h5>`;
		html += `            <div class="dot-hr"></div>`;
		html += `                   <span class="text-wrap">방 ${data[i-1].roomBedsNum}개, 욕실 ${data[i-1].roomBathNum}개</span>`;
		if (data[i-1].roomTradeType === '전세') {
			html += `                <span class="text-wrap">${data[i-1].roomTradeType} ${price}</span>`;
		} else if (data[i-1].roomTradeType === '월세') {
			html += `                <span class="text-wrap">${data[i-1].roomTradeType} ${price} / ${deposit}</span>`;
		} else if (data[i-1].roomTradeType === '매매') {
			html += `                <span class="text-wrap">${data[i-1].roomTradeType} ${price}</span>`;
		}

		html += `                <span class="text-wrap">${data[i-1].roomRoadAddress}</span>`;
		html += `                <span class="text-wrap">${data[i-1].roomDetailTitle}</span>`;
		html += `    </div>`;
		html += `</div>`;
		favoriteListUl.innerHTML += html;
	}

	const likes = document.querySelectorAll(".like");

	likes.forEach(function (checkbox) {
		checkbox.addEventListener("click", async function () {
			if (checkbox.checked === false) {
				if (confirm('관심목록에서 삭제하시겠습니까?')) {
					// 토큰 만료 시간 지났는지 확인 하고 해야될 것 같은데
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
						getFavoriteList(event, page);
					}
				} else {
					checkbox.checked = true;
				}
			}
		})
	});
}

window.addEventListener("load", getFavoriteList);