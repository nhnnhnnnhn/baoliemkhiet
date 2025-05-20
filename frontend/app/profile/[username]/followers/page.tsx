import { Suspense } from "react"
import FollowersClient from "./followers-client"

export default function FollowersPage({ params }: { params: { username: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FollowersClient username={params.username} />
    </Suspense>
  )
}
