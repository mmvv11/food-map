let mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(37.54, 126.96), // 지도의 중심좌표
    level: 8, // 지도의 확대 레벨
  };

let map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성

// 지도에 확대 축소 컨트롤을 생성
let zoomControl = new kakao.maps.ZoomControl();

// 지도의 우측에 확대 축소 컨트롤을 추가
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// 주소-좌표 변환 객체를 생성
let geocoder = new kakao.maps.services.Geocoder();

// 마커 객체 배열
let markerArray = [];

// 인포윈도우 객체 배열
let infowindowArray = [];

const getDataConfig = {
  url: "http://www.seongong.shop" + `/restaurants`,
  method: "get",
};

// 데이터 요청 및 실행
axios(getDataConfig).then((res) => {
  // 데이터셋
  const dataSet = res.data.result;

  // 실행
  setMap(dataSet);
});

const categoryContainer = document.querySelector(".category");

categoryContainer.addEventListener("click", categoryHandler);

// 카테고리 클릭 핸들러
function categoryHandler(event) {
  const categoryId = event.target.id;
  const category = categoryMap[categoryId];

  const getDataByCategoryConfig = {
    url: "http://www.seongong.shop" + `/restaurants?category=${category}`,
    method: "get",
  };

  // 데이터 요청 및 실행
  axios(getDataByCategoryConfig).then((res) => {
    // 데이터셋
    const dataSet = res.data.result;
    console.log(dataSet);
    // 기존 마커 삭제
    for (var i = 0; i < markerArray.length; i++) {
      markerArray[i].setMap(null);
    }
    // 기존 인포윈도우 닫기
    closeInfoWindow();
    // 실행
    setMap(dataSet);
  });
}

// 카테고리
const categoryMap = {
  korea: "한식",
  china: "중식",
  japan: "일식",
  america: "양식",
  meel: "분식",
  meat: "구이",
  sushi: "회/초밥",
  etc: "기타",
};

// HTML 코드로 바꾸는 함수
function getContent(title, address, url) {
  let videoId = "";
  let replaceUrl = url;
  replaceUrl = replaceUrl.replace("https://youtu.be/", "");
  replaceUrl = replaceUrl.replace("https://www.youtube.com/embed/", "");
  replaceUrl = replaceUrl.replace("https://www.youtube.com/watch?v=", "");
  videoId = replaceUrl.split("&")[0];

  const result = `<div class="infowindow">
  <div class="infowindow-img-container">
    <img src="https://img.youtube.com/vi/${videoId}/sddefault.jpg" class="infowindow-img" alt="...">
  </div>
  <div class="infowindow-body">
    <h5 class="infowindow-title">${title}</h5>
    <p class="infowindow-text">${address}</p>
    <a href="https://youtu.be/${videoId}" target="_blank" class="infowindow-btn">영상이동</a>
  </div>
</div>`;
  return result;
}

// 인포윈도우를 닫는 함수
function closeInfoWindow() {
  for (infowindow of infowindowArray) {
    infowindow.close();
  }
}

// 인포윈도우를 표시하는 클로저를 만드는 함수
function makeOverListener(map, marker, infowindow, latlng) {
  return function () {
    closeInfoWindow();
    infowindow.open(map, marker);
    panTo(latlng);
  };
}

// 인포윈도우를 닫는 클로저를 만드는 함수
function makeOutListener(infowindow) {
  return function () {
    infowindow.close();
  };
}

// 부드럽게 센터 좌표이동 함수
function panTo(latlng) {
  map.panTo(latlng);
}

// 주소-좌표 변환 promise 객체 리턴 함수
function getLatlng(address) {
  return new Promise((resolve) => {
    geocoder.addressSearch(address, (result, status) => {
      const latlng = new kakao.maps.LatLng(result[0].y, result[0].x);
      resolve(latlng);
    });
  });
}

async function setMap(dataSet) {
  for (let i = 0; i < dataSet.length; i++) {
    const data = dataSet[i];
    const latlng = await getLatlng(data.address);

    // 마커를 생성
    let marker = new kakao.maps.Marker({
      map: map, // 마커를 표시할 지도
      position: latlng, // 마커의 위치
    });

    // 마커 배열에 푸시
    markerArray.push(marker);

    // 마커에 표시할 인포윈도우를 생성
    let infowindow = new kakao.maps.InfoWindow({
      content: getContent(data.title, data.address, data.videoUrl), // 인포윈도우에 표시할 내용
      disableAutoPan: true, // 인포윈도우를 열 때 지도가 자동으로 패닝하지 않을지의 여부 (기본값: false)
    });

    // 인포윈도우 배열에 푸시
    infowindowArray.push(infowindow);

    // 마커에 클릭 이벤트 등록
    kakao.maps.event.addListener(
      marker,
      "click",
      makeOverListener(map, marker, infowindow, latlng)
    );
    kakao.maps.event.addListener(map, "click", makeOutListener(infowindow));
  }
}
