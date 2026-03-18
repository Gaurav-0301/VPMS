import React from 'react';
import { Shield, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = (props) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-white border-t border-slate-100 pt-16 pb-8 px-6 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
                <Shield className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Gatekeeper</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Securing workplaces with smart, digital visitor management solutions. Built for safety and efficiency.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to={props.link1} className="hover:text-indigo-600 transition-colors">{props.opt1}</Link></li>
              <li><Link to={props.link2} className="hover:text-indigo-600 transition-colors">{props.opt2}</Link></li>
              <li><Link to={props.link3} className="hover:text-indigo-600 transition-colors">{props.opt3}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Support</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Newsletter/Social */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Stay Connected</h4>
            <div className="flex gap-4">
              <SocialIcon icon={<Github size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
              <SocialIcon icon={<Mail size={18} />} />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400 uppercase tracking-widest">
          <p>© {currentYear} Gatekeeper. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600 transition-colors">Status: System Operational</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon }) => (
  <a href="#" className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all duration-300">
    {icon}
  </a>
);

export default Footer;