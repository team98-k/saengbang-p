let mapContainer;
let mapOption;
let map;
let clusterer;
let mapRoomList = [];

// 마커를 담을 배열입니다
let markers = [];
// 장소 검색 객체를 생성합니다
let ps = new kakao.maps.services.Places();
// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
let infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

let place = new URL(location.href).searchParams.get('place');

// 아파트 체크박스와 각 방 유형 체크박스에 대한 변수 설정
let roomTypeCheckboxes = document.querySelectorAll(".roomType input[type='checkbox']");
let saleTypeCheckboxes = document.querySelectorAll('.saleType input[type="checkbox"]');
let mRoomTypeCheckboxes = document.querySelectorAll('.room-type input[type="checkbox"]');
let mSaleTypeCheckboxes = document.querySelectorAll('.sale-type input[type="checkbox"]');
let rButton = document.querySelector("#rType");
let sButton = document.querySelector("#sType");

// 필터 체크 되어 있는거 배열로 만든거 (초기값은 다 체크되어 있어서 [원룸, 투룸, ..., 아파트] 이렇게 5개임)
let selectedRoomValues = Array.from(roomTypeCheckboxes)
	.filter(function(checkbox) {
		return checkbox.checked;
	})
	.map(function(checkbox) {
		return checkbox.value;
	});

// 필터 체크 되어 있는거 배열로 만든거 (초기값은 다 체크되어 있어서 [전세, 월세, 매매] 이렇게 3개임)
let selectedSaleValues = Array.from(saleTypeCheckboxes)
	.filter(function(checkbox) {
		return checkbox.checked;
	})
	.map(function(checkbox) {
		return checkbox.value;
	});

function setKakaoMap(latitude, longitude) {
	mapContainer = document.querySelector('#kMap') // 지도를 표시할 div
		
	if (mapOption === undefined) {
		mapOption = {
			center: new kakao.maps.LatLng(latitude, longitude), // 지도의 중심좌표
			level: 4 // 지도의 확대 레벨
		};
	};

	map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

	if (place) {
		document.querySelector('#keyword').value = place;
		document.querySelector('#mapSearchBar').value = place;
		
		// 키워드로 장소를 검색합니다
		ps.keywordSearch(place, function(data, status) {
			if (status === kakao.maps.services.Status.OK) {
				var bounds = new kakao.maps.LatLngBounds();

				for (var i = 0; i < data.length; i++) {
					bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
				}

				// 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
				map.setBounds(bounds);
				map.setLevel(4);
			}
		});
		
		searchPlaces(place);
	}

	// 마커 클러스터러를 생성합니다 
	clusterer = new kakao.maps.MarkerClusterer({
		map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
		averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
		minLevel: 0 // 클러스터 할 최소 지도 레벨 
	});

	getMapRoomList();

	// 지도 시점 변화 완료 이벤트를 등록한다
	kakao.maps.event.addListener(map, 'idle', getMapRoomList);
}


async function getLocation(){
	if(window.flutter_inappwebview.callHandler) {
		window.flutter_inappwebview.callHandler('getLocation')
		.then(location=>{
			setKakaoMap(location.lat, location.lon);
		})		
	} else {
		window.flutter_inappwebview._callHandler('getLocation')
		.then(location=>{
			setKakaoMap(location.lat, location.lon);
		})
	}
}

// 현재 위치를 가져와서 지도에 표시하는 함수
if(window.flutter_inappwebview){
	window.addEventListener("flutterInAppWebViewPlatformReady", function(event) {
		getLocation();
	});
}else if(navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(
		// 위치 사용이 허용되었을 경우
		async (position) => {
			setKakaoMap(position.coords.latitude, position.coords.longitude);
		},
		// 위치 사용이 거부되었을 경우
		(error) => {
			if(error.code == error.PERMISSION_DENIED) {
				setKakaoMap(37.566826, 126.9786567);
			}
		}
	);
} else {
	setKakaoMap(37.566826, 126.9786567);
}

let mapPlacesList = document.querySelector('#mapPlacesList');

function enter() {
	var mapSearchBar = document.querySelector('#mapSearchBar');
	if (mapSearchBar) {
		// 키워드로 장소를 검색합니다
		searchMapPlaces(mapSearchBar.value);

		showMapPlacesList();
	}
}


