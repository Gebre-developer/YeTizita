import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios'; // 1. Swapped Firebase for Axios
import { Eye, EyeOff } from 'lucide-react'; 
import authSideImage from '../assets/img/img.png';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Pull dynamic production api gateway URL or fall back to localhost
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      // 2. Sent user payload to your custom dynamic backend
      const response = await axios.post(`${baseUrl}/api/register`, {
        username: name, // Maps 'name' state to 'username' column
        email: email,
        password: password,
        role: 'student'
      });

      if (response.data.success) {
        // Create matching local state token representation 
        const createdProfile = { 
          name: name, 
          email: email, 
          role: 'student' 
        };
        
        login(createdProfile); // Syncs state with your AuthContext
        navigate('/dashboard'); // Routes user forward
      }
    } catch (err) {
      console.error(err);
      // Catch custom error messages sent by your Express server blocks
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        const activeEndpoint = import.meta.env.VITE_API_URL ? "production cloud services" : "local node configurations";
        setError(`Could not process registration. Verify ${activeEndpoint} connectivity.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 glass-card rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
        
        {/* Left Side: Input Form Panel */}
        <div className="md:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-slate-950/40">
          <div className="mb-6 text-center md:text-left">
            <h2 className="text-3xl font-black text-white tracking-tight">Create Account</h2>
            <p className="text-slate-400 text-xs mt-1.5 uppercase font-bold tracking-wider">
              Join the regional student development network
            </p>
          </div>

          <form onSubmit={handleFormSubmission} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl text-center">
                {error}
              </div>
            )}

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Legal Name</label>
              <input
                type="text" required
                className="glass-input"
                placeholder="Abebe Kebede"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
              <input
                type="email" required
                className="glass-input"
                placeholder="abebe@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Password Credentials</label>
              
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="glass-input pr-12 w-full"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200 select-none flex items-center justify-center p-1 rounded-md"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:brightness-110 disabled:opacity-50 text-white font-black py-3.5 rounded-xl transition duration-300 text-sm uppercase tracking-widest shadow-lg shadow-emerald-900/30 transform active:scale-95 mt-2"
            >
              {loading ? 'Creating Network Profile...' : 'Finalize Registration'}
            </button>
          </form>

          <p className="text-center md:text-left text-sm text-slate-400 border-t border-slate-900 pt-6 mt-6">
            Already registered inside the hub?{' '}
            <Link to="/login" className="text-amber-400 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        {/* Right Side: Visual Graphic Display Panel */}
        <div className="hidden md:block md:col-span-6 relative min-h-[500px]">
          <img 
            src={authSideImage} 
            alt="Ethiopian Learning Hub Side Cover Graphic" 
            className="absolute inset-0 w-full h-full object-cover select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/40 to-emerald-950/30"></div>
          
          <div className="absolute bottom-10 left-10 right-10 bg-slate-950/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800/80">
            <p className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-1">Hub Quote</p>
            <p className="text-white text-sm italic font-medium leading-relaxed">
              "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice."
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
