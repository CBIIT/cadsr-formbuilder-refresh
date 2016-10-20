import searchService from  "./services/search/SearchService";
import cartsService from  "./services/carts/CartsService";
import formService from  "./services/form/FormService";
import userService from  "./services/user/UserService";

export const app = {};
app.formService = formService;
app.searchService = searchService;
app.userService = userService;
app.cartsService = cartsService;
window.Application = app;