function selectAddress(latitude, longitude) {
	hideMapPlacesList();
	map.setCenter(new kakao.maps.LatLng(latitude, longitude));
	map.setLevel(4);
}

// 키워드 검색을 요청하는 함수입니다
function searchMapPlaces(mapSearchBar) {

	// if (!mainSearchBar.replace(/^\s+|\s+$/g, '')) {
	//     alert('키워드를 입력해주세요!');
	//     return false;
	// }

	// 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
	ps.keywordSearch(mapSearchBar, mapPlacesSearchCB);
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function mapPlacesSearchCB(places, status, pagination) {
	if (status === kakao.maps.services.Status.OK) {
		let html = '',
			bounds = new kakao.maps.LatLngBounds();
		for (let i = 0; i < places.length; i++) {

			var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x);
			bounds.extend(placePosition);
			html += `<li class="list-group-item list-group-item-action" onclick="selectAddress('${places[i].y}', '${places[i].x}')">`
			html += `<p style="margin: 0;padding: 0 1rem">주소 : ${places[i].address_name}</p>`;
			// html += '<p>카테고리 : ' + data[i].category_group_name + '</p>';
			html += '<p style="margin: 0;padding: 0 1rem">장소 이름 : ' + places[i].place_name + '</p>'
			html += '</li>';
		}
		document.querySelector('#mapPlacesList').innerHTML = html;
		displayPagination(pagination);

	} else if (status === kakao.maps.services.Status.ZERO_RESULT) {
		alert('검색 결과가 존재하지 않습니다.');
		return;
	} else if (status === kakao.maps.services.Status.ERROR) {
		alert('검색 결과 중 오류가 발생했습니다.');
		return;
	}
}

// mapPlacesList를 표시하는 함수 (display: block)
function showMapPlacesList() {
	if (mapPlacesList) {
		mapPlacesList.style.display = 'block';
	}
}

// mapPlacesList를 숨기는 함수 (display: none)
function hideMapPlacesList() {
	if (mapPlacesList) {
		mapPlacesList.style.display = 'none';
	}
}

async function searchAddress() {
	const searchValue = document.querySelector('#keyword').value;
	if (!searchValue.replace(/^\s+|\s+$/g, '')) {
		return false;
	}
	const response = await fetch('/kakao');
	const kakaoData = await response.json();
	const res = await fetch(`https://dapi.kakao.com/v2/local/search/address.json?analyze_type=similar&page=1&size=30&query=${searchValue}`, {
		headers: {
			'Authorization': `KakaoAK ${kakaoData}`
		}
	});
	const data = await res.json();

	displayPlaces(data.documents);
}
// // 키워드로 장소를 검색합니다
// searchPlaces();

// 키워드 검색을 요청하는 함수입니다
function searchPlaces(keyword) {

	var keyword = document.querySelector('#keyword').value;
	if (!keyword.replace(/^\s+|\s+$/g, '')) {
		alert('검색할 주소를 입력하세요');
		return false;
	}

	// 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
	ps.keywordSearch(keyword, placesSearchCB);
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
	if (status === kakao.maps.services.Status.OK) {
		displayPlaces(data, pagination);
		// 페이지 번호를 표출합니다
		displayPagination(pagination);
	} else if (status === kakao.maps.services.Status.ZERO_RESULT) {
		alert('검색 결과가 존재하지 않습니다.');
		return;
	} else if (status === kakao.maps.services.Status.ERROR) {
		alert('검색 결과 중 오류가 발생했습니다.');
		return;
	}
}

// 검색 결과 목록과 마커를 표출하는 함수입니다
function displayPlaces(places, pagination) {
	var listEl = document.querySelector('#placesList'),
		menuEl = document.querySelector('#menu_wrap'),
		fragment = document.createDocumentFragment(),
		bounds = new kakao.maps.LatLngBounds(),
		listStr = '';

	// 검색 결과 목록에 추가된 항목들을 제거합니다
	removeAllChildNods(listEl);

	// 지도에 표시되고 있는 마커를 제거합니다
	removeMarker();
	let html = '';
	html += `<span class='title'>검색결과 수 : ${pagination.totalCount}개</span>`;
	listEl.innerHTML = html;
	for (let i = 0; i < places.length; i++) {
		// 마커를 생성하고 지도에 표시합니다
		var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x);
		// marker = addMarker(placePosition, i);
		let itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다
		bounds.extend(placePosition);
		fragment.appendChild(itemEl);
	}

	// 검색결과 항목들을 검색결과 목록 Element에 추가합니다
	listEl.appendChild(fragment);
	menuEl.scrollTop = 0;
}

