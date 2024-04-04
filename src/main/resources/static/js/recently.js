const countPerPage = 8;

function goToFavorite() {
    if (localStorage.getItem('token') === null) {
        alert('로그인 후 이용해주세요.');
        location.href = '/html/saengbang/login';
        return;
    }
    location.href = '/html/member/favorite';
}

let currentPage = 1;
function getRecentlyList() {
    if (localStorage.getItem('recentlyList') && JSON.parse(localStorage.getItem('recentlyList')).length > 0) {
        let recentlyList = JSON.parse(localStorage.getItem('recentlyList'));
        recentlyList = recentlyList.reverse();
        const recentlyListCount = recentlyList.length;
        // 페이지 그룹 당 페이지네이션 숫자 버튼 수
        const pageGroupPerPageCount = 5;
        const totalPageCount = Math.ceil(recentlyListCount / countPerPage);
        // 현재 페이지가 몇 번째 페이지네이션 그룹에 있는지
        let pageGroup = Math.ceil(1 / pageGroupPerPageCount);
        let firstPageNum = ((pageGroup - 1) * pageGroupPerPageCount) + 1;
        let lastPageNum = pageGroup * pageGroupPerPageCount;
        if (lastPageNum > totalPageCount) {
            lastPageNum = totalPageCount;
        }
        if (document.querySelector('#recentlyCount')) {
            document.querySelector('#recentlyCount').innerHTML += `총 <b>${recentlyListCount}개</b>의 최근 본 방이 있습니다.`;
        }
        setPageBtn(firstPageNum, lastPageNum, recentlyList);
        setPageData(firstPageNum, recentlyList);

        if(currentPage === 1) {
            document.querySelector('.previous-btn').classList.add('previous-btn-disabled');
        }
        if(currentPage === totalPageCount) {
            document.querySelector('.next-btn').classList.add('next-btn-disabled');
        }

        document.querySelector('.previous-btn').addEventListener('click', function () {
			if(currentPage === 1 && currentPage === totalPageCount) {
                document.querySelector('.previous-btn').classList.add('previous-btn-disabled');
                document.querySelector('.next-btn').classList.add('next-btn-disabled');				
                return;
			}
            if(currentPage === 1) {
                document.querySelector('.previous-btn').classList.add('previous-btn-disabled');
                document.querySelector('.next-btn').classList.remove('next-btn-disabled');
                return;
            }
            currentPage--;
            if(currentPage !== totalPageCount) {
                document.querySelector('.next-btn').classList.remove('next-btn-disabled');
            }
            if (currentPage === 1) {
                document.querySelector('.previous-btn').classList.add('previous-btn-disabled');
            } else {
                document.querySelector('.previous-btn').classList.remove('previous-btn-disabled');
            }

            lastPageNum = pageGroup * pageGroupPerPageCount;
            if (lastPageNum > totalPageCount) {
                lastPageNum = totalPageCount;
            }
            if(currentPage < firstPageNum) {
                pageGroup--;
                firstPageNum = ((pageGroup - 1) * pageGroupPerPageCount) + 1;
                lastPageNum = pageGroup * pageGroupPerPageCount;
                if (lastPageNum > totalPageCount) {
                    lastPageNum = totalPageCount;
                }
                setPageBtn(firstPageNum, lastPageNum, recentlyList);
                setPageData(firstPageNum, recentlyList);
                return;
            }
            firstPageNum = ((pageGroup - 1) * pageGroupPerPageCount) + 1;
            setPageBtn(firstPageNum, lastPageNum, recentlyList);
            setPageData(currentPage, recentlyList);
        });

        document.querySelector('.next-btn').addEventListener('click', function () {
			if(currentPage === 1 && currentPage === totalPageCount) {
                document.querySelector('.previous-btn').classList.add('previous-btn-disabled');
                document.querySelector('.next-btn').classList.add('next-btn-disabled');				
                return;
			}
            if(currentPage === totalPageCount) {
                document.querySelector('.previous-btn').classList.remove('previous-btn-disabled');
                document.querySelector('.next-btn').classList.add('next-btn-disabled');
                return;
            }
            currentPage++;
            if(currentPage !== 1) {
                document.querySelector('.previous-btn').classList.remove('previous-btn-disabled');
            }
            if(currentPage === totalPageCount) {
                document.querySelector('.next-btn').classList.add('next-btn-disabled');
            } else {
                document.querySelector('.next-btn').classList.remove('next-btn-disabled');
            }

            lastPageNum = pageGroup * pageGroupPerPageCount;
            if (lastPageNum > totalPageCount) {
                lastPageNum = totalPageCount;
            }
            if(currentPage > lastPageNum) {
                pageGroup++;
                firstPageNum = ((pageGroup - 1) * pageGroupPerPageCount) + 1;
                lastPageNum = pageGroup * pageGroupPerPageCount;
                if (lastPageNum > totalPageCount) {
                    lastPageNum = totalPageCount;
                }
                setPageBtn(firstPageNum, lastPageNum, recentlyList);
                setPageData(firstPageNum, recentlyList);
                return;
            }
            firstPageNum = ((pageGroup - 1) * pageGroupPerPageCount) + 1;
            setPageBtn(firstPageNum, lastPageNum, recentlyList);
            setPageData(currentPage, recentlyList);
        });
    }
}

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

