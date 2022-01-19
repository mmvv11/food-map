const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");
const jwt = require("jsonwebtoken");
const secret = require("../../config/secret");

const indexDao = require("../dao/indexDao");

// 회원가입
exports.signUp = async function (req, res) {
  const { userID, name } = req.body;

  // userID 8~20자 사이여야한다.
  userIDLen = userID.length;
  if (userIDLen < 8 || userIDLen > 20) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "userID 길이를 8~20으로 설정해주세요.",
    });
  }
  // name 영어로만 할 것.
  var eng = /^[a-zA-Z]*$/;
  if (!eng.test(name)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: "name은 영어만 가능합니다.",
    });
  }

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const rows = await indexDao.insertUser(connection, userID, name);

      return res.send({
        isSuccess: true,
        code: 200,
        message: "회원가입 성공",
      });
    } catch (err) {
      logger.error(`signUp Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`signUp DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};

// 로그인
exports.signIn = async function (req, res) {
  const { userId, userPassword } = req.body;

  if (!userId || !userPassword) {
    res.send({
      isSuccess: false,
      code: 400,
      message: "회원정보를 입력해주세요.",
    });
  }

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const [userInfoRows] = await indexDao.isValidUser(
        connection,
        userId,
        userPassword
      );

      if (userInfoRows.length <= 0) {
        return res.send({
          isSuccess: false,
          code: 410,
          message: "로그인 정보가 올바르지 않습니다.",
        });
      }

      // 토큰 생성
      const token = jwt.sign(
        {
          masterUserIdx: userInfoRows[0].masterUserIdx,
        }, // payload
        secret.jwtsecret // secret
      );

      return res.send({
        result: {
          masterUserIdx: userInfoRows[0].masterUserIdx,
          jwt: token,
        },
        isSuccess: true,
        code: 200,
        message: "로그인 성공",
      });
    } catch (err) {
      logger.error(`signIn Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`signIn DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};

// 식당 CRUD
exports.getRestaurants = async function (req, res) {
  const { category } = req.query;

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const [selectRestaurantsRows] = await indexDao.selectRestaurants(
        connection,
        category
      );

      console.log(selectRestaurantsRows);

      return res.send({
        result: selectRestaurantsRows,
        isSuccess: true,
        code: 200,
        message: "식당 조회 성공",
      });
    } catch (err) {
      logger.error(`getRestaurants Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(
      `getRestaurants DB Connection error\n: ${JSON.stringify(err)}`
    );
    return false;
  }
};

exports.insertRestaurant = async function (req, res) {
  const { title, address, category, videoUrl } = req.body;
  const masterUserIdx = req.verifiedToken.masterUserIdx;

  if (!title || !address || !category || !videoUrl) {
    return res.send({
      isSuccess: true,
      code: 400,
      message: "입력값을 확인하세요.",
    });
  }

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      // restaurantsIdx 설정 max+1
      const [selectRestaurantIdxRows] = await indexDao.selectRestaurantIdx(
        connection,
        masterUserIdx
      );

      const restaurantIdx = selectRestaurantIdxRows.restaurantIdx;

      await indexDao.insertRestaurants(
        connection,
        restaurantIdx,
        masterUserIdx,
        title,
        address,
        category,
        videoUrl
      );

      return res.send({
        isSuccess: true,
        code: 200,
        message: "식당 생성 성공",
      });
    } catch (err) {
      logger.error(`insertRestaurant Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(
      `insertRestaurant DB Connection error\n: ${JSON.stringify(err)}`
    );
    return false;
  }
};
exports.updateRestaurant = async function (req, res) {};
exports.deleteRestaurant = async function (req, res) {};
