// App.tsx
import React, { useEffect, useState } from "react";
import ProfileManager from "./ProfileManager";
import AtomicAssetsManager from "./AtomicAssetManager";
import { initPermaweb } from "./utils/permaweb";

function App() {
  const [permaweb, setPermaweb] = useState<any | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const pw = await initPermaweb();
        setPermaweb(pw);
      } catch (err) {
        console.error("Failed to initialize permaweb:", err);
        alert("Failed to connect to ArConnect. Please ensure it’s installed and unlocked.");
      }
    };
    init();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Permaweb Profile Demo</h1>
      {permaweb ? (
        <ProfileManager permaweb={permaweb} />
      ) : (
        <p>Connecting to ArConnect...</p>
      )}
      <AtomicAssetsManager/>
    </div>
  );
}

export default App;
