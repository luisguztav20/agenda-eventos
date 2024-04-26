import { Navigate, Route, Routes } from "react-router-dom";
import {LoginPage} from '../auth';
import {CalendarPage} from '../calendar';

export const AppRouter = () => {
    const authStatus = 'aunthenticated'; // esto seria temporal
    
    return(
        <Routes>
            {
                (authStatus === 'not-aunthenticated')
                ? <Route path='/auth/*' element={ <LoginPage/> }/>
                : <Route path='*' element={ <CalendarPage/>}/>
            }
            <Route path="*" element={<Navigate to={'/auth/login'}/>}/>
            
        </Routes>
    )
}