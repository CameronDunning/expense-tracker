import create from 'zustand'
import { getWindowDimensions } from '../utils/windowDimensions'

const UtilsStore = create(set => ({
    windowDimensions: getWindowDimensions(),
    setWindowDimensions: windowDimensions => set({ windowDimensions }),
}))

export const useWindowDimensions = () => UtilsStore(state => state.windowDimensions)
export const useSetWindowDimensions = () => UtilsStore(state => state.setWindowDimensions)
