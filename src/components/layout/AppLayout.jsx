import { Outlet } from 'react-router-dom';
import MainNavbar from './MainNavbar';

function AppLayout() {
    return (
        <>
            <MainNavbar />
            <Outlet />
        </>
    );
}

export default AppLayout;
