const router = require("express-promise-router")();
const bookController = require("../controllers/bookController");

router
  .route("/postBook")
  .post(bookController.postBook);
router
  .route("/getBooks")
  .get(bookController.getBooks);
router
  .route("/getBook/:id")
  .get(bookController.getBook);
router
  .route("/getBook/:id")
  .get(bookController.deleteBook);
router
  .route("/getBook/:id")
  .get(bookController.updateBook);
module.exports = router;