// 검색결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, places) {

	var el = document.createElement('li');
	let itemStr = '';
	itemStr += `<div class="info" onclick="selectAddress('${places.y}', '${places.x}')">`;
	itemStr += '    <h5>' + places.place_name + '</h5>';
	if (places.road_address_name) {
		itemStr += '    <span>' + places.road_address_name + '</span>';
		itemStr += '    <span class="jibun gray">' + places.address_name + '</span>';
	} else {
		itemStr += '    <span>' + places.address_name + '</span>';
	}
	itemStr += '</div>';

	el.innerHTML = itemStr;
	el.className = 'item';

	return el;
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(position, idx, title) {
	var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
		imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
		imgOptions = {
			spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
			spriteOrigin: new kakao.maps.Point(0, (idx * 46) + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
			offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
		},
		markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
	marker = new kakao.maps.Marker({
		position: position, // 마커의 위치
		image: markerImage
	});

	marker.setMap(map); // 지도 위에 마커를 표출합니다
	markers.push(marker);  // 배열에 생성된 마커를 추가합니다

	return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
}

// 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
function displayPagination(pagination) {
	var paginationEl = document.querySelector('#pagination'),
		fragment = document.createDocumentFragment(),
		i;

	// 기존에 추가된 페이지번호를 삭제합니다
	while (paginationEl.hasChildNodes()) {
		paginationEl.removeChild(paginationEl.lastChild);
	}

	for (i = 1; i <= pagination.last; i++) {
		var el = document.createElement('a');
		el.href = "#";
		el.innerHTML = i;

		if (i === pagination.current) {
			el.className = 'on';
		} else {
			el.onclick = (function(i) {
				return function() {
					pagination.gotoPage(i);
				}
			})(i);
		}
		fragment.appendChild(el);
	}
	paginationEl.appendChild(fragment);
}

// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
// 인포윈도우에 장소명을 표시합니다
function displayInfowindow(marker, title) {
	let content = '<div class="room-info">' + title + '</div>';
	infowindow.setContent(content);
	infowindow.open(map, marker);
}

// 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {
	while (el.hasChildNodes()) {
		el.removeChild(el.lastChild);
	}
}

document.addEventListener("DOMContentLoaded", function() {
	// 매물종류 버튼과 거래방식 버튼 클릭 시 드롭다운 메뉴 활성화
	var roomFilterButtons = document.querySelectorAll(".roomFilter");
	roomFilterButtons.forEach(function(button) {
		button.addEventListener("click", function() {
			var roomContent = this.nextElementSibling; // 클릭한 버튼 다음에 있는 드롭다운 메뉴
			button.style.color = (button.style.color === "black") ? "#FDC600" : "black"
			button.style.borderColor = (button.style.borderColor === "black") ? "#FDC600" : "black"
			roomContent.style.display = (roomContent.style.display === "none") ? "block" : "none";
		});
	});

	// 문서의 다른 영역을 클릭하면 드롭다운 메뉴를 비활성화
	document.addEventListener("click", function(event) {
		var roomFilterButtons = document.querySelectorAll(".roomFilter");
		roomFilterButtons.forEach(function(button) {
			var roomContent = button.nextElementSibling;
			if (event.target !== button && event.target !== roomContent) {
				button.style.color = "black";
				button.style.borderColor = "black";
				roomContent.style.display = "none";
			}
		});
	});
});
document.querySelectorAll(".roomContent").forEach(function(roomContent) {
	roomContent.addEventListener("click", function(event) {
		event.stopPropagation(); // 이벤트 전파 중지
	});
});

// 버튼의 값을 업데이트하는 함수 (버튼에 뜨는 글자 업데이트하는거인듯)
function updateButtonValue() {
	handleCheckboxChange();
		var selectedRoomValues = Array.from(roomTypeCheckboxes)
		.filter(function(checkbox) {
			return checkbox.checked;
		})
		.map(function(checkbox) {
			return checkbox.value;
		});

	var selectedSaleValues = Array.from(saleTypeCheckboxes)
		.filter(function(checkbox) {
			return checkbox.checked;
		})
		.map(function(checkbox) {
			return checkbox.value;
		});
	rButton.value = selectedRoomValues.join(", ");
	sButton.value = selectedSaleValues.join(", ");
}

