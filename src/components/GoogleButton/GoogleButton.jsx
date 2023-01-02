import { FcGoogle } from 'react-icons/fc'
import { Button, Center, Text } from '@chakra-ui/react'

export const GoogleButton = ({ onClick, children }) => {
    return (
        <Button w={'full'} maxW={'md'} variant={'outline'} leftIcon={<FcGoogle />} onClick={onClick}>
            <Center>
                <Text>{children}</Text>
            </Center>
        </Button>
    )
}
