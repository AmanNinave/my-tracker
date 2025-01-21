import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Session } from "next-auth"; // Import Session type

export default async function Dashboard() {
  const session = await getServerSession(authOptions) as Session | null; // Type assertion

  if (!session) {
    return <div>Access Denied</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user?.name}!</p> {/* Safe access using optional chaining */}
      <p>Your ID is: {session.user.id}</p>
      {session.user.role && <p>Your role is: {session.user.role}</p>}
    </div>
  );
}