// 방 종류 체크박스 클릭하면 선택된 방 종류 배열의 값을 업데이트함, 
// 파라미터는 모바일에서 쓰는 체크박스들 배열이랑 피시에서 쓰는 체크박스들 배열이랑 구분하려고 넣은건데 모달로 하면 없어도 될것 같음
function updateSelectedRoomValues(roomTypeCheckboxes) {
	selectedRoomValues = Array.from(roomTypeCheckboxes)
		.filter(function(checkbox) {
			return checkbox.checked;
		})
		.map(function(checkbox) {
			return checkbox.value;
		});
}

// 거래 방식 체크박스 클릭하면 선택된 거래 방식 배열의 값을 업데이트함
// 얘도 파라미터 넣은 이유 위와 같음
function updateSelectedSaleValues(saleTypeCheckboxes) {
	selectedSaleValues = Array.from(saleTypeCheckboxes)
		.filter(function(checkbox) {
			return checkbox.checked;
		})
		.map(function(checkbox) {
			return checkbox.value;
		});
}

// 체크박스가 클릭될 때 버튼의 값을 업데이트하고 매물 목록을 가져옴
roomTypeCheckboxes.forEach(function(checkbox) {
	checkbox.addEventListener("click", function() {
		updateSelectedRoomValues(roomTypeCheckboxes);
		updateButtonValue();
		getMapRoomList();
	});
	checkbox.addEventListener('change', function() {
		mRoomTypeCheckboxes.forEach(function(mCheckbox) {
			if (checkbox.value === mCheckbox.value) {
				mCheckbox.checked = checkbox.checked;
			}
		})
	});
});

saleTypeCheckboxes.forEach(function(checkbox) {
	checkbox.addEventListener("click", function() {
		updateSelectedSaleValues(saleTypeCheckboxes);
		updateButtonValue();
		getMapRoomList();
	});
	checkbox.addEventListener('change', function() {
		mSaleTypeCheckboxes.forEach(function(mCheckbox) {
			if (checkbox.value === mCheckbox.value) {
				mCheckbox.checked = checkbox.checked;
			}
		})
	});
});

// 모바일에서 쓰는 체크박스들
mRoomTypeCheckboxes.forEach(function(checkbox) {
	checkbox.addEventListener("click", function() {
		updateSelectedRoomValues(mRoomTypeCheckboxes);
		updateButtonValue();
		getMapRoomList();
	});
	checkbox.addEventListener('change', function() {
		roomTypeCheckboxes.forEach(function(rCheckbox) {
			if (checkbox.value === rCheckbox.value) {
				rCheckbox.checked = checkbox.checked;
			}
		})
	});
});

mSaleTypeCheckboxes.forEach(function(checkbox) {
	checkbox.addEventListener("click", function() {
		updateSelectedSaleValues(mSaleTypeCheckboxes);
		updateButtonValue();
		getMapRoomList();
	});
	checkbox.addEventListener('change', function() {
		saleTypeCheckboxes.forEach(function(rCheckbox) {
			if (checkbox.value === rCheckbox.value) {
				rCheckbox.checked = checkbox.checked;
			}
		})
	});
});

// 페이지 로드 시 초기 버튼 값 설정
updateButtonValue();

