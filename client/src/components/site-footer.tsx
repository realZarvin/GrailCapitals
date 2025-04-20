import { Link } from "wouter";

export function SiteFooter() {
  return (
    <footer className="bg-black py-10 px-4 border-t border-zinc-800">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-2xl font-bold flex items-center mb-4">
              <span className="text-accent mr-1">Grail</span>
              <span className="text-foreground">Capitals</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              Maximize your crypto investments with our premium plans designed for optimal returns.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">
                <i className="fab fa-telegram"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">
                <i className="fab fa-discord"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-muted-foreground hover:text-accent transition-colors duration-200">Home</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">About Us</a></li>
              <li><a href="/#plans" className="text-muted-foreground hover:text-accent transition-colors duration-200">Investment Plans</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">FAQ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">Terms & Conditions</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">Risk Disclosure</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">Anti-Money Laundering</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">Refund Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-muted-foreground">
                <i className="fas fa-envelope mr-3 text-accent"></i>
                <span>support@grailcapitals.com</span>
              </li>
              <li className="flex items-center text-muted-foreground">
                <i className="fas fa-phone-alt mr-3 text-accent"></i>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center text-muted-foreground">
                <i className="fas fa-clock mr-3 text-accent"></i>
                <span>24/7 Support</span>
              </li>
            </ul>
            
            <div className="mt-6">
              <h4 className="text-lg font-bold mb-4">Security</h4>
              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-white/10 p-2 rounded-md">
                  <i className="fas fa-lock text-accent mr-2"></i>
                  <span>SSL Secure</span>
                </div>
                <div className="flex items-center bg-white/10 p-2 rounded-md">
                  <i className="fas fa-shield-alt text-accent mr-2"></i>
                  <span>Protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Grail Capitals. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm text-center md:text-right">
            <i className="fas fa-exclamation-triangle text-accent mr-1"></i>
            Risk Disclaimer: Cryptocurrency investments are volatile. Only invest what you can afford to lose.
          </p>
        </div>
      </div>
    </footer>
  );
}
