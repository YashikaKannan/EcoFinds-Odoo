"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Leaf, Search, Plus, ShoppingCart, User, Filter, SlidersHorizontal, Star } from "lucide-react"

// Enhanced mock data for products with more attributes
const mockProducts = [
  {
    id: 1,
    title: "Vintage Leather Jacket",
    description: "Classic brown leather jacket in excellent condition",
    category: "Clothing",
    price: 89.99,
    image: "/images/vintage-leather-jacket.png",
    seller: "EcoSeller123",
    condition: "Excellent",
    location: "San Francisco, CA",
    postedDate: "2024-01-15",
    views: 24,
    likes: 8,
    sellerRating: 4.8,
    brand: "Vintage Collection",
    size: "Medium",
  },
  {
    id: 2,
    title: "Wooden Coffee Table",
    description: "Handcrafted oak coffee table, perfect for any living room",
    category: "Furniture",
    price: 150.0,
    image: "/images/wooden-coffee-table.png",
    seller: "FurnitureFinder",
    condition: "Good",
    location: "Los Angeles, CA",
    postedDate: "2024-01-10",
    views: 45,
    likes: 12,
    sellerRating: 4.6,
    brand: "Handcrafted",
    size: "Large",
  },
  {
    id: 3,
    title: "iPhone 12 Pro",
    description: "Unlocked iPhone 12 Pro in great condition with original box",
    category: "Electronics",
    price: 599.99,
    image: "/images/iphone-12-pro.jpg",
    seller: "TechReseller",
    condition: "Very Good",
    location: "New York, NY",
    postedDate: "2024-01-20",
    views: 67,
    likes: 15,
    sellerRating: 4.9,
    brand: "Apple",
    size: "128GB",
  },
  {
    id: 4,
    title: "Designer Handbag",
    description: "Authentic designer handbag, gently used",
    category: "Accessories",
    price: 299.99,
    image: "/images/luxury-quilted-handbag.png",
    seller: "LuxuryFinds",
    condition: "Excellent",
    location: "Miami, FL",
    postedDate: "2024-01-18",
    views: 33,
    likes: 9,
    sellerRating: 4.7,
    brand: "Designer Brand",
    size: "Medium",
  },
  {
    id: 5,
    title: "Mountain Bike",
    description: "Trek mountain bike, perfect for outdoor adventures",
    category: "Sports",
    price: 450.0,
    image: "/images/mountain-bike-trail.png",
    seller: "BikeEnthusiast",
    condition: "Good",
    location: "Denver, CO",
    postedDate: "2024-01-12",
    views: 28,
    likes: 6,
    sellerRating: 4.5,
    brand: "Trek",
    size: "Large",
  },
  {
    id: 6,
    title: "Ceramic Vase Set",
    description: "Beautiful set of 3 ceramic vases for home decoration",
    category: "Home & Garden",
    price: 45.99,
    image: "/images/ceramic-vase-set.png",
    seller: "HomeDecorLover",
    condition: "Like New",
    location: "Seattle, WA",
    postedDate: "2024-01-22",
    views: 19,
    likes: 4,
    sellerRating: 4.4,
    brand: "Artisan Made",
    size: "Set of 3",
  },
]

const categories = ["All", "Clothing", "Electronics", "Furniture", "Accessories", "Sports", "Home & Garden"]
const conditions = ["All", "Like New", "Excellent", "Very Good", "Good", "Fair"]
const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated Seller" },
]

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedCondition, setSelectedCondition] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState("newest")
  const [showOnlyHighRated, setShowOnlyHighRated] = useState(false)
  const [products] = useState(mockProducts)

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesCondition = selectedCondition === "All" || product.condition === selectedCondition
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesRating = !showOnlyHighRated || product.sellerRating >= 4.5

    return matchesSearch && matchesCategory && matchesCondition && matchesPrice && matchesRating
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      case "oldest":
        return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime()
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "popular":
        return b.views + b.likes - (a.views + a.likes)
      case "rating":
        return b.sellerRating - a.sellerRating
      default:
        return 0
    }
  })

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("All")
    setSelectedCondition("All")
    setPriceRange([0, 1000])
    setSortBy("newest")
    setShowOnlyHighRated(false)
  }

  const activeFiltersCount = [
    selectedCategory !== "All",
    selectedCondition !== "All",
    priceRange[0] > 0 || priceRange[1] < 1000,
    showOnlyHighRated,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {/* <Leaf className="h-8 w-8 text-secondary" /> */}
            {/* <h1 className="text-2xl font-bold text-foreground">EcoFinds</h1> */}
          </Link>
          <nav className="flex items-center gap-4">
            {/* <Link href="/add-product">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Sell Item
              </Button>
            </Link> */}
            <Link href="/my-listings">
              <Button variant="outline">My Listings</Button>
            </Link>
            <Link href="/purchases">
              <Button variant="outline">Purchases</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="outline" size="icon">
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">Discover Sustainable Finds</h2>

          {/* Search Bar and Sort */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products, brands, or sellers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden bg-transparent">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filter Products</SheetTitle>
                  <SheetDescription>Refine your search to find exactly what you're looking for</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Mobile filters content - same as desktop */}
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Condition</Label>
                    <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label>Price Range</Label>
                    <div className="px-2">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={1000}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                        id="highRated"
                        checked={showOnlyHighRated}
                        onCheckedChange={(checked) => setShowOnlyHighRated(checked === true)}
                      />

                    <Label htmlFor="highRated" className="text-sm">
                      High-rated sellers only (4.5+ stars)
                    </Label>
                  </div>

                  <Button onClick={clearFilters} variant="outline" className="w-full bg-transparent">
                    Clear All Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Filters */}
          <div className="hidden md:flex items-center gap-4 mb-6">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Label className="text-sm whitespace-nowrap">Price:</Label>
              <div className="w-32">
                <Slider value={priceRange} onValueChange={setPriceRange} max={1000} step={10} className="w-full" />
              </div>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                ${priceRange[0]}-${priceRange[1]}
              </span>
            </div>

            <div className="flex items-center space-x-2">
                  <Checkbox
      id="highRatedDesktop"
      checked={showOnlyHighRated}
      onCheckedChange={(checked) => setShowOnlyHighRated(checked === true)}
    />

              <Label htmlFor="highRatedDesktop" className="text-sm whitespace-nowrap">
                High-rated sellers
              </Label>
            </div>

            {activeFiltersCount > 0 && (
              <Button onClick={clearFilters} variant="outline" size="sm" className="bg-transparent">
                Clear ({activeFiltersCount})
              </Button>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-muted-foreground">
              {sortedProducts.length} {sortedProducts.length === 1 ? "result" : "results"} found
              {searchTerm && ` for "${searchTerm}"`}
            </p>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">
                {activeFiltersCount} filter{activeFiltersCount !== 1 ? "s" : ""} applied
              </Badge>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <img
                  src={product.image || "/images/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg line-clamp-1">{product.title}</CardTitle>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
                <CardDescription className="line-clamp-2 mb-3">{product.description}</CardDescription>

                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {product.condition}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-secondary text-secondary" />
                    <span className="text-xs text-muted-foreground">{product.sellerRating}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-secondary">${product.price}</span>
                  <Link href={`/product/${product.id}`}>
                    <Button size="sm">View Details</Button>
                  </Link>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Sold by {product.seller}</span>
                  <span>{product.views} views</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <SlidersHorizontal className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or filters to find more results
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={clearFilters} variant="outline" className="bg-transparent">
                Clear All Filters
              </Button>
              <Link href="/add-product">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  List an Item
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