// 체크박스 상태를 감시하는 함수
function handleCheckboxChange(event) {
	let checkedRoomTypeCheckboxes = document.querySelectorAll('.roomType input[type="checkbox"]:checked');
	let checkedSaleTypeCheckboxes = document.querySelectorAll('.saleType input[type="checkbox"]:checked');
	let checkedMRoomTypeCheckboxes = document.querySelectorAll('.room-type input[type="checkbox"]:checked');
	let checkedMSaleTypeCheckboxes = document.querySelectorAll('.sale-type input[type="checkbox"]:checked');

	// 체크된 체크박스가 하나 남았을 때
	if (checkedRoomTypeCheckboxes.length === 1) {
		// 해당 체크박스의 disabled 속성을 설정하여 변경을 방지합니다
		checkedRoomTypeCheckboxes[0].disabled = true;
	} else {
		// 다른 경우 모든 체크박스의 disabled 속성을 제거합니다
		roomTypeCheckboxes.forEach(function(checkbox) {
			checkbox.disabled = false;
		});
	}

	if (checkedSaleTypeCheckboxes.length === 1) {
		// 해당 체크박스의 disabled 속성을 설정하여 변경을 방지합니다
		checkedSaleTypeCheckboxes[0].disabled = true;
	} else {
		// 다른 경우 모든 체크박스의 disabled 속성을 제거합니다
		saleTypeCheckboxes.forEach(function(checkbox) {
			checkbox.disabled = false;
		});
	}

	if (checkedMRoomTypeCheckboxes.length === 1) {
		// 해당 체크박스의 disabled 속성을 설정하여 변경을 방지합니다
		checkedMRoomTypeCheckboxes[0].disabled = true;
	} else {
		// 다른 경우 모든 체크박스의 disabled 속성을 제거합니다
		mRoomTypeCheckboxes.forEach(function(checkbox) {
			checkbox.disabled = false;
		});
	}

	if (checkedMSaleTypeCheckboxes.length === 1) {
		// 해당 체크박스의 disabled 속성을 설정하여 변경을 방지합니다
		checkedMSaleTypeCheckboxes[0].disabled = true;
	} else {
		// 다른 경우 모든 체크박스의 disabled 속성을 제거합니다
		mSaleTypeCheckboxes.forEach(function(checkbox) {
			checkbox.disabled = false;
		});
	}
}

let squareMeters = document.querySelectorAll('#inputSizeDiv input[type="number"]');
let pyeongs = document.querySelectorAll('#pyeongSizeDiv input[type="number"]');

squareMeters.forEach(function(input, index) {
	input.addEventListener("input", function() {
		MeterToPyeong(index);
		getMapRoomList();
	});
});

pyeongs.forEach(function(input, index) {
	input.addEventListener("input", function() {
		pyeongToMeter(index);
		getMapRoomList();
	});
});

function MeterToPyeong(index) {
	let squareMeter = parseFloat(squareMeters[index].value);
	let pyeong = squareMeter / 3.30578;

	pyeongs[index].value = pyeong.toFixed(0);
}

function pyeongToMeter(index) {
	let pyeong = parseFloat(pyeongs[index].value);
	let squareMeter = pyeong * 3.30578;

	squareMeters[index].value = squareMeter.toFixed(0);
}

function resetFilter() {
	if (confirm("초기화 하시겠습니까?") == true) {
		roomTypeCheckboxes.forEach(function(checkbox) {
			checkbox.checked = true;
		});
		saleTypeCheckboxes.forEach(function(checkbox) {
			checkbox.checked = true;
		});
		mRoomTypeCheckboxes.forEach(function(checkbox) {
			checkbox.checked = true;
		})
		mSaleTypeCheckboxes.forEach(function(checkbox) {
			checkbox.checked = true;
		})

		squareMeters.forEach(function(input) {
			input.value = '';
		});
		pyeongs.forEach(function(input) {
			input.value = '';
		});

		updateButtonValue();
		updateSelectedRoomValues(roomTypeCheckboxes);
		updateSelectedSaleValues(saleTypeCheckboxes);
		getMapRoomList();
	} else {
		return false;
	}
}

// 페이징 할때 쓰는 변수들
const countPerPage = 6;
let curPage = 1;
const pageGroupPerPageCount = 5;
let totalPageCount;
let pageGroup;
let firstPageNum;
let lastPageNum;
// 매물 목록 데이터 저장할 변수
let data;

