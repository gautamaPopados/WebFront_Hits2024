import Login from './views/Login.js'
import Registration from './views/Registration.js';
import Profile from './views/Profile.js';
import Patients from './views/Patients.js';
import PatientCard from './views/PatientCard.js';
import CreateInspection from './views/CreateInspection.js';
import Inspection from './views/Inspection.js';
import Consultations from './views/Consultations.js';
import Reports from './views/Reports.js';

const router = async () => {
    const routes = [
        { path: "/login", view: Login },
        { path: "/registration", view: Registration },
        { path: "/profile", view: Profile },
        { path: "/patients", view: Patients },
        { path: "/patient/:id", view: PatientCard },
        { path: "/inspection/create", view: CreateInspection },
        { path: "/inspection/:id", view: Inspection },
        { path: "/consultations", view: Consultations },
        { path: "/reports", view: Reports }
    ];

    const handleLocation = async () => {
        const path = window.location.pathname;
        
        const potentialRoute = routes.find((route) => {
            if (route.path.includes(':id')) {
                const routePathRegex = route.path.replace(':id', '([^/]+)');
                return new RegExp(`^${routePathRegex}$`).test(path);
            }
            return route.path === path;
        });
    
        if (potentialRoute) {
            let params = {};
            if (potentialRoute.path.includes(':id')) {
                const id = path.split('/').pop();
                params = { id };
            }
    
            const view = new potentialRoute.view(params);
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