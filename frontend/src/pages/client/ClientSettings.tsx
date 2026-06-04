import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { User, Mail, Building, Phone, Shield, Bell, Save } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { API_URL } from '../../config';

export function ClientSettings() {
  const { user, token, login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    companyName: user?.company?.name || 'Acme Corp',
    phone: '+1 (555) 123-4567'
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/api/client/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          companyName: formData.companyName
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        // Update global auth store with new user data
        if (token) login(data.user, token);
        alert('Settings saved successfully!');
      } else {
        alert(data.error || 'Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      alert('Please fill in both password fields');
      return;
    }
    
    setPasswordLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/client/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(passwords)
      });
      const data = await res.json();
      
      if (res.ok) {
        alert('Password updated successfully!');
        setPasswords({ currentPassword: '', newPassword: '' });
      } else {
        alert(data.error || 'Failed to update password');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while updating password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-8 space-y-8 overflow-y-auto custom-scrollbar bg-[#FAFAFA] max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 mt-2 font-medium">Manage your account preferences and profile details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-6">
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-700 font-bold text-3xl flex items-center justify-center border-4 border-white shadow-md">
                  {formData.firstName?.[0] || 'U'}
                </div>
                <div>
                  <Button type="button" variant="outline" className="text-sm">Change Avatar</Button>
                  <p className="text-xs text-slate-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                  <input 
                    type="text" 
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400"/> Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-xl px-4 py-3 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-400 mt-1">Contact support to change your email.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400"/> Phone Number</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"><Building className="w-4 h-4 text-slate-400"/> Company Name</label>
                <input 
                  type="text" 
                  value={formData.companyName}
                  onChange={e => setFormData({...formData, companyName: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <Button type="submit" variant="primary" className="bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                  {loading ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                </Button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Security</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Change Password</h4>
                <p className="text-sm text-slate-500 mt-1 mb-4">Ensure your account is using a long, random password to stay secure.</p>
                <div className="space-y-4 max-w-md">
                  <input 
                    type="password" 
                    placeholder="Current Password"
                    value={passwords.currentPassword}
                    onChange={e => setPasswords({...passwords, currentPassword: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                  <input 
                    type="password" 
                    placeholder="New Password"
                    value={passwords.newPassword}
                    onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                  <Button 
                    variant="outline" 
                    onClick={handlePasswordUpdate}
                    disabled={passwordLoading}
                    className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
                  >
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Bell className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
            </div>
            <div className="p-6 space-y-6">
              {[
                { title: 'Email Notifications', desc: 'Receive daily summary emails' },
                { title: 'Project Updates', desc: 'Get notified when a project advances' },
                { title: 'Invoice Alerts', desc: 'Reminders for due and paid invoices' },
                { title: 'Marketing Reports', desc: 'Weekly ad performance summaries' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={idx !== 3} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
