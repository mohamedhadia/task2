import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/dashboard");

  return <div className="w-full p-14">home</div>;
}
