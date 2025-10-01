import { Outlet, Navigate } from "react-router-dom";

export default function AuthRequiredRoute(){
    const isLogged = true;

    if (!isLogged){
        return <Navigate to="/auth/login" replace />;
    }

    return <Outlet />
}