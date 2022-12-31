import { Outlet } from 'react-router-dom'
import { Stack } from '@chakra-ui/react'

import { useUser } from '../../Stores/UserStore'
import { NavBar } from '../NavBar/NavBar'
import { UIAlert } from '../UIAlert/UIAlert'
import { Mask } from '../Mask/Mask'

export const Layout = () => {
    const showAlert = false
    const user = useUser()

    return (
        <Stack minH={'100vh'}>
            {user && !user.emailVerified && <Mask />}
            <NavBar />
            {showAlert && <UIAlert severity="warning" text="This is a warning" />}
            <Outlet />
        </Stack>
    )
}
