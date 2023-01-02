import { useState } from 'react'

import { deleteDoc, doc } from 'firebase/firestore'
import {
    VStack,
    StackDivider,
    Box,
    Text,
    Heading,
    Flex,
    Icon,
    Spacer,
    Divider,
    IconButton,
    useDisclosure,
    HStack,
    Button,
} from '@chakra-ui/react'
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'

import { currencyFormatter } from '../../utils/numberFormatter'
import { DATE_FORMATTING } from '../../config/constants'
import { db } from '../../config/firebase'
import { useUser } from '../../Stores/UserStore'
import { IncomeEditorModal } from './IncomeEditorModal'

const IN_VIEW_INCREMENT = 50

export const MobileTable = ({ incomes }) => {
    const user = useUser()
    const modalControls = useDisclosure()
    const [selectedIncome, setSelectedIncome] = useState(null)
    const [numberIncomesInView, setNumberIncomesInView] = useState(IN_VIEW_INCREMENT)

    const handleEditClick = income => {
        setSelectedIncome(income)

        modalControls.onOpen()
    }

    const handleDelete = income => {
        deleteDoc(doc(db, `/users/${user.uid}/incomes`, income.id))
    }

    return (
        <>
            <VStack divider={<StackDivider borderColor="gray.400" />} spacing={4} w={'100%'}>
                {incomes &&
                    incomes.map((income, key) => {
                        if (key > numberIncomesInView) return null

                        return (
                            <Box key={income.id} mb={1} w={'100%'}>
                                <Flex>
                                    <Box>
                                        <Heading color={'white'} mb={1}>
                                            {income.incomeName}
                                        </Heading>
                                        <Text color={'gray.400'}>
                                            {income.date.toDate().toLocaleDateString(undefined, DATE_FORMATTING)}
                                        </Text>
                                    </Box>
                                    <Spacer />
                                    <Flex>
                                        <VStack alignItems={'end'}>
                                            <Text
                                                color={'gray.500'}
                                                fontWeight={700}
                                                fontSize={'2xl'}
                                                lineHeight={0.9}
                                                mt={1}>
                                                {currencyFormatter.format(income.amount)}
                                            </Text>
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
                                                bg={'blue.500'}
                                                _hover={{ bg: 'blue.500' }}
                                                onClick={() => handleEditClick(income)}>
                                                <Icon as={FaPencilAlt} />
                                            </IconButton>
                                            <Spacer />
                                            <IconButton
                                                w={8}
                                                h={8}
                                                align={'center'}
                                                justify={'center'}
                                                rounded={'15%'}
                                                bg={'red.500'}
                                                _hover={{ bg: 'red.500' }}
                                                onClick={() => handleDelete(income)}>
                                                <Icon as={FaTrashAlt} />
                                            </IconButton>
                                        </VStack>
                                    </Box>
                                </Flex>
                            </Box>
                        )
                    })}
            </VStack>
            {incomes && incomes.length > numberIncomesInView && (
                <HStack justifyContent={'center'}>
                    <Button m={5} onClick={() => setNumberIncomesInView(numberIncomesInView + IN_VIEW_INCREMENT)}>
                        Show more incomes
                    </Button>
                </HStack>
            )}
            <IncomeEditorModal modalControls={modalControls} income={selectedIncome} />
        </>
    )
}
