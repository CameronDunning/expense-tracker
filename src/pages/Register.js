import {
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Link,
    Stack,
    Image,
    Text,
    HStack,
} from '@chakra-ui/react'
import { GoogleButton } from '../components/GoogleButton/GoogleButton'

export const Register = () => {
    return (
        <Stack direction={'row'} flex={1}>
            <Flex flex={{ base: 0, md: 1 }}>
                <Image alt={'Login Image'} objectFit={'cover'} src={'/register.jpg'} />
            </Flex>
            <Flex p={8} flex={1} align={'center'} justify={'center'}>
                <Stack spacing={4} w={'full'} maxW={'md'}>
                    <Heading fontSize={'2xl'}>Register an account</Heading>
                    <FormControl id="email">
                        <FormLabel>First Name</FormLabel>
                        <Input type="email" />
                    </FormControl>
                    <FormControl id="email">
                        <FormLabel>Last Name</FormLabel>
                        <Input type="email" />
                    </FormControl>
                    <FormControl id="email">
                        <FormLabel>Email address</FormLabel>
                        <Input type="email" />
                    </FormControl>
                    <FormControl id="password">
                        <FormLabel>Password</FormLabel>
                        <Input type="password" />
                    </FormControl>
                    <FormControl id="password">
                        <FormLabel>Re-enter Password</FormLabel>
                        <Input type="password" />
                    </FormControl>
                    <Stack spacing={6}>
                        <Stack direction={{ base: 'column', sm: 'row' }} align={'start'} justify={'right'}>
                            <HStack>
                                <Text>Already have an account?</Text>
                                <Link color={'blue.500'} href={'/login'}>
                                    Log in
                                </Link>
                            </HStack>
                        </Stack>
                        <Button colorScheme={'blue'} variant={'solid'}>
                            Register
                        </Button>
                        <GoogleButton>Register with Google</GoogleButton>
                    </Stack>
                </Stack>
            </Flex>
        </Stack>
    )
}
