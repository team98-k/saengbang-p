const pageSize = 10;
const blockSize = 5;

function truncateText(text, maxWidth) {
    if (text.length > maxWidth) {
        return text.slice(0, maxWidth) + '...';
    }
    return text;
}

function getQuestionMaxWidth() {
    const questionElement = document.querySelector('.question');
    return questionElement.offsetWidth / 14;
}

function changeOption(target) {
    document.querySelector('[data-id=searchInput]').id = target.value;
}

async function getNoticeList(evt, page) {
    if (!page) {
        page = 1;
    }
    changeOption(document.querySelector('#search'));

    let url = `/notice?currentPage=${page}&pageSize=${pageSize}`;
    if (document.querySelector('#noticeTitle')) {
        if (document.querySelector('#noticeTitle').value) {
            url += `&noticeTitle=${document.querySelector('#noticeTitle').value}`;
        }
    }
    if (document.querySelector('#noticeDetail')) {
        if (document.querySelector('#noticeDetail').value) {
            url += `&noticeDetail=${document.querySelector('#noticeDetail').value}`;
        }
    }
    const res = await fetch(url);
    const noticeList = await res.json();

    let html = '';

    for (const notice of noticeList.list) {
        html += '<div class="QnASet">';
        html += '   <div class="que" style="display: inline-flex;">';
        html += '       <div class="question">';
        html += `           <span style="max-width: 70%;">${truncateText(notice.noticeTitle, getQuestionMaxWidth())}</span>`;
        html += '       </div>';
        html += '       <div class="date">';
        html += `           <span class="writter">${notice.noticeCredat}</span>`;
        html += '       </div>';
        html += '   </div>';
        html += '   <div class="naeyong">';
        html += '       <div class="answer">';
        html += `           <span>${notice.noticeDetail}</span>`;
        html += '       </div>';
        if(localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).user.authorities[0].authority === 'ROLE_ADMIN') {
            html += '		<div class="edit">';
            html += `			<button id="edit" onclick="location.href='/html/admin/update-notice?noticeNum=${notice.noticeNum}'">수정</button>`;
            html += '		</div>';
        }
        html += '   </div>';
        html += '</div>';
    }

    if(localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).user.authorities[0].authority === 'ROLE_ADMIN'){
        html += `<button class="add-notice" onclick="location.href='/html/admin/add-notice'">게시글 작성</button>`;
    }

    document.querySelector('#noticeList').innerHTML = html;

    const totalCount = noticeList.total;
    const pageBlock = Math.ceil(totalCount / pageSize);
    const startBlock = Math.ceil((page / blockSize) - 1) * blockSize + 1;
    let endBlock = startBlock + blockSize - 1;
    let pageHtml = '';
    if (endBlock > pageBlock) {
        endBlock = pageBlock;
    }
    pageHtml += '<div class="pagination" style="text-align: center; display: block">';
    pageHtml += '	<ul>';
    if(noticeList.isFirstPage) {
        pageHtml += '<span class="previous-btn-disabled">이전</span>';
    } else {
        pageHtml += '<span class="previous-btn">이전</span>';
    }
    for (let i = startBlock; i <= endBlock; i++) {
        pageHtml += `<li class="page-num-btn-container">`;
        pageHtml += `	<span class="page-num-btn" data-pnum="${i}">${i}</span>`;
        pageHtml += `</li>`;
    }
    if(noticeList.isLastPage) {
        pageHtml += '<span class="next-btn-disabled">다음</span>';
    } else {
        pageHtml += '<span class="next-btn">다음</span>';
    }
    pageHtml += '	</ul>';
    pageHtml += '</div>';

    document.querySelector('#noticeList').innerHTML += pageHtml;

    const preButton = document.querySelector('.previous-btn');
    const nextButton = document.querySelector('.next-btn');

    if(preButton) {
        preButton.addEventListener('click', function(){
            if(noticeList.isFirstPage) {
                return;
            }
            getNoticeList(event, noticeList.prePage);
        })
    }

    if(nextButton) {
        nextButton.addEventListener('click', function(){
            if(noticeList.isLastPage) {
                return;
            }
            getNoticeList(event, noticeList.nextPage);
        })
    }

    document.querySelectorAll('.page-num-btn').forEach(function(btn){
        btn.addEventListener('click', function(){
            getNoticeList(event, parseInt(btn.dataset.pnum));
        });
        if(btn.dataset.pnum === `${noticeList.pageNum}`) {
            btn.classList.add('page-num-btn-selected');
        }
    });

    $(".que").click(function() {
        $(this).next(".naeyong").stop().slideToggle(300);
        $(this).toggleClass('on').siblings().removeClass('on');
        $(this).next(".naeyong").siblings(".naeyong").slideUp(300); // 1개씩 펼치기
    });
}

function enter() {
    if (window.event.keyCode == 13) {
        getNoticeList();
    }
}

window.addEventListener('load', getNoticeList);