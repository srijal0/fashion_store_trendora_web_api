import { redirect } from "next/navigation";
import ProfileForm from "./_components/ProfileForm";

// This will be a client component that fetches on mount
export default function ProfilePage() {
  redirect("/user/profile/client");
}