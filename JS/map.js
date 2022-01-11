var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
    level: 3, // 지도의 확대 레벨
  };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 지도에 확대 축소 컨트롤을 생성한다
var zoomControl = new kakao.maps.ZoomControl();

// 지도의 우측에 확대 축소 컨트롤을 추가한다
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// 마커를 표시할 위치와 내용을 가지고 있는 객체 배열입니다
var positions = [
  {
    content: "<div>카카오</div>",
    latlng: new kakao.maps.LatLng(33.450705, 126.570677),
  },
  {
    content: "<div>생태연못</div>",
    latlng: new kakao.maps.LatLng(33.450936, 126.569477),
  },
  {
    content: "<div>텃밭</div>",
    latlng: new kakao.maps.LatLng(33.450879, 126.56994),
  },
  {
    content: "<div>근린공원</div>",
    latlng: new kakao.maps.LatLng(33.451393, 126.570738),
  },
];

// 인포윈도우 객체 배열
var infowindowArray = [];

for (var i = 0; i < positions.length; i++) {
  // 마커를 생성합니다
  var marker = new kakao.maps.Marker({
    map: map, // 마커를 표시할 지도
    position: positions[i].latlng, // 마커의 위치
  });

  // 마커에 표시할 인포윈도우를 생성합니다
  var infowindow = new kakao.maps.InfoWindow({
    content: positions[i].content, // 인포윈도우에 표시할 내용
  });

  // 인포윈도우 배열에 푸시
  infowindowArray.push(infowindow);

  // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
  // 이벤트 리스너로는 클로저를 만들어 등록합니다
  // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
  kakao.maps.event.addListener(
    marker,
    "click",
    makeOverListener(map, marker, infowindow, positions[i].latlng)
  );
  kakao.maps.event.addListener(map, "click", makeOutListener(infowindow));
}

// 인포윈도우를 닫는 함수
function closeInfoWindow() {
  for (infowindow of infowindowArray) {
    infowindow.close();
  }
}

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다
function makeOverListener(map, marker, infowindow, latlng) {
  return function () {
    closeInfoWindow();
    infowindow.open(map, marker);
    panTo(latlng)

  };
}

// 인포윈도우를 닫는 클로저를 만드는 함수입니다
function makeOutListener(infowindow) {
  return function () {
    infowindow.close();
  };
}

// 센터 좌표이동 부드럽게
function panTo(latlng) {
  map.panTo(latlng);
}
