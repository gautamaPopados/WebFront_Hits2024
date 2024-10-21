import Login from './views/Login.js'
import Registration from './views/Registration.js';
import Profile from './views/Profile.js';
import Patients from './views/Patients.js';

const router = async () => {
    const routes = [
        { path: "/login", view: Login },
        { path: "/registration", view: Registration },
        { path: "/profile", view: Profile },
        { path: "/patients", view: Patients }

    ];

    const handleLocation = async () => {
        const path = window.location.pathname;
        const route = routes.find((route) => route.path === path);
        if (route) {
            const view = new route.view();
            const html = await view.getHtml();
            document.getElementById("app").innerHTML = html;
            await view.executeViewScript(); 
        }
    };

    window.onpopstate = handleLocation;
    
    const route = (event) => {
        event.preventDefault();
        const anchor = event.target.closest('a');
        if (anchor) {
            window.history.pushState({}, "", anchor.href);
            handleLocation();
        }
    };

    window.route = route;

    handleLocation();
};

router();