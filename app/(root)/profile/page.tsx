import { auth } from "@clerk/nextjs";
import { Header } from "@/components/shared/Header";

const Profile = () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  console.log(userId);

  return (
    <>
      <Header title="Profile" />
    </>
  );
};

export default Profile;
