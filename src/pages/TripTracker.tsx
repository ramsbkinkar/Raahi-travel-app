import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import TravelCard from '@/components/TravelCard';
import { getTravelPackages } from '@/lib/supabase';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SupabasePackage {
  id: string;
  title: string;
  description: string | null;
  location: string;
  duration: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  created_at: string | null;
}

interface TravelPackage {
  id: string;
  title: string;
  location: string;
  duration: string;
  price: string;
  image_url: string;
  category: string;
}

const TripTracker: React.FC = () => {
  const { toast } = useToast();
  const [showShareLink, setShowShareLink] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCategory, setCurrentCategory] = useState('all');

  // Sample travel packages data (fallback data while loading from Supabase)
  const samplePackages: TravelPackage[] = [
    {
      id: "1",
      image_url: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      title: "Serene Kashmir Voyage",
      location: "Kashmir, India",
      duration: "6 Days / 5 Nights",
      price: "₹32,999",
      category: "Honeymoon"
    },
    {
      id: "2",
      image_url: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb",
      title: "Goa Beach Adventure",
      location: "Goa, India",
      duration: "4 Days / 3 Nights",
      price: "₹18,499",
      category: "Friends"
    },
    {
      id: "3",
      image_url: "https://images.unsplash.com/photo-1469041797191-50ace28483c3",
      title: "Rajasthan Heritage Tour",
      location: "Rajasthan, India",
      duration: "8 Days / 7 Nights",
      price: "₹45,999",
      category: "Family"
    }
  ];
  
  const { data: supabasePackages = [], isLoading: isLoadingPackages } = useQuery<SupabasePackage[]>({
    queryKey: ['travelPackages', currentCategory],
    queryFn: () => getTravelPackages(currentCategory),
  });

  // Transform Supabase data to match our TravelPackage interface
  const travelPackages: TravelPackage[] = isLoadingPackages ? samplePackages : supabasePackages.map(pkg => ({
    id: pkg.id,
    title: pkg.title,
    location: pkg.location,
    duration: pkg.duration || "Duration not specified",
    price: `₹${pkg.price.toLocaleString()}`,
    image_url: pkg.image_url || "https://images.unsplash.com/photo-1469041797191-50ace28483c3",
    category: pkg.category || "All"
  }));

  const filterPackages = (packages: TravelPackage[], search: string) => {
    return packages.filter(pkg => 
      pkg.title.toLowerCase().includes(search.toLowerCase()) || 
      pkg.location.toLowerCase().includes(search.toLowerCase())
    );
  };

  const handleShare = () => {
    setShowShareLink(true);
    toast({
      title: "Link Copied!",
      description: "Trip tracking link has been copied to clipboard.",
      duration: 3000,
    });
  };
  
  const travelersData = [
    {
      id: 1,
      name: "Amit Sharma",
      avatar: "https://i.pravatar.cc/150?img=1",
      location: "New Delhi",
      coordinates: { x: 30, y: 35 },
      lastUpdated: "2 minutes ago"
    },
    {
      id: 2,
      name: "Priya Patel",
      avatar: "https://i.pravatar.cc/150?img=2",
      location: "Mumbai",
      coordinates: { x: 22, y: 65 },
      lastUpdated: "5 minutes ago"
    },
    {
      id: 3,
      name: "Rahul Singh",
      avatar: "https://i.pravatar.cc/150?img=3",
      location: "Jaipur",
      coordinates: { x: 35, y: 52 },
      lastUpdated: "15 minutes ago"
    },
    {
      id: 4,
      name: "Ananya Gupta",
      avatar: "https://i.pravatar.cc/150?img=4",
      location: "Kolkata",
      coordinates: { x: 70, y: 45 },
      lastUpdated: "30 minutes ago"
    },
    {
      id: 5,
      name: "Vikram Reddy",
      avatar: "https://i.pravatar.cc/150?img=5",
      location: "Bangalore",
      coordinates: { x: 50, y: 80 },
      lastUpdated: "1 hour ago"
    }
  ];

  return (
    <div className="min-h-screen">
      <NavBar />
      
      {/* Header Section */}
      <section className="pt-28 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Live Group Trip Tracker</h1>
            <p className="text-lg text-gray-600 mb-8">
              Keep track of your travel companions in real-time across India. See where everyone is and stay connected throughout your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-raahi-blue hover:bg-raahi-blue-dark"
                onClick={() => {
                  toast({
                    title: "Location Updated",
                    description: "Your current location has been updated.",
                    duration: 3000,
                  });
                }}
              >
                Update My Location
              </Button>
              <Button 
                variant="outline" 
                className="border-raahi-blue text-raahi-blue hover:bg-raahi-blue-light/30"
                onClick={handleShare}
              >
                Share Trip Link
              </Button>
            </div>
            
            {showShareLink && (
              <div className="mt-4 p-3 bg-gray-50 border rounded-md flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate">
                  https://raahi.travel/trip/TRIP123456
                </span>
                <button 
                  className="text-raahi-blue text-sm font-medium"
                  onClick={() => {
                    toast({
                      title: "Link Copied Again!",
                      description: "Trip tracking link has been copied to clipboard.",
                      duration: 3000,
                    });
                  }}
                >
                  Copy
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Map Container */}
            <div className="relative h-[500px] bg-gray-100">
              {/* India Map Image */}
              <div className="absolute inset-0">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/e/e4/India_topo_big.jpg" 
                  alt="Map of India" 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              {/* Traveler Pins */}
              <TooltipProvider>
                {travelersData.map(traveler => (
                  <Tooltip key={traveler.id}>
                    <TooltipTrigger asChild>
                      <div 
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer animate-bounce"
                        style={{ left: `${traveler.coordinates.x}%`, top: `${traveler.coordinates.y}%` }}
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                            <AvatarImage src={traveler.avatar} alt={traveler.name} />
                            <AvatarFallback>{traveler.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="p-2">
                        <p className="font-semibold">{traveler.name}</p>
                        <p className="text-sm text-gray-500">{traveler.location}</p>
                        <p className="text-xs text-gray-400">Updated {traveler.lastUpdated}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
            
            {/* Legend & Controls */}
            <div className="p-4 border-t">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-sm text-gray-600">Online</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                    <span className="text-sm text-gray-600">Offline</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">Zoom In</Button>
                  <Button variant="outline" size="sm">Zoom Out</Button>
                  <Button variant="outline" size="sm">Center Map</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Travel Packages Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Recommended Travel Packages</h2>
          <p className="text-gray-600 mb-8">
            Discover curated travel experiences perfect for your next adventure across India.
          </p>

          {/* Search & Filter */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search packages by name or location..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Tabs defaultValue="all" onValueChange={setCurrentCategory} className="w-full">
              <TabsList className="mb-6 flex flex-wrap justify-start gap-2">
                <TabsTrigger value="all">All Packages</TabsTrigger>
                <TabsTrigger value="Honeymoon">Honeymoon</TabsTrigger>
                <TabsTrigger value="Adventure">Adventure</TabsTrigger>
                <TabsTrigger value="Spiritual">Spiritual</TabsTrigger>
                <TabsTrigger value="Friends">Friends</TabsTrigger>
                <TabsTrigger value="Family">Family</TabsTrigger>
              </TabsList>

              <TabsContent value={currentCategory}>
                {isLoadingPackages ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-raahi-blue" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filterPackages(travelPackages, searchTerm).map((pkg: TravelPackage) => (
                      <TravelCard
                        key={pkg.id}
                        image={pkg.image_url}
                        title={pkg.title}
                        location={pkg.location}
                        duration={pkg.duration}
                        price={pkg.price}
                        category={pkg.category}
                        id={pkg.id}
                      />
                    ))}
                  </div>
                )}

                {filterPackages(travelPackages, searchTerm).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No packages found matching your search.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-8 text-center">
            <Button 
              variant="outline" 
              className="border-raahi-blue text-raahi-blue hover:bg-raahi-blue-light/30"
              onClick={() => window.location.href = '/travel-packages'}
            >
              View All Packages
            </Button>
          </div>
        </div>
      </section>
      
      {/* Travelers List */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Your Travel Companions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelersData.map(traveler => (
              <div key={traveler.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={traveler.avatar} alt={traveler.name} />
                  <AvatarFallback>{traveler.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="font-medium">{traveler.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>{traveler.location}</span>
                  </div>
                  <p className="text-xs text-gray-400">Updated {traveler.lastUpdated}</p>
                </div>
                
                <Button variant="ghost" size="sm">Message</Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default TripTracker;
