import { Stack } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'

import { NavBar } from '../NavBar/NavBar'
import { UIAlert } from '../UIAlert/UIAlert'

export const Layout = () => {
    const showAlert = false

    return (
        <Stack minH={'100vh'}>
            <NavBar />
            {showAlert && <UIAlert severity="warning" text="This is a warning" />}
            <Outlet />
        </Stack>
    )
}
