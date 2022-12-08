const router = require("express").Router();
const UserControllers  = require("../controllers/UserControllers");
const CategoryControllers = require("../controllers/CategoryControllers");
const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");
const ProductControllers = require("../controllers/ProductControllers");
const TransactionHistoryControllers = require("../controllers/TransactionHistoriesControllers")



//Register & Login
router.post("/users/register", UserControllers.register);
router.post("/users/login", UserControllers.login);

//Autentication
router.use(authentication);

//User activity
router.put("/users", UserControllers.updateUser);
router.delete("/users", UserControllers.deleteUser);
router.patch("/users/topup", UserControllers.TopUpBalance);


//Category activity
router.post("/categories", authorization, CategoryControllers.createCategory);
router.get("/categories", authorization, CategoryControllers.getCategory);
router.patch("/categories/:categoryId", authorization, CategoryControllers.updateCategory);
router.delete("/categories/:categoryId", authorization, CategoryControllers.deleteCategory);


//Product acrivity
router.post("/products", authorization, ProductControllers.createProduct);
router.get("/products", ProductControllers.getAllProducts);
router.put("/products/:productId", authorization, ProductControllers.updateAllAttributes);
router.patch("/products/:productId", authorization, ProductControllers.updateOneAttribut);
router.delete("/products/:productId", authorization, ProductControllers.deleteProduct);


//Transcation Histories activity
router.post("/transactions", TransactionHistoryControllers.createTransaction);
router.get("/transactions/user", TransactionHistoryControllers.getTransactionUser);
router.get("/transactions/admin", authorization, TransactionHistoryControllers.getAllTransactionAdmin);
router.get("/transactions/:transactionId", authorization, TransactionHistoryControllers.getTransactionsByUser);









module.exports = router;