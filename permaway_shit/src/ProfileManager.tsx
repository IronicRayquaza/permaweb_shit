// import React, { useState } from "react";

// type ProfileData = {
//   id: string;
//   walletAddress: string;
//   username: string;
//   displayName: string;
//   description: string;
//   thumbnail: string;
//   banner: string;
//   assets: {
//     id: string;
//     quantity: string;
//     dateCreated: number;
//     lastUpdate: number;
//   }[];
// };

// type Props = {
//   permaweb: any;
// };

// const ProfileManager: React.FC<Props> = ({ permaweb }) => {
//   const [form, setForm] = useState({
//     username: "",
//     displayName: "",
//     description: "",
//     thumbnail: "",
//     banner: "",
//   });
//   const [profileId, setProfileId] = useState("");
//   const [walletAddress, setWalletAddress] = useState("");
//   const [profile, setProfile] = useState<ProfileData | null>(null);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "thumbnail" | "banner") => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setForm(prev => ({ ...prev, [type]: reader.result as string }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const createProfile = async () => {
//     try {
//       const newProfileId = await permaweb.createProfile(form);
//       setProfileId(newProfileId);
//       alert("Profile created with ID: " + newProfileId);
//     } catch (err: any) {
//       console.error("Create profile failed:", err);
//       if (err?.message?.includes("cancelled")) {
//         alert("You cancelled the signing. Please try again.");
//       } else {
//         alert("Failed to create profile.");
//       }
//     }
//   };

//   const updateProfile = async () => {
//     if (!profileId) return alert("Please provide a profile ID to update.");
//     try {
//       const updatedId = await permaweb.updateProfile(form, profileId);
//       alert("Profile updated. Update ID: " + updatedId);
//     } catch (err: any) {
//       console.error("Update failed:", err);
//       alert("Failed to update profile.");
//     }
//   };

//   const fetchById = async () => {
//     if (!profileId) return alert("Enter Profile ID first");
//     try {
//       const fetchedProfile = await permaweb.getProfileById(profileId);
//       setProfile(fetchedProfile);
//     } catch (err) {
//       console.error("Fetch by ID failed:", err);
//       alert("Failed to fetch profile.");
//     }
//   };

//   const fetchByWallet = async () => {
//     if (!walletAddress) return alert("Enter Wallet Address first");
//     try {
//       const fetchedProfile = await permaweb.getProfileByWalletAddress(walletAddress);
//       setProfile(fetchedProfile);
//     } catch (err) {
//       console.error("Fetch by Wallet failed:", err);
//       alert("Failed to fetch profile.");
//     }
//   };

//   const renderImage = (src: string, alt: string) => {
//     // Check if it's base64 or arweave txId
//     const isBase64 = src?.startsWith("data:image");
//     return (
//       <img
//         src={isBase64 ? src : `https://arweave.net/${src}`}
//         alt={alt}
//         className="w-20 h-20 object-cover"
//       />
//     );
//   };

//   // Custom file input for better styling
//   const FileInput = ({ type, label }: { type: "thumbnail" | "banner"; label: string }) => (
//     <label className="block w-full cursor-pointer">
//       <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
//       <div className="flex items-center gap-2">
//         <span className="inline-block bg-gray-200 px-3 py-2 rounded border border-gray-300 text-gray-700 text-sm hover:bg-gray-300 transition">
//           Choose {label}
//         </span>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => handleImageUpload(e, type)}
//           className="hidden"
//         />
//       </div>
//     </label>
//   );

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-2xl shadow-lg space-y-8 mt-8">
//       <h2 className="text-2xl font-bold text-blue-700 mb-2">Profile Manager</h2>
//       {/* Profile Form */}
//       <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
//         <h3 className="text-lg font-semibold text-gray-800 mb-2">Create / Update Profile</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input name="username" placeholder="Username" value={form.username} onChange={handleInputChange} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full" />
//           <input name="displayName" placeholder="Display Name" value={form.displayName} onChange={handleInputChange} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full" />
//         </div>
//         <textarea name="description" placeholder="Description" value={form.description} onChange={handleInputChange} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full min-h-[60px]" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FileInput type="thumbnail" label="Thumbnail" />
//           <FileInput type="banner" label="Banner" />
//         </div>
//         <div className="flex gap-4 mt-2">
//           <button onClick={createProfile} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition">Create Profile</button>
//           <button onClick={updateProfile} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition">Update Profile</button>
//         </div>
//       </div>

