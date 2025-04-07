const Notification = ({
  count = 1,
  className = ''
}: {
  count?: number;
  className?: string;
}) => {
  return (
    <div
      className={`w-[18px] h-[18px] rounded-full bg-[#FF3B30] text-white flex items-center justify-center text-[10px] font-[510] leading-[15px] font-['SF-Pro'] not-italic ${className}`}
    >
      {count}
    </div>
  );
};

export default Notification;
