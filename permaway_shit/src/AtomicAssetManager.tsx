


// import React, { useEffect, useState } from "react";
// import Arweave from "arweave";
// import { getWalletAddress } from "./utils/getWalletAddress";

// interface AtomicAsset {
//   id: string;
//   name: string;
//   description: string;
//   creator: string;
//   topics: string[];
//   dateCreated: number;
//   assetType: string;
//   contentType: string;
//   metadata?: any;
// }

// const arweave = Arweave.init({
//   host: "arweave.net",
//   port: 443,
//   protocol: "https",
// });

// const AtomicAssetsManager: React.FC = () => {
//   const [assets, setAssets] = useState<AtomicAsset[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [showForm, setShowForm] = useState(false);

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     type: "",
//     topics: "",
//     contentType: "",
//     file: null as File | null,
//   });

//   const fetchAssets = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const address = await getWalletAddress();
//       if (!address) {
//         setError("Wallet not connected");
//         return;
//       }

//       const query = {
//         query: `
//           query {
//             transactions(owners: ["${address}"], tags: [{ name: "Protocol-Name", values: ["Permaweb Atomic Asset"] }]) {
//               edges {
//                 node {
//                   id
//                   tags {
//                     name
//                     value
//                   }
//                   block {
//                     timestamp
//                   }
//                 }
//               }
//             }
//           }
//         `,
//       };

//       const response = await fetch("https://arweave.net/graphql", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(query),
//       });

//       const result = await response.json();
//       const nodes = result?.data?.transactions?.edges || [];

//       const parsedAssets: AtomicAsset[] = nodes.map(({ node }: any) => {
//         const tags: Record<string, string> = {};
//         node.tags.forEach((tag: any) => {
//           tags[tag.name] = tag.value;
//         });

//         return {
//           id: node.id,
//           name: tags["Title"] || "Untitled",
//           description: tags["Description"] || "No description",
//           creator: address,
//           topics: tags["Topics"]?.split(",") || [],
//           dateCreated: node.block?.timestamp * 1000 || Date.now(),
//           assetType: tags["Type"] || "Unknown",
//           contentType: tags["Content-Type"] || "N/A",
//         };
//       });

//       setAssets(parsedAssets);
//     } catch (err) {
//       console.error("Error fetching assets:", err);
//       setError("Failed to load assets");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateAsset = () => setShowForm(true);
//   const closeForm = () => setShowForm(false);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value, files } = e.target as any;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const address = await getWalletAddress();
//     if (!address || !formData.file) return;

//     const tags = [
//       { name: "App-Name", value: "Permaweb Atomic Asset Uploader" },
//       { name: "Protocol-Name", value: "Permaweb Atomic Asset" },
//       { name: "Title", value: formData.title },
//       { name: "Description", value: formData.description },
//       { name: "Type", value: formData.type },
//       { name: "Topics", value: formData.topics },
//       { name: "Content-Type", value: formData.contentType },
//     ];

//     try {
//       const data = await formData.file.arrayBuffer();

//       await window.arweaveWallet.connect([
//         "ACCESS_ADDRESS",
//         "SIGN_TRANSACTION",
//       ]);

//       const tx = await arweave.createTransaction({ data });

//       tags.forEach((tag) => tx.addTag(tag.name, tag.value));

//       await window.arweaveWallet.sign(tx);
//       const response = await arweave.transactions.post(tx);

//       if (response.status === 200 || response.status === 202) {
//         alert("Asset uploaded successfully!");
//         setShowForm(false);
//         fetchAssets();
//       } else {
//         alert("Upload failed. Please try again.");
//       }
//     } catch (err) {
//       console.error("Upload error:", err);
//       alert("Failed to upload asset.");
//     }
//   };

//   useEffect(() => {
//     fetchAssets();
//   }, []);

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">Your Atomic Assets</h2>

//       {loading && <p>Loading assets...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {assets.length > 0 ? (
//         <>
//           <button
//             onClick={handleCreateAsset}
//             className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//           >
//             Upload or Create Asset
//           </button>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {assets.map((asset) => (
//               <div
//                 key={asset.id}
//                 className="p-4 border rounded shadow hover:shadow-md transition"
//               >
//                 <h3 className="font-semibold text-lg mb-1">{asset.name}</h3>
//                 <p className="text-sm mb-1">{asset.description}</p>
//                 <p className="text-xs text-gray-500">
//                   Created: {new Date(asset.dateCreated).toLocaleString()}
//                 </p>
//                 <p className="text-xs text-gray-600">
//                   Type: {asset.assetType}
//                 </p>
//                 {asset.topics?.length > 0 && (
//                   <p className="text-xs mt-1">
//                     Topics: {asset.topics.join(", ")}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </>
//       ) : (
//         !loading && (
//           <div className="text-center mt-4">
//             <p className="mb-2">You have no Atomic Assets yet.</p>
//             <button
//               onClick={handleCreateAsset}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//             >
//               Upload or Create Asset
//             </button>
//           </div>
//         )
//       )}