//       {/* Fetch Actions */}
//       <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
//         <h3 className="text-lg font-semibold text-gray-800 mb-2">Fetch Profile</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <input
//               placeholder="Profile ID"
//               value={profileId}
//               onChange={(e) => setProfileId(e.target.value)}
//               className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
//             />
//             <button onClick={fetchById} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold w-full mt-2 transition">Fetch by Profile ID</button>
//           </div>
//           <div>
//             <input
//               placeholder="Wallet Address"
//               value={walletAddress}
//               onChange={(e) => setWalletAddress(e.target.value)}
//               className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full"
//             />
//             <button onClick={fetchByWallet} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold w-full mt-2 transition">Fetch by Wallet</button>
//           </div>
//         </div>
//       </div>

//       {/* Profile Display */}
//       {profile && (
//         <div className="p-6 border border-gray-200 rounded-2xl bg-gradient-to-br from-gray-50 to-white shadow-inner mt-4">
//           <h3 className="text-xl font-bold text-blue-700 mb-4">Profile Info</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <p className="mb-1"><span className="font-semibold text-gray-700">ID:</span> {profile.id}</p>
//               <p className="mb-1"><span className="font-semibold text-gray-700">Username:</span> {profile.username}</p>
//               <p className="mb-1"><span className="font-semibold text-gray-700">Display Name:</span> {profile.displayName}</p>
//               <p className="mb-1"><span className="font-semibold text-gray-700">Description:</span> {profile.description}</p>
//               <p className="mb-1"><span className="font-semibold text-gray-700">Wallet:</span> {profile.walletAddress}</p>
//             </div>
//             <div className="flex gap-4 items-center">
//               {profile.thumbnail && renderImage(profile.thumbnail, "Thumbnail")}
//               {profile.banner && renderImage(profile.banner, "Banner")}
//             </div>
//           </div>
//           <div className="mt-2">
//             <h4 className="font-bold text-gray-800 mb-2">Assets</h4>
//             <ul className="list-disc pl-6 space-y-1 text-gray-700">
//               {Array.isArray(profile.assets) && profile.assets.map(asset => (
//                 <li key={asset.id} className="bg-gray-100 rounded px-2 py-1">
//                   <span className="font-semibold">ID:</span> {asset.id}, <span className="font-semibold">Qty:</span> {asset.quantity}, <span className="font-semibold">Created:</span> {new Date(asset.dateCreated).toLocaleString()}, <span className="font-semibold">Updated:</span> {new Date(asset.lastUpdate).toLocaleString()}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfileManager;
import React, { useState } from "react";

type ProfileData = {
  id: string;
  walletAddress: string;
  username: string;
  displayName: string;
  description: string;
  thumbnail: string;
  banner: string;
  assets: {
    id: string;
    quantity: string;
    dateCreated: number;
    lastUpdate: number;
  }[];
};

type Props = {
  permaweb: any;
};

