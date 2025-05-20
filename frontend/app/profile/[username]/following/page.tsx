import { Suspense } from "react"
import FollowingClient from "./following-client"

export default function FollowingPage({ params }: { params: { username: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FollowingClient username={params.username} />
    </Suspense>
  )
}