// 페이지네이션 버튼 생성
function setPageBtn(firstPageNum, lastPageNum, recentlyList) {
    if (document.querySelector('.page-num-btn-container')) {
        let html = '';
        for (let i = firstPageNum; i <= lastPageNum; i++) {
            if(i === currentPage){
                html += `<span class="page-num-btn page-num-btn-selected">${i}</span>`;
            } else {
                html += `<span class="page-num-btn">${i}</span>`;
            }
            document.querySelector('.page-num-btn-container').innerHTML = html;
        }
        document.querySelectorAll('.page-num-btn').forEach(function (btn) {
            if(btn.textContent === currentPage) {
                btn.classList.add('page-num-btn-selected');
            }
            btn.addEventListener('click', function () {
                document.querySelectorAll('.page-num-btn').forEach(function (resetBtn) {
                    if (resetBtn.textContent === btn.textContent) {
                        return;
                    }
                    resetBtn.classList.remove('page-num-btn-selected');
                });
                currentPage = parseInt(btn.textContent);
                btn.classList.add('page-num-btn-selected');
                if(currentPage === 1 && currentPage === Math.ceil(recentlyList.length / countPerPage)) {
                    document.querySelector('.previous-btn').classList.add('previous-btn-disabled');
                    document.querySelector('.next-btn').classList.add('next-btn-disabled');					
				} else if(currentPage == 1) {
                    document.querySelector('.previous-btn').classList.add('previous-btn-disabled');
                    document.querySelector('.next-btn').classList.remove('next-btn-disabled');
                } else if(currentPage == Math.ceil(recentlyList.length / countPerPage)) {
                    document.querySelector('.previous-btn').classList.remove('previous-btn-disabled'); 
                    document.querySelector('.next-btn').classList.add('next-btn-disabled');
                } else {
                    document.querySelector('.previous-btn').classList.remove('previous-btn-disabled');
                    document.querySelector('.next-btn').classList.remove('next-btn-disabled');
                }
                setPageData(btn.textContent, recentlyList);
            });
        });
    }
}

