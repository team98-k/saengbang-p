const pageSize = 8;
const blockSize = 5;

async function roomTradeComplete(roomNum) {
    const checkRealComplete = confirm('해당 매물의 거래를 완료합니다.');
    if (checkRealComplete) {
        const res = await fetch(`/rooms/${roomNum}`, {
            method: 'PATCH'
        });
        const data = await res.json();

        if (data === 1) {
            alert('거래 완료 처리되었습니다.');
            location.reload();
        }
    }
}

async function getRealtorRoomList(evt, page) {
    if (!page) {
        page = 1;
    }
    const res = await fetch(`/rooms/realtor/${new URL(location.href).searchParams.get('realtorNum')}?currentPage=${page}&pageSize=${pageSize}`);
    const realtorRoomData = await res.json();

    let html = '';

    for (const realtorRoom of realtorRoomData.list) {
        let price = '';
        if (realtorRoom.roomPrice > 9999) {
            if (realtorRoom.roomPrice % 10000 === 0) {
                price = `${Math.floor(realtorRoom.roomPrice / 10000)}억`;
            } else {
                price = `${Math.floor(realtorRoom.roomPrice / 10000)}억 ${realtorRoom.roomPrice % 10000}`;
            }
        } else {
            price = `${realtorRoom.roomPrice}`;
        }
        let deposit = '';
        if (realtorRoom.roomDeposit > 9999) {
            if (realtorRoom.roomDeposit % 10000 === 0) {
                deposit = `${Math.floor(realtorRoom.roomDeposit / 10000)}억`;
            } else {
                deposit = `${Math.floor(realtorRoom.roomDeposit / 10000)}억 ${realtorRoom.roomDeposit % 10000}`;
            }
        } else {
            deposit = `${realtorRoom.roomDeposit}`;
        }

        if(realtorRoom.roomStatus === '판매중'){
            html += `<div class="col-sm-6 col-md-3 p0">`;
            html += `<div class="box-two proerty-item">`;
        }else{
            html += `<div class="col-sm-6 col-md-3 p0" style="opacity:0.5">`;
            html += `<div class="box-two proerty-item" style="opacity:0.5">`;
        }
        html += `		<div class="infos" onclick="location.href='/html/saengbang/detail?roomNum=${realtorRoom.roomNum}'">`;
        html += '			<div class="item-thumb">';
        if(realtorRoom.roomStatus === '판매중'){
            html += `				<img src="${realtorRoom.roomImgPath}" style="width: 100%; height: 100%;">`;
        }else{
            html += '				<h1 class="image_text" style="font-size:30px">거래 완료</h1>'
            html += `				<img src="${realtorRoom.roomImgPath}" style="width: 100%; height: 100%; filter: grayscale(100%);">`;
        }
        html += '			</div>';
        html += '			<div class="item-entry overflow">';
        html += `					<h5>${realtorRoom.roomType}</h5> <div class="dot-hr"></div> <span>방 ${realtorRoom.roomBedsNum}개</sapn>, <span>욕실 ${realtorRoom.roomBathNum}개</span><br/>`;
        if(realtorRoom.roomTradeType === '전세' || realtorRoom.roomTradeType === '매매') {
            html += `				<span>${realtorRoom.roomTradeType} ${price}</span><br/>`;					
        } else if(realtorRoom.roomTradeType === '월세') {
            html += `				<span>${realtorRoom.roomTradeType} ${deposit}/${price}</span><br>`;					
        }
        html += `					<span style= " display: block; overflow:hidden; text-overflow:ellipsis; white-space: nowrap; >${realtorRoom.roomRoadAddress}</span><br>`;
        html += `					<span style= " display: block; overflow:hidden; text-overflow:ellipsis; white-space: nowrap; >${realtorRoom.roomDetailTitle}</span>`;
        html += '			</div>';
        html += '		</div>';
        html += '		</div>';
        html += `	</a>`;
        html += '</div>';    
        }
    document.querySelector('#list-type').innerHTML = html;

    const totalCount = realtorRoomData.total;
    const pageBlock = Math.ceil(totalCount / pageSize);
    const startBlock = Math.ceil((page / blockSize) - 1) * blockSize + 1;
    let endBlock = startBlock + blockSize - 1;
    let pageHtml = '';

    if (endBlock > pageBlock) {
        endBlock = pageBlock;
    }
    if (realtorRoomData.hasPreviousPage) {
        pageHtml += `<a href="javascript:void(0)" onclick="getRealtorRoomList(event, ${realtorRoomData.pageNum - 1})">◀</a>`
    }
    for (let i = startBlock; i <= endBlock; i++) {
        pageHtml += `<a href="javascript:void(0)" onclick="getRealtorRoomList(event, ${i})" id="pageNum">${i}</a>`;
    }
    if (realtorRoomData.hasNextPage) {
        pageHtml += `<a href="javascript:void(0)" onclick="getRealtorRoomList(event, ${realtorRoomData.pageNum + 1})">▶</a>`;
    }
    document.querySelector('#page').innerHTML = pageHtml;
    document.querySelectorAll('#pageNum').forEach(function (btn) {
        if (btn.textContent == `[ ${realtorRoomData.pageNum} ]`) {
            btn.style.color = 'red';
        }
    });
}

async function getRealtorInfo() {
    const res = await fetch(`/realtor/${new URL(location.href).searchParams.get('realtorNum')}`);
    const realtorInfoData = await res.json();
    for (const realtorInfoKey in realtorInfoData) {
        if (document.querySelector(`#${realtorInfoKey}`)) {
            document.querySelector(`#${realtorInfoKey}`).innerHTML = realtorInfoData[realtorInfoKey];
        }
    }
    document.querySelector('#realtorOfficeAddress').innerHTML += ` ${realtorInfoData.realtorOfficeDetailAddress}`;

    document.querySelector('#realtorImgView').src = realtorInfoData.realtorImgPath;
}

function loadRealtorInfo() {
    getRealtorInfo();
    getRealtorRoomList();
}

window.addEventListener('load', loadRealtorInfo)