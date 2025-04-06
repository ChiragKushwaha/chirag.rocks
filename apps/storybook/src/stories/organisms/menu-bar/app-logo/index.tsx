const AppLogo = ({ variant }: { variant: 'light' | 'dark' }) => {
  return variant == 'light' ? (
    <div className="hover:bg-[#E6E6E6] py-[2px] px-[11px] rounded-[4px] w-[37px] h-[24px] flex items-center justify-center">
      <img
        width={15}
        height={20}
        src={'./stories/assets/logos/Apple Logo Light.png'}
        alt="App Logo Light"
      />
    </div>
  ) : (
    <div className="hover:bg-[#FFFFFF33] rounded-[4px] w-[37px] h-[24px] flex items-center justify-center">
      <img
        width={20}
        height={28}
        src={'./stories/assets/logos/Apple Logo Dark.png'}
        alt="App Logo Dark"
      />
    </div>
  );
};

export default AppLogo;
