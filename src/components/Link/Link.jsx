import React from 'react'

import { Link as ChakraLink } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export const Link = ({ href, px, py, rounded, hover, color, children }) => {
    return (
        <ChakraLink px={px} py={py} rounded={rounded} _hover={hover} color={color}>
            <RouterLink to={href}>{children}</RouterLink>
        </ChakraLink>
    )
}
