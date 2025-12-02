import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Heart,
  Search,
  ChevronLeft,
  LayoutGrid,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Image as ImageIcon,
  Clock,
  MapPin,
  Share,
  Info,
  Library,
  Layers,
  Video,
  User,
  Trash2,
  Lock,
  Copy,
  Folder,
  Map as MapIcon,
  ChevronRight,
  Plus,
  MoreHorizontal,
} from "lucide-react";

interface Photo {
  id: string;
  url: string;
  thumbnail: string;
  originalUrl: string;
  description?: string;
  camera?: string;
  creationTime?: number;
}

type SidebarItemType =
  | "library"
  | "collections"
  | "favorites"
  | "recents"
  | "map"
  | "videos"
  | "screenshots"
  | "people"
  | "deleted"
  | "shared"
  | "activity"
  | "duplicates"
  | "projects";

export const Photos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SidebarItemType>("library");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    fetchPhotos();
    const savedLikes = localStorage.getItem("likedPhotos");
    if (savedLikes) {
      setLikedPhotos(new Set(JSON.parse(savedLikes)));
    }

    // Get User Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    }
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;

      if (e.key === "Escape") {
        setSelectedPhoto(null);
      } else if (e.key === "ArrowLeft") {
        const currentIndex = photos.findIndex((p) => p.id === selectedPhoto.id);
        if (currentIndex > 0) {
          setSelectedPhoto(photos[currentIndex - 1]);
        }
      } else if (e.key === "ArrowRight") {
        const currentIndex = photos.findIndex((p) => p.id === selectedPhoto.id);
        if (currentIndex < photos.length - 1) {
          setSelectedPhoto(photos[currentIndex + 1]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto, photos]);

  const fetchPhotos = async () => {
    try {
      const res = await fetch("/api/photos");
      const data = await res.json();
      setPhotos(data.photos || []);
    } catch (error) {
      console.error("Failed to fetch photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (id: string) => {
    const newLikes = new Set(likedPhotos);
    if (newLikes.has(id)) {
      newLikes.delete(id);
    } else {
      newLikes.add(id);
    }
    setLikedPhotos(newLikes);
    localStorage.setItem("likedPhotos", JSON.stringify(Array.from(newLikes)));
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        "https://photos.app.goo.gl/8thR6dvU5AtsQUMb8"
      );
      alert("Album link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const filteredPhotos = photos.filter((photo) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      photo.id.toLowerCase().includes(query) ||
      (photo.description && photo.description.toLowerCase().includes(query)) ||
      (photo.camera && photo.camera.toLowerCase().includes(query))
    );
  });

  const renderContent = () => {
    if (activeTab === "library" || activeTab === "recents") {
      if (loading) {
        return (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
          </div>
        );
      }

      const displayPhotos =
        activeTab === "recents"
          ? [...filteredPhotos].reverse()
          : filteredPhotos;

      return (
        <div className="p-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {displayPhotos.map((photo) => (
            <div
              key={photo.id}
              className="aspect-square relative group cursor-pointer overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800"
              onClick={() => setSelectedPhoto(photo)}
            >
              <Image
                src={photo.thumbnail}
                alt={photo.description || "Photo"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              {likedPhotos.has(photo.id) && (
                <div className="absolute bottom-2 right-2 text-red-500 drop-shadow-md">
                  <Heart size={16} fill="currentColor" />
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === "favorites") {
      const favs = photos.filter((p) => likedPhotos.has(p.id));
      if (favs.length === 0)
        return <EmptyStateView title="No Favourites" icon={Heart} />;
      return (
        <div className="p-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favs.map((photo) => (
            <div
              key={photo.id}
              className="aspect-square relative group cursor-pointer overflow-hidden rounded-md"
              onClick={() => setSelectedPhoto(photo)}
            >
              <Image
                src={photo.thumbnail}
                alt="Favorite"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-2 right-2 text-red-500 drop-shadow-md">
                <Heart size={16} fill="currentColor" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === "map") {
      // Default to user location or a fallback (San Francisco)
      const center = userLocation
        ? `${userLocation.lat},${userLocation.lng}`
        : "37.7749,-122.4194";
      return (
        <div className="w-full h-full">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/view?key=${
              process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ""
            }&center=${center}&zoom=12&maptype=satellite`}
          ></iframe>
          {/* Overlay to simulate map controls if needed, or just let the iframe handle it */}
        </div>
      );
    }

    if (activeTab === "deleted") {
      return <LockedView />;
    }

    return <CollectionsView />;
  };

  return (
    <div className="flex w-full h-full bg-[#F5F5F7] dark:bg-[#1E1E1E] overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-60 bg-[#F2F2F7] dark:bg-[#262628] border-r border-[#D1D1D6] dark:border-black/50 flex flex-col py-4 overflow-y-auto shrink-0">
        <SidebarSection title="">
          <SidebarItem
            icon={Library}
            label="Library"
            active={activeTab === "library"}
            onClick={() => setActiveTab("library")}
          />
          <SidebarItem
            icon={Layers}
            label="Collections"
            active={activeTab === "collections"}
            onClick={() => setActiveTab("collections")}
          />
        </SidebarSection>

        <SidebarSection title="Pinned">
          <SidebarItem
            icon={Heart}
            label="Favourites"
            active={activeTab === "favorites"}
            onClick={() => setActiveTab("favorites")}
          />
          <SidebarItem
            icon={Clock}
            label="Recently Saved"
            active={activeTab === "recents"}
            onClick={() => setActiveTab("recents")}
          />
          <SidebarItem
            icon={MapIcon}
            label="Map"
            active={activeTab === "map"}
            onClick={() => setActiveTab("map")}
          />
          <SidebarItem
            icon={Video}
            label="Videos"
            active={activeTab === "videos"}
            onClick={() => setActiveTab("videos")}
          />
          <SidebarItem
            icon={ImageIcon}
            label="Screenshots"
            active={activeTab === "screenshots"}
            onClick={() => setActiveTab("screenshots")}
          />
          <SidebarItem
            icon={User}
            label="People & Pets"
            active={activeTab === "people"}
            onClick={() => setActiveTab("people")}
          />
          <SidebarItem
            icon={Trash2}
            label="Recently Deleted"
            active={activeTab === "deleted"}
            onClick={() => setActiveTab("deleted")}
            rightIcon={<Lock size={12} />}
          />
        </SidebarSection>

        <SidebarSection title="Albums">
          <SidebarItem
            icon={Folder}
            label="Shared Albums"
            active={activeTab === "shared"}
            onClick={() => setActiveTab("shared")}
            arrow
          />
          <SidebarItem
            icon={Info}
            label="Activity"
            active={activeTab === "activity"}
            onClick={() => setActiveTab("activity")}
          />
        </SidebarSection>

        <SidebarSection title="Utilities">
          <SidebarItem
            icon={Trash2}
            label="Recently Deleted"
            active={activeTab === "deleted"}
            onClick={() => setActiveTab("deleted")}
            rightIcon={<Lock size={12} />}
          />
          <SidebarItem
            icon={Copy}
            label="Duplicates"
            active={activeTab === "duplicates"}
            onClick={() => setActiveTab("duplicates")}
          />
          <SidebarItem
            icon={MapIcon}
            label="Map"
            active={activeTab === "map"}
            onClick={() => setActiveTab("map")}
          />
        </SidebarSection>

        <SidebarSection title="Projects">
          <SidebarItem
            icon={Folder}
            label="All Projects"
            active={activeTab === "projects"}
            onClick={() => setActiveTab("projects")}
          />
        </SidebarSection>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white dark:bg-[#1E1E1E] overflow-y-auto relative flex flex-col">
        {/* Toolbar */}
        <div className="h-12 bg-white dark:bg-[#1E1E1E] border-b border-[#D1D1D6] dark:border-black/50 flex items-center justify-between px-4 shrink-0">
          <div className="flex bg-gray-200 dark:bg-white/10 rounded-md p-0.5">
            <button
              onClick={() => setActiveTab("library")}
              className={`px-3 py-0.5 text-xs font-medium rounded-sm transition-all ${
                activeTab === "library"
                  ? "bg-white dark:bg-[#636366] shadow-sm"
                  : "text-gray-500 hover:text-black dark:hover:text-white"
              }`}
            >
              Years
            </button>
            <button className="px-3 py-0.5 text-xs font-medium text-gray-500 hover:text-black dark:hover:text-white rounded-sm transition-all">
              Months
            </button>
            <button
              onClick={() => setActiveTab("library")}
              className={`px-3 py-0.5 text-xs font-medium rounded-sm transition-all ${
                activeTab === "library"
                  ? "bg-white dark:bg-[#636366] shadow-sm"
                  : "text-gray-500 hover:text-black dark:hover:text-white"
              }`}
            >
              All Photos
            </button>
          </div>

          <div className="relative">
            <Search
              size={14}
              className="absolute left-2 top-1.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-40 bg-[#E3E3E5] dark:bg-[#3A3A3C] rounded-md pl-7 pr-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-black dark:text-white placeholder-gray-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-60 bg-black/95 flex flex-col animate-in fade-in duration-200">
          {/* Lightbox Toolbar */}
          <div className="h-14 flex items-center justify-between px-6 text-white/80 shrink-0">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => toggleLike(selectedPhoto.id)}
                className={`p-2 rounded-full transition-colors ${
                  likedPhotos.has(selectedPhoto.id)
                    ? "text-red-500"
                    : "hover:bg-white/10"
                }`}
              >
                <Heart
                  size={20}
                  fill={
                    likedPhotos.has(selectedPhoto.id) ? "currentColor" : "none"
                  }
                />
              </button>
              <button
                onClick={handleShare}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title="Copy Link"
              >
                <Share size={20} />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Info size={20} />
              </button>
            </div>
          </div>

          {/* Main Image */}
          <div className="flex-1 relative flex items-center justify-center p-4">
            <div className="relative w-full h-full max-w-5xl max-h-[85vh]">
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.description || "Full size"}
                fill
                className="object-contain"
                priority
                quality={90}
              />
            </div>
          </div>

          {/* Bottom Strip (Thumbnails) */}
          <div className="h-20 bg-black/50 backdrop-blur-md flex items-center justify-center gap-2 overflow-x-auto px-4 shrink-0">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className={`w-12 h-12 relative shrink-0 cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                  selectedPhoto.id === photo.id
                    ? "border-white opacity-100"
                    : "border-transparent opacity-50 hover:opacity-80"
                }`}
                onClick={() => setSelectedPhoto(photo)}
              >
                <Image
                  src={photo.thumbnail}
                  alt="Thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Subcomponents ---

const SidebarSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-4">
    {title && (
      <div className="px-4 mb-1 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {title}
      </div>
    )}
    <div className="flex flex-col gap-0.5">{children}</div>
  </div>
);

const SidebarItem = ({
  icon: Icon,
  label,
  active,
  onClick,
  rightIcon,
  arrow,
}: {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
  rightIcon?: React.ReactNode;
  arrow?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-1.5 text-[13px] transition-colors ${
      active
        ? "bg-[#007AFF] text-white"
        : "text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
    }`}
  >
    <Icon size={16} className={active ? "text-white" : "text-[#007AFF]"} />
    <span className="font-medium flex-1 text-left truncate">{label}</span>
    {rightIcon && <span className="opacity-70">{rightIcon}</span>}
    {arrow && <ChevronRight size={12} className="opacity-70" />}
  </button>
);

const CollectionsView = () => (
  <div className="h-full overflow-y-auto p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-black dark:text-white">
        Collections
      </h2>
      <div className="flex gap-2">
        <button className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md">
          <Plus size={18} />
        </button>
        <button className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>

    {/* Memories */}
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-gray-500 mb-3">Memories</h3>
      <div className="h-40 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-gray-400">
        <div className="text-center">
          <Clock size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No Memories Available</p>
          <p className="text-xs opacity-70">
            Memories will appear here when available.
          </p>
        </div>
      </div>
    </div>

    {/* Pinned */}
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-gray-500 mb-3">Pinned</h3>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {["Favourites", "Recently Saved", "Map", "Videos", "Screenshots"].map(
          (item) => (
            <div
              key={item}
              className="w-40 h-40 shrink-0 bg-gray-200 dark:bg-white/10 rounded-xl relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 flex items-end p-3 bg-linear-to-t from-black/60 to-transparent">
                <span className="text-white font-medium text-sm">{item}</span>
              </div>
            </div>
          )
        )}
      </div>
    </div>

    {/* Albums */}
    <div>
      <h3 className="text-sm font-semibold text-gray-500 mb-3">Albums</h3>
      <div className="h-32 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-gray-400">
        <div className="text-center">
          <Folder size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No Albums Available</p>
        </div>
      </div>
    </div>
  </div>
);

const EmptyStateView = ({
  title,
  icon: Icon,
}: {
  title: string;
  icon?: any;
}) => (
  <div className="h-full flex flex-col items-center justify-center text-gray-400">
    <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
      {Icon ? (
        <Icon size={40} className="opacity-50" />
      ) : (
        <ImageIcon size={40} className="opacity-50" />
      )}
    </div>
    <h3 className="text-lg font-medium text-black dark:text-white capitalize">
      {title}
    </h3>
    <p className="text-sm opacity-70 mt-1">No items found in {title}</p>
  </div>
);

const LockedView = ({ title = "Locked" }: { title?: string }) => (
  <div className="h-full flex flex-col items-center justify-center text-gray-400">
    <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
      <Lock size={40} className="opacity-50" />
    </div>
    <h3 className="text-lg font-medium text-black dark:text-white">
      {title} is Locked
    </h3>
    <p className="text-sm opacity-70 mt-1">Authenticate to view these items.</p>
  </div>
);
