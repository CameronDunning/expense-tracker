import {
    VStack,
    StackDivider,
    Box,
    Text,
    Heading,
    Flex,
    Icon,
    Spacer,
    HStack,
    Divider,
    IconButton,
} from '@chakra-ui/react'
import { TbArrowsSplit } from 'react-icons/tb'
import { FaPencilAlt, FaRedoAlt, FaTrashAlt } from 'react-icons/fa'

import { formatter } from '../../utils/currencyFormatter'
import { DATE_FORMATTING } from '../../config/constants'

export const MobileTable = ({ expenses }) => {
    return (
        <VStack divider={<StackDivider borderColor="gray.400" />} spacing={4} w={'100%'}>
            {expenses &&
                expenses.map(expense => (
                    <Box mb={1} w={'100%'}>
                        <Flex>
                            <Box>
                                <Text fontWeight={700} textTransform={'uppercase'} color={'gray.500'}>
                                    {expense.category}
                                </Text>
                                <Heading color={'white'} mb={1}>
                                    {expense.expenseName}
                                </Heading>
                                <Text color={'gray.400'}>
                                    {expense.date.toDate().toLocaleDateString(undefined, DATE_FORMATTING)}
                                </Text>
                            </Box>
                            <Spacer />
                            <Flex>
                                <VStack alignItems={'end'}>
                                    <Text color={'gray.500'} fontWeight={700} fontSize={'2xl'} lineHeight={0.9}>
                                        {formatter.format(expense.amount)}
                                    </Text>
                                    {expense.split ? (
                                        <Text color={'gray.500'} fontWeight={700} fontSize={'large'}>
                                            {'(' + formatter.format(expense.amount / 2) + ')'}
                                        </Text>
                                    ) : (
                                        <Spacer />
                                    )}
                                    <HStack>
                                        <Flex
                                            w={8}
                                            h={8}
                                            align={'center'}
                                            justify={'center'}
                                            rounded={'full'}
                                            bg={expense.split ? 'green.500' : 'gray.400'}>
                                            <Icon as={TbArrowsSplit} size={'md'} w={5} h={5} />
                                        </Flex>
                                        <Flex
                                            w={8}
                                            h={8}
                                            align={'center'}
                                            justify={'center'}
                                            rounded={'full'}
                                            bg={expense.recurring ? 'green.500' : 'gray.400'}>
                                            <Icon as={FaRedoAlt} size={'md'} w={5} h={5} />
                                        </Flex>
                                    </HStack>
                                </VStack>
                            </Flex>
                            <Box>
                                <Divider orientation="vertical" mx={6} />
                            </Box>
                            <Box>
                                <VStack h={'100%'}>
                                    <IconButton
                                        w={8}
                                        h={8}
                                        align={'center'}
                                        justify={'center'}
                                        rounded={'15%'}
                                        bg={'blue.500'}>
                                        <Icon as={FaPencilAlt} size={'md'} w={5} h={5} />
                                    </IconButton>
                                    <Spacer />
                                    <IconButton
                                        w={8}
                                        h={8}
                                        align={'center'}
                                        justify={'center'}
                                        rounded={'15%'}
                                        bg={'red.500'}>
                                        <Icon as={FaTrashAlt} size={'md'} w={5} h={5} />
                                    </IconButton>
                                </VStack>
                            </Box>
                        </Flex>
                    </Box>
                ))}
        </VStack>
    )
}
