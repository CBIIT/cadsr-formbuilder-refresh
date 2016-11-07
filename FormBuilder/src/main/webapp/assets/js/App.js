import {setGlobalJQAjaxSettings} from './helpers/ajaXHelpers';
import appService from  "./services/app/AppService";
import searchService from  "./services/search/SearchService";
import cartsService from  "./services/carts/CartsService";
import formService from  "./services/form/FormService";
import userService from  "./services/user/UserService";
import modalsService from  "./services/search/ModalsService";

setGlobalJQAjaxSettings();
export const app = {};
app.formService = appService;
app.formService = formService;
app.formService = formService;
app.searchService = searchService;
app.userService = userService;
app.cartsService = cartsService;
app.modalsService = modalsService;
window.Application = app;