//       {showForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
//             <h3 className="text-xl font-semibold mb-4">Create Atomic Asset</h3>
//             <form onSubmit={handleSubmit}>
//               <input
//                 className="w-full mb-2 border p-2"
//                 type="text"
//                 name="title"
//                 placeholder="Title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//               />
//               <textarea
//                 className="w-full mb-2 border p-2"
//                 name="description"
//                 placeholder="Description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 className="w-full mb-2 border p-2"
//                 type="text"
//                 name="type"
//                 placeholder="Type (e.g. image, doc)"
//                 value={formData.type}
//                 onChange={handleChange}
//               />
//               <input
//                 className="w-full mb-2 border p-2"
//                 type="text"
//                 name="topics"
//                 placeholder="Topics (comma-separated)"
//                 value={formData.topics}
//                 onChange={handleChange}
//               />
//               <input
//                 className="w-full mb-2 border p-2"
//                 type="text"
//                 name="contentType"
//                 placeholder="Content-Type (e.g. image/png)"
//                 value={formData.contentType}
//                 onChange={handleChange}
//               />
//               <input
//                 className="w-full mb-4"
//                 type="file"
//                 name="file"
//                 accept="*"
//                 onChange={handleChange}
//                 required
//               />

//               <div className="flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={closeForm}
//                   className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                 >
//                   Upload
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AtomicAssetsManager;

import React, { useEffect, useState } from "react";
import Arweave from "arweave";
import { getWalletAddress } from "./utils/getWalletAddress";

interface AtomicAsset {
  id: string;
  name: string;
  description: string;
  creator: string;
  topics: string[];
  dateCreated: number;
  assetType: string;
  contentType: string;
}

const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

const AtomicAssetsManager: React.FC = () => {
  const [assets, setAssets] = useState<AtomicAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    topics: "",
    contentType: "",
    file: null as File | null,
  });

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const address = await getWalletAddress();
      if (!address) {
        setError("Wallet not connected");
        return;
      }

      const query = {
        query: `
          query {
            transactions(owners: ["${address}"], tags: [{ name: "Protocol-Name", values: ["Permaweb Atomic Asset"] }]) {
              edges {
                node {
                  id
                  tags {
                    name
                    value
                  }
                  block {
                    timestamp
                  }
                }
              }
            }
          }
        `,
      };

      const response = await fetch("https://arweave.net/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      });

      const result = await response.json();
      const nodes = result?.data?.transactions?.edges || [];

      const parsedAssets: AtomicAsset[] = nodes.map(({ node }: any) => {
        const tags: Record<string, string> = {};
        node.tags.forEach((tag: any) => {
          tags[tag.name] = tag.value;
        });

        return {
          id: node.id,
          name: tags["Title"] || "Untitled",
          description: tags["Description"] || "No description",
          creator: address,
          topics: tags["Topics"]?.split(",") || [],
          dateCreated: node.block?.timestamp * 1000 || Date.now(),
          assetType: tags["Type"] || "Unknown",
          contentType: tags["Content-Type"] || "N/A",
        };
      });

      setAssets(parsedAssets);
    } catch (err) {
      console.error("Error fetching assets:", err);
      setError("Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAsset = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.file) {
      alert("File is required");
      return;
    }

    try {
      await window.arweaveWallet.connect(["ACCESS_ADDRESS", "SIGN_TRANSACTION", "DISPATCH"]);

      const data = await formData.file.arrayBuffer();
      const tx = await arweave.createTransaction({ data });

      tx.addTag("App-Name", "Permaweb Atomic Asset Uploader");
      tx.addTag("Protocol-Name", "Permaweb Atomic Asset");
      tx.addTag("Title", formData.title);
      tx.addTag("Description", formData.description);
      tx.addTag("Type", formData.type);
      tx.addTag("Topics", formData.topics);
      tx.addTag("Content-Type", formData.contentType);

      // Use ArConnect dispatch to sign and upload
      await window.arweaveWallet.dispatch(tx);

      alert("Asset uploaded successfully!");
      setShowForm(false);
      setFormData({
        title: "",
        description: "",
        type: "",
        topics: "",
        contentType: "",
        file: null,
      });
      fetchAssets();
    } catch (err: any) {
      console.error("Upload error:", err);
      alert("Upload error: " + (err?.message || "Unknown error"));
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Atomic Assets</h2>

      {loading && <p>Loading assets...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {assets.length > 0 ? (
        <>
          <button
            onClick={handleCreateAsset}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Upload or Create Asset
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="p-4 border rounded shadow hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg mb-1">{asset.name}</h3>
                <p className="text-sm mb-1">{asset.description}</p>
                <p className="text-xs text-gray-500">
                  Created: {new Date(asset.dateCreated).toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">
                  Type: {asset.assetType}
                </p>
                {asset.topics?.length > 0 && (
                  <p className="text-xs mt-1">
                    Topics: {asset.topics.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        !loading && (
          <div className="text-center mt-4">
            <p className="mb-2">You have no Atomic Assets yet.</p>
            <button
              onClick={handleCreateAsset}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Upload or Create Asset
            </button>
          </div>
        )
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Create Atomic Asset</h3>
            <form onSubmit={handleSubmit}>
              <input
                className="w-full mb-2 border p-2"
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <textarea
                className="w-full mb-2 border p-2"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <input
                className="w-full mb-2 border p-2"
                type="text"
                name="type"
                placeholder="Type (e.g. image, doc)"
                value={formData.type}
                onChange={handleChange}
              />
              <input
                className="w-full mb-2 border p-2"
                type="text"
                name="topics"
                placeholder="Topics (comma-separated)"
                value={formData.topics}
                onChange={handleChange}
              />
              <input
                className="w-full mb-2 border p-2"
                type="text"
                name="contentType"
                placeholder="Content-Type (e.g. image/png)"
                value={formData.contentType}
                onChange={handleChange}
                required
              />
              <input
                className="w-full mb-4"
                type="file"
                name="file"
                accept="*"
                onChange={handleChange}
                required
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AtomicAssetsManager;


