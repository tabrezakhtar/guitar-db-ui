function SideMenu() {
  return (
    <aside className="bg-gray-500 text-white w-full md:w-1/4 lg:w-1/5 p-4 bg-[url(/guitar-bg.svg)] bg-contain bg-top bg-no-repeat">
      <div className="mt-4 justify-items-center">
        <div className="text-sm font-semibold mb-2">Select Shape</div>
        <div className="flex space-x-2">
          <button className="w-8 h-8 border flex items-center justify-center hover:bg-gray-200">
            <span className="w-6 h-6">All</span>
          </button>
          <button className="w-8 h-8 border flex items-center justify-center hover:bg-gray-200">
            <img src="/shapes/singlecut_outline.png" alt="Icon" className="w-6 h-6" />
          </button>
          <button className="w-8 h-8 border flex items-center justify-center hover:bg-gray-200">
            <img src="/shapes/stype_outline.png" alt="Icon" className="w-6 h-6" />
          </button>
          <button className="w-8 h-8 border flex items-center justify-center hover:bg-gray-200">
            <img src="/shapes/ttype_outline.png" alt="Icon" className="w-6 h-6" />
          </button>
          <button className="w-8 h-8 border flex items-center justify-center hover:bg-gray-200">
            <img src="/shapes/v_outline.png" alt="Icon" className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="mt-4 justify-items-center">
        <div className="text-sm font-semibold mb-2">Brand</div>

        <div className="flex space-x-2 w-full">
            <select title="brands" className="border rounded p-2 w-full">
              <option value="fender">Fender</option>
              <option value="gibson">Gibson</option>
              <option value="ibanez">Ibanez</option>
            </select>
        </div>
      </div>
    </aside>
  );
}

export default SideMenu;