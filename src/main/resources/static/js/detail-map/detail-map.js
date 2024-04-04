var geocoder = new kakao.maps.services.Geocoder();
var placeOverlay = new kakao.maps.CustomOverlay({ zIndex: 1 });
var contentNode = document.createElement('div');
var markers = [];
var currCategory = '';

// 지도 옵션 설정
var mapContainer = document.querySelector('#map');
var mapOption = {
    center: new kakao.maps.LatLng(37.545967, 126.719227), // 초기 중심 좌표 설정
    level: 5
};

// 지도 생성
var map = new kakao.maps.Map(mapContainer, mapOption);
var ps = new kakao.maps.services.Places(map);

// 페이지 로딩시 맵 초기화
function initMap() {
    let roomRoadAddress = document.querySelector('#roomRoadAddress').innerText;
    // 초기 로딩 시 지도의 중심 좌표를 가져옴
    geocoder.addressSearch(roomRoadAddress, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
            var centerLatLng = new kakao.maps.LatLng(result[0].y, result[0].x);
            map.setCenter(centerLatLng);
            searchPlaces(); // 초기 로딩 후 장소 검색
        }
    })
}

// 커스텀 오버레이 설정
contentNode.className = 'placeinfo_wrap';
addEventHandle(contentNode, 'mousedown', kakao.maps.event.preventMap);
addEventHandle(contentNode, 'touchstart', kakao.maps.event.preventMap);
placeOverlay.setContent(contentNode);

// 지도 idle 이벤트 리스너 등록
kakao.maps.event.addListener(map, 'idle', searchPlaces);

// 카테고리 클릭 이벤트 리스너 등록
addCategoryClickEvent();


// 이벤트 핸들러 등록 함수
function addEventHandle(target, type, callback) {
    if (target.addEventListener) {
        target.addEventListener(type, callback);
    } else {
        target.attachEvent('on' + type, callback);
    }
}

// 장소 검색 함수
function searchPlaces() {
    if (!currCategory) {
        return;
    }

    placeOverlay.setMap(null);
    removeMarker();

    ps.categorySearch(currCategory, placesSearchCB, { useMapBounds: true });
}

// 장소 검색 결과 콜백 함수
function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        displayPlaces(data);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        // 검색결과가 없는 경우의 처리
    } else if (status === kakao.maps.services.Status.ERROR) {
        // 에러로 인한 검색결과 없음의 처리
    }
}

// 검색된 장소 표시 함수
function displayPlaces(places) {
    var order = document.querySelector('#' + currCategory).getAttribute('data-order');

    for (var i = 0; i < places.length; i++) {
        var marker = addMarker(new kakao.maps.LatLng(places[i].y, places[i].x), order);

        // 클로저를 사용하여 클릭 이벤트 핸들러 등록
        (function (marker, place) {
            kakao.maps.event.addListener(marker, 'click', function () {
                displayPlaceInfo(place);
            });
        })(marker, places[i]);
    }
}

// 마커 추가 함수
function addMarker(position, order) {
    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png';
    var imageSize = new kakao.maps.Size(27, 28);
    var imgOptions = {
        spriteSize: new kakao.maps.Size(72, 208),
        spriteOrigin: new kakao.maps.Point(46, order * 36),
        offset: new kakao.maps.Point(11, 28)
    };

    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
    var marker = new kakao.maps.Marker({
        position: position,
        image: markerImage
    });

    marker.setMap(map);
    markers.push(marker);

    return marker;
}

// 모든 마커 제거 함수
function removeMarker() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

// 장소 정보 표시 함수
function displayPlaceInfo(place) {
    var content = '<div class="placeinfo">' +
        '   <a class="title" href="' + place.place_url + '" target="_blank" title="' + place.place_name + '">' + place.place_name + '</a>';

    if (place.road_address_name) {
        content += '    <span title="' + place.road_address_name + '">' + place.road_address_name + '</span>' +
            '  <span class="jibun" title="' + place.address_name + '">(지번 : ' + place.address_name + ')</span>';
    } else {
        content += '    <span title="' + place.address_name + '">' + place.address_name + '</span>';
    }

    content += '    <span class="tel">' + place.phone + '</span>' +
        '</div>' +
        '<div class="after"></div>';

    contentNode.innerHTML = content;
    placeOverlay.setPosition(new kakao.maps.LatLng(place.y, place.x));
    placeOverlay.setMap(map);
}

// 카테고리 클릭 이벤트 핸들러 등록 함수
function addCategoryClickEvent() {
    var category = document.querySelector('#category');
    var children = category.children;

    for (var i = 0; i < children.length; i++) {
        children[i].onclick = onClickCategory;
    }
}

// 카테고리 클릭 이벤트 핸들러
function onClickCategory() {
    var id = this.id;
    var className = this.className;

    placeOverlay.setMap(null);

    if (className === 'on') {
        currCategory = '';
        changeCategoryClass();
        removeMarker();
    } else {
        currCategory = id;
        changeCategoryClass(this);
        searchPlaces();
    }
}

// 카테고리 클래스 변경 함수
function changeCategoryClass(el) {
    var category = document.querySelector('#category');
    var children = category.children;

    for (var i = 0; i < children.length; i++) {
        children[i].className = '';
    }

    if (el) {
        el.className = 'on';
    }
}