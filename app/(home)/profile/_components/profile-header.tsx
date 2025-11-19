"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award } from "lucide-react"
import type { User } from "./types"

interface ProfileHeaderProps {
    user: User
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar className="size-20">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl">{user.name}</CardTitle>
                            <CardDescription className="text-base">{user.email}</CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}

