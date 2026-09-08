import { redirect } from "next/navigation";

export default function Page() {
  redirect("/accounts?id=acc-amundi");
}
