import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Mail, MessageSquare, Phone, User, AlertCircle } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
  category: z.string(),
});

// FAQ data
const faqs = [
  {
    category: "account",
    questions: [
      {
        question: "How do I create an account?",
        answer: "To create an account, click on the 'Get Started' or 'Sign Up' button on the homepage. Fill out the registration form with your personal details, create a secure password, and agree to the terms and conditions. Once you submit the form, you'll receive a verification email to activate your account."
      },
      {
        question: "How can I recover my password?",
        answer: "If you've forgotten your password, click on the 'Forgot Password' link on the login page. Enter your registered email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password. For security reasons, password reset links expire after 24 hours."
      },
      {
        question: "Can I change my email address?",
        answer: "Yes, you can change your email address in your account settings. Log in to your account, go to the 'Profile' page, and update your email in the 'General' tab. You'll need to verify the new email address before the change takes effect."
      },
      {
        question: "How do I enable two-factor authentication?",
        answer: "To enable two-factor authentication (2FA), go to your 'Profile' page, navigate to the 'Security' tab, and toggle on the 2FA option. You'll need to scan a QR code with an authenticator app (like Google Authenticator or Authy) and enter the verification code to complete the setup."
      }
    ]
  },
  {
    category: "investments",
    questions: [
      {
        question: "What investment plans do you offer?",
        answer: "We offer four investment plans with varying ROI rates and terms: Silver (2% daily ROI, 1 week term, $100 minimum), Gold (3% daily ROI, 2 weeks term, $150 minimum), Platinum (4% daily ROI, 3 weeks term, $250 minimum), and Diamond (5% daily ROI, 4 weeks term, $400 minimum). Each plan is designed to cater to different investment goals and risk appetites."
      },
      {
        question: "How is my ROI calculated?",
        answer: "Your Return on Investment (ROI) is calculated daily based on your initial deposit amount and the ROI rate of your chosen plan. For example, if you invest $1,000 in the Gold plan with a 3% daily ROI, you'll earn $30 per day for the duration of the investment term."
      },
      {
        question: "Can I withdraw my investment before the term ends?",
        answer: "Your principal investment is locked for the duration of the investment term. However, you can withdraw your daily ROI earnings once they reach the minimum withdrawal threshold of $50. Early withdrawal of the principal amount is not available to ensure our investment strategies can operate as designed."
      },
      {
        question: "Can I have multiple investment plans at once?",
        answer: "Yes, you can invest in multiple plans simultaneously. Each investment is tracked separately with its own ROI calculation and term period. This strategy allows you to diversify your investments across different ROI rates and term lengths."
      }
    ]
  },
  {
    category: "deposits",
    questions: [
      {
        question: "What cryptocurrencies do you accept for deposits?",
        answer: "We currently accept Bitcoin (BTC), Ethereum (ETH), and Solana (SOL) for deposits. We're continually evaluating additional cryptocurrencies to add to our platform."
      },
      {
        question: "How long does it take for my deposit to be credited?",
        answer: "Deposits are typically credited to your account within 15-60 minutes after receiving the required blockchain confirmations. Bitcoin requires 3 confirmations, Ethereum requires 12 confirmations, and Solana requires 32 confirmations. You'll receive a notification once your deposit is confirmed."
      },
      {
        question: "Is there a minimum deposit amount?",
        answer: "Yes, the minimum deposit amount depends on your chosen investment plan: $100 for Silver, $150 for Gold, $250 for Platinum, and $400 for Diamond. There's no maximum limit on deposits."
      },
      {
        question: "Can I deposit using fiat currency?",
        answer: "Currently, we only accept cryptocurrency deposits. We do not support fiat currency deposits via bank transfer, credit card, or other payment methods. This allows us to maintain lower fees and faster processing times."
      }
    ]
  },
  {
    category: "withdrawals",
    questions: [
      {
        question: "How do I withdraw my earnings?",
        answer: "To withdraw your earnings, navigate to the 'Dashboard' page and click on the 'Withdraw Funds' button. Select the cryptocurrency you wish to receive (BTC, ETH, or SOL), enter the amount, and confirm your withdrawal request. The funds will be sent to your registered wallet address."
      },
      {
        question: "What is the minimum withdrawal amount?",
        answer: "The minimum withdrawal amount is $50 (or equivalent in cryptocurrency). This minimum applies to all withdrawal requests regardless of the cryptocurrency selected."
      },
      {
        question: "How long do withdrawals take to process?",
        answer: "Withdrawal requests are typically processed within 24 hours. Once processed, the transaction is submitted to the blockchain network, and the time to reach your wallet depends on network congestion and the cryptocurrency selected. BTC withdrawals usually take 30-60 minutes, ETH withdrawals 5-10 minutes, and SOL withdrawals 1-2 minutes."
      },
      {
        question: "Are there any fees for withdrawals?",
        answer: "We do not charge any platform fees for withdrawals. However, blockchain network fees apply and are deducted from the withdrawal amount. These fees vary depending on network congestion and the cryptocurrency selected."
      }
    ]
  },
  {
    category: "security",
    questions: [
      {
        question: "How do you secure my investments?",
        answer: "We employ multiple security measures to protect your investments, including SSL encryption for all communications, cold storage for the majority of funds, two-factor authentication for accounts, multi-signature wallets requiring multiple approvals for large transactions, and regular security audits by third-party firms."
      },
      {
        question: "What happens if I lose my 2FA device?",
        answer: "If you lose your 2FA device, you'll need to contact our support team with identity verification documents. After verifying your identity, we'll disable 2FA on your account and guide you through setting it up again with a new device. This process typically takes 1-3 business days for security purposes."
      },
      {
        question: "Is my personal information secure?",
        answer: "Yes, we take data privacy very seriously. Your personal information is encrypted and stored in secure databases with strict access controls. We comply with international data protection regulations and never share your information with third parties without your consent unless required by law."
      },
      {
        question: "What should I do if I notice suspicious activity on my account?",
        answer: "If you notice any suspicious activity, immediately change your password, ensure 2FA is enabled, and contact our support team. We recommend using a unique password for our platform and enabling email notifications for all account activities."
      }
    ]
  }
];

