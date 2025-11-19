"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Search, X, Clock, TrendingUp, Filter } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EndingSoonTab } from "./_components/ending-soon-tab";
import { NewestTab } from "./_components/newest-tab";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export type Auction = {
    _id: string;
    _creationTime: number;
    title: string;
    city: string;
    state: string;
    currentBid?: number;
    expiringAt: number;
    imageUrl?: string[];
    description: string
}

export default function Home() {

    const [open, setOpen] = useState(false);
    const auctions = useQuery(api.items.getAllItems) || []
    console.log(auctions)

    return (
        <main className="flex flex-col gap-4 overflow-y-auto">
            <Tabs className="w-full flex flex-col gap-4" defaultValue="endingSoon">
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="endingSoon">
                            <Clock className="size-4" />
                            Terminando em breve
                        </TabsTrigger>
                        <TabsTrigger value="newest">
                            <TrendingUp className="size-4" />
                            Recentes
                        </TabsTrigger>
                    </TabsList>
                    <Button variant="outline" onClick={() => setOpen(true)}>
                        <Filter className="size-4" />
                        Filtrar
                    </Button>
                </div>
                <TabsContent value="endingSoon" className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    <EndingSoonTab auctions={auctions} />
                </TabsContent>
                <TabsContent value="newest" className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    <NewestTab auctions={auctions} />
                </TabsContent>
            </Tabs>

            {/* Filters Sheet */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                        <SheetDescription>
                            Refine your search results
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-6 mt-6 px-6">
                        {/* Search */}
                        <div className="relative">
                            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                            <Input className="w-full pl-9 h-9 text-sm" placeholder="Search auctions..." />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Category</Label>
                            <Select defaultValue="all">
                                <SelectTrigger className="w-full h-9 text-sm">
                                    <SelectValue placeholder="All categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="cars">Classic Cars</SelectItem>
                                    <SelectItem value="watches">Luxury Watches</SelectItem>
                                    <SelectItem value="art">Fine Art</SelectItem>
                                    <SelectItem value="antiques">Antiques</SelectItem>
                                    <SelectItem value="jewelry">Jewelry</SelectItem>
                                    <SelectItem value="collectibles">Collectibles</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Location</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Input className="h-9 text-sm" placeholder="State" />
                                <Input className="h-9 text-sm" placeholder="City" />
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="space-y-3">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Price Range</Label>
                            <div className="space-y-3">
                                <Slider className="w-full" defaultValue={[20, 80]} />
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">$0</span>
                                    <span className="text-muted-foreground">$100k</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4">
                            <Button className="flex-1">Apply Filters</Button>
                            <Button variant="outline" className="flex-1">
                                <X className="size-4 mr-2" />
                                Clear
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

        </main>
    );
}
