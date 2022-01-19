const { pool } = require("../../config/database");

// 회원가입
exports.insertUser = async function (connection, userID, name) {
  const insertUserQuery = `insert into Users(userID, name) VALUES (?,?);`;
  const insertUserParams = [userID, name];
  const rows = await connection.query(insertUserQuery, insertUserParams);

  return rows;
};

// 유저 유효성 검사
exports.isValidUser = async function (connection, userId, userPassword) {
  const selectUserQuery = `select * from MasterUsers where userId = ? and userPassword = ?;`;
  const selectUserParams = [userId, userPassword];
  const rows = await connection.query(selectUserQuery, selectUserParams);

  return rows;
};

// 식당 조회
exports.selectRestaurants = async function (connection, category) {
  const selectRestaurantsQuery = `select title, address, category, videoUrl from Restaurants where status="A"`;
  const selectRestaurantsByCategoryQuery = `select * from Restaurants where category = ? and status="A";`;
  const selectRestaurantsParams = [category];

  const rows = await connection.query(
    category ? selectRestaurantsByCategoryQuery : selectRestaurantsQuery,
    selectRestaurantsParams
  );

  return rows;
};

// 식당 입력
exports.insertRestaurants = async function (
  connection,
  restaurantIdx,
  masterUserIdx,
  title,
  address,
  category,
  videoUrl
) {
  const Query = `insert into Restaurants(restaurantIdx, masterUserIdx, title, address, category , videoUrl) values (?,?,?,?,?,?);`;
  const Params = [
    restaurantIdx,
    masterUserIdx,
    title,
    address,
    category,
    videoUrl,
  ];

  const rows = await connection.query(Query, Params);

  return rows;
};

// 식당 입력시 식당 인덱스 조회
exports.selectRestaurantIdx = async function (connection, masterUserIdx) {
  const Query = `select ifnull(max(restaurantIdx)+1, 1) as restaurantIdx  from Restaurants where masterUserIdx = ?;`;
  const Params = [masterUserIdx];

  const [rows] = await connection.query(Query, Params);

  return rows;
};

exports.example = async function (connection, params) {
  const Query = ``;
  const Params = [];

  const rows = await connection.query(Query, Params);

  return rows;
};
