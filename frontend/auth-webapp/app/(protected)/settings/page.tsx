'use client'

import { logout } from "@/actions/logout"
import { useCurrentUser } from "@/hooks/use-current-user"


const SettingsPage = () => {
  const session = useCurrentUser()

  const onClick= () => {
    logout()
  }

  return ( 
    <div>
      {JSON.stringify(session)}
      <div> 
        <button onClick={onClick} type="submit">
          Sign out
        </button>
      </div>
    </div>
   )
}

export default SettingsPage