export default function SupportPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeFaqCategory, setActiveFaqCategory] = useState("account");
  const [activeTab, setActiveTab] = useState("faq");
  
  // Contact form with react-hook-form
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: user?.fullName || "",
      email: user?.email || "",
      subject: "",
      message: "",
      category: "general",
    },
  });
  
  // Support ticket mutation
  const submitTicketMutation = useMutation({
    mutationFn: async (data: z.infer<typeof contactFormSchema>) => {
      const res = await apiRequest("POST", "/api/support/ticket", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Support ticket submitted",
        description: "We've received your message and will respond as soon as possible.",
      });
      form.reset({
        name: user?.fullName || "",
        email: user?.email || "",
        subject: "",
        message: "",
        category: "general",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle contact form submission
  const onSubmit = (data: z.infer<typeof contactFormSchema>) => {
    submitTicketMutation.mutate(data);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-black text-foreground">
      <SiteHeader />
      
      <main className="flex-grow">
        {/* Header Section */}
        <section className="py-12 px-4 bg-black">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-accent">Support</span> & Resources
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Find answers to common questions or reach out to our dedicated support team for assistance.
            </p>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl mx-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="faq">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  FAQs
                </TabsTrigger>
                <TabsTrigger value="contact">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Us
                </TabsTrigger>
              </TabsList>
              
              {/* FAQ Tab */}
              <TabsContent value="faq" className="pt-8">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>
                      Browse through our most common questions and answers
                    </CardDescription>
                    
                    <div className="mt-4">
                      <Tabs value={activeFaqCategory} onValueChange={setActiveFaqCategory}>
                        <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto">
                          <TabsTrigger value="account" className="py-2 px-3">Account</TabsTrigger>
                          <TabsTrigger value="investments" className="py-2 px-3">Investments</TabsTrigger>
                          <TabsTrigger value="deposits" className="py-2 px-3">Deposits</TabsTrigger>
                          <TabsTrigger value="withdrawals" className="py-2 px-3">Withdrawals</TabsTrigger>
                          <TabsTrigger value="security" className="py-2 px-3">Security</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-6">
                      {faqs
                        .find(category => category.category === activeFaqCategory)
                        ?.questions.map((faq, index) => (
                          <div key={index} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
                            <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                            <p className="text-muted-foreground">{faq.answer}</p>
                          </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 p-4 bg-accent/10 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Can't find what you're looking for?</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            If you couldn't find the answer to your question, please don't hesitate to contact our support team. 
                            We're available 24/7 to assist you.
                          </p>
                          <Button 
                            variant="link" 
                            className="text-accent p-0 h-auto mt-2"
                            onClick={() => setActiveTab("contact")}
                          >
                            Contact Support →
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Contact Tab */}
              <TabsContent value="contact" className="pt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Contact Form */}
                  <div className="md:col-span-2">
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle>Send Us a Message</CardTitle>
                        <CardDescription>
                          Fill out the form below and our team will get back to you as soon as possible
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                      <Input className="pl-10" placeholder="Your full name" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Address</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                      <Input className="pl-10" type="email" placeholder="Your email address" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="general">General Inquiry</SelectItem>
                                      <SelectItem value="account">Account Issues</SelectItem>
                                      <SelectItem value="deposit">Deposit Problems</SelectItem>
                                      <SelectItem value="withdrawal">Withdrawal Issues</SelectItem>
                                      <SelectItem value="investment">Investment Questions</SelectItem>
                                      <SelectItem value="technical">Technical Support</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="subject"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Subject</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Brief description of your inquiry" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="message"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Message</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Please provide as much detail as possible" 
                                      className="min-h-32" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Include any relevant details such as transaction IDs or screenshots
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="pt-2">
                              <Button 
                                type="submit" 
                                className="w-full"
                                disabled={submitTicketMutation.isPending}
                              >
                                {submitTicketMutation.isPending ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                  </>
                                ) : "Submit Support Ticket"}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Contact Information */}
                  <div>
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                        <CardDescription>
                          Alternative ways to reach our support team
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-6">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                            <Mail className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-medium">Email Support</p>
                            <p className="text-sm text-accent mt-1">support@grailcapitals.com</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Response time: 1-2 business hours
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                            <MessageSquare className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-medium">Live Chat</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Available 24/7 for immediate assistance
                            </p>
                            <Button variant="link" className="text-accent p-0 h-auto mt-1">
                              Start Chat
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                            <Phone className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-medium">Phone Support</p>
                            <p className="text-sm text-accent mt-1">+1 (888) 123-4567</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Mon-Fri: 9am-5pm EST
                            </p>
                          </div>
                        </div>
                        
                        <div className="pt-4 mt-4 border-t border-border">
                          <p className="font-medium mb-3">Support Hours</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Email & Chat:</span>
                              <span>24/7</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Phone Support:</span>
                              <span>Mon-Fri, 9am-5pm EST</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4 mt-4 border-t border-border">
                          <p className="font-medium mb-3">Priority Support</p>
                          <p className="text-sm text-muted-foreground">
                            Diamond and Platinum plan investors receive priority support with dedicated account managers.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Quick Resources */}
                    <Card className="bg-card border-border mt-6">
                      <CardHeader>
                        <CardTitle>Quick Resources</CardTitle>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full justify-start border-accent text-accent hover:bg-accent hover:text-card-foreground">
                          <i className="fas fa-book-open mr-2"></i>
                          User Guide
                        </Button>
                        
                        <Button variant="outline" className="w-full justify-start border-accent text-accent hover:bg-accent hover:text-card-foreground">
                          <i className="fas fa-file-alt mr-2"></i>
                          Terms & Conditions
                        </Button>
                        
                        <Button variant="outline" className="w-full justify-start border-accent text-accent hover:bg-accent hover:text-card-foreground">
                          <i className="fas fa-shield-alt mr-2"></i>
                          Privacy Policy
                        </Button>
                        
                        <Button variant="outline" className="w-full justify-start border-accent text-accent hover:bg-accent hover:text-card-foreground">
                          <i className="fas fa-video mr-2"></i>
                          Video Tutorials
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <SiteFooter />
    </div>
  );
}
