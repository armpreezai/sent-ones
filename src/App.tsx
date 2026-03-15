import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Calendar, 
  Users, 
  Link as LinkIcon, 
  DollarSign, 
  BookOpen, 
  Anchor, 
  Mail,
  Menu,
  Bell,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Clock,
  ExternalLink,
  Play,
  Heart,
  X,
  CheckCircle2,
  Flame,
  Bird,
  Crown,
  Facebook,
  Instagram,
  Youtube,
  Phone,
  FileText,
  Download,
  RefreshCw,
  Trash2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchUpcomingData, UpcomingItem } from './services/googleSheets';
import { cn } from './lib/utils';
import { getApiUrl } from './config';

// --- Types ---
type Screen = 'home' | 'about-us' | 'services' | 'ministries' | 'connect' | 'giving' | 'school' | 'soul-anchored' | 'contact' | 'notes' | 'upcoming' | 'upcoming-boksburg' | 'upcoming-benoni' | 'upcoming-boksburg-speaker' | 'upcoming-boksburg-events' | 'upcoming-benoni-speaker' | 'upcoming-benoni-events';

// --- Components ---

const Button = ({ children, onClick, className, variant = 'primary', disabled, type = 'button' }: { children: React.ReactNode, onClick?: () => void, className?: string, variant?: 'primary' | 'secondary' | 'outline', disabled?: boolean, type?: 'button' | 'submit' | 'reset' }) => {
  const variants = {
    primary: 'bg-[#00A89E] text-white hover:bg-[#008e85] disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-white text-[#00A89E] border border-[#00A89E] disabled:opacity-50 disabled:cursor-not-allowed',
    outline: 'bg-transparent border border-white text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed'
  };
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn('px-6 py-3 rounded-xl font-semibold transition-all active:scale-95 flex items-center justify-center gap-2', variants[variant], className)}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={cn('bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden', className)}
  >
    {children}
  </div>
);

const Input = ({ label, placeholder, type = 'text', value, onChange, ...props }: any) => (
  <div className="space-y-1.5 w-full text-center">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">{label}</label>
    <input 
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#00A89E] focus:ring-1 focus:ring-[#00A89E] outline-none transition-all"
      {...props}
    />
  </div>
);

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ y: '100%' }} 
          animate={{ y: 0 }} 
          exit={{ y: '100%' }}
          className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        >
          <div className="p-6 border-bottom flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="p-6 overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const RegistrationModal = ({ isOpen, onClose, type, title, eventName }: { isOpen: boolean, onClose: () => void, type: 'gods_girls' | 'mens_breakfast' | 'home_group' | 'event', title: string, eventName?: string }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    mobile: '',
    email: '',
    groupType: 'Mixed Adults'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: any = { 
        name: formData.name,
        surname: formData.surname,
        mobile: formData.mobile,
        email: formData.email,
        type,
        eventName
      };

      if (type === 'home_group') {
        payload.groupType = formData.groupType;
      }

      const response = await fetch(getApiUrl('/api/connect-registration'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          setFormData({ name: '', surname: '', mobile: '', email: '', groupType: 'Mixed Adults' });
        }, 2000);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        {isSuccess ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Registration Successful!</h3>
            <p className="text-gray-600">We've received your information and will be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Name" 
                placeholder="First name" 
                value={formData.name} 
                onChange={(e: any) => setFormData({...formData, name: e.target.value})} 
                required 
              />
              <Input 
                label="Surname" 
                placeholder="Last name" 
                value={formData.surname} 
                onChange={(e: any) => setFormData({...formData, surname: e.target.value})} 
                required 
              />
            </div>
            <Input 
              label="Mobile Number" 
              placeholder="000 000 0000" 
              value={formData.mobile} 
              onChange={(e: any) => setFormData({...formData, mobile: e.target.value})} 
              required 
            />
            <Input 
              label="Email" 
              type="email" 
              placeholder="email@example.com" 
              value={formData.email} 
              onChange={(e: any) => setFormData({...formData, email: e.target.value})} 
              required 
            />
            {type === 'home_group' && (
              <div className="space-y-1.5 w-full text-center">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Group Type</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#00A89E] focus:ring-1 focus:ring-[#00A89E] outline-none transition-all"
                  value={formData.groupType}
                  onChange={(e) => setFormData({...formData, groupType: e.target.value})}
                >
                  <option>Young Couples</option>
                  <option>Men Only</option>
                  <option>Women Only</option>
                  <option>Mixed Adults</option>
                </select>
              </div>
            )}
            <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Confirm'}
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
};

const PageBanner = ({ title, onBack }: { title: string, onBack?: () => void }) => (
  <div className="relative flex items-center justify-center py-12 px-2 md:px-4 overflow-hidden">
    {onBack && (
      <button 
        onClick={onBack}
        className="absolute left-0 top-1/2 -translate-y-1/2 p-2 hover:bg-[#00A89E]/10 rounded-full transition-colors text-[#00A89E]"
        aria-label="Go back"
      >
        <ChevronLeft size={28} strokeWidth={2.5} />
      </button>
    )}
    <div className="flex flex-col gap-1.5 shrink-0 w-8 sm:w-12 md:w-24 lg:w-32">
      <div className="h-px bg-[#00A89E]/30 w-full"></div>
      <div className="h-px bg-[#00A89E]/30 w-full"></div>
    </div>
    <h1 className="text-3xl md:text-5xl font-serif italic text-[#00A89E] mx-3 md:mx-8 text-center leading-tight">
      {title}
    </h1>
    <div className="flex flex-col gap-1.5 shrink-0 w-8 sm:w-12 md:w-24 lg:w-32">
      <div className="h-px bg-[#00A89E]/30 w-full"></div>
      <div className="h-px bg-[#00A89E]/30 w-full"></div>
    </div>
  </div>
);

// --- Screens ---

const HomeScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  const [showWatchModal, setShowWatchModal] = useState(false);

  return (
    <div className="space-y-8 pb-24">
      {/* Hero */}
      <div className="pt-4 mx-2">
        <div className="relative overflow-hidden rounded-[2rem] shadow-lg">
          <img 
            src="/home-picture.jpeg" 
            alt="Sent Ones Holy Spirit Ministry" 
            className="w-full h-auto"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Service Times Section */}
      <section className="px-4 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="overflow-hidden rounded-2xl shadow-md aspect-[3/4]">
            <img 
              src="/benoni-service-times.png" 
              className="w-full h-full object-cover" 
              alt="Boksburg Service Times"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="overflow-hidden rounded-2xl shadow-md aspect-[3/4]">
            <img 
              src="/benoni-service-times.png" 
              className="w-full h-full object-cover" 
              alt="Benoni Service Times"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        
        <Button 
          className="w-full bg-[#00A89E] hover:bg-[#008c84] text-white py-6 rounded-full font-bold shadow-lg"
          onClick={() => setShowWatchModal(true)}
        >
          Watch The Service Online
        </Button>
      </section>

      <Modal isOpen={showWatchModal} onClose={() => setShowWatchModal(false)} title="Watch Online">
        <div className="space-y-4 py-4">
          <p className="text-center text-gray-600 mb-6">Choose your preferred platform to join our live stream:</p>
          <div className="grid gap-4">
            <Button 
              className="w-full bg-[#1877F2] hover:bg-[#166fe5] border-none flex items-center justify-center gap-3 h-14 text-lg"
              onClick={() => window.open('https://www.facebook.com/sentonesministry/', '_blank')}
            >
              <Facebook size={24} />
              Watch on Facebook
            </Button>
            <Button 
              className="w-full bg-[#FF0000] hover:bg-[#e60000] border-none flex items-center justify-center gap-3 h-14 text-lg"
              onClick={() => window.open('https://www.youtube.com/@sentonesholyspiritministry2320', '_blank')}
            >
              <Youtube size={24} />
              Watch on YouTube
            </Button>
          </div>
        </div>
      </Modal>

      {/* Connect Section: Where can I get involved? */}
      <section className="px-4 space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-[#00A89E] font-bold text-sm uppercase tracking-wider">Connect in the church</p>
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">Where can I get involved?</h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="overflow-hidden rounded-2xl shadow-sm">
            <img 
              src="/blueprint.jpeg" 
              className="w-full h-auto block" 
              alt="Blueprint Young Adults"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="overflow-hidden rounded-2xl shadow-sm">
            <img 
              src="/bible-study.jpeg" 
              className="w-full h-auto block" 
              alt="Bible Study"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="overflow-hidden rounded-2xl shadow-sm">
            <img 
              src="/kingdom-kiddies.jpeg" 
              className="w-full h-auto block" 
              alt="Kingdom Kiddies"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Statement of Faith Banner */}
      <section className="px-4">
        <div 
          className="relative overflow-hidden rounded-3xl shadow-md cursor-pointer group" 
          onClick={() => window.open('https://sentones.co.za/wp-content/uploads/2023/04/STATEMENT-OF-FAITH.pdf', '_blank')}
        >
          <img 
            src="/statement-of-faith.jpeg" 
            className="w-full h-auto block transition-transform duration-500 group-hover:scale-105" 
            alt="Statement of Faith" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-[#00A89E] px-8 py-3 rounded-full text-white font-bold shadow-lg">
              Statement Of Faith
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="px-4">
        <img 
          src="/banner.jpeg" 
          className="rounded-2xl w-full h-auto object-cover shadow-md" 
          alt="Banner" 
          referrerPolicy="no-referrer"
        />
      </section>
    </div>
  );
};

