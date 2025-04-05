import { useGuitarStore } from "./store/useGuitarStore";

function SideMenu() {
  const { settings, loading } = useGuitarStore();

  return (
    <aside className="bg-gray-500 text-white w-full md:w-1/4 lg:w-1/5 p-4 bg-[url(/guitar-bg.svg)] bg-contain bg-top bg-no-repeat">
      <div className="mt-4">
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

      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="mt-4">
            <div className="text-sm font-semibold mb-2">Brand</div>
            <div className="flex space-x-2 w-full">
              <select title="brands" className="border rounded p-2 w-full bg-white text-gray-800">
                <option value="" className="text-gray-500">All Brands</option>
                {settings.brand?.map(brand => (
                  <option key={brand} value={brand} className="text-gray-800">{brand}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold mb-2">Colour</div>
            <div className="flex space-x-2 w-full">
              <select title="colours" className="border rounded p-2 w-full bg-white text-gray-800">
                <option value="" className="text-gray-500">All Colours</option>
                {settings.colours?.map(colour => (
                  <option key={colour} value={colour} className="text-gray-800">{colour}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold mb-2">Pickups</div>
            <div className="flex space-x-2 w-full">
              <select title="pickups" className="border rounded p-2 w-full bg-white text-gray-800">
                <option value="" className="text-gray-500">All Pickups</option>
                {settings.pickups?.map(pickup => (
                  <option key={pickup} value={pickup} className="text-gray-800">{pickup}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold mb-2">Tremolo</div>
            <div className="flex space-x-2 w-full">
              <select title="tremolo" className="border rounded p-2 w-full bg-white text-gray-800">
                <option value="" className="text-gray-500">All Tremolos</option>
                {settings.tremolo?.map(trem => (
                  <option key={trem} value={trem} className="text-gray-800">{trem}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold mb-2">Fretboard</div>
            <div className="flex space-x-2 w-full">
              <select title="fretboard" className="border rounded p-2 w-full bg-white text-gray-800">
                <option value="" className="text-gray-500">All Fretboards</option>
                {settings.fretboard?.map(material => (
                  <option key={material} value={material} className="text-gray-800">{material}</option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}

export default SideMenu;