async function getMapRoomList() {
	curPage = 1;
	let mapBounds = map.getBounds();
	let minRoomSpaceMeter = '';
	let maxRoomSpaceMeter = '';
	document.querySelectorAll('#minRoomSpaceMeter').forEach((meter) => {
		if (meter.value) {
			minRoomSpaceMeter = meter.value;
		}
	})

	document.querySelectorAll('#maxRoomSpaceMeter').forEach((meter) => {
		if (meter.value) {
			maxRoomSpaceMeter = meter.value;
		}
	})

	let fetchUrl = `/rooms/map?roomSouthCoord=${mapBounds.qa}&roomNorthCoord=${mapBounds.pa}&roomWestCoord=${mapBounds.ha}&roomEastCoord=${mapBounds.oa}`;
	if (selectedRoomValues) {
		fetchUrl += `&roomTypeFilterList=${selectedRoomValues}`;
	}
	if (selectedSaleValues) {
		fetchUrl += `&roomTradeTypeFilterList=${selectedSaleValues}`;
	}
	if (minRoomSpaceMeter && maxRoomSpaceMeter) {
		fetchUrl += `&minRoomSpaceMeter=${minRoomSpaceMeter}`;
		fetchUrl += `&maxRoomSpaceMeter=${maxRoomSpaceMeter}`;
	}
	const res = await fetch(fetchUrl);
	data = await res.json();
	const total = data.length;
	totalPageCount = Math.ceil(total / countPerPage);
	pageGroup = Math.ceil(1 / pageGroupPerPageCount);
	lastPageNum = pageGroup * pageGroupPerPageCount;
	firstPageNum = (pageGroup - 1) * pageGroupPerPageCount + 1;
	if(lastPageNum > totalPageCount) {
		lastPageNum = totalPageCount;
	}

	setPageBtn(firstPageNum, lastPageNum, data);
	setPageData(firstPageNum, data);

	if(curPage === 1) {
		document.querySelector('.previous-btn').classList.add('previous-btn-disabled');
	} else {
		document.querySelector('.previous-btn').classList.remove('previous-btn-disabled');
	}
	if(curPage === totalPageCount) {
		document.querySelector('.next-btn').classList.add('next-btn-disabled');
	} else {
		document.querySelector('.next-btn').classList.remove('next-btn-disabled');
	}
	document.querySelector('.previous-btn').removeEventListener('click', previousPageBtnClick);
	document.querySelector('.previous-btn').addEventListener('click', previousPageBtnClick);

	document.querySelector('.next-btn').removeEventListener('click', nextPageBtnClick);
	document.querySelector('.next-btn').addEventListener('click', nextPageBtnClick);

	if (total === 0) {
		displayEmptyMessage();
		return;
	}
}

function previousPageBtnClick() {
	if(curPage === 1 && curPage === totalPageCount) {
		document.querySelector('.previous-btn').classList.add('previous-btn-disabled');
		document.querySelector('.next-btn').classList.add('next-btn-disabled');
		return;
	}
	if(curPage === 1) {
		document.querySelector('.previous-btn').classList.add('previous-btn-disabled');
		document.querySelector('.next-btn').classList.remove('next-btn-disabled');
		return;
	}
	curPage--;
	if(curPage !== totalPageCount) {
		document.querySelector('.next-btn').classList.remove('next-btn-disabled');
	}
	if(curPage === 1) {
		document.querySelector('.previous-btn').classList.add('previous-btn-disabled');
	} else {
		document.querySelector('.previous-btn').classList.remove('previous-btn-disabled');
	}

	lastPageNum = pageGroup * pageGroupPerPageCount;
	if(lastPageNum > totalPageCount) {
		lastPageNum = totalPageCount;
	}
	if(curPage < firstPageNum) {
		pageGroup--;
		firstPageNum = ((pageGroup - 1) * pageGroupPerPageCount) + 1;
		lastPageNum = pageGroup * pageGroupPerPageCount;
		if(lastPageNum > totalPageCount) {
			lastPageNum = totalPageCount;
		}
		setPageBtn(firstPageNum, lastPageNum, data);
		setPageData(firstPageNum, data);
		return;
	}
	firstPageNum = ((pageGroup - 1) * pageGroupPerPageCount) + 1;
	setPageBtn(firstPageNum, lastPageNum, data);
	setPageData(curPage, data);
}

function nextPageBtnClick() {
	if(curPage === 1 && curPage === totalPageCount) {
		document.querySelector('.previous-btn').classList.add('previous-btn-disabled');
		document.querySelector('.next-btn').classList.add('next-btn-disabled');
		return;
	}
	if(curPage === totalPageCount) {
		document.querySelector('.previous-btn').classList.remove('previous-btn-disabled');
		document.querySelector('.next-btn').classList.add('next-btn-disabled');
		return;
	}
	curPage++;
	if(curPage !== 1) {
		document.querySelector('.previous-btn').classList.remove('previous-btn-disabled');
	}
	if(curPage === totalPageCount) {
		document.querySelector('.next-btn').classList.add('next-btn-disabled');
	} else {
		document.querySelector('.next-btn').classList.remove('next-btn-disabled');
	}
	
	lastPageNum = pageGroup * pageGroupPerPageCount;
	if(lastPageNum > totalPageCount) {
		lastPageNum = totalPageCount;
	}
	if(curPage > lastPageNum) {
		pageGroup++;
		firstPageNum = ((pageGroup - 1) * pageGroupPerPageCount) + 1;
		lastPageNum = pageGroup * pageGroupPerPageCount;
		if(lastPageNum > totalPageCount) {
			lastPageNum = totalPageCount;
		}
		setPageBtn(firstPageNum, lastPageNum, data);
		setPageData(firstPageNum, data);
		return;
	}
	firstPageNum = ((pageGroup - 1) * pageGroupPerPageCount) + 1;
	setPageBtn(firstPageNum, lastPageNum, data);
	setPageData(curPage, data);
}