const ProfileManager: React.FC<Props> = ({ permaweb }) => {
  const [form, setForm] = useState({
    username: "",
    displayName: "",
    description: "",
    thumbnail: "",
    banner: "",
  });
  const [profileId, setProfileId] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "thumbnail" | "banner") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const createProfile = async () => {
    try {
      const newProfileId = await permaweb.createProfile(form);
      setProfileId(newProfileId);
      alert("Profile created with ID: " + newProfileId);
    } catch (err: any) {
      console.error("Create profile failed:", err);
      if (err?.message?.includes("cancelled")) {
        alert("You cancelled the signing. Please try again.");
      } else {
        alert("Failed to create profile.");
      }
    }
  };

  const updateProfile = async () => {
    if (!profileId) return alert("Please provide a profile ID to update.");
    try {
      const updatedId = await permaweb.updateProfile(form, profileId);
      alert("Profile updated. Update ID: " + updatedId);
    } catch (err: any) {
      console.error("Update failed:", err);
      alert("Failed to update profile.");
    }
  };

  const fetchById = async () => {
    if (!profileId) return alert("Enter Profile ID first");
    try {
      const fetchedProfile = await permaweb.getProfileById(profileId);
      setProfile(fetchedProfile);
    } catch (err) {
      console.error("Fetch by ID failed:", err);
      alert("Failed to fetch profile.");
    }
  };

  const fetchByWallet = async () => {
    if (!walletAddress) return alert("Enter Wallet Address first");
    try {
      const fetchedProfile = await permaweb.getProfileByWalletAddress(walletAddress);
      setProfile(fetchedProfile);
    } catch (err) {
      console.error("Fetch by Wallet failed:", err);
      alert("Failed to fetch profile.");
    }
  };

  const renderImage = (src: string, alt: string, size = "w-20 h-20") => {
    if (!src) return <div className={`bg-gray-200 ${size} flex items-center justify-center rounded`}>No {alt}</div>;
    const isBase64 = src.startsWith("data:image");
    return (
      <img
        src={isBase64 ? src : `https://arweave.net/${src}`}
        alt={alt}
        className={`${size} object-cover rounded border`}
      />
    );
  };

  const FileInput = ({ type, label }: { type: "thumbnail" | "banner"; label: string }) => (
    <label className="block w-full cursor-pointer">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <div className="flex items-center gap-4">
        {form[type] && renderImage(form[type], label, "w-16 h-16")}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, type)}
          className="text-sm bg-white border border-gray-300 rounded px-3 py-2 shadow-sm file:mr-4 file:py-2 file:px-4 file:border file:rounded file:border-gray-300 file:text-sm file:bg-gray-100 file:text-gray-700"
        />
      </div>
    </label>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-2xl shadow-lg space-y-8 mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">Profile Manager</h2>

      {/* Profile Form */}
      <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Create / Update Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleInputChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />
          <input
            name="displayName"
            placeholder="Display Name"
            value={form.displayName}
            onChange={handleInputChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />
        </div>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleInputChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full min-h-[60px]"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileInput type="thumbnail" label="Thumbnail" />
          <FileInput type="banner" label="Banner" />
        </div>
        <div className="flex gap-4 mt-2">
          <button onClick={createProfile} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition">
            Create Profile
          </button>
          <button onClick={updateProfile} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition">
            Update Profile
          </button>
        </div>
      </div>

      {/* Fetch Actions */}
      <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Fetch Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              placeholder="Profile ID"
              value={profileId}
              onChange={(e) => setProfileId(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
            />
            <button onClick={fetchById} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold w-full mt-2 transition">
              Fetch by Profile ID
            </button>
          </div>
          <div>
            <input
              placeholder="Wallet Address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full"
            />
            <button onClick={fetchByWallet} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold w-full mt-2 transition">
              Fetch by Wallet
            </button>
          </div>
        </div>
      </div>

      {/* Profile Display */}
      {profile && (
        <div className="p-6 border border-gray-200 rounded-2xl bg-gradient-to-br from-gray-50 to-white shadow-inner mt-4">
          <h3 className="text-xl font-bold text-blue-700 mb-4">Profile Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="mb-1"><span className="font-semibold text-gray-700">ID:</span> {profile.id}</p>
              <p className="mb-1"><span className="font-semibold text-gray-700">Username:</span> {profile.username}</p>
              <p className="mb-1"><span className="font-semibold text-gray-700">Display Name:</span> {profile.displayName}</p>
              <p className="mb-1"><span className="font-semibold text-gray-700">Description:</span> {profile.description}</p>
              <p className="mb-1"><span className="font-semibold text-gray-700">Wallet:</span> {profile.walletAddress}</p>
            </div>
            <div className="flex flex-col gap-2 items-start">
              {renderImage(profile.thumbnail, "Thumbnail", "w-28 h-28")}
              {renderImage(profile.banner, "Banner", "w-full h-28")}
            </div>
          </div>
          <div className="mt-2">
            <h4 className="font-bold text-gray-800 mb-2">Assets</h4>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              {Array.isArray(profile.assets) && profile.assets.map(asset => (
                <li key={asset.id} className="bg-gray-100 rounded px-2 py-1">
                  <span className="font-semibold">ID:</span> {asset.id}, <span className="font-semibold">Qty:</span> {asset.quantity}, <span className="font-semibold">Created:</span> {new Date(asset.dateCreated).toLocaleString()}, <span className="font-semibold">Updated:</span> {new Date(asset.lastUpdate).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileManager;
