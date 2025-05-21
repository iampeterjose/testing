const ProfileDropdown = ({ user, onSignOut }) => {
  return (
    <div id="dropdownInformation" className="z-50 min-w-56 bg-white rounded-xl shadow-2xl border border-orange-100 py-2 px-0 animate-fade-in">
      <div className="px-5 py-4 flex flex-col items-center border-b border-orange-50">
        {user?.image ? (
          <img src={user.image} alt="Profile" className="w-12 h-12 rounded-full mb-2 border-2 border-orange-200 object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
            <span className="text-orange-500 text-xl font-bold">{user?.name ? user.name[0] : '?'}</span>
          </div>
        )}
        <div className="text-base font-semibold text-orange-800">{user?.name || 'User'}</div>
        <div className="text-xs text-gray-500 font-mono truncate">{user?.email}</div>
      </div>
      <ul className="py-2 text-sm text-gray-700">
        <li>
          <a href="/profile" className="block px-5 py-2 hover:bg-orange-50 rounded-lg transition">Profile</a>
        </li>
        <li>
          <a href="/history" className="block px-5 py-2 hover:bg-orange-50 rounded-lg transition">Order History</a>
        </li>
        <li>
          <a href="/settings" className="block px-5 py-2 hover:bg-orange-50 rounded-lg transition">Settings</a>
        </li>
      </ul>
      <div className="py-2 border-t border-orange-50">
        <button onClick={onSignOut} className="block w-full text-left px-5 py-2 text-sm text-orange-600 font-semibold hover:bg-orange-100 rounded-lg transition">Sign out</button>
      </div>
    </div>
  );
};

export default ProfileDropdown;