import { useUser } from '../Stores/UserStore'

import { NotLoggedIn } from '../components/Layout/NotLoggedIn'

export const Monthly = () => {
    const user = useUser()

    if (!user) return <NotLoggedIn />

    return <div>Monthly</div>
}