const AboutUsScreen = () => {
  return (
    <div className="space-y-8 pb-24">
      <PageBanner title="About Us" />

      {/* About Section: Who are we? */}
      <section className="px-4 space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-[#00A89E] font-bold text-sm uppercase tracking-wider">About Sent Ones</p>
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">Who are we?</h2>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed text-sm text-center">
            Sent Ones Holy Spirit Ministry is a Christian Church with two campuses in Boksburg and Benoni. 
            Our vision is to model the authentic church of Jesus Christ, preparing our Lord's bride for when He returns. 
            A home for saints and a safe haven for the lost and dying. A church for all nations and in every nation. 
            We are a church that only sees one 'race' the human race, representing all nations from diverse walks of life, 
            bringing everyone to the stature and maturity of Jesus Christ.
          </p>
          
          <div className="space-y-2 text-center">
            <p className="font-bold text-gray-900 text-sm">We have been sent to:</p>
            <div className="flex justify-center">
              <ul className="space-y-2 text-left">
                {[
                  'CREATE an environment to',
                  'EDUCATE the church, to',
                  'EMPOWER and',
                  'TRAIN the called, and to',
                  'MOBILISE the chosen.'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700 text-sm">
                    <div className="bg-[#00A89E] p-1 rounded-full shrink-0">
                      <CheckCircle2 size={12} className="text-white" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pastors Section: Meet Our Pastors */}
      <section className="px-4 space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-[#00A89E] font-bold text-sm uppercase tracking-wider">The Founders</p>
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">Meet Our Pastors</h2>
        </div>

        <div className="space-y-6">
          <img 
            src="/ps-al-and-nat.jpeg" 
            className="w-full rounded-3xl shadow-xl" 
            alt="Apostle Aldrick and Pastor Natalie Carlsen" 
            referrerPolicy="no-referrer"
          />
          
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed text-center">
            <p className="font-bold text-gray-900">FOUNDED – May 1, 2013</p>
            <p>
              Apostle Aldrick Carlsen and Pastor Natalie Carlsen Senior Pastors & Founders of Sent Ones Holy Spirit Ministry.
            </p>
            <p>
              In May of 2013, the Lord planted within Apostle Aldrick heart, the vision and desire to begin a ministry in Boksburg. 
              With a heart for the lost and dying, to raise up true son's and daughter's of God to be the change the world needs to 
              see by bringing hope and solutions to the various world systems.
            </p>
            <p>
              Whilst serving and ministering at various ministries in South Africa, Apostle Aldrick developing Kingdom minded 
              relationships, having the same heart to come into the one authentic church of Jesus Christ. Always focusing on 
              true intimacy with the God head (Almighty Father, Jesus Christ the eternal Son and precious Holy Spirit) through 
              sincere praise, worship, anointed preaching, anointed teaching with demonstrating the Word of God.
            </p>
            <p>
              Making sure to always reveal the Heart, Mind, Glory, Kingdom and Power of God our Father, revealing Jesus our Lord 
              and always submitting to the leading of Holy Spirit and His mandate, authority and power.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const ServicesScreen = () => {
  const [showWatchModal, setShowWatchModal] = useState(false);
  const [formData, setFormData] = useState({ 
    parentName: '', 
    contactNumber: '', 
    email: '', 
    numChildren: 1,
    children: [{ name: '', age: '', gender: 'M' }]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNumChildrenChange = (num: number) => {
    const newChildren = [...formData.children];
    if (num > newChildren.length) {
      for (let i = newChildren.length; i < num; i++) {
        newChildren.push({ name: '', age: '', gender: 'M' });
      }
    } else {
      newChildren.splice(num);
    }
    setFormData({ ...formData, numChildren: num, children: newChildren });
  };

  const handleChildChange = (index: number, field: string, value: string) => {
    const newChildren = [...formData.children];
    newChildren[index] = { ...newChildren[index], [field]: value };
    setFormData({ ...formData, children: newChildren });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(getApiUrl('/api/register-kingdom-kiddies'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        alert('Success! Your children are registered for Kingdom Kiddies.');
        setFormData({ 
          parentName: '', 
          contactNumber: '', 
          email: '', 
          numChildren: 1,
          children: [{ name: '', age: '', gender: 'M' }]
        });
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to register. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-1 pb-0">
      <PageBanner title="Services" />

      <section className="px-4 space-y-2">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-center">What to Expect</h2>
          <div className="space-y-4">
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer font-semibold text-[#00A89E]">
                Holy Spirit-led Worship
                <ChevronRight size={20} className="group-open:rotate-90 transition-transform" />
              </summary>
              <p className="mt-2 text-sm text-gray-600">We are a home away from home for believers, led by the Holy Spirit. Come expectant, ready to worship and delight in the presence of the Lord.</p>
            </details>
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer font-semibold text-[#00A89E]">
                Infant Rooms & Facilities
                <ChevronRight size={20} className="group-open:rotate-90 transition-transform" />
              </summary>
              <p className="mt-2 text-sm text-gray-600">We have a separate private room for mommies with infants and also a family room for families with young babies and toddlers. </p>
            </details>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="bg-[#00A89E] border-none" onClick={() => setShowWatchModal(true)}>
            Watch Online
          </Button>
          <Button variant="secondary" onClick={() => window.open('https://www.youtube.com/@sentonesholyspiritministry2320', '_blank')}>
            Sermons
          </Button>
        </div>
      </section>

      <Modal isOpen={showWatchModal} onClose={() => setShowWatchModal(false)} title="Watch Online">
        <div className="space-y-4 py-4">
          <p className="text-center text-gray-600 mb-6">Choose your preferred platform to join our live stream:</p>
          <div className="grid gap-4">
            <Button 
              className="w-full bg-[#1877F2] hover:bg-[#166fe5] border-none flex items-center justify-center gap-3 h-14 text-lg"
              onClick={() => window.open('https://www.facebook.com/sentonesministry/', '_blank')}
            >
              <Facebook size={24} />
              Watch on Facebook
            </Button>
            <Button 
              className="w-full bg-[#FF0000] hover:bg-[#e60000] border-none flex items-center justify-center gap-3 h-14 text-lg"
              onClick={() => window.open('https://www.youtube.com/@sentonesholyspiritministry2320', '_blank')}
            >
              <Youtube size={24} />
              Watch on YouTube
            </Button>
          </div>
        </div>
      </Modal>

      <section className="px-4">
        <div className="flex justify-center mt-4">
          <img 
            src="/kingdom-kiddies-picture.jpeg" 
            alt="Kingdom Kiddies" 
            className="h-48 object-contain rounded-2xl shadow-lg"
            referrerPolicy="no-referrer"
          />
        </div>
        <Card className="p-6 -mt-4">
          <p className="text-sm text-gray-600 mb-2 text-center">Register your children (ages 3-12) for our Sunday morning program.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input 
                label="Parent Name & Surname" 
                placeholder="Full name" 
                value={formData.parentName} 
                onChange={(e: any) => setFormData({...formData, parentName: e.target.value})} 
                required
              />
              <Input 
                label="Contact Number" 
                placeholder="082..." 
                value={formData.contactNumber} 
                onChange={(e: any) => setFormData({...formData, contactNumber: e.target.value})} 
                required
              />
              <Input 
                label="Email" 
                placeholder="your@email.com" 
                type="email"
                value={formData.email} 
                onChange={(e: any) => setFormData({...formData, email: e.target.value})} 
                required
              />
              
              <div className="space-y-1.5 text-center">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">How many children?</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#00A89E] outline-none"
                  value={formData.numChildren}
                  onChange={(e) => handleNumChildrenChange(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-gray-100">
              {formData.children.map((child, index) => (
                <div key={index} className="space-y-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-bold text-[#00A89E] uppercase tracking-widest">Child {index + 1} Details</p>
                  <Input 
                    label="Child Name & Surname" 
                    placeholder="Full name" 
                    value={child.name} 
                    onChange={(e: any) => handleChildChange(index, 'name', e.target.value)} 
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label="Child Age" 
                      placeholder="Age" 
                      type="number"
                      value={child.age} 
                      onChange={(e: any) => handleChildChange(index, 'age', e.target.value)} 
                      required
                    />
                    <div className="space-y-1.5 text-center">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Gender</label>
                      <select 
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 focus:border-[#00A89E] outline-none"
                        value={child.gender}
                        onChange={(e) => handleChildChange(index, 'gender', e.target.value)}
                      >
                        <option value="M">M</option>
                        <option value="F">F</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register Children'}
            </Button>
          </form>
        </Card>

        <div className="flex justify-center -mt-6">
          <img 
            src="/kingdom-kiddies-logo.png" 
            alt="Kingdom Kiddies Logo" 
            className="h-48 object-contain rounded-xl"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>
    </div>
  );
};

const MinistriesScreen = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    surname: '', 
    email: '', 
    contact: '', 
    area: '',
    message: '',
    supportAreas: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supportOptions = [
    "Financial",
    "Relationships",
    "Grief",
    "Divorce",
    "Trauma",
    "Identity",
    "Other"
  ];

  const handleCheckboxChange = (option: string) => {
    setFormData(prev => ({
      ...prev,
      supportAreas: prev.supportAreas.includes(option)
        ? prev.supportAreas.filter(item => item !== option)
        : [...prev.supportAreas, option]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.surname || !formData.email || !formData.contact) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(getApiUrl('/api/counselling-request'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        alert('Success! Your counselling request has been sent.');
        setFormData({ 
          name: '', 
          surname: '', 
          email: '', 
          contact: '', 
          area: '',
          message: '',
          supportAreas: [] as string[]
        });
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to send request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-12 bg-white">
      <PageBanner title="Ministries" />


      <div className="max-w-6xl mx-auto px-4 space-y-16">
        {/* Kneel with us in Prayer */}
        <section className="space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <img 
              src="/breakthrough-prayer.png" 
              alt="Breakthrough Prayer" 
              className="w-full max-w-5xl h-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight text-center">Kneel with us in Prayer</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="rounded-3xl overflow-hidden shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-500 w-full">
              <img 
                src="/prayerimage.gif" 
                alt="Prayer" 
                className="w-full h-full object-cover aspect-[4/3]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-gray-600 text-base leading-relaxed text-center md:text-left">
              <p>Join us every Friday night at 19h00 for our Prayer Meetings with Apostle Aldrick. Prayer is the most effective way to commune with God, and in that intimate time with Him, you can expect transformation.</p>
            </div>
          </div>
        </section>

        {/* Blueprint Young Adults */}
        <section className="space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <img 
              src="/blue-print-youth.png" 
              alt="Blueprint Youth" 
              className="w-full max-w-5xl h-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight text-center">
              Real Faith. Real Fun<br />
              Real Friends
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div className="rounded-3xl overflow-hidden shadow-xl transform -rotate-1 hover:rotate-0 transition-transform duration-500 w-full">
              <img 
                src="/blueprintimage.gif" 
                alt="Young Adults" 
                className="w-full h-full object-cover aspect-[4/3]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-2 text-center md:text-left">
              <div className="text-gray-600 text-base leading-relaxed">
                <p>Blueprint Young Adults meets every Friday at 19h00 for a night of connection, growth, and purpose. It's more than just a movement of 18-30(ish)-year-olds who are serious about Jesus.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Christian Counselling */}
        <section className="space-y-4">
          <div className="flex justify-center">
            <img 
              src="/christian-counselling.png" 
              alt="Christian Counselling" 
              className="w-full max-w-5xl h-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Reach Out</h2>
              <div className="space-y-3 text-gray-600 text-base leading-relaxed">
                <p>Sent Ones Holy Spirit Ministry serves our local community by offering Christian counselling. We seek to help our members spiritually and emotionally as we journey through life.</p>
                <p>If you are looking for Godly counselling please contact us for an appointment.</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-[#00A89E]/10 shadow-sm space-y-1 inline-block">
                <p className="font-bold text-[#00A89E] text-sm">Call us on: 074 212 0296</p>
                <p className="font-bold text-[#00A89E] text-sm">Email: counselling@sentones.co.za</p>
              </div>
            </div>

            <div className="space-y-4 w-full max-w-sm">
              <p className="font-bold text-base text-gray-900">Areas we support:</p>
              <div className="grid grid-cols-2 gap-3">
                {supportOptions.map((area, i) => (
                  <div 
                    key={i} 
                    className="p-2.5 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-center transition-transform hover:scale-[1.02]"
                  >
                    <p className="text-[13px] font-bold text-slate-700">{area}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-[2.5rem] p-8 md:p-12 border border-blue-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-10">
              <div className="max-w-2xl space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">Ready to start your journey?</h2>
                <p className="text-gray-600 text-sm md:text-base">Fill out the form to request a session. Our team will reach out to you shortly to discuss next steps.</p>
              </div>

              <div className="w-full max-w-3xl space-y-8">
                <div className="space-y-4">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em]">Select areas of interest:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {supportOptions.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleCheckboxChange(option)}
                        className={cn(
                          "px-4 py-2 rounded-full text-[10px] font-bold transition-all border shadow-sm",
                          formData.supportAreas.includes(option) 
                            ? "bg-[#00A89E] border-[#00A89E] text-white" 
                            : "bg-white border-gray-100 text-gray-600 hover:border-[#00A89E]/40"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
                  <input 
                    placeholder="First Name" 
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#00A89E] outline-none transition-all text-sm shadow-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                  <input 
                    placeholder="Last Name" 
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#00A89E] outline-none transition-all text-sm shadow-sm"
                    value={formData.surname}
                    onChange={(e) => setFormData({...formData, surname: e.target.value})}
                    required
                  />
                  <input 
                    type="email"
                    placeholder="Email Address" 
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#00A89E] outline-none transition-all text-sm shadow-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                  <input 
                    placeholder="Contact Number" 
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#00A89E] outline-none transition-all text-sm shadow-sm"
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    required
                  />
                  <div className="sm:col-span-2">
                    <input 
                      placeholder="Area" 
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#00A89E] outline-none transition-all text-sm shadow-sm"
                      value={formData.area}
                      onChange={(e) => setFormData({...formData, area: e.target.value})}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <textarea 
                      placeholder="How can we help?"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#00A89E] outline-none transition-all text-sm min-h-[100px] resize-none shadow-sm"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Button type="submit" className="w-full py-4 rounded-xl font-bold text-lg shadow-lg" disabled={isSubmitting}>
                      {isSubmitting ? 'Sending Request...' : 'Send Request'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ConnectScreen = () => {
  const [modalType, setModalType] = useState<'gods_girls' | 'mens_breakfast' | 'home_group' | null>(null);

  const getModalTitle = () => {
    switch (modalType) {
      case 'gods_girls': return "Join God's Girls Hike";
      case 'mens_breakfast': return "Register for Men's Breakfast";
      case 'home_group': return "Find a Home Group";
      default: return "";
    }
  };

  return (
    <div className="space-y-8 pb-24">
      <PageBanner title="Connect" />

      <section className="px-4 space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <Card className="p-6 bg-rose-50 border-rose-100 text-center flex flex-col items-center">
            <h3 className="text-xl font-bold text-rose-900 mb-2">God's Girls</h3>
            <p className="text-sm text-rose-800 mb-4">Our women's ministry focused on fellowship, hikes, and growing together in grace.</p>
            <Button variant="outline" className="border-rose-300 text-rose-900" onClick={() => setModalType('gods_girls')}>Join Next Hike</Button>
          </Card>

          <Card className="p-6 bg-blue-50 border-blue-100 text-center flex flex-col items-center">
            <h3 className="text-xl font-bold text-blue-900 mb-2">Men of God</h3>
            <p className="text-sm text-blue-800 mb-4">Empowering men to lead with integrity. Join our monthly breakfasts.</p>
            <Button variant="outline" className="border-blue-300 text-blue-900" onClick={() => setModalType('mens_breakfast')}>Register for Breakfast</Button>
          </Card>
        </div>

        <Card className="p-6 text-center">
          <h3 className="text-xl font-bold mb-4">Home Groups</h3>
          <p className="text-sm text-gray-600 mb-4">Find a community near you. We have groups for everyone.</p>
          <div className="space-y-4 text-center">
            <Button className="w-full" onClick={() => setModalType('home_group')}>Find a Group</Button>
          </div>
        </Card>
      </section>

      <RegistrationModal 
        isOpen={!!modalType} 
        onClose={() => setModalType(null)} 
        type={modalType || 'home_group'} 
        title={getModalTitle()} 
      />
    </div>
  );
};

const EmailSelectionModal = ({ isOpen, onClose, email }: { isOpen: boolean, onClose: () => void, email: string }) => {
  const providers = [
    { 
      name: 'Gmail', 
      url: `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`,
      color: 'bg-red-50 text-red-600'
    },
    { 
      name: 'Outlook', 
      url: `https://outlook.live.com/owa/?path=/mail/action/compose&to=${email}`,
      color: 'bg-blue-50 text-blue-600'
    },
    { 
      name: 'Yahoo', 
      url: `https://compose.mail.yahoo.com/?to=${email}`,
      color: 'bg-purple-50 text-purple-600'
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Email Provider">
      <div className="space-y-3">
        <p className="text-sm text-gray-500 mb-4">Choose your preferred email service to send to <span className="font-bold text-[#00A89E]">{email}</span></p>
        <div className="grid grid-cols-1 gap-3">
          {providers.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                window.open(p.url, '_blank');
                onClose();
              }}
              className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-[#00A89E] hover:bg-[#00A89E]/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", p.color)}>
                  <Mail size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-500">Click to compose</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-[#00A89E] transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

const GivingScreen = () => {
  const [amount, setAmount] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);

  return (
    <div className="space-y-8 pb-24">
      <PageBanner title="Giving" />

      <section className="px-4 space-y-6">
        <div className="text-center italic text-gray-600 font-serif px-8">
          "Those who live to bless others will have blessings heaped upon them, and the one who pours out his life to pour out blessings will be saturated with favor."
          <p className="text-xs mt-2 font-sans font-bold text-[#00A89E]">— Proverbs 11:25</p>
        </div>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 text-center">Banking Details</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm font-bold text-[#00A89E] uppercase tracking-widest mb-2 border-b border-gray-200 pb-1 text-center">Boksburg Campus</p>
              <div className="font-mono text-sm space-y-1 text-center">
                <p>Bank: FNB</p>
                <p>Acc: 62412345678</p>
                <p>Branch: 250655</p>
                <p>BRANCH CODE: 250 655</p>
                <p>SWIFT CODE: FIRNZAJJ</p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm font-bold text-[#00A89E] uppercase tracking-widest mb-2 border-b border-gray-200 pb-1 text-center">Benoni Campus</p>
              <div className="font-mono text-sm space-y-1 text-center">
                <p>Bank: FNB</p>
                <p>ACC# 63094843191</p>
                <p>Branch: 250655</p>
                <p>SWIFT CODE: FIRNZAJJ</p>
              </div>
            </div>
          </div>
        </Card>

        <Button variant="secondary" className="w-full" onClick={() => setShowEmailModal(true)}>
          <Mail size={20} />
          Get Involved / Enquire
        </Button>

        <EmailSelectionModal 
          isOpen={showEmailModal} 
          onClose={() => setShowEmailModal(false)} 
          email="reception@sentones.co.za" 
        />

        <div className="pt-8">
          <div className="bg-[#00A89E]/5 border border-[#00A89E]/20 rounded-[2rem] p-8 text-center space-y-4 shadow-sm">
            <p className="text-[#00A89E] font-serif italic text-3xl">Partner with us</p>
            <p className="font-bold text-gray-900 leading-tight uppercase tracking-wide text-sm md:text-base">
              CREATING, EDUCATING, EMPOWERING, TRAINING AND MOBILISING, THROUGH OUR SPIRIT LIFE NETWORK
            </p>
          </div>
          <div className="mt-8 flex justify-center">
            <img 
              src="/spirit-life-website.png" 
              alt="Spirit Life Network" 
              className="w-48 h-auto"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const SchoolScreen = () => {
  const [tab, setTab] = useState<'year1' | 'year2'>('year1');
  const [regYear, setRegYear] = useState<1 | 2 | null>(null);
  const registrationRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({ name: '', surname: '', email: '', contact: '', area: '', experience: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const startRegistration = (year?: 1 | 2) => {
    if (year) setRegYear(year);
    else setRegYear(null);
    registrationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRegister = async () => {
    if (!regYear) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(getApiUrl('/api/school-registration'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, year: `Year ${regYear}` })
      });
      if (response.ok) {
        setSuccessMsg(`Year ${regYear} Registration Successful!`);
        setFormData({ name: '', surname: '', email: '', contact: '', area: '', experience: '' });
        setRegYear(null);
        setTimeout(() => setSuccessMsg(''), 5000);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      <PageBanner title="School of Prophetic" />

      <section className="px-4 space-y-8">
        {/* Who are we? */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <img 
              src="/school-of-the-prophetic.png" 
              alt="School of the Prophetic" 
              className="w-full max-w-[224px] h-auto"
              referrerPolicy="no-referrer"
              onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/prophetic/300/200')}
            />
          </div>
          <Card className="p-6 bg-[#f9fdfd] text-center space-y-4">
            <h2 className="text-2xl font-bold text-[#00A89E]">Who are we?</h2>
            <p className="text-sm font-bold text-[#00A89E] italic">About Prophetic Ones</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Guided by the visionary leadership of Prophet Ed Traut from Prophetic Life Ministry in San Antonio, Texas, our community of prophetic believers and prophets is dedicated to developing spiritual gifts, deepening prophetic insights, and strengthening relationships with the Lord.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              As a community, we are passionate about seeing God's true prophets rise and operate powerfully in the Holy Spirit. Our mission is to witness lives healed and transformed by the power of Jesus through accurate and Spirit-led prophecy.
            </p>
            <Button className="mx-auto" onClick={() => startRegistration()}>Sign Me Up!</Button>
          </Card>
        </div>

        {/* Tabs for Year 1 and Year 2 */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setTab('year1')}
            className={cn('flex-1 py-3 rounded-lg text-sm font-bold transition-all', tab === 'year1' ? 'bg-white shadow-sm text-[#00A89E]' : 'text-gray-500')}
          >
            Year One
          </button>
          <button 
            onClick={() => setTab('year2')}
            className={cn('flex-1 py-3 rounded-lg text-sm font-bold transition-all', tab === 'year2' ? 'bg-white shadow-sm text-[#00A89E]' : 'text-gray-500')}
          >
            Year Two
          </button>
        </div>

        {tab === 'year1' ? (
          <div className="space-y-6">
            <Card className="p-6 space-y-6">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Year One Fee</h3>
                  <p className="text-[#00A89E] font-bold">R650.00 (Once off)</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-gray-900">Includes:</h4>
                <ul className="space-y-3">
                  {[
                    'All material/books and notes',
                    'Zoom meetings once a month with training from Prophets and the 5 fold ministers',
                    'Once a month prophetic training meetings in House (Sent Ones Boksburg Campus) with Prophets from Prophets Academy and 5 fold ministers',
                    'One on One coaching to help you grow your prophetic gift and ministry',
                    'Includes one on one training for up and coming Prophets',
                    'Includes certificate of completion',
                    'Includes community and fellowship as the Body of Christ and support for your ministry and calling'
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start text-sm text-gray-700">
                      <Bird size={16} className="text-[#00A89E] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h4 className="font-bold text-gray-900">Year 1 Requirements:</h4>
                <ul className="space-y-3">
                  {[
                    'Minimum of 1+ year history of being faithful and committed to a local church',
                    'A committed heart to see the Kingdom of God manifested and committed to attend meetings and Zoom meetings'
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start text-sm text-gray-700">
                      <Bird size={16} className="text-[#00A89E] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="p-6 space-y-6">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Year Two Fee</h3>
                  <p className="text-[#00A89E] font-bold">R700.00 (Once off)</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-gray-900">Year 2 Focus Areas:</h4>
                <ul className="space-y-3">
                  {[
                    'The Seer Realm - Exploring visions, dreams, and supernatural encounters.',
                    'Prophetic Intercession - Learning to war effectively with the Word of the Lord.',
                    'The Watchman Anointing - Discerning and declaring Heaven\'s agenda.',
                    'Times & Seasons - Stewarding prophetic timelines and understanding their significance.',
                    'Activating Greater Accuracy - Testing and refining your prophetic flow for precision.',
                    'Mantles & Mandates - Understanding your specific kingdom assignment and calling.'
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start text-sm text-gray-700">
                      <Bird size={16} className="text-[#00A89E] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h4 className="font-bold text-gray-900">Year 2 Requirements:</h4>
                <ul className="space-y-3">
                  {[
                    'Completion of Prophetic Ones Year 1 - Only students who have successfully completed all Year 1 requirements are eligible for enrollment.'
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start text-sm text-gray-700">
                      <Bird size={16} className="text-[#00A89E] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        )}

        {/* Unified Registration Section */}
        <div ref={registrationRef} className="space-y-8 pt-8 border-t">
          {!regYear ? (
            <div className="text-center space-y-6 py-12">
              <h2 className="text-3xl font-bold text-gray-900">School Registration</h2>
              <p className="text-gray-600 max-w-md mx-auto">Ready to join the School of Prophetic? Select which year you would like to register for to begin.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="px-12" onClick={() => setRegYear(1)}>Register for Year 1</Button>
                <Button className="px-12" onClick={() => setRegYear(2)}>Register for Year 2</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button onClick={() => setRegYear(null)} className="flex items-center gap-2 text-sm font-bold text-[#00A89E]">
                  <ChevronLeft size={20} />
                  Change Year
                </button>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Registering for Year {regYear}</span>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">Year {regYear} Registration</h2>
                <p className="text-sm text-gray-600">Please fill out the form below and we will be in contact with you.</p>
              </div>

              <Card className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Name" value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} />
                  <Input label="Surname" value={formData.surname} onChange={(e: any) => setFormData({...formData, surname: e.target.value})} />
                </div>
                <Input label="Email" type="email" value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})} />
                <Input label="Contact Number" value={formData.contact} onChange={(e: any) => setFormData({...formData, contact: e.target.value})} />
                <Input label="Area" value={formData.area} onChange={(e: any) => setFormData({...formData, area: e.target.value})} />
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block text-center">
                    {regYear === 1 
                      ? "Tell us about your experience with Biblical Prophecy" 
                      : "Tell us about your experience in your first year of School of the Prophetic"}
                  </label>
                  <p className="text-[10px] text-gray-400 text-center mb-1">
                    {regYear === 1 
                      ? "About me and my relationship with Jesus" 
                      : "About what I learned and experienced in my first year"}
                  </p>
                  <textarea 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#00A89E] focus:ring-1 focus:ring-[#00A89E] outline-none transition-all min-h-[120px]"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  />
                </div>
                <Button className="w-full" disabled={isSubmitting} onClick={handleRegister}>
                  {isSubmitting ? 'Sending...' : 'Send'}
                </Button>
              </Card>
            </div>
          )}
        </div>

        {successMsg && (
          <div className="fixed bottom-24 left-4 right-4 bg-green-600 text-white p-4 rounded-xl shadow-lg flex items-center gap-3 animate-bounce z-50">
            <CheckCircle2 size={24} />
            <p className="font-bold">{successMsg}</p>
          </div>
        )}
      </section>
    </div>
  );
};

const SoulAnchoredScreen = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    surname: '', 
    email: '', 
    contact: '', 
    area: '',
    message: '',
    supportAreas: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supportOptions = [
    "Financial", "Relationships", "Grief", "Divorce", "Trauma", "Identity", "Other"
  ];

  const handleCheckboxChange = (option: string) => {
    setFormData(prev => ({
      ...prev,
      supportAreas: prev.supportAreas.includes(option)
        ? prev.supportAreas.filter(item => item !== option)
        : [...prev.supportAreas, option]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.surname || !formData.email || !formData.contact) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(getApiUrl('/api/soul-anchored-request'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        alert('Success! Your request has been sent.');
        setFormData({ name: '', surname: '', email: '', contact: '', area: '', message: '', supportAreas: [] });
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white pb-24">
      <PageBanner title="SoulAnchored" />

      <div className="max-w-5xl mx-auto px-4">
        {/* Hero Section */}
        <section className="py-4 text-center space-y-3">
          <div className="flex justify-center">
            <img 
              src="/soulanchored.jpg" 
              alt="SoulAnchored" 
              className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-[#00A89E]/10 shadow-lg"
              referrerPolicy="no-referrer"
              onError={(e) => e.currentTarget.src = "https://picsum.photos/seed/soul/400/400"}
            />
          </div>
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Healing from Within</h2>
            <p className="text-gray-500 leading-relaxed text-xs md:text-sm">
              SoulAnchored provides a safe, non-judgmental space for inner healing and growth. We help you unpack pain, confront challenges, and rediscover your authentic self through Godly guidance.
            </p>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-y border-gray-100">
          {[
            { title: "Personal Sessions", desc: "One-on-one tailored support for your unique journey.", icon: <Users size={18} /> },
            { title: "Inner Healing", desc: "Unpack root causes and find emotional restoration.", icon: <Heart size={18} /> },
            { title: "Lasting Change", desc: "Practical tools and strategies for a life unburdened.", icon: <RefreshCw size={18} /> }
          ].map((pillar, i) => (
            <div key={i} className="text-center space-y-1 p-2">
              <div className="w-8 h-8 bg-[#00A89E]/10 text-[#00A89E] rounded-full flex items-center justify-center mx-auto">
                {pillar.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-xs">{pillar.title}</h3>
              <p className="text-[10px] text-gray-400 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </section>

        {/* Focus Areas - Improved */}
        <section className="py-8 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-[10px] font-bold text-[#00A89E] uppercase tracking-[0.2em]">Our Focus</h3>
            <h2 className="text-2xl font-bold text-gray-900">Areas of Support</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              "Addiction Recovery", "Identity & Worth", "Anxiety & Depression", "Trauma Healing",
              "Relationship Restoration", "Grief & Loss", "Spiritual Growth", "Confidence Building"
            ].map((area, i) => (
              <div key={i} className="p-3 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-center min-h-[60px] hover:shadow-md hover:border-[#00A89E]/20 transition-all group">
                <p className="text-[10px] font-semibold text-gray-700 group-hover:text-[#00A89E] transition-colors">{area}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Registration - Compact */}
        <section className="py-12 bg-blue-50 rounded-[3rem] px-6 md:px-12 text-gray-900 overflow-hidden relative border border-blue-100 w-full max-w-2xl mx-auto mt-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -mr-48 -mt-48" />
          
          <div className="relative z-10 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">Ready to start your journey?</h2>
              <p className="text-gray-500 text-sm md:text-base">Fill out the form to request a session. Our team will reach out to you shortly to discuss next steps.</p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4 text-center">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em]">Select areas of interest:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-lg mx-auto">
                  {supportOptions.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleCheckboxChange(option)}
                      className={cn(
                        "px-3 py-2.5 rounded-xl text-[10px] font-bold transition-all border shadow-sm flex items-center justify-center text-center h-full",
                        formData.supportAreas.includes(option) 
                          ? "bg-[#00A89E] border-[#00A89E] text-white shadow-[#00A89E]/20" 
                          : "bg-white border-gray-100 text-gray-600 hover:border-[#00A89E]/40 hover:bg-gray-50"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5 max-w-lg mx-auto">
                <div className="grid grid-cols-2 gap-3.5">
                  <input 
                    placeholder="First Name" 
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#00A89E] outline-none transition-all text-sm shadow-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                  <input 
                    placeholder="Last Name" 
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#00A89E] outline-none transition-all text-sm shadow-sm"
                    value={formData.surname}
                    onChange={(e) => setFormData({...formData, surname: e.target.value})}
                    required
                  />
                </div>
                <input 
                  type="email"
                  placeholder="Email Address" 
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#00A89E] outline-none transition-all text-sm shadow-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                <input 
                  placeholder="Contact Number" 
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#00A89E] outline-none transition-all text-sm shadow-sm"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  required
                />
                <textarea 
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#00A89E] outline-none transition-all text-sm min-h-[100px] resize-none shadow-sm"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
                <Button type="submit" className="w-full py-4 rounded-xl font-bold text-lg shadow-lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending Request...' : 'Send Request'}
                </Button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ContactScreen = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(getApiUrl('/api/contact-message'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      <PageBanner title="Contact Us" />

      <section className="px-4 space-y-6">
        <Card className="p-6 text-center">
          <h3 className="text-xl font-bold mb-4">Send a Message</h3>
          <div className="space-y-4">
            <Input 
              label="Name" 
              placeholder="Your name" 
              value={formData.name}
              onChange={(e: any) => setFormData({...formData, name: e.target.value})}
            />
            <Input 
              label="Email" 
              placeholder="your@email.com" 
              type="email" 
              value={formData.email}
              onChange={(e: any) => setFormData({...formData, email: e.target.value})}
            />
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Message</label>
              <textarea 
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#00A89E] outline-none min-h-[120px]"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </Card>

        <div className="space-y-4 text-center">
          <h3 className="font-bold text-gray-900">Visit Us</h3>
          <Card className="p-4">
            <div className="flex flex-col items-center text-center gap-3">
              <MapPin className="text-[#00A89E]" />
              <div>
                <p className="font-bold">Boksburg Campus (Main)</p>
                <p className="text-sm text-gray-500">Unit 37 Airborne park, 7 Taljaard Rd, Bartlett, Boksburg</p>
                <button 
                  onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=-26.170451726173305,28.23281835799024', '_blank')}
                  className="text-[#00A89E] text-xs font-bold mt-2 flex items-center gap-1 mx-auto hover:underline"
                >
                  Open in Maps <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex flex-col items-center text-center gap-3">
              <MapPin className="text-[#00A89E]" />
              <div>
                <p className="font-bold">Benoni Campus</p>
                <p className="text-sm text-gray-500">3 Struben Street, Rynfield, Benoni</p>
                <button 
                  onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=3+Struben+Street+Rynfield+Benoni', '_blank')}
                  className="text-[#00A89E] text-xs font-bold mt-2 flex items-center gap-1 mx-auto hover:underline"
                >
                  Open in Maps <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

const NotesScreen = () => {
  const [note, setNote] = useState('');
  const [title, setTitle] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSave = () => {
    if (!note.trim()) {
      alert('Please enter some notes before saving.');
      return;
    }

    const fileContent = `
TITLE: ${title || 'Untitled Note'}
SPEAKER: ${speaker || 'Not specified'}
DATE: ${date}

NOTES:
--------------------------------------------------
${note}
--------------------------------------------------
Generated via Sent One's
`.trim();

    const fileName = (title.trim().replace(/\s+/g, '_') || 'Service_Notes') + '.txt';
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setNote('');
    setTitle('');
    setSpeaker('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-8 pb-24">
      <PageBanner title="Service Notes" />
      
      <section className="px-4 space-y-6">
        <Card className="p-6 space-y-4">
          <Input 
            label="Note Title" 
            placeholder="e.g. Sunday Service" 
            value={title} 
            onChange={(e: any) => setTitle(e.target.value)} 
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              label="Speaker" 
              placeholder="e.g. Apostle Aldrick" 
              value={speaker} 
              onChange={(e: any) => setSpeaker(e.target.value)} 
            />
            <Input 
              label="Date" 
              type="date"
              value={date} 
              onChange={(e: any) => setDate(e.target.value)} 
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Your Notes</label>
            <textarea 
              className="w-full px-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-[#00A89E] focus:ring-4 focus:ring-[#00A89E]/5 outline-none h-[400px] overflow-y-auto transition-all resize-none text-gray-700 leading-relaxed"
              placeholder="Start typing your notes here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Button className="w-full py-4 shadow-lg shadow-[#00A89E]/20" onClick={handleSave}>
              <Download size={20} />
              Save to Device
            </Button>
            
            <Button variant="outline" className="w-full py-4 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200" onClick={handleClear}>
              <Trash2 size={20} />
              Clear All
            </Button>
          </div>
          
          <p className="text-[10px] text-gray-400 text-center italic">
            Note: Clicking save will prompt you to choose a location on your device to store this text file.
          </p>
        </Card>
      </section>
    </div>
  );
};

const UpcomingScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => (
  <div className="space-y-8 pb-24">
    <PageBanner title="Upcoming" onBack={() => setScreen('home')} />
    <section className="px-4 space-y-4">
      <Card className="p-8 flex flex-col items-center gap-4 cursor-pointer hover:bg-gray-50 transition-all active:scale-[0.98] group" onClick={() => setScreen('upcoming-boksburg')}>
        <div className="w-16 h-16 bg-[#00A89E]/10 rounded-full flex items-center justify-center text-[#00A89E] group-hover:bg-[#00A89E] group-hover:text-white transition-colors">
          <MapPin size={32} />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">Boksburg</h3>
          <p className="text-sm text-gray-500">View upcoming speakers and events</p>
        </div>
      </Card>
      <Card className="p-8 flex flex-col items-center gap-4 cursor-pointer hover:bg-gray-50 transition-all active:scale-[0.98] group" onClick={() => setScreen('upcoming-benoni')}>
        <div className="w-16 h-16 bg-[#00A89E]/10 rounded-full flex items-center justify-center text-[#00A89E] group-hover:bg-[#00A89E] group-hover:text-white transition-colors">
          <MapPin size={32} />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">Benoni</h3>
          <p className="text-sm text-gray-500">View upcoming speakers and events</p>
        </div>
      </Card>
    </section>
  </div>
);

const UpcomingLocationScreen = ({ location, setScreen }: { location: 'Boksburg' | 'Benoni', setScreen: (s: Screen) => void }) => {
  const locKey = location.toLowerCase() as 'boksburg' | 'benoni';
  return (
    <div className="space-y-8 pb-24">
      <PageBanner title={`Upcoming: ${location}`} onBack={() => setScreen('upcoming')} />
      <section className="px-4 space-y-4">
        <Card className="p-8 flex flex-col items-center gap-4 cursor-pointer hover:bg-gray-50 transition-all active:scale-[0.98] group" onClick={() => setScreen(`upcoming-${locKey}-speaker` as Screen)}>
          <div className="w-16 h-16 bg-[#00A89E]/10 rounded-full flex items-center justify-center text-[#00A89E] group-hover:bg-[#00A89E] group-hover:text-white transition-colors">
            <Users size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Upcoming Speaker</h3>
        </Card>
        <Card className="p-8 flex flex-col items-center gap-4 cursor-pointer hover:bg-gray-50 transition-all active:scale-[0.98] group" onClick={() => setScreen(`upcoming-${locKey}-events` as Screen)}>
          <div className="w-16 h-16 bg-[#00A89E]/10 rounded-full flex items-center justify-center text-[#00A89E] group-hover:bg-[#00A89E] group-hover:text-white transition-colors">
            <Calendar size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Upcoming Events</h3>
        </Card>
        <Button variant="outline" className="w-full py-4" onClick={() => setScreen('upcoming')}>
          Back to Locations
        </Button>
      </section>
    </div>
  );
};

const UpcomingDetailScreen = ({ title, location, setScreen, items, isLoading, onRefresh, onRegister }: { title: string, location: 'Boksburg' | 'Benoni', setScreen: (s: Screen) => void, items: UpcomingItem[], isLoading: boolean, onRefresh: () => void, onRegister: (name: string) => void }) => {
  const category = title.includes('Speaker') ? 'Speaker' : 'Events';
  const filteredItems = items.filter(item => item.location === location && item.category === category);
  const locKey = location.toLowerCase() as 'boksburg' | 'benoni';

  return (
    <div className="space-y-8 pb-24">
      <div className="relative">
        <PageBanner title={title} onBack={() => setScreen(`upcoming-${locKey}` as Screen)} />
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="absolute right-0 bottom-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-[#00A89E] hover:bg-[#00A89E]/10 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={20} className={cn(isLoading && "animate-spin")} />
        </button>
      </div>
      <section className="px-4 space-y-4">
        {isLoading ? (
          <Card className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-[#00A89E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading latest updates...</p>
          </Card>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item, idx) => (
            <div key={idx}>
              <Card className="p-6 space-y-4">
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-48 object-cover rounded-xl mb-4"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                      <p className="text-[#00A89E] font-semibold text-sm">{item.subtitle}</p>
                    </div>
                    {item.date && (
                      <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600">
                        {item.date}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </Card>
            </div>
          ))
        ) : (
          <Card className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-[#00A89E]/10 rounded-full flex items-center justify-center text-[#00A89E] mx-auto">
              {category === 'Speaker' ? <Users size={40} /> : <Calendar size={40} />}
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
              <p className="text-[#00A89E] font-semibold">{location} Campus</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500 italic">Information for upcoming {title.toLowerCase()} will be posted here soon. Stay tuned!</p>
            </div>
          </Card>
        )}
        <Button variant="outline" className="w-full" onClick={() => setScreen(`upcoming-${location.toLowerCase() as 'boksburg' | 'benoni'}` as Screen)}>
          Back
        </Button>
      </section>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [upcomingItems, setUpcomingItems] = useState<UpcomingItem[]>([]);
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [eventReg, setEventReg] = useState<{ title: string, eventName: string } | null>(null);

  const loadUpcomingData = async () => {
    setIsLoadingUpcoming(true);
    const data = await fetchUpcomingData();
    setUpcomingItems(data);
    setIsLoadingUpcoming(false);
  };

  useEffect(() => {
    loadUpcomingData();
  }, []);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'about-us', icon: Users, label: 'About Us' },
    { id: 'services', icon: Calendar, label: 'Services' },
    { id: 'upcoming', icon: Clock, label: 'Upcoming' },
    { id: 'ministries', icon: Users, label: 'Ministries' },
    { id: 'connect', icon: LinkIcon, label: 'Connect' },
    { id: 'giving', icon: DollarSign, label: 'Giving' },
    { id: 'school', icon: BookOpen, label: 'School of the Prophetic' },
    { id: 'soul-anchored', icon: Anchor, label: 'Soul' },
    { id: 'contact', icon: Mail, label: 'Contact' },
    { id: 'notes', icon: FileText, label: 'Notes' },
  ];

  const renderScreen = () => {
    switch (screen) {
      case 'home': return <HomeScreen setScreen={setScreen} />;
      case 'about-us': return <AboutUsScreen />;
      case 'services': return <ServicesScreen />;
      case 'ministries': return <MinistriesScreen />;
      case 'connect': return <ConnectScreen />;
      case 'giving': return <GivingScreen />;
      case 'school': return <SchoolScreen />;
      case 'soul-anchored': return <SoulAnchoredScreen />;
      case 'contact': return <ContactScreen />;
      case 'notes': return <NotesScreen />;
      case 'upcoming': return <UpcomingScreen setScreen={setScreen} />;
      case 'upcoming-boksburg': return <UpcomingLocationScreen location="Boksburg" setScreen={setScreen} />;
      case 'upcoming-benoni': return <UpcomingLocationScreen location="Benoni" setScreen={setScreen} />;
      case 'upcoming-boksburg-speaker': return <UpcomingDetailScreen title="Upcoming Speaker" location="Boksburg" setScreen={setScreen} items={upcomingItems} isLoading={isLoadingUpcoming} onRefresh={loadUpcomingData} onRegister={(name) => setEventReg({ title: 'Register for Speaker', eventName: name })} />;
      case 'upcoming-boksburg-events': return <UpcomingDetailScreen title="Upcoming Events" location="Boksburg" setScreen={setScreen} items={upcomingItems} isLoading={isLoadingUpcoming} onRefresh={loadUpcomingData} onRegister={(name) => setEventReg({ title: 'Register for Event', eventName: name })} />;
      case 'upcoming-benoni-speaker': return <UpcomingDetailScreen title="Upcoming Speaker" location="Benoni" setScreen={setScreen} items={upcomingItems} isLoading={isLoadingUpcoming} onRefresh={loadUpcomingData} onRegister={(name) => setEventReg({ title: 'Register for Speaker', eventName: name })} />;
      case 'upcoming-benoni-events': return <UpcomingDetailScreen title="Upcoming Events" location="Benoni" setScreen={setScreen} items={upcomingItems} isLoading={isLoadingUpcoming} onRefresh={loadUpcomingData} onRegister={(name) => setEventReg({ title: 'Register for Event', eventName: name })} />;
      default: return <HomeScreen setScreen={setScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-[#00A89E]/20">
      {/* Mobile Container Simulation */}
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative flex flex-col">
        
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-black/5 px-4 h-28 flex items-center justify-between">
          <button onClick={() => setIsMenuOpen(true)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <Menu size={24} />
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <img src="/sent-ones-logo-photoroom.png" alt="Logo" className="h-24 w-auto" referrerPolicy="no-referrer" />
          </div>
          <button 
            onClick={() => setIsNotificationsOpen(true)}
            className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors relative"
          >
            <Bell size={24} />
            {upcomingItems.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            )}
          </button>
        </header>

        {/* Notifications Modal */}
        <Modal 
          isOpen={isNotificationsOpen} 
          onClose={() => setIsNotificationsOpen(false)} 
          title="Notifications"
        >
          <div className="space-y-4">
            {isLoadingUpcoming ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="animate-spin text-[#00A89E]" size={24} />
              </div>
            ) : upcomingItems.length > 0 ? (
              <div className="space-y-3">
                {upcomingItems.slice(0, 5).map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#00A89E]/20 transition-all cursor-pointer"
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      const loc = item.location.toLowerCase();
                      const cat = item.category.toLowerCase();
                      setScreen(`upcoming-${loc}-${cat}` as Screen);
                    }}
                  >
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-[#00A89E]/10 rounded-full flex items-center justify-center text-[#00A89E] shrink-0">
                        <Calendar size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-gray-900">{item.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-[#00A89E] uppercase tracking-wider">{item.location}</span>
                          <span className="text-[10px] text-gray-400">•</span>
                          <span className="text-[10px] text-gray-400">{item.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="secondary" 
                  className="w-full text-xs py-2" 
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    setScreen('upcoming');
                  }}
                >
                  View All Upcoming
                </Button>
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto">
                  <Bell size={32} />
                </div>
                <p className="text-gray-500 text-sm italic">No new notifications at this time.</p>
              </div>
            )}
          </div>
        </Modal>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 pt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>

          {/* Footer Info */}
          <footer className="px-6 py-12 bg-gray-50 -mx-4 border-t border-gray-100 -mt-6">
            <div className="max-w-7xl mx-auto space-y-12 text-sm">
              {/* Logo and Socials - Now at the Top */}
              <div className="flex flex-col items-center space-y-6">
                <div className="flex flex-col items-center gap-2">
                  <img src="/sent-ones-logo-photoroom.png" alt="Logo" className="h-20 w-auto" referrerPolicy="no-referrer" />
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 leading-none">SENT ONES</h2>
                    <p className="text-[10px] text-gray-500 tracking-[0.2em] font-medium uppercase">Holy Spirit Ministry</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <a href="https://www.facebook.com/sentonesministry/" target="_blank" rel="noopener noreferrer" className="bg-[#00A89E] p-3.5 rounded-full text-white shadow-lg hover:scale-110 transition-transform">
                    <Facebook size={20} />
                  </a>
                  <a href="https://www.instagram.com/sentonesholy/" target="_blank" rel="noopener noreferrer" className="bg-[#00A89E] p-3.5 rounded-full text-white shadow-lg hover:scale-110 transition-transform">
                    <Instagram size={20} />
                  </a>
                  <a href="https://www.youtube.com/@sentonesholyspiritministry2320" target="_blank" rel="noopener noreferrer" className="bg-[#00A89E] p-3.5 rounded-full text-white shadow-lg hover:scale-110 transition-transform">
                    <Youtube size={20} />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-10">
                {/* Boksburg Campus */}
                <div className="space-y-4 text-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h4 className="font-bold text-[#00A89E] uppercase tracking-widest text-xs">Boksburg Campus (Main)</h4>
                  <ul className="space-y-3 text-gray-600 flex flex-col items-center">
                    <li className="flex items-center gap-2">
                      <Mail size={14} className="text-[#00A89E]" /> 
                      <span className="font-medium">reception@sentones.co.za</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone size={14} className="text-[#00A89E]" /> 
                      <span className="font-medium">074 212 0296</span>
                    </li>
                    <li className="flex items-start gap-2 max-w-[280px]">
                      <MapPin size={14} className="text-[#00A89E] mt-0.5 shrink-0" /> 
                      <span className="leading-relaxed">Unit 37 Airborne park, 7 Taljaard Rd, Bartlett, Boksburg</span>
                    </li>
                  </ul>
                </div>

                {/* Benoni Campus */}
                <div className="space-y-4 text-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h4 className="font-bold text-[#00A89E] uppercase tracking-widest text-xs">Benoni Campus</h4>
                  <ul className="space-y-3 text-gray-600 flex flex-col items-center">
                    <li className="flex items-center gap-2">
                      <Mail size={14} className="text-[#00A89E]" /> 
                      <span className="font-medium">reception@sentones.co.za</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone size={14} className="text-[#00A89E]" /> 
                      <span className="font-medium">074 212 0296</span>
                    </li>
                    <li className="flex items-start gap-2 max-w-[280px]">
                      <MapPin size={14} className="text-[#00A89E] mt-0.5 shrink-0" /> 
                      <span className="leading-relaxed">3 Struben Street, Rynfield, Benoni</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 flex flex-col items-center gap-2 text-[10px] text-slate-400 uppercase tracking-[0.12em] font-medium">
              <p>© 2026 SENT ONES | ALL RIGHTS RESERVED</p>
            </div>
          </footer>
        </main>

        {/* Bottom Nav */}
        <nav className="sticky bottom-0 z-40 bg-white/90 backdrop-blur-lg border-t border-black/5 px-2 py-2 flex justify-around items-center">
          {['home', 'about-us', 'services', 'connect', 'notes'].map((id) => {
            const item = navItems.find(n => n.id === id);
            if (!item) return null;
            return (
              <button
                key={item.id}
                onClick={() => setScreen(item.id as Screen)}
                className={cn(
                  'flex flex-col items-center gap-1 p-2 rounded-xl transition-all',
                  screen === item.id ? 'text-[#00A89E]' : 'text-gray-400 hover:text-gray-600'
                )}
              >
                <item.icon size={22} strokeWidth={screen === item.id ? 2.5 : 2} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Side Drawer Simulation */}
        <AnimatePresence>
          {isMenuOpen && (
            <div className="fixed inset-0 z-50 flex">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ x: '-100%' }} 
                animate={{ x: 0 }} 
                exit={{ x: '-100%' }}
                className="relative bg-white w-4/5 max-w-xs h-full shadow-2xl p-6 flex flex-col"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <img 
                      src="/sent-ones-logo-photoroom.png" 
                      alt="Sent One's Logo" 
                      className="w-10 h-10 object-contain"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML += '<div class="w-10 h-10 bg-[#00A89E] rounded-full flex items-center justify-center text-white font-bold">SO</div>';
                      }}
                    />
                    <div>
                      <p className="font-bold text-sm">Sent One's</p>
                      <p className="text-[10px] text-gray-400">Version 1.0.0</p>
                    </div>
                  </div>
                  <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-1 flex-1 overflow-y-auto pr-2 -mr-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setScreen(item.id as Screen);
                        setIsMenuOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-4 p-3 rounded-xl font-semibold transition-colors text-left',
                        screen === item.id ? 'bg-[#00A89E]/10 text-[#00A89E]' : 'text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="pt-6 border-t mt-auto">
                  <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">
                    © 2026 Sent Ones Holy Spirit Ministry
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <RegistrationModal 
          isOpen={!!eventReg} 
          onClose={() => setEventReg(null)} 
          type="event" 
          title={eventReg?.title || ''} 
          eventName={eventReg?.eventName}
        />
      </div>
    </div>
  );
}
