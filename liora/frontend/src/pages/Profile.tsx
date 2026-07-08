import { useState, useEffect, useRef } from 'react';
import { Camera, Check, ShieldCheck, ArrowLeft, RotateCcw } from 'lucide-react';
import '../styles/Profile.scss';
import { UpdateProfile, GetProfile } from '../../wailsjs/go/main/App';
import { supabase } from '../lib/supabaseClient'; 
import { useProfileStore } from '../components/services/profileStore'; 

interface ProfileProps {
  myID: string;
  onBack: () => void;
}

export default function Profile({ myID, onBack }: ProfileProps) {
  const { getProfileForUser, setProfileForUser } = useProfileStore();
  const cachedProfile = getProfileForUser(myID);

  const [username, setUsername] = useState(cachedProfile?.username || '');
  const [bio, setBio] = useState(cachedProfile?.bio || '');
  const [avatar, setAvatar] = useState(cachedProfile?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${myID}`);
  const [avatarTs, setAvatarTs] = useState(Date.now());
  
  const [isLoading, setIsLoading] = useState(!cachedProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);

  const [baseline, setBaseline] = useState({
    username: cachedProfile?.username || '',
    bio: cachedProfile?.bio || '',
    avatar: cachedProfile?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${myID}`
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUsernameValid = (val: string): boolean => {
    if (val.length < 3 || val.length > 20) return false;
    if (!/^[a-zA-Z0-9._-]+$/.test(val)) return false;
    if (/^[.-]/.test(val)) return false;
    if (/[^a-zA-Z0-9][.-]/.test(val)) return false;
    return true;
  };

  const hasChanges = username !== baseline.username || bio !== baseline.bio || avatar !== baseline.avatar;
  const canSave = hasChanges && !isSaving && !isCheckingUsername && !isUsernameTaken && isUsernameValid(username);

  useEffect(() => {
    const currentCached = getProfileForUser(myID);
    const initUsername = currentCached?.username || '';
    const initBio = currentCached?.bio || '';
    const initAvatar = currentCached?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${myID}`;

    setUsername(initUsername);
    setBio(initBio);
    setAvatar(initAvatar);
    setAvatarTs(Date.now());
    setIsLoading(!currentCached);
    setBaseline({ username: initUsername, bio: initBio, avatar: initAvatar });
  }, [myID]);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const data = await GetProfile(); 
        if (isMounted && data) {
          const freshData = {
            username: data.username || 'Anonymous',
            bio: data.bio || '',
            avatar_url: data.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${myID}`
          };

          setProfileForUser(myID, freshData);

          setUsername(freshData.username);
          setBio(freshData.bio);
          setAvatar(freshData.avatar_url);
          setAvatarTs(Date.now());
          setBaseline({
            username: freshData.username,
            bio: freshData.bio,
            avatar: freshData.avatar_url
          });
        }
      } catch (err) {
        console.error("Failed to load profile from Go layer:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [myID]); 

  useEffect(() => {
    if (username === baseline.username || !isUsernameValid(username)) {
      setIsUsernameTaken(false);
      return;
    }

    let isCurrent = true;

    const checkUsernameAvailability = async () => {
      setIsCheckingUsername(true);
      try {
        const [userCheck, channelCheck] = await Promise.all([
          supabase
            .from('profiles')
            .select('username')
            .eq('username', username)
            .maybeSingle(),
          supabase
            .from('channels')
            .select('handle')
            .eq('handle', username)
            .maybeSingle()
        ]);

        if (isCurrent) {
          setIsUsernameTaken(!!userCheck.data || !!channelCheck.data);
        }
      } catch (err) {
        console.error("Namespace check failed:", err);
      } finally {
        if (isCurrent) {
          setIsCheckingUsername(false);
        }
      }
    };

    const delayHandler = setTimeout(() => {
      checkUsernameAvailability();
    }, 400);

    return () => {
      isCurrent = false;
      clearTimeout(delayHandler);
    };
  }, [username, baseline.username]);

  const processAndCompressImage = (file: File, targetSize = 200, quality = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error("Canvas context identity failure"));
            return;
          }

          let srcX = 0;
          let srcY = 0;
          let srcSize = Math.min(img.width, img.height);

          if (img.width > img.height) {
            srcX = Math.round((img.width - srcSize) / 2);
          } else {
            srcY = Math.round((img.height - srcSize) / 2);
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          ctx.drawImage(
            img,
            srcX, srcY, srcSize, srcSize,
            0, 0, targetSize, targetSize
          );

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Canvas blob generation failed"));
                return;
              }
              const processedFile = new File([blob], `${myID}.jpg`, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(processedFile);
            },
            "image/jpeg",
            quality
          );
        };

        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const uploadToSupabase = async (file: File): Promise<string | null> => {
    try {
      const fileName = `${myID}-${Date.now()}.jpg`;
      const filePath = `${fileName}`;

      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image to server');
      return null;
    }
  };

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    
    try {
      await UpdateProfile(username, bio, avatar);
      
      setProfileForUser(myID, {
        username,
        bio,
        avatar_url: avatar
      });

      setBaseline({ username, bio, avatar });
      setAvatarTs(Date.now()); 
    } catch (err) {
      console.error("Protocol Sync Failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsSaving(true);
      try {
        const compressedFile = await processAndCompressImage(file, 200, 0.8);
        const publicUrl = await uploadToSupabase(compressedFile);
        
        if (publicUrl) {
          setAvatar(publicUrl);
          setAvatarTs(Date.now());
        }
      } catch (err) {
        console.error("Image processing pipeline failed:", err);
        alert("Failed to process image safely");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const resetAvatar = () => {
    setAvatar(`https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random()}`);
    setAvatarTs(Date.now());
  };

  const getAvatarSrc = () => {
    if (avatar.includes('supabase.co')) {
      return `${avatar}?t=${avatarTs}`;
    }
    return avatar;
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = e.target.value.replace(/[^a-zA-Z0-9._-]/g, '');
    setUsername(cleanValue);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  if (isLoading) return <div className="profile-loader-overlay"><div className="scanner-line"></div></div>;

  return (
    <div className="profile-page">
      <div className="noise"></div>
      
      <header className="profile-nav">
        <button className="back-btn-circle" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
      </header>

      <div className="profile-container glass-morphism">
        <div className="avatar-master-section">
          <div className={`avatar-frame ${isSaving ? 'syncing' : ''}`}>
            <img 
              src={getAvatarSrc()}
              alt="Identity" 
              onError={(e) => (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${myID}`}
            />
            <div className="avatar-overlay">
              <button onClick={() => fileInputRef.current?.click()} className="action-btn" disabled={isSaving}>
                <Camera size={18} />
              </button>
              <button onClick={resetAvatar} className="action-btn" disabled={isSaving}>
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
        </div>

        <div className="identity-card">
          <div className="input-group-modern">
            <label>Username</label>
            <div className="username-input-wrapper" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <span className="username-prefix" style={{ position: 'absolute', left: '12px', opacity: 0.5 }}>@</span>
              <input 
                type="text" 
                value={username} 
                onChange={handleUsernameChange}
                spellCheck={false}
                style={{ paddingLeft: '28px', width: '100%' }}
              />
            </div>
          </div>

          <div className="input-group-modern">
            <label>Bio</label>
            <textarea 
              value={bio} 
              onChange={handleBioChange}
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="hash-info">
            <label>Public Identity Hash</label>
            <div className="id-strip">
              <code>{myID}</code>
            </div>
          </div>
        </div>

        <footer className="action-footer">
          <button 
            className={`protocol-btn ${canSave ? 'ready' : ''} ${isSaving ? 'executing' : ''}`} 
            onClick={handleSave}
            disabled={!canSave}
          >
            {isSaving ? (
              <span className="flex-center"><div className="spinner"></div> Processing...</span>
            ) : isCheckingUsername ? (
              <span className="flex-center"><div className="spinner"></div> Checking availability...</span>
            ) : isUsernameTaken ? (
              "Username already taken"
            ) : hasChanges ? (
              isUsernameValid(username) ? (
                <span className="flex-center"><Check size={18} /> Update</span>
              ) : (
                "Invalid Username"
              )
            ) : (
              "Up to date"
            )}
          </button>
        </footer>
      </div>
    </div>
  );
}