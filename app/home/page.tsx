"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Filter } from "lucide-react";

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
  return (
    <main className="flex flex-col gap-4">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All auctions from all around the world</h1>
        <Button variant="outline">
          <Filter />
          Filter
        </Button>
      </div>

      {/* Auction List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
                <p className="text-xs text-center text-muted-foreground">
                  Ends in <CountdownTimer endTime={auction.endTime} />
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}