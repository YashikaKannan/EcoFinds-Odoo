import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Recycle, Heart, ShoppingBag } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-green-600">EcoFinds</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Discover amazing second-hand treasures and give items a new life. Join our sustainable marketplace where
            every purchase makes a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="/marketplace">Start Shopping</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/signup">Join EcoFinds</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose EcoFinds?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're more than just a marketplace - we're a community committed to sustainable living
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Eco-Friendly</h3>
              <p className="text-gray-600 text-sm">Reduce waste by giving items a second life</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Recycle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Sustainable</h3>
              <p className="text-gray-600 text-sm">Support circular economy and sustainable practices</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Community</h3>
              <p className="text-gray-600 text-sm">Connect with like-minded eco-conscious people</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <ShoppingBag className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Great Deals</h3>
              <p className="text-gray-600 text-sm">Find quality items at affordable prices</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Sustainable Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who are making a positive impact on the environment
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/signup">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
