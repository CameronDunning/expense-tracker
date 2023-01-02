import { FcGoogle } from 'react-icons/fc'
import { Button, Center, Text } from '@chakra-ui/react'

export const GoogleButton = ({ children }) => {
    return (
        <Button w={'full'} maxW={'md'} variant={'outline'} leftIcon={<FcGoogle />}>
            <Center>
                <Text>{children}</Text>
            </Center>
        </Button>
    )
}
