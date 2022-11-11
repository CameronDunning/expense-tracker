import React from 'react'

// import { Navigate } from 'react-router-dom'
// import { Stack, Flex, Text, useToast } from '@chakra-ui/react'
import { Stack, Flex, Text } from '@chakra-ui/react'

import { useUser } from '../Stores/UserStore'

export const Home = () => {
    // const toast = useToast()

    const user = useUser()

    // if (!user) {
    //     toast({
    //         title: 'You are not logged in.',
    //         description: 'You have been redirected to the login page.',
    //         status: 'error',
    //         duration: NOTIFICATION_DURATION,
    //         isClosable: true,
    //     })
    //     return <Navigate to={'/login'} />
    // }

    return (
        <Stack direction={'row'} flex={1} minH={'100%'}>
            <Flex flex={{ base: 0, md: 1 }}>
                <Text>Home</Text>
                <Text>{user?.email}</Text>
                <Text>{user?.firstName}</Text>
                <Text>{user?.lastName}</Text>
            </Flex>
        </Stack>
    )
}
