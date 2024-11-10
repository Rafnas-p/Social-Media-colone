import { IoMdSearch } from "react-icons/io";
const Searchbar: React.FC = () => {
    return (
      <div className="flex flex-col items-start w-full px-4 sm:px-0">
        <div className="relative mb-6 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search..."
            className="p-4 rounded-full border border-gray-300 w-full sm:w-[500px] h-8 focus:outline-none focus:ring-2 focus:ring-blue-100" // Full width on mobile, fixed width on larger screens
          />
        
          <div className="absolute top-0 right-0 h-full w-12 sm:w-20 bg-gray-100 p-2 rounded-r-full border border-gray-300 flex items-center justify-center">
            <span><IoMdSearch/></span> 
          </div>
        </div>
      </div>
    );
  };
  
  export default Searchbar;
  