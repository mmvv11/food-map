module.exports = function (app) {
  const index = require("../controllers/indexController");
  const jwtMiddleware = require("../../config/jwtMiddleware");

  app.post("/signin", index.signIn); // 로그인

  // 식당 CRUD
  app.post("/restaurant", jwtMiddleware, index.insertRestaurant); // 식당 create
  app.get("/restaurants", index.getRestaurants); // 식당 read
  app.patch("/restaurant", jwtMiddleware, index.updateRestaurant); // 식당 update
  app.delete(
    "/restaurant/:restaurantIdx",
    jwtMiddleware,
    index.deleteRestaurant
  ); // 식당 delete
};
