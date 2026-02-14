import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LogoutModal from './LogoutModal';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, [location]);

    const handleLogoutConfirm = () => {
        setIsLoggingOut(true);

        // Simulate a small delay for better UX
        setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsLoggedIn(false);
            setShowLogoutModal(false);
            setIsLoggingOut(false);
            // Force a hard refresh to clear any in-memory state
            window.location.href = '/';
        }, 1500);
    };

    const scrollToSection = (sectionId) => {
        setIsOpen(false);
        if (location.pathname === '/') {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate('/', { state: { scrollTo: sectionId } });
        }
    };

    const navItems = isLoggedIn
        ? [{ name: 'Dashboard', path: '/dashboard' }]
        : [{ name: 'Testimonials', id: 'testimonials' }];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
            <div className="w-full px-8 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="transition-transform duration-300 group-hover:scale-110">
                        <img
                            src="/logo_minimal.svg"
                            alt="RizzLab Logo"
                            className="w-8 h-8 object-contain"
                        />
                    </div>
                    <span className="text-2xl font-black tracking-tight text-white/90 group-hover:text-white transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        RizzLab
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        item.path ? (
                            <Link
                                key={item.name}
                                to={item.path}
                                className="text-white/70 hover:text-white transition-colors text-sm font-medium"
                            >
                                {item.name}
                            </Link>
                        ) : (
                            <button
                                key={item.name}
                                onClick={() => scrollToSection(item.id)}
                                className="text-white/70 hover:text-white transition-colors text-sm font-medium"
                            >
                                {item.name}
                            </button>
                        )
                    ))}
                    {isLoggedIn ? (
                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="text-white/70 hover:text-white transition-colors text-sm font-medium"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link to="/signup?role=submitter" className="btn-primary text-sm px-6 py-2.5">
                            Get Rizz Score
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black/90 border-b border-white/10 overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                            {navItems.map((item) => (
                                item.path ? (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className="text-white/70 hover:text-white py-2 block text-left font-medium"
                                    >
                                        {item.name}
                                    </Link>
                                ) : (
                                    <button
                                        key={item.name}
                                        onClick={() => scrollToSection(item.id)}
                                        className="text-white/70 hover:text-white py-2 block text-left"
                                    >
                                        {item.name}
                                    </button>
                                )
                            ))}
                            <Link
                                to="/signup?role=submitter"
                                className="btn-primary text-center py-2"
                                onClick={() => setIsOpen(false)}
                            >
                                Get Rizz Score
                            </Link>
                            {isLoggedIn && (
                                <button
                                    onClick={() => {
                                        setShowLogoutModal(true);
                                        setIsOpen(false);
                                    }}
                                    className="text-white/70 hover:text-white py-2 block text-left"
                                >
                                    Logout
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => !isLoggingOut && setShowLogoutModal(false)}
                onConfirm={handleLogoutConfirm}
                isLoading={isLoggingOut}
            />
        </nav>
    );
};

export default Navbar;
