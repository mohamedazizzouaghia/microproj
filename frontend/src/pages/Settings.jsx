import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Bell, Shield, Database, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: false,
    maxUploadSize: 10,
    systemLanguage: 'English'
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 text-gray-700 rounded-lg">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Platform Settings</h1>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/30 transition-all">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* General Settings */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" /> General Configuration
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800">Maintenance Mode</h4>
                  <p className="text-sm text-gray-500">Put the platform in read-only mode for students.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={settings.maintenanceMode} onChange={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800">Allow New Registrations</h4>
                  <p className="text-sm text-gray-500">Enable or disable new student signups.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={settings.allowRegistration} onChange={() => setSettings({...settings, allowRegistration: !settings.allowRegistration})} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" /> Security
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800">Require Email Verification</h4>
                  <p className="text-sm text-gray-500">Force users to verify email before login.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={settings.requireEmailVerification} onChange={() => setSettings({...settings, requireEmailVerification: !settings.requireEmailVerification})} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 space-y-6">
          {/* Data & Storage */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Database className="w-5 h-5 text-orange-500" /> Storage
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Max Upload Size (MB)</label>
                <input 
                  type="number" 
                  value={settings.maxUploadSize}
                  onChange={(e) => setSettings({...settings, maxUploadSize: parseInt(e.target.value)})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
