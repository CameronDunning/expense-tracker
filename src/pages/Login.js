import {
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Image,
    Text,
    HStack,
} from '@chakra-ui/react'
import { GoogleButton } from '../components/GoogleButton/GoogleButton'
import { Link } from '../components/Link/Link'

export const Login = () => {
    return (
        <Stack direction={'row'} flex={1}>
            <Flex flex={{ base: 0, md: 1 }}>
                <Image alt={'Login Image'} objectFit={'cover'} src={'/login.jpg'} />
            </Flex>
            <Flex p={8} flex={1} align={'center'} justify={'center'}>
                <Stack spacing={4} w={'full'} maxW={'md'}>
                    <Heading fontSize={'2xl'}>Sign in to your account</Heading>
                    <FormControl id="email">
                        <FormLabel>Email address</FormLabel>
                        <Input type="email" />
                    </FormControl>
                    <FormControl id="password">
                        <FormLabel>Password</FormLabel>
                        <Input type="password" />
                    </FormControl>
                    <Stack spacing={6}>
                        <Stack direction={{ base: 'column', sm: 'row' }} align={'start'} justify={'space-between'}>
                            <Checkbox>Remember me</Checkbox>
                            <HStack>
                                <Text>Don't have an account?</Text>
                                <Link color={'blue.500'} href={'/register'}>
                                    Register
                                </Link>
                            </HStack>
                        </Stack>
                        <Button colorScheme={'blue'} variant={'solid'}>
                            Sign in
                        </Button>
                        <GoogleButton>Sign in with Google</GoogleButton>
                    </Stack>
                </Stack>
            </Flex>
        </Stack>
    )
}