function displayEmptyMessage() {
	const html = '<div class="empty"><img src="/imgs/information.png" alt="이미지">' +
		'<h1>조건에 맞는 방이 없습니다.<br>위치 및 맞춤필터를 조정해보세요.</h1></div>';
	document.querySelector('#saleList').innerHTML = html;
}

function setPageBtn(firstPageNum, lastPageNum, roomList) {
	const pageBtnContainer = document.querySelector('.page-num-btn-container');
	let html = '';

	

	for (let i = firstPageNum; i <= lastPageNum; i++) {
		if(i === curPage) {
			html += `<span class="page-num-btn page-num-btn-selected">${i}</span>`;
		} else {
			html += `<span class="page-num-btn">${i}</span>`;
		}
		pageBtnContainer.innerHTML = html;
	}

	document.querySelectorAll('.page-num-btn').forEach(function (btn) {
		if(btn.textContent == curPage) {
			btn.classList.add('page-num-btn-selected');
		}
		btn.addEventListener('click', function () {
			document.querySelectorAll('.page-num-btn').forEach(function (noClickedBtn) {
				if(noClickedBtn.textContent !== btn.textContent) {
					noClickedBtn.classList.remove('page-num-btn-selected');
				}
			})
			curPage = parseInt(btn.textContent);
			btn.classList.add('page-num-btn-selected');
			if(curPage === 1 && curPage === Math.ceil(roomList.length / countPerPage)) {
				document.querySelector('.previous-btn').classList.add('previous-btn-disabled');
                document.querySelector('.next-btn').classList.add('next-btn-disabled');				
			} else if(curPage == 1) {
				document.querySelector('.previous-btn').classList.add('previous-btn-disabled');
                document.querySelector('.next-btn').classList.remove('next-btn-disabled');
			} else if(curPage == Math.ceil(roomList.length / countPerPage)) {
				document.querySelector('.previous-btn').classList.remove('previous-btn-disabled'); 
				document.querySelector('.next-btn').classList.add('next-btn-disabled');
			} else {
				document.querySelector('.previous-btn').classList.remove('previous-btn-disabled');
				document.querySelector('.next-btn').classList.remove('next-btn-disabled');
			}
			setPageData(btn.textContent, roomList);
		});
	});

	// const nextBtn = document.querySelector('.next-btn');
	
	// nextBtn.addEventListener('click', function() {
	// 	if (pageGroup < Math.ceil(totalPageCount / pageGroupPerPageCount)) {
	// 		updatePageGroup(pageGroup + 1);
	// 	}
	// });
	// pageBtnContainer.appendChild(nextBtn);

	// if (pageGroup === 1 && curPage === firstPageNum) {
	// 	previousBtn.style.display = 'none';
	// } else {
	// 	previousBtn.style.display = '';
	// }

	// if (totalPageCount <= pageGroupPerPageCount || pageGroup === Math.ceil(totalPageCount / pageGroupPerPageCount)) {
	// 	nextBtn.style.display = 'none';
	// } else {
	// 	nextBtn.style.display = '';
	// }
}

