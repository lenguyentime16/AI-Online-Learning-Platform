'use client';

import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function HeaderButtons() {
    const { isSignedIn } = useUser();

    if (isSignedIn) {
        return (
            <div className="flex items-center space-x-4">
                <Link href="/workspace">
                    <Button className="bg-gradient-to-r from-blue-600 to-pink-500 hover:from-blue-700 hover:to-pink-600">
                        Go to Dashboard
                    </Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-4">
            <Link href="/sign-in">
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                    Sign In
                </Button>
            </Link>
            <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-blue-600 to-pink-500 hover:from-blue-700 hover:to-pink-600">
                    Sign Up
                </Button>
            </Link>
        </div>
    );
}
