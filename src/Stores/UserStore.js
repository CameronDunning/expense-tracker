import create from 'zustand'

const UserStore = create(set => ({
    user: null,
    setUser: user => set({ user }),
}))

export const useUser = () => UserStore(state => state.user)
export const useSetUser = () => UserStore(state => state.setUser)
