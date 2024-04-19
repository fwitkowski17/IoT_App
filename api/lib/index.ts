import App from './app';
import UserController from './controllers/user.controller';
import IndexController from './controllers/index.controller';
import DataController from './controllers/data.controller';

const app: App = new App([
    new UserController(),
    new DataController(),
    new IndexController()
]);
app.listen();