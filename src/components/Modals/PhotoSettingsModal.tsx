import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Check, RefreshCw, Link as LinkIcon, Sparkles, User } from 'lucide-react';
import { ProfileConfig } from '../../types';

interface PhotoSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileConfig;
  onUpdateProfile: (updated: Partial<ProfileConfig>) => void;
}

export const PhotoSettingsModal: React.FC<PhotoSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  if (!isOpen) return null;

  const [imageUrl, setImageUrl] = useState(profile.customHeroPhoto || '');
  const [creatorName, setCreatorName] = useState(profile.creatorName);
  const [brandName, setBrandName] = useState(profile.brandName);
  const [heroBadge, setHeroBadge] = useState(profile.heroBadge);
  const [heroBio, setHeroBio] = useState(profile.heroBio);
  const [activeTab, setActiveTab] = useState<'photo' | 'info'>('photo');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const result = loadEvt.target?.result as string;
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateProfile({
      customHeroPhoto: imageUrl.trim() || undefined,
      creatorName,
      brandName,
      heroBadge,
      heroBio,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleResetToIllustration = () => {
    setImageUrl('');
    onUpdateProfile({ customHeroPhoto: undefined });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div
        className="bg-white rounded-[32px] max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden relative animate-scaleUp my-8"
        id="photo-settings-modal"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center shadow-xs z-20 cursor-pointer transition-all hover:rotate-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#6C5CE7] to-[#8B7EFF] text-white">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
              Personalize Your Portfolio
            </span>
          </div>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold">
            Hero Photo & Profile Settings
          </h2>
          <p className="text-xs text-purple-100 mt-1">
            Set your photo or link, brand title, and bio across the website.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-stone-200 px-6 pt-3 bg-stone-50">
          <button
            onClick={() => setActiveTab('photo')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'photo'
                ? 'border-[#6C5CE7] text-[#6C5CE7]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Hero Image</span>
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'info'
                ? 'border-[#6C5CE7] text-[#6C5CE7]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Brand & Bio Info</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {activeTab === 'photo' ? (
            <div className="space-y-4">
              
              {/* Preview */}
              <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-200 shrink-0 border-2 border-white shadow-md">
                  <img
                    src={imageUrl || '/src/assets/images/hero_tech_creator_1787669566326.jpg'}
                    alt="Preview"
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Current Hero Image</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {imageUrl ? 'Using custom photo URL / file' : 'Using aesthetic template illustrated avatar'}
                  </p>
                  {imageUrl && (
                    <button
                      onClick={handleResetToIllustration}
                      className="mt-2 text-[11px] font-bold text-[#6C5CE7] hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset to template illustration</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Paste Image URL */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1 flex items-center gap-1">
                  <LinkIcon className="w-3.5 h-3.5 text-[#6C5CE7]" />
                  <span>Option 1: Paste Your Photo URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/my-photo.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#6C5CE7] focus:bg-white"
                />
              </div>

              {/* Upload Local File */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1 flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5 text-[#FF7675]" />
                  <span>Option 2: Upload Image from Computer</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-stone-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-[#6C5CE7] hover:file:bg-purple-100 cursor-pointer"
                />
              </div>

            </div>
          ) : (
            <div className="space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#6C5CE7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Creator Name
                  </label>
                  <input
                    type="text"
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#6C5CE7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Hero Pill Badge Text
                </label>
                <input
                  type="text"
                  value={heroBadge}
                  onChange={(e) => setHeroBadge(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#6C5CE7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Hero Bio Text
                </label>
                <textarea
                  rows={3}
                  value={heroBio}
                  onChange={(e) => setHeroBio(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#6C5CE7]"
                />
              </div>

            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-stone-100 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-full transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 text-xs font-bold text-white bg-[#6C5CE7] hover:bg-[#5742DE] rounded-full shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
