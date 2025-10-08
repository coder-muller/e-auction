import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

type Category =
  | "Electronics"
  | "Clothing"
  | "Home & Garden"
  | "Sports"
  | "Books"
  | "Arts & Collectibles"
  | "Other";

const categories: Record<Category, string[]> = {
  Electronics: [
    "MacBook Pro", "iPhone", "Samsung TV", "PlayStation", "Xbox",
    "Digital Camera", "Bluetooth Speaker", "Smartwatch"
  ],
  Clothing: [
    "Leather Jacket", "Sneakers", "Designer Dress", "Wool Sweater",
    "Jeans", "Formal Suit", "Running Shoes", "T-Shirt"
  ],
  "Home & Garden": [
    "Coffee Maker", "Dining Table", "Vacuum Cleaner", "Lamp",
    "Sofa", "Cookware Set", "Garden Tools", "Bookshelf"
  ],
  Sports: [
    "Mountain Bike", "Tennis Racket", "Soccer Ball", "Yoga Mat",
    "Golf Clubs", "Hiking Backpack", "Running Shoes", "Skateboard"
  ],
  Books: [
    "Hardcover Novel", "Comic Book", "Cookbook", "History Book",
    "Science Textbook", "Fantasy Series", "Biography", "Poetry Collection"
  ],
  "Arts & Collectibles": [
    "Oil Painting", "Vinyl Record", "Action Figure", "Autographed Poster",
    "Sculpture", "Trading Card Set", "Photography Print", "Ceramic Vase"
  ],
  Other: [
    "Board Game", "Puzzle Set", "Musical Instrument", "Camping Tent",
    "Toy Collection", "Vintage Coin", "Antique Clock", "Handcrafted Basket"
  ]
};

function generateSampleItems(count: number) {
  const descriptors = [
    "Vintage", "Limited Edition", "Rare", "Classic", "Stylish",
    "Elegant", "Durable", "Compact", "Premium", "Lightweight",
    "Signed", "Collectible", "Luxury", "Refurbished", "Handmade",
    "Modern", "Custom", "Exclusive", "Eco-Friendly", "Portable"
  ];

  const categoriesList = Object.keys(categories) as Category[];

  const randomElement = <T,>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

  const items = [];
  for (let i = 0; i < count; i++) {
    const category = randomElement(categoriesList);
    const descriptor = randomElement(descriptors);
    const product = randomElement(categories[category]);
    const year = 2000 + Math.floor(Math.random() * 25);

    const title = `${descriptor} ${product} ${year}`;
    const description = `A ${descriptor.toLowerCase()} ${product} from ${year}. Perfect for collectors or everyday use.`;

    const startingPrice = Math.floor(Math.random() * 500) + 20;
    const durationHours = [1, 6, 12, 24, 72, 168][Math.floor(Math.random() * 4)];

    items.push({
      title,
      description,
      startingPrice,
      category,
      durationHours,
    });
  }

  return items;
}

const ITEMS_TO_GENERATE = 100;
const sampleItems = generateSampleItems(ITEMS_TO_GENERATE);


export const seedDatabase = internalMutation({
  args: { 
    userId: v.id("users"),
    count: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const itemsToCreate = args.count ? sampleItems.slice(0, args.count) : sampleItems;
    const now = Date.now();
    
    const createdItems = [];
    
    for (const item of itemsToCreate) {
      // Add some randomness to starting times (some started recently, some a while ago)
      const startOffset = Math.random() * 12 * 60 * 60 * 1000; // Random offset up to 12 hours ago
      const startingAt = now - startOffset;
      const expiringAt = startingAt + (item.durationHours * 60 * 60 * 1000);
      
      // Randomly add some bids to make it more realistic
      const shouldHaveBids = Math.random() > 0.3; // 70% chance of having bids
      const startingPriceInCents = item.startingPrice * 100;
      let lastBidValue = startingPriceInCents;
      
      if (shouldHaveBids) {
        // Add 1-5 bid increments
        const bidIncrements = Math.floor(Math.random() * 5) + 1;
        for (let i = 0; i < bidIncrements; i++) {
          lastBidValue += Math.floor(Math.random() * 50) + 10; // Add $0.10 to $0.60 per bid
        }
      }
      
      const itemId = await ctx.db.insert("items", {
        title: item.title,
        description: item.description,
        startingPrice: startingPriceInCents,
        lastBidValue,
        sellerId: args.userId,
        status: expiringAt > now ? "live" : "ended",
        startingAt,
        expiringAt,
        category: item.category,
        ...(shouldHaveBids && expiringAt <= now ? { winnerId: args.userId } : {}),
      });
      
      createdItems.push(itemId);
    }
    
    return {
      message: `Successfully created ${createdItems.length} sample auction items`,
      itemIds: createdItems,
    };
  },
});

// Helper function to clear all items (for testing)
export const clearAllItems = internalMutation({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("items").collect();
    const bids = await ctx.db.query("bids").collect();
    const transactions = await ctx.db.query("transactions").collect();
    
    // Delete all related data
    for (const transaction of transactions) {
      await ctx.db.delete(transaction._id);
    }
    
    for (const bid of bids) {
      await ctx.db.delete(bid._id);
    }
    
    for (const item of items) {
      await ctx.db.delete(item._id);
    }
    
    return {
      message: `Cleared ${items.length} items, ${bids.length} bids, and ${transactions.length} transactions`,
    };
  },
});
