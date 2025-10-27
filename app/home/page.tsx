"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Search, X, Clock, TrendingUp, Flame, Zap } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function CountdownTimer({ endTime }: { endTime: Date }) {
    const [timeLeft, setTimeLeft] = useState<string>("");

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime.getTime() - now;

            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            } else {
                setTimeLeft("Ended");
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    return <span className="font-mono">{timeLeft}</span>;
}

const auctions = [
    {
        id: 1,
        title: "1965 Ferrari 275 GTB",
        city: "São Paulo",
        state: "SP",
        currentBid: 100000,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        imageUrl: "https://images.girardo.com/girardo/image/upload/2021/03/girardo-co-1965-ferrari-275-gtb-competizione-sn-07437-342-copy.jpg",
    },
    {
        id: 2,
        title: "Rolex Daytona Paul Newman",
        city: "Rio de Janeiro",
        state: "RJ",
        currentBid: 100000,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        imageUrl: "https://www.paradisoluxury.com/28325-extralarge_default/paul-newman-new.jpg",
    },
    {
        id: 3,
        title: "Picasso Original Sketch",
        city: "Belo Horizonte",
        state: "MG",
        currentBid: 100000,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        imageUrl: "https://www.sellingantiques.co.uk/photosnew/dealer_stricklandrussell/dealer_stricklandrussell_highres_1656853879703-3110540682.jpg",
    },
    {
        id: 4,
        title: "Louis XV Armchair Set",
        city: "Salvador",
        state: "BA",
        currentBid: 100000,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        imageUrl: "https://p.turbosquid.com/ts-thumb/0H/KzEfy3/1x/contextsearchimagelouisxv/jpg/1617817062/600x600/fit_q87/69c989843900b781b968bb8775eaecf10adcdc89/contextsearchimagelouisxv.jpg",
    },
    {
        id: 5,
        title: "Ancient Roman Coins",
        city: "Brasília",
        state: "DF",
        currentBid: 100000,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        imageUrl: "https://m.media-amazon.com/images/I/91NjRrx511L._UF894,1000_QL80_.jpg",
    },
    {
        id: 6,
        title: "Diamond Necklace 5ct",
        city: "Curitiba",
        state: "PR",
        currentBid: 100000,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        imageUrl: "https://vplive-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2020/11/JC1491_2.jpg",
    },
    {
        id: 7,
        title: "Harley-Davidson 1940",
        city: "Brasília",
        state: "DF",
        currentBid: 100000,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        imageUrl: "https://dempseymotorsports.com/wp-content/uploads/2018/10/h_57-1024x768.jpg",
    },
]

export default function Home() {

    const [open, setOpen] = useState(false);

    return (
        <main className="flex flex-col gap-4">

            <Tabs defaultValue="latest" className="w-full">
                <ScrollArea className="w-full">
                    <TabsList className="text-foreground mb-3 h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1">
                        <TabsTrigger
                            value="latest"
                            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                            <Clock
                                className="-ms-0.5 me-1.5 opacity-60"
                                size={16}
                                aria-hidden="true"
                            />
                            Latest
                        </TabsTrigger>
                        <TabsTrigger
                            value="ending"
                            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                            <Zap
                                className="-ms-0.5 me-1.5 opacity-60"
                                size={16}
                                aria-hidden="true"
                            />
                            Ending Soon
                        </TabsTrigger>
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                <TabsContent value="latest" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                        {auctions.map((auction) => {
                            return (
                                <Card key={auction.id} className="overflow-hidden p-0 hover:shadow-lg transition-shadow">
                                    <div className="relative aspect-[4/3] w-full">
                                        <Image
                                            src={auction.imageUrl}
                                            alt={auction.title}
                                            fill
                                            unoptimized
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover"
                                        />
                                    </div>
                                    <CardHeader className="gap-2">
                                        <CardTitle className="text-base">{auction.title}</CardTitle>
                                        <CardDescription className="text-xs text-muted-foreground">
                                            {auction.city} • {auction.state}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-full space-y-3 pb-6 flex flex-col justify-end">
                                        <div className="flex flex-col items-center justify-between gap-3">
                                            <div className="text-lg font-semibold">
                                                {auction.currentBid.toLocaleString("us", { style: "currency", currency: "USD" })}
                                                <span className="text-sm font-normal text-muted-foreground"> current bid</span>
                                            </div>
                                            <Button className="shrink-0 w-full">Place Bid</Button>
                                        </div>
                                        <span className="text-xs text-center text-muted-foreground">
                                            Ends in <CountdownTimer endTime={auction.endTime} />
                                        </span>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>

                <TabsContent value="popular" className="mt-6">
                    <p className="text-muted-foreground pt-1 text-center text-sm">
                        Popular auctions coming soon...
                    </p>
                </TabsContent>

                <TabsContent value="trending" className="mt-6">
                    <p className="text-muted-foreground pt-1 text-center text-sm">
                        Trending auctions coming soon...
                    </p>
                </TabsContent>

                <TabsContent value="ending" className="mt-6">
                    <p className="text-muted-foreground pt-1 text-center text-sm">
                        Ending soon auctions coming soon...
                    </p>
                </TabsContent>
            </Tabs>

            <div className="flex items-center justify-end">
                <Button variant="outline" onClick={() => setOpen(true)}>
                    <Filter />
                    Filter
                </Button>
            </div>


            {/* Filters Sheet */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                        <SheetDescription>
                            Refine your search results
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-6 mt-6">
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
