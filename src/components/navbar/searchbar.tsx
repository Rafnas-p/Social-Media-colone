import Link from 'next/link'; // Import Link for navigation
import { IoMdSearch } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "@/context/vidoContext/VideoContext";


interface Thumbnails {
  default: { url: string; width: number; height: number };
}

interface Snippet {
  channelId: string;
  channelTitle: string;
  description: string;
  liveBroadcastContent: string;
  publishTime: string;
  publishedAt: string;
  thumbnails: Thumbnails;
  title: string;
}

interface VideoId {
  kind: string;
  videoId: string;
}

interface SearchItem {
  id: VideoId;
  snippet: Snippet;
}

interface MyContextType {
  searchData: SearchItem[];  
  filteredData: SearchItem[]; 
  setFilteredData: React.Dispatch<React.SetStateAction<SearchItem[]>>; 
}

const Searchbar: React.FC = () => {
  const context = useContext(MyContext) as MyContextType | undefined;
  
  if (!context) {
    throw new Error('MyContext is not available');
  }

  const { data, filteredData, setFilteredData } = context;
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.trim());
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  useEffect(() => {
    if (searchQuery && data) {
      const results = data.filter((item: SearchItem) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(results);
    }
  }, [searchQuery, data, setFilteredData]);

  
console.log("filte", filteredData);

  return (
    <div className=" px-4 sm:px-0 fixed top-4 flex flex-col items-center z-10">
      <div className="relative w-full sm:w-[500px]">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleInputChange}
          className="p-3 rounded-full border border-gray-300 w-full h-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        
        <div className="absolute top-0 right-0 h-full w-10 sm:w-12 bg-gray-200 p-2 rounded-r-full border border-gray-300 flex items-center justify-center">
          <span><IoMdSearch size={18} /></span>
        </div>

        {searchQuery && (
          <button
            className="absolute top-0 right-10 h-full w-10 sm:w-12 p-2 flex items-center justify-center"
            onClick={clearSearch}
          >
            <MdCancel className="text-gray-500" />
          </button>
        )}
      </div>

      {searchQuery && (
        <div className="relative w-full sm:w-[500px] bg-white shadow-lg rounded-lg p-2 max-h-72 overflow-y-auto text-sm z-0">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div key={item.videoId} className="border-b p-2 cursor-pointer hover:bg-gray-100 transition">
                <Link href={`/search?Id=${item._id}`} passHref>
                  <div>
                    <h3 className="text-base font-semibold">{item.title}</h3>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Searchbar;
