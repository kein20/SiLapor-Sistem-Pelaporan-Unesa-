import Home from './views/home';
import Lapor from './views/lapor';
import Detail from './views/detail';
import Login from './views/login';
import Register from './views/register';

const routes = {
    '/': Home,
    '/home': Home,
    '/lapor': Lapor,
    '/detail/:id': Detail,
    '/login': Login,
    '/register': Register, 
};

export default routes;