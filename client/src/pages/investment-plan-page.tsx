import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronRight, Info } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { calculateTotalROI, weeksToDays } from "@/lib/crypto-utils";
import { useCrypto } from "@/context/crypto-context";

// Investment Plans Data
const investmentPlans = [
  {
    id: "silver",
    name: "Silver",
    dailyRoi: 2,
    duration: 1, // weeks
    minInvestment: 100,
    features: [
      "Daily ROI payouts",
      "1 week investment term",
      "Access to basic market insights",
      "Email support"
    ],
    description: "Perfect for beginners looking to test the waters with cryptocurrency investments.",
    iconBg: "bg-gray-800",
    isPopular: false,
  },
  {
    id: "gold",
    name: "Gold",
    dailyRoi: 3,
    duration: 2, // weeks
    minInvestment: 150,
    features: [
      "Enhanced daily ROI payouts",
      "2 weeks investment term",
      "Priority withdrawal processing",
      "Market analysis reports",
      "Email and chat support"
    ],
    description: "Our balanced option for investors seeking consistent growth with a medium-term commitment.",
    iconBg: "bg-amber-900",
    isPopular: false,
  },
  {
    id: "platinum",
    name: "Platinum",
    dailyRoi: 4,
    duration: 3, // weeks
    minInvestment: 250,
    features: [
      "Premium daily ROI payouts",
      "3 weeks investment term",
      "Advanced portfolio diversification",
      "Real-time market alerts",
      "VIP withdrawal processing",
      "Priority email, chat, and phone support"
    ],
    description: "For serious investors looking for higher returns with expert insights and premium benefits.",
    iconBg: "bg-blue-900",
    isPopular: false,
  },
  {
    id: "diamond",
    name: "Diamond",
    dailyRoi: 5,
    duration: 4, // weeks
    minInvestment: 400,
    features: [
      "Maximum daily ROI payouts",
      "4 weeks investment term",
      "Expert investment strategy consulting",
      "Custom portfolio management",
      "Instant withdrawal processing",
      "24/7 dedicated account manager",
      "Exclusive investment opportunities"
    ],
    description: "Our elite plan offering maximum returns and comprehensive benefits for professional investors.",
    iconBg: "bg-teal-900",
    isPopular: true,
  }
];

export default function InvestmentPlansPage() {
  const { user } = useAuth();
  const { setSelectedPlan } = useCrypto();
  const [activeTab, setActiveTab] = useState("compare");
  
  // Calculate total ROI for each plan
  const plansWithTotalROI = investmentPlans.map(plan => ({
    ...plan,
    totalROI: calculateTotalROI(1000, plan.dailyRoi, weeksToDays(plan.duration)),
    totalDays: weeksToDays(plan.duration)
  }));

  const handleSelectPlan = (plan) => {
    if (user) {
      setSelectedPlan(plan);
      // Navigate to dashboard for deposit
      window.location.href = "/dashboard";
    } else {
      // Navigate to auth page
      window.location.href = "/auth";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-foreground">
      <SiteHeader />
      
      <main className="flex-grow">
        {/* Header Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Premium <span className="text-accent">Investment Plans</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Compare our investment plans and choose the one that best suits your financial goals.
            </p>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="compare">Compare Plans</TabsTrigger>
                <TabsTrigger value="details">Plan Details</TabsTrigger>
              </TabsList>
              
              {/* Compare Plans Tab */}
              <TabsContent value="compare" className="pt-8">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-4 px-6 text-left">Features</th>
                        {plansWithTotalROI.map((plan) => (
                          <th key={plan.id} className="py-4 px-6 text-center">
                            <div className="font-bold text-lg">{plan.name}</div>
                            {plan.isPopular && (
                              <Badge variant="outline" className="mt-1 bg-accent/20 text-accent border-accent">
                                Most Popular
                              </Badge>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="py-4 px-6 text-left font-semibold">Daily ROI</td>
                        {plansWithTotalROI.map((plan) => (
                          <td key={plan.id} className="py-4 px-6 text-center">
                            <span className="text-accent font-bold">{plan.dailyRoi}%</span>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-4 px-6 text-left font-semibold">Investment Term</td>
                        {plansWithTotalROI.map((plan) => (
                          <td key={plan.id} className="py-4 px-6 text-center">
                            {plan.duration} {plan.duration === 1 ? 'week' : 'weeks'} ({plan.totalDays} days)
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-4 px-6 text-left font-semibold">Minimum Investment</td>
                        {plansWithTotalROI.map((plan) => (
                          <td key={plan.id} className="py-4 px-6 text-center">
                            <span className="font-bold">${plan.minInvestment}</span>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-4 px-6 text-left font-semibold">
                          <div className="flex items-center">
                            <span>Total ROI</span>
                            <Info className="h-4 w-4 ml-1 text-muted-foreground" />
                          </div>
                          <div className="text-xs text-muted-foreground">Based on $1,000 investment</div>
                        </td>
                        {plansWithTotalROI.map((plan) => (
                          <td key={plan.id} className="py-4 px-6 text-center">
                            <span className="text-accent font-bold">${plan.totalROI.toFixed(2)}</span>
                            <div className="text-xs text-muted-foreground">({plan.dailyRoi * plan.totalDays}% total)</div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-4 px-6"></td>
                        {plansWithTotalROI.map((plan) => (
                          <td key={plan.id} className="py-4 px-6 text-center">
                            <Button 
                              variant={plan.isPopular ? "default" : "outline"}
                              className={plan.isPopular ? "" : "border-accent text-accent hover:bg-accent hover:text-primary"}
                              onClick={() => handleSelectPlan(plan)}
                            >
                              Select Plan
                            </Button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              {/* Plan Details Tab */}
              <TabsContent value="details" className="pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {plansWithTotalROI.map((plan) => (
                    <Card key={plan.id} className={`${plan.isPopular ? 'border-accent' : 'border-border'} bg-card`}>
                      <CardHeader className={`${plan.iconBg} rounded-t-lg`}>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-xl">{plan.name}</CardTitle>
                          {plan.isPopular && (
                            <Badge variant="outline" className="bg-accent/20 text-accent border-accent">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-card-foreground opacity-90">
                          {plan.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="mb-6">
                          <p className="text-3xl font-bold text-accent">{plan.dailyRoi}%</p>
                          <p className="text-muted-foreground">Daily ROI</p>
                        </div>
                        <div className="mb-6">
                          <p className="text-lg font-semibold">${plan.minInvestment} minimum</p>
                          <p className="text-muted-foreground">{plan.duration} {plan.duration === 1 ? 'week' : 'weeks'} term</p>
                        </div>
                        <div>
                          <p className="font-semibold mb-2">Plan Features:</p>
                          <ul className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <Check className="h-5 w-5 text-accent shrink-0 mr-2" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          variant={plan.isPopular ? "default" : "outline"}
                          onClick={() => handleSelectPlan(plan)}
                        >
                          <span>Get Started</span>
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-12 px-4 bg-black">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Frequently Asked <span className="text-accent">Questions</span>
            </h2>
            
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">How are the returns generated?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Returns are generated through strategic cryptocurrency trading, staking, and yield farming 
                    across different blockchain networks, managed by our expert team.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">When can I withdraw my earnings?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Daily ROI earnings are credited to your account daily and can be withdrawn once they reach 
                    a minimum threshold of $50, while principal amounts are locked until the end of the term.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">What cryptocurrencies do you accept?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We currently accept Bitcoin (BTC), Ethereum (ETH), and Solana (SOL) for deposits.
                    Additional cryptocurrencies may be added in the future.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Can I upgrade my investment plan?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, you can upgrade to a higher tier plan at any time by making an additional investment
                    that meets the minimum requirement for the new plan.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Is there a maximum investment limit?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    There is no maximum investment limit for our plans. However, for investments over $50,000,
                    please contact our support team for personalized assistance.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">How secure are my investments?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your investments are secured through advanced encryption, multi-signature wallets, and 
                    strict internal controls. We also maintain a reserve fund to ensure stability.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4 bg-black">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of investors already growing their portfolios with Grail Capitals.
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/auth">Create Account</Link>
                </Button>
                <Button variant="outline" asChild size="lg" 
                  className="border-accent text-accent hover:bg-accent hover:text-primary">
                  <Link href="#plans">Compare Plans</Link>
                </Button>
              </div>
            ) : (
              <Button asChild size="lg">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            )}
          </div>
        </section>
      </main>
      
      <SiteFooter />
    </div>
  );
}
