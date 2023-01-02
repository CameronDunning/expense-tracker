import { createBrowserRouter } from 'react-router-dom'

import { Layout } from '../components/Layout/Layout'
import { Home } from '../pages/Home'
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import { Profile } from '../pages/Profile'
import { Expenses } from '../pages/Expenses'
import { Incomes } from '../pages/Incomes'
import { Summary } from '../pages/Summary'
import { Monthly } from '../pages/Monthly'
import { DataEntry } from '../pages/DataEntry'
import { NotFound } from '../pages/404'

export const ROUTER = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { path: '/', element: <Home /> },
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            { path: 'profile', element: <Profile /> },
            { path: 'expenses', element: <Expenses /> },
            { path: 'incomes', element: <Incomes /> },
            { path: 'summary', element: <Summary /> },
            { path: 'monthly', element: <Monthly /> },
            { path: 'data-entry', element: <DataEntry /> },
        ],
        errorElement: <NotFound />,
    },
])
