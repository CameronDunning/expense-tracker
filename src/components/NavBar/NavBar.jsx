import { signOut } from 'firebase/auth'
import {
    Box,
    Flex,
    Avatar,
    HStack,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    Image,
    Divider,
    Center,
} from '@chakra-ui/react'
// import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { Link } from '../Link/Link'

import { auth } from '../../config/firebase'
import { useUser, useSetUser } from '../../Stores/UserStore'
import { ColourModeSwitcher } from '../ColourModeSwitcher/ColourModeSwitcher'

const LINKS = ['Dashboard', 'Projects', 'Team']

const NavLink = ({ children }) => {
    return (
        <Link
            href={`/${children.toLowerCase()}`}
            text={children}
            px={2}
            py={1}
            rounded={'md'}
            hover={{
                textDecoration: 'none',
                bg: useColorModeValue('gray.200', 'gray.700'),
            }}>
            {children}
        </Link>
    )
}

export const NavBar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const user = useUser()
    const setUser = useSetUser()

    const handleLogout = () => {
        signOut(auth)
        setUser(null)
    }

    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        <Link href="/">
                            <Image src="logo-no-background.png" boxSize={'25px'} />
                        </Link>
                        <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
                            {LINKS.map(link => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </HStack>
                    </HStack>
                    <Flex alignItems={'center'}>
                        {/* <Button variant={'solid'} colorScheme={'teal'} size={'sm'} mr={4} leftIcon={<AddIcon />}>
                            Action
                        </Button> */}
                        <ColourModeSwitcher mr={4} />
                        {user && (
                            <Menu>
                                <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={0}>
                                    <Avatar size={'sm'} name={`${user.firstName} ${user.lastName}`} />
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={handleLogout}>Log out</MenuItem>
                                    <MenuItem>Link 2</MenuItem>
                                    <MenuDivider />
                                    <MenuItem>Link 3</MenuItem>
                                </MenuList>
                            </Menu>
                        )}
                        {!user && (
                            <Center height={'20px'}>
                                <Link href="/login">Login</Link>
                                <Divider orientation="vertical" m={2} />
                                <Link href="/register">Register</Link>
                            </Center>
                        )}
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {LINKS.map(link => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </>
    )
}
