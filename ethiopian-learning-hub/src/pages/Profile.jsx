import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || 'Abebe Kebede');
  const [email, setEmail] = useState(user?.email || 'abebe@learninghub.edu');
  const [isSaved, setIsSaved] = useState(false);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="glass-card rounded-3xl p-8 relative overflow-hidden transition-all duration-300 hover:border-slate-700">
        
        {/* Background Decorative Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-slate-800">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-emerald-600 rounded-2xl flex items-center justify-center text-4xl shadow-xl font-black text-slate-950">
            {name.charAt(0)}
          </div>
          <div className="text-center md:text-left space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-white">{name}</h1>
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">Account Level: {user?.role || 'Student'}</p>
            <p className="text-slate-400 text-sm">{email}</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="mt-8 space-y-6 max-w-xl">
          <h2 className="text-lg font-bold text-slate-200">Account Configurations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Display Identity Name</label>
              <input type="text" className="glass-input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Communication Email Address</label>
              <input type="email" className="glass-input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:brightness-110 text-white font-bold px-6 py-3 rounded-xl transition duration-300 shadow-lg text-sm uppercase tracking-wider">
              Save Account Preferences
            </button>
          </div>

          {isSaved && (
            <p className="text-emerald-400 text-xs font-semibold animate-bounce mt-2">
              ✓ Profile updates synchronized successfully!
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