// 페이지네이션 클릭하면 거기에 맞는 데이터 출력
async function setPageData(pageNum, recentlyList) {
    const recentlyListUl = document.querySelector('#list-type');
    recentlyListUl.innerHTML = '';
    let html = '';
    const recentlyListRoomNums = [];
    const alreadyRegisteredRoomNums = [];

    for(let i = countPerPage * (pageNum - 1) + 1; i < countPerPage * (pageNum - 1) + countPerPage; i++) {
        if(localStorage.getItem('token')) {
			if(recentlyList[i-1]) {
	            recentlyListRoomNums.push(recentlyList[i - 1].roomNum);				
			} else {
				break;
			}
        }
    }

    if(localStorage.getItem('token') && localStorage.getItem('user')) {
        const res = await fetch(`/favorite/is-already-registered?recentlyViewedRoomNumList=${recentlyListRoomNums}`);
        const data = await res.json();
        console.log('data', data);
        data.forEach(function (roomNum) {
            alreadyRegisteredRoomNums.push(roomNum);
        });
        console.log('alreadyRegisteredRoomNums', alreadyRegisteredRoomNums);
        // isAlreadyRegistered = await res.json();	//1이면 이미 등록된거고 0이면 등록 안된거임
    }

    for (let i = countPerPage * (pageNum - 1) + 1; i < countPerPage * (pageNum - 1) + countPerPage; i++) {
		
		if(recentlyList[i-1]) {
	        let price = exchangeToHundredMillionOrNot(recentlyList[i - 1].roomPrice);
	        let deposit = exchangeToHundredMillionOrNot(recentlyList[i - 1].roomDeposit);
	        if(!recentlyList[i - 1].roomBedsNum){
	            localStorage.removeItem('recentlyList');
	        }
	        if (recentlyList[i - 1].roomStatus === '판매중') {
	            html = `<div class="col-sm-6 col-md-3 p0">`;
	            html += `    <div class="box-two proerty-item">`;
	            html += `        <div class="item-thumb">`;
	            html += `            <a href="/html/saengbang/detail?roomNum=${recentlyList[i - 1].roomNum}"><img src="${recentlyList[i - 1].roomImgPath}"></a>`;
	            html += `        </div>`;
	        } else {
	            html = `<div class="col-sm-6 col-md-3 p0" style="opacity:0.5">`;
	            html += `    <div class="box-two proerty-item">`;
	            html += `        <div class="item-thumb">`;
	            html += `            <h1 class="image_text" style="font-size:30px">거래 완료</h1>`;
	            html += `            <img src="${recentlyList[i - 1].roomImgPath}" style="filter: grayscale(100%)">`;
	            html += `        </div>`;
	        }
	        if (alreadyRegisteredRoomNums.includes(recentlyList[i - 1].roomNum)) {
	            html += `        <input type="checkbox" class="like" id="like${i}" data-rnum="${recentlyList[i - 1].roomNum}" checked>`;
	        } else {
	            html += `        <input type="checkbox" class="like" id="like${i}" data-rnum="${recentlyList[i - 1].roomNum}">`;
	        }
	        html += `            <label for="like${i}"></label>`;
	        html += `            <div class="item-entry overflow" style="cursor:pointer;" onclick="location.href='/html/saengbang/detail?roomNum=${recentlyList[i - 1].roomNum}'">`;
	        html += `                <h5>${recentlyList[i - 1].roomType}</h5>`;
	        html += `                <div class="dot-hr"></div>`;
	        html += `                   <span class="text-wrap">방 ${recentlyList[i - 1].roomBedsNum}개, 욕실 ${recentlyList[i - 1].roomBathNum}개</span>`;
	        if (recentlyList[i - 1].roomTradeType === '전세') {
	            html += `                <span class="text-wrap">${recentlyList[i - 1].roomTradeType} ${price}</span>`;
	        } else if (recentlyList[i - 1].roomTradeType === '월세') {
	            html += `                <span class="text-wrap">${recentlyList[i - 1].roomTradeType} ${price} / ${deposit}</span>`;
	        } else if (recentlyList[i - 1].roomTradeType === '매매') {
	            html += `                <span class="text-wrap">${recentlyList[i - 1].roomTradeType} ${price}</span>`;
	        }
	        html += `                    <span class="text-wrap">${recentlyList[i - 1].roomRoadAddress}</span>`;
	        html += `                    <span class="text-wrap">${recentlyList[i - 1].roomDetailTitle}</span>`;
	        html += `            </div>`;
	        html += `        </div>`;
	        html += `</div>`;
	        recentlyListUl.innerHTML += html;
		} else {
			break;
		}
        
    }

    const likes = document.querySelectorAll(".like");

    likes.forEach(function (checkbox) {
        checkbox.addEventListener("change", async function () {
            if (localStorage.getItem('token') === null) {
                alert('로그인 후 이용해주세요.');
                location.href = '/html/saengbang/login';
                checkbox.checked = false;
                return;
            }
            if (checkbox.checked === true) {
                if (confirm('관심목록에 추가하시겠습니까?')) {
                    const res = await fetch('/favorite', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify({
                            roomNum: checkbox.dataset.rnum
                        })
                    });
                    if (res.ok) {
                        alert('관심목록에 추가되었습니다.');
                    } else {
                        alert('관심목록 추가 실패');
                        checkbox.checked = false;
                    }
                } else {
                    checkbox.checked = false;
                }
            } else {
                if (confirm('관심목록에서 삭제하시겠습니까?')) {
                    // 얘도 토큰 만료 시간 지났는지 확인 하고 해야될 것 같은데 일단 급하니까
                    const res = await fetch(`/favorite`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify({
                            roomNum: checkbox.dataset.rnum
                        })
                    });
                    if (res.ok) {
                        alert('관심목록에서 삭제되었습니다.');
                    }
                } else {
                    checkbox.checked = true;
                }
            }
        })
    })
}

window.addEventListener('load', getRecentlyList);