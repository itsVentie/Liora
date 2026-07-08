import { useState } from 'react';
import { 
  User, 
  Shield, 
  HardDrive, 
  Globe, 
  Wallet, 
  Fingerprint, 
  X, 
  Lock,
  Settings as SettingsIcon,
  Database,
  Bell,
  Volume2,
  Monitor,
  Eye,
  Key,
  Server,
  Sliders,
  Trash2,
  Download,
  EyeOff,
  RefreshCw,
  Languages 
} from 'lucide-react';
import '../styles/Settings.scss';

interface SettingsProps {
  onBack: () => void;
}

type SettingsTab = 'profile' | 'general' | 'languages' | 'security' | 'network' | 'connections' | 'vault';

export default function Settings({ onBack }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  
  const [profileAlias, setProfileAlias] = useState('Anonymous User');
  const [statusMessage, setStatusMessage] = useState('');
  const [stripMetadata, setStripMetadata] = useState(true);
  const [nodeDestruct, setNodeDestruct] = useState('never');
  const [avatarSeed, setAvatarSeed] = useState('liora-user-4');

  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState('14');
  const [startOnBoot, setStartOnBoot] = useState(true);
  const [minimizeToTray, setMinimizeToTray] = useState(false);
  const [notifSounds, setNotifSounds] = useState(true);
  const [notifPreviews, setNotifPreviews] = useState(true);

  const [stealthMode, setStealthMode] = useState(false);
  const [readReceipts, setReadReceipts] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState('contacts');
  const [passcodeLock, setPasscodeLock] = useState(false);

  const [p2pEnabled, setP2pEnabled] = useState(true);
  const [relayServer, setRelayServer] = useState('eu');
  const [useProxy, setUseProxy] = useState(false);
  const [autoDownload, setAutoDownload] = useState(true);

  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  const [cacheRetention, setCacheRetention] = useState('month');

  const handleWalletConnect = () => {
    setIsConnectingWallet(true);
    setTimeout(() => setIsConnectingWallet(false), 1500);
  };

  const regenerateSeed = () => {
    setAvatarSeed(Math.random().toString(36).substring(7));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <section className="settings-section animate-in">
            <div className="section-title">
              <User size={18} />
              <h2>My Profile</h2>
            </div>

            <div className="settings-group">
              <div className="group-title">Public Info</div>

              <div className="setting-item">
                <div className="info">
                  <span className="label">Username</span>
                  <p>Your display name visible to other users</p>
                </div>
                <input 
                  type="text" 
                  className="dark-input" 
                  value={profileAlias} 
                  onChange={(e) => setProfileAlias(e.target.value)} 
                  spellCheck={false}
                />
              </div>

              <div className="setting-item">
                <div className="info">
                  <span className="label">Status Message</span>
                  <p>A short text status shown to your contacts</p>
                </div>
                <input 
                  type="text" 
                  className="dark-input" 
                  value={statusMessage} 
                  onChange={(e) => setStatusMessage(e.target.value)} 
                  placeholder="Set a status..."
                />
              </div>
            </div>

            <div className="settings-group">
              <div className="group-title">Media & Privacy</div>

              <div className="setting-item">
                <div className="info">
                  <span className="label">Clean Image Metadata</span>
                  <p>Automatically remove location and camera data from sent photos</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={stripMetadata} 
                  onChange={(e) => setStripMetadata(e.target.checked)} 
                />
              </div>

              <div className="setting-item">
                <div className="info">
                  <span className="label">Profile Picture Seed</span>
                  <p>Random key used to generate your default avatar style</p>
                </div>
                <div className="flex-row-gap">
                  <code className="seed-display">{avatarSeed}</code>
                  <button className="icon-action-btn" onClick={regenerateSeed}>
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="settings-group">
              <div className="group-title">Account Deletion</div>

              <div className="setting-item">
                <div className="info">
                  <span className="label">Inactivity Delete</span>
                  <p>Automatically delete local profile data if you remain offline</p>
                </div>
                <select className="dark-select" value={nodeDestruct} onChange={(e) => setNodeDestruct(e.target.value)}>
                  <option value="never">Never</option>
                  <option value="7d">7 Days</option>
                  <option value="1m">1 Month</option>
                  <option value="3m">3 Months</option>
                </select>
              </div>
            </div>
          </section>
        );

      case 'general':
        return (
          <section className="settings-section animate-in">
            <div className="section-title">
              <SettingsIcon size={18} />
              <h2>General Preferences</h2>
            </div>

            <div className="settings-group">
              <div className="group-title">Appearance</div>

              <div className="setting-item">
                <div className="info">
                  <span className="label">Color Theme</span>
                  <p>Customize the application window look</p>
                </div>
                <select className="dark-select" value={theme} onChange={(e) => setTheme(e.target.value)}>
                  <option value="dark">Deep Charcoal</option>
                  <option value="amoled">Pure AMOLED</option>
                  <option value="system">System Default</option>
                </select>
              </div>

              <div className="setting-item">
                <div className="info">
                  <span className="label">Text Size</span>
                  <p>Adjust chat font scale</p>
                </div>
                <select className="dark-select" value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
                  <option value="12">12px (Small)</option>
                  <option value="14">14px (Default)</option>
                  <option value="16">16px (Large)</option>
                  <option value="18">18px (Extra Large)</option>
                </select>
              </div>
            </div>

            <div className="settings-group">
              <div className="group-title">System & Startup</div>
              
              <div className="setting-item">
                <div className="info">
                  <span className="label">Launch on Startup</span>
                  <p>Automatically open application when system boots</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={startOnBoot} 
                  onChange={(e) => setStartOnBoot(e.target.checked)} 
                />
              </div>

              <div className="setting-item">
                <div className="info">
                  <span className="label">Minimize to Tray</span>
                  <p>Closing the window moves it to the system tray</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={minimizeToTray} 
                  onChange={(e) => setMinimizeToTray(e.target.checked)} 
                />
              </div>
            </div>

            <div className="settings-group">
              <div className="group-title">Notifications</div>

              <div className="setting-item">
                <div className="info">
                  <span className="label">Sound Alerts</span>
                  <p>Play audio cues for incoming messages</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifSounds} 
                  onChange={(e) => setNotifSounds(e.target.checked)} 
                />
              </div>

              <div className="setting-item">
                <div className="info">
                  <span className="label">Message Previews</span>
                  <p>Show sender name and text content in banners</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifPreviews} 
                  onChange={(e) => setNotifPreviews(e.target.checked)} 
                />
              </div>
            </div>
          </section>
        );

      case 'security':
        return (
          <section className="settings-section animate-in">
            <div className="section-title">
              <Shield size={18} />
              <h2>Security & Privacy</h2>
            </div>

            <div className="settings-group">
              <div className="group-title">Privacy Settings</div>

              <div className="setting-item">
                <div className="info">
                  <span className="label">Stealth Mode</span>
                  <p>Hide your online status from everyone</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={stealthMode} 
                  onChange={(e) => setStealthMode(e.target.checked)} 
                />
              </div>

              <div className="setting-item">
                <div className="info">
                  <span className="label">Read Receipts</span>
                  <p>Allow others to see when you have read messages</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={readReceipts} 
                  onChange={(e) => setReadReceipts(e.target.checked)} 
                />
              </div>

              <div className="setting-item">
                <div className="info">
                  <span className="label">Profile Visibility</span>
                  <p>Control who can see your avatar and bio</p>
                </div>
                <select className="dark-select" value={profileVisibility} onChange={(e) => setProfileVisibility(e.target.value)}>
                  <option value="everyone">Everyone</option>
                  <option value="contacts">Trusted Contacts Only</option>
                  <option value="nobody">Nobody</option>
                </select>
              </div>
            </div>

            <div className="settings-group">
              <div className="group-title">Authentication</div>

              <div className="setting-item">
                <div className="info">
                  <span className="label">Local Passcode Lock</span>
                  <p>Require a PIN or password on application launch</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={passcodeLock} 
                  onChange={(e) => setPasscodeLock(e.target.checked)} 
                />
              </div>

              <div className="setting-item">
                <div className="info">
                  <span className="label">Advanced Encryption Protocols</span>
                  <p>Enable experimental next-generation security algorithms</p>
                </div>
                <div className="toggle-disabled">Dev Only</div>
              </div>

              <div className="setting-item">
                <div className="info">
                  <span className="label">End-to-End Encryption</span>
                  <p>All chat data is secured and encrypted by default</p>
                </div>
                <span className="status-locked">Always On</span>
              </div>
            </div>
          </section>
        );

      case 'network':
        return (
          <section className="settings-section animate-in">
            <div className="section-title">
              <Globe size={18} />
              <h2>Network Settings</h2>
            </div>

            <div className="settings-group">
              <div className="group-title">Connections</div>

              <div className="setting-item">
                <div className="info">
                  <span className="label">Direct Peer-to-Peer</span>
                  <p>Allow direct connection to other users for faster speeds</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={p2pEnabled} 
                  onChange={(e) => setP2pEnabled(e.target.checked)} 
                />
              </div>

              <div className="setting-item">
                <div className="info">
                  <span className="label">Backup Relay Servers</span>
                  <p>Route traffic through servers if direct connection is blocked</p>
                </div>
                <select className="dark-select" value={relayServer} onChange={(e) => setRelayServer(e.target.value)}>
                  <option value="eu">Europe</option>
                  <option value="us">United States</option>
                  <option value="asia">Asia</option>
                </select>
              </div>
            </div>

            <div className="settings-group">
              <div className="group-title">Proxy Server</div>

              <div className="setting-item">
                <div className="info">
                  <span className="label">Use SOCKS5 Proxy</span>
                  <p>Route your connection through a custom proxy location</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={useProxy} 
                  onChange={(e) => setUseProxy(e.target.checked)} 
                />
              </div>
            </div>

            <div className="settings-group">
              <div className="group-title">Media Download</div>

              <div className="setting-item">
                <div className="info">
                  <span className="label">Auto-Download Media</span>
                  <p>Automatically download incoming images and files</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={autoDownload} 
                  onChange={(e) => setAutoDownload(e.target.checked)} 
                />
              </div>
            </div>
          </section>
        );

      case 'connections':
        return (
          <section className="settings-section animate-in">
            <div className="section-title highlight">
              <Wallet size={18} />
              <h2>Integrations</h2>
            </div>

            <div className="settings-group">
              <div className="group-title">Verification & Accounts</div>

              <div className="setting-item">
                <div className="info">
                  <span className="label">Crypto Wallet Link</span>
                  <p>Connect Web3 wallet for account verification and secure login</p>
                </div>
                <button 
                  className={`wallet-btn ${isConnectingWallet ? 'loading' : ''}`} 
                  onClick={handleWalletConnect}
                >
                  {isConnectingWallet ? 'Connecting...' : 'Connect Wallet'}
                </button>
              </div>

              <div className="setting-item">
                <div className="info">
                  <span className="label">Biometric Login</span>
                  <p>Unlock the application using Windows Hello or TouchID</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={biometricsEnabled} 
                  onChange={(e) => setBiometricsEnabled(e.target.checked)} 
                />
              </div>
            </div>
          </section>
        );

      case 'vault':
        return (
          <section className="settings-section animate-in">
            <div className="section-title">
              <HardDrive size={18} />
              <h2>Storage Settings</h2>
            </div>

            <div className="settings-group">
              <div className="group-title">Local App Storage</div>

              <div className="vault-info">
                <div className="storage-bar">
                  <div className="usage" style={{ width: '15%' }}></div>
                </div>
                <p>Storage used: 1.2 MB / 500.0 MB maximum allowed</p>
              </div>

              <div className="setting-item">
                <div className="info">
                  <span className="label">Clear Media Cache</span>
                  <p>Automatically delete cached files and images after a set time</p>
                </div>
                <select className="dark-select" value={cacheRetention} onChange={(e) => setCacheRetention(e.target.value)}>
                  <option value="three-days">3 Days</option>
                  <option value="week">1 Week</option>
                  <option value="month">1 Month</option>
                  <option value="infinite">Keep Forever</option>
                </select>
              </div>
            </div>

            <div className="settings-group">
              <div className="group-title">Manage Data</div>
              
              <div className="action-row">
                <button className="secondary-btn">Clear Cache</button>
                <button className="secondary-btn">Export Backup</button>
              </div>
              <div className="action-row" style={{ marginTop: '12px' }}>
                <button className="danger-btn">Delete All Data</button>
              </div>
            </div>
          </section>
        );
        case 'languages':
        return (
          <section className="settings-section animate-in">
            <div className="section-title">
              <Languages size={18} />
              <h2>Language Settings</h2>
            </div>

            <div className="settings-group">
              <div className="group-title">Interface Language</div>
              
              <div className="variant-grid">
  {[
    { code: 'en', name: 'English', desc: 'United States', flag: '🇺🇸' },
    { code: 'ru', name: 'Русский', desc: 'Россия', flag: '🇷🇺' },
    { code: 'es', name: 'Español', desc: 'España', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', desc: 'Deutschland', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', desc: 'France', flag: '🇫🇷' },
    { code: 'zh', name: '中文', desc: '中国', flag: '🇨🇳' }
  ].map((lang) => (
    <div 
      key={lang.code}
      className={`variant-card ${language === lang.code ? 'active' : ''}`}
      onClick={() => setLanguage(lang.code)}
    >
      <span className="card-flag">{lang.flag}</span>
      <span className="card-title">{lang.name}</span>
      <span className="card-desc">{lang.desc}</span>
    </div>
  ))}
</div>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onBack}>
      <div className="settings-modal animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="noise"></div>
        
        <aside className="settings-sidebar">
          <div className="sidebar-header">
            <SettingsIcon size={24} className="logo-icon" />
             <span>Liora</span>
          </div>
          
          <nav className="sidebar-nav">
            <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
              <User size={18} /> Profile Settings
            </button>
            <button className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>
              <SettingsIcon size={18} /> General
            </button>
            <button className={activeTab === 'languages' ? 'active' : ''} onClick={() => setActiveTab('languages')}>
              <Languages size={18} /> Languages
            </button>
            <button className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>
              <Lock size={18} /> Security & Privacy
            </button>
            <button className={activeTab === 'network' ? 'active' : ''} onClick={() => setActiveTab('network')}>
              <Globe size={18} /> Network
            </button>
            <button className={activeTab === 'connections' ? 'active' : ''} onClick={() => setActiveTab('connections')}>
              <Wallet size={18} /> Integrations
            </button>
            <button className={activeTab === 'vault' ? 'active' : ''} onClick={() => setActiveTab('vault')}>
              <Database size={18} /> Storage
            </button>
          </nav>

          <div className="sidebar-footer">
          </div>
        </aside>

        <main className="settings-main">
          <header className="main-header">
            <h1>{activeTab === 'profile' ? 'Profile' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <button className="close-btn" onClick={onBack}><X size={20} /></button>
          </header>
          
          <div className="main-content">
            {activeTab === 'network' ? (
              <div className="main-content">
                {renderContent()}
              </div>
            ) : renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}