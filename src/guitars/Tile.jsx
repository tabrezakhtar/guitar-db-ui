import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { hasAdminAccess } from "../utils/roleUtils";
import SkeletonImage from "../components/SkeletonImage";
import AvatarDisplayOnly from "../profile/AvatarDisplayOnly";

function Tile({ item, likedEquipment, onLikeClick, onAvatarClick }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const getEquipmentIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "guitar":
        return "https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759857213/vintage-semi1_r7n1vj.png";
      case "amp":
        return "https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759857212/marshall1_e6ddzm.png";
      case "pedal":
        return "https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759857212/boss-ds1_qcqsiz.png";
      case "bass":
        return "https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759857214/vintage-bass1_rzpl8q.png";
      case "acoustic":
        return "https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759857213/acoustic1_o9agae.png";
      case "accessory":
        return "https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759857214/mic_e4e0ec.png";
      default:
        return "https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759857213/vintage-semi1_r7n1vj.png";
    }
  };

  const imageUrl = item.images && item.images.length > 0 ? item.images[0] : null;

  return (
    <div
      key={item._id}
      className="aspect-[4/5] rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 relative group bg-gray-300"
      onClick={() => navigate("/view/" + item._id)}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`Thumbnail: ${item.brand} ${item.name}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full">
          <SkeletonImage />
        </div>
      )}
      <div
        className="absolute top-2 left-2 px-2 py-1 rounded-md bg-[var(--color-overlay-dark)] shadow-sm flex items-center"
        onClick={(e) => {
          onAvatarClick(e, item.user?._id);
        }}
      >
        <AvatarDisplayOnly
          imageUrl={item.user?.avatarUrl}
          username={item.user?.username}
          size="xsmall"
        />
        <Link
          to={item.user?._id ? `/profile/${item.user._id}` : "#"}
          onClick={(e) => e.stopPropagation()}
          className="pl-2 text-xs text-white drop-shadow-md hover:underline flex items-center gap-1"
        >
          <span className="">
            {item.user ? item.user?.username.slice(0, 12) : ""}
          </span>
          {hasAdminAccess(item.user) && (
            <img
              src="/verified.svg"
              alt="Verified"
              className="w-4 h-4"
              loading="lazy"
              decoding="async"
            />
          )}
        </Link>
      </div>
      <div className="absolute top-2 right-2 bg-[var(--color-overlay-dark)] rounded-full p-1 shadow-md flex items-center justify-center">
        <img
          src={getEquipmentIcon(item.type)}
          alt={item.type}
          className="w-8 h-8"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="absolute inset-0 flex flex-col justify-center items-center p-3 pointer-events-none">
        <div className="group-hover:[transform:rotateY(180deg)] transition-transform duration-500 [transform-style:preserve-3d] w-full">
          <div className="[backface-visibility:hidden] px-3 py-2 rounded bg-[var(--color-overlay-dark)] w-full">
            <h4 className="text-[8px] font-semibold text-center text-white drop-shadow-md uppercase">
              {item.brand}
            </h4>
            <h2 className="text-lg font-semibold text-center text-white drop-shadow-md">
              {item.name}
            </h2>
          </div>
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-center items-center w-full">
            <div className="rounded bg-[var(--color-overlay-dark)] px-3 py-2 w-full">
              <p className="text-sm text-white text-center drop-shadow-md">
                {item.description.length <= 150
                  ? item.description
                  : `${item.description.slice(0, 150)} ...`}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 left-2 pointer-events-none">
        <span className="bg-transparent text-white text-xs px-2 py-1 rounded inline-flex items-center drop-shadow-md pointer-events-auto">
          <span className="mr-1">💬</span>
          {item.commentCount}
        </span>
      </div>
      <div className="absolute bottom-2 right-2 pointer-events-none">
        <button
          className={`${likedEquipment[item._id] ? "bg-purple-600 text-white" : "bg-purple-400 text-purple-900"} text-xs px-2 py-1 rounded inline-flex items-center transition-colors duration-200 drop-shadow-md pointer-events-auto hover:cursor-pointer`}
          onClick={(e) => onLikeClick(e, item)}
          disabled={item.user?._id === user?._id}
          title={!user ? "Create an account to like!" : ""}
        >
          <span className="mr-1">👍</span>
          {item.likesCount || 0}
        </button>
      </div>
    </div>
  );
}

export default Tile;
