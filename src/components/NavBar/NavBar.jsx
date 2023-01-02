import { signOut } from 'firebase/auth'
import { useNavigate, useLocation } from 'react-router-dom'
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
    useDisclosure,
    useColorModeValue,
    Stack,
    Image,
    Divider,
    Center,
    useToast,
    Link,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { Link as RouterLink } from 'react-router-dom'

import { auth } from '../../config/firebase'
import { useUser, useSetUser } from '../../Stores/UserStore'
import { useSetExpenses } from '../../Stores/ExpensesStore'
import { useSetIncomes } from '../../Stores/IncomesStore'
import { ColourModeSwitcher } from '../ColourModeSwitcher/ColourModeSwitcher'
import { NOTIFICATION_DURATION } from '../../config/constants'

const LINKS = ['Expenses', 'Incomes', 'Summary', 'Monthly', 'Data Entry']

const NavLink = ({ onClose = () => {}, selected = false, children }) => {
    const backgroundColour = useColorModeValue('gray.200', 'gray.700')

    return (
        <Link
            as={RouterLink}
            to={`/${children.toLowerCase().replace(' ', '-')}`}
            text={children}
            px={2}
            py={1}
            rounded={'md'}
            bg={selected ? backgroundColour : undefined}
            _hover={{
                textDecoration: 'none',
                bg: backgroundColour,
            }}
            onClick={onClose}>
            {children}
        </Link>
    )
}

export const NavBar = () => {
    const { pathname } = useLocation()
    const matchedPath = pathname.replace('/', '').replace('-', ' ')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate()
    const toast = useToast()

    const user = useUser()
    const setUser = useSetUser()
    const setExpenses = useSetExpenses()
    const setIncomes = useSetIncomes()

    const handleLogout = () => {
        signOut(auth)
        setUser(null)
        setExpenses([])
        setIncomes([])

        toast({
            title: 'Logged out',
            description: 'You have been logged out',
            status: 'success',
            duration: NOTIFICATION_DURATION,
            isClosable: true,
        })
        navigate('/login')
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
                        <Link as={RouterLink} to="/">
                            <Image src="logo-no-background.png" boxSize={'25px'} />
                        </Link>
                        <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
                            {LINKS.map(link => (
                                <NavLink key={link} selected={link.toLowerCase() === matchedPath}>
                                    {link}
                                </NavLink>
                            ))}
                        </HStack>
                    </HStack>
                    <Flex alignItems={'center'}>
                        <ColourModeSwitcher mr={4} />
                        {user && (
                            <Menu>
                                <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={0}>
                                    <Avatar size={'sm'} name={`${user.firstName} ${user.lastName}`} />
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={handleLogout}>Log out</MenuItem>
                                    <MenuItem>
                                        <Link
                                            as={RouterLink}
                                            to={'/profile'}
                                            _hover={{
                                                textDecoration: 'none',
                                            }}>
                                            Profile
                                        </Link>
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        )}
                        {!user && (
                            <Center height={'20px'}>
                                <Link as={RouterLink} to="/login">
                                    Login
                                </Link>
                                <Divider orientation="vertical" m={2} />
                                <Link as={RouterLink} to="/register">
                                    Register
                                </Link>
                            </Center>
                        )}
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {LINKS.map(link => (
                                <NavLink onClose={onClose} key={link}>
                                    {link}
                                </NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </>
    )
}
