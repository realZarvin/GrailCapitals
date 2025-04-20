import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { InvestmentPlanCard } from "@/components/investment-plan-card";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const investmentPlans = [
  {
    id: "silver",
    name: "Silver",
    dailyRoi: 2,
    duration: 1, // weeks
    minInvestment: 100,
    icon: <i className="fas fa-coins text-gray-400 text-xl"></i>,
    iconBg: "bg-gray-700",
    isPopular: false,
  },
  {
    id: "gold",
    name: "Gold",
    dailyRoi: 3,
    duration: 2, // weeks
    minInvestment: 150,
    icon: <i className="fas fa-medal text-amber-500 text-xl"></i>,
    iconBg: "bg-amber-900",
    isPopular: false,
  },
  {
    id: "platinum",
    name: "Platinum",
    dailyRoi: 4,
    duration: 3, // weeks
    minInvestment: 250,
    icon: <i className="fas fa-award text-blue-400 text-xl"></i>,
    iconBg: "bg-blue-900",
    isPopular: false,
  },
  {
    id: "diamond",
    name: "Diamond",
    dailyRoi: 5,
    duration: 4, // weeks
    minInvestment: 400,
    icon: <i className="fas fa-gem text-teal-400 text-xl"></i>,
    iconBg: "bg-teal-900",
    isPopular: true,
  }
];

const securityFeatures = [
  {
    icon: "fas fa-shield-alt",
    title: "SSL Encryption",
    description: "All data is encrypted with bank-level security to protect your personal and financial information."
  },
  {
    icon: "fas fa-lock",
    title: "Two-Factor Authentication",
    description: "Add an extra layer of security to your account with our 2FA feature for logins and withdrawals."
  },
  {
    icon: "fas fa-wallet",
    title: "Cold Storage",
    description: "The majority of funds are stored in cold wallets, disconnected from the internet for maximum security."
  },
  {
    icon: "fas fa-eye-slash",
    title: "Privacy Protection",
    description: "Your personal data is protected with strict privacy policies and advanced security protocols."
  },
  {
    icon: "fas fa-code-branch",
    title: "Secure Blockchain Transactions",
    description: "All cryptocurrency transactions are executed on their respective blockchains for maximum transparency."
  },
  {
    icon: "fas fa-headset",
    title: "24/7 Support",
    description: "Our dedicated support team is available around the clock to assist with any security concerns."
  }
];

export default function HomePage() {
  const { user, isLoading } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-black text-foreground">
      <SiteHeader />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-black py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-foreground">Invest in Your Future with </span>
              <span className="text-accent">Grail Capitals</span>
            </h1>
            <p className="text-muted-foreground text-xl md:text-2xl max-w-3xl mx-auto mb-10">
              Maximize your crypto investments with our premium plans designed for optimal returns.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
              {!isLoading && !user ? (
                <>
                  <Button asChild size="lg" className="text-lg px-8 py-6 h-auto font-bold">
                    <Link href="/auth">Get Started Now</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto font-bold border-accent text-accent hover:bg-accent hover:text-primary">
                    <a href="#plans">Learn More</a>
                  </Button>
                </>
              ) : (
                <Button asChild size="lg" className="text-lg px-8 py-6 h-auto font-bold">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-accent">24/7</span>
                <span className="text-muted-foreground mt-2">Support</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-accent">$10M+</span>
                <span className="text-muted-foreground mt-2">Managed</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-accent">10K+</span>
                <span className="text-muted-foreground mt-2">Users</span>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Plans Section */}
        <section id="plans" className="py-20 px-4 bg-black">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our <span className="text-accent">Investment Plans</span></h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Choose from our carefully designed investment packages tailored to meet your financial goals.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {investmentPlans.map((plan) => (
                <InvestmentPlanCard key={plan.id} plan={plan} />
              ))}
            </div>
            
            <div className="mt-10 text-center text-muted-foreground text-sm">
              <p>T&Cs apply to all packages. <a href="#" className="text-accent hover:underline">View Terms & Conditions</a></p>
              <p className="mt-2"><i className="fas fa-exclamation-triangle text-accent mr-1"></i> Risk Disclaimer: Cryptocurrency investments are volatile. Only invest what you can afford to lose.</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 bg-black">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How <span className="text-accent">It Works</span></h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Simple steps to start growing your crypto investments with Grail Capitals.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-user-plus text-accent text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">Create an Account</h3>
                <p className="text-muted-foreground">Sign up with your email and complete the simple verification process to get started.</p>
              </div>
              
              <div className="bg-card p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-wallet text-accent text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">Make a Deposit</h3>
                <p className="text-muted-foreground">Choose your investment plan and deposit using BTC, ETH, or SOL to activate your investment.</p>
              </div>
              
              <div className="bg-card p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-chart-line text-accent text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">Watch Your Profits Grow</h3>
                <p className="text-muted-foreground">Monitor your daily returns on the dashboard and withdraw profits according to your plan terms.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="py-20 px-4 bg-black">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Your <span className="text-accent">Security</span> Is Our Priority</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">We employ the most advanced security measures to ensure your investments are protected.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-4 mt-1">
                    <i className={`${feature.icon} text-accent text-2xl`}></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-black">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Investment Journey?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-10 text-lg">Join thousands of investors already growing their portfolio with Grail Capitals.</p>
            {!isLoading && !user ? (
              <Button asChild size="lg" className="text-lg px-8 py-6 h-auto font-bold">
                <Link href="/auth">Create Your Account Now</Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="text-lg px-8 py-6 h-auto font-bold">
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