function resetPageBtnColors() {
	document.querySelectorAll('.page-num-btn').forEach(function(resetBtn) {
		resetBtn.style.color = 'black';
	});
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

function setPageData(pageNumber, data) {
	document.querySelector('#saleList').innerHTML = '';
	const roomListUl = document.querySelector('#saleList');
	clusterer.removeMarkers(markers);
	markers = $(data).map(function(i, roomData) {
		return new kakao.maps.Marker({
			position: new kakao.maps.LatLng(roomData.roomLatitude, roomData.roomLongitude)
		});
	});
	// 클러스터러에 마커들을 추가합니다
	clusterer.addMarkers(markers);

	document.querySelector('#roomListCount').innerText = `지역 목록 ${data.length}개`;

	for (let i = countPerPage * (pageNumber - 1) + 1; i <= countPerPage * (pageNumber - 1) + countPerPage && i <= data.length; i++) {
		let price = exchangeToHundredMillionOrNot(data[i - 1].roomPrice);
		let deposit = exchangeToHundredMillionOrNot(data[i - 1].roomDeposit);
		let html = `<li class="items" id="item${data[i - 1].roomNum}" onclick="location.href='/html/saengbang/detail?roomNum=${data[i - 1].roomNum}'">`;
		html += `    <div class="roomInfo">`;
		html += `        <div class="itemImg">`;
		html += `            <img src="${data[i - 1].roomImgPath}">`;
		html += `        </div>`;
		html += `        <div class="itemInfo">`;
		if (data[i - 1].roomTradeType === '전세' || data[i - 1].roomTradeType === '매매') {
			html += `            <h1>${data[i - 1].roomTradeType} ${price}</h1>`;
		} else if (data[i - 1].roomTradeType === '월세') {
			html += `            <h1>${data[i - 1].roomTradeType} ${deposit}/${price}</h1>`;
		}
		html += `                <p>${data[i - 1].roomType}</p>`;
		html += `                <p>${data[i - 1].roomFloor}층 &#183; ${data[i - 1].roomSpaceMeter}㎡</p>`;
		html += `                <p>${data[i - 1].roomDetailTitle}</p>`;
		html += `        </div>`;
		html += `    </div>`;
		html += `</li>`;
		roomListUl.innerHTML += html;
	}

	for (let i = countPerPage * (pageNumber - 1) + 1; i <= countPerPage * (pageNumber - 1) + countPerPage && i <= data.length; i++) {
		// 마커와 검색결과 항목에 mouseover 했을때
		// 해당 장소에 인포윈도우에 장소명을 표시합니다
		// mouseout 했을 때는 인포윈도우를 닫습니다
		let marker = new kakao.maps.Marker({
			position: new kakao.maps.LatLng(data[i - 1].roomLatitude, data[i - 1].roomLongitude)
		});
		document.querySelector(`#item${data[i - 1].roomNum}`).addEventListener('mouseover', function() {
			displayInfowindow(marker, data[i - 1].roomRoadAddress);
		});
		document.querySelector(`#item${data[i - 1].roomNum}`).addEventListener('mouseout', function() {
			infowindow.close();
		});
	}

	// const previousBtn = document.querySelector('.previous-btn');
	// if (previousBtn) {
	// 	if (pageGroup === 1 && (curPage % 5) === 1) {
	// 		previousBtn.style.display = 'none';
	// 	} else {
	// 		previousBtn.style.display = '';
	// 	}
	// }

	// const nextBtn = document.querySelector('.next-btn');
	// if (nextBtn) {
	// 	if (totalPageCount <= pageGroupPerPageCount || pageGroup === Math.ceil(totalPageCount / pageGroupPerPageCount)) {
	// 		nextBtn.style.display = 'none';
	// 	} else {
	// 		nextBtn.style.display = '';
	// 	}
	// }
}
// 토글 버튼 또는 아이콘 클릭 시 콜랩스 열고 닫기
document.querySelector('#list-up').addEventListener('click', function() {
	const listAndSearch = document.querySelector('.listAndSearch');
	listAndSearch.classList.toggle('active');
});

document.querySelector('#room-close').addEventListener('click', function() {
	const listAndSearch = document.querySelector('.listAndSearch');
	listAndSearch.classList.toggle('active');
});

// document.querySelector('#filter-on').addEventListener('click', function() {
//   const filterList = document.querySelector('.filterList');
//   filterList.classList.toggle('active');
// });

// document.querySelector('#filter-close').addEventListener('click', function() {
//   const filterList = document.querySelector('.filterList');
//   filterList.classList.toggle('active');
// });

// 얘는 그 preloader (로딩 되는 효과) 내는건데 원래  <script th:src="@{/assets/js/main.js}"></script> 이거 쓰면 안써도 됐는데 저거 쓰면 조금 문제가 생기는 것 같아서 이렇게 해놓음..
$(window).load(function() { // makes sure the whole site is loaded
	$('#status').fadeOut(); // will first fade out the loading animation
	$('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
	$('body').delay(350).css({ 'overflow': 'visible' });
})