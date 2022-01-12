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

// 인포윈도우 객체 배열
let infowindowArray = [];

// 데이터셋
const dummyDataSet = [
  {
    title: "행복한식당",
    address: "성동구 성수동2가 278-5",
    url: "https://www.youtube.com/watch?v=wU_z7Pjhhd4",
  },
];

setMap(dummyDataSet);

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

    // 마커에 표시할 인포윈도우를 생성
    let infowindow = new kakao.maps.InfoWindow({
      content: getContent(data.title, data.address, data.url), // 인포윈도우에 표시할 내용
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
