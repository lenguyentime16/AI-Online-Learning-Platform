import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";


export default function Home() {
  return (
    <div>
      <h2>Hello world!</h2>
      <Button>Hello</Button>
      <UserButton />
    </div>
  );
}
