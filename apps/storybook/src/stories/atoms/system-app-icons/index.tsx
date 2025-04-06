const listOfIcons = [
  'App Store',
  'Apple Developer',
  'Apple TV',
  'Automator',
  'Books',
  'Calculator',
  'Calendar',
  'Contacts',
  'Dictionary',
  'Document Icon',
  'FaceTime',
  'Final Cut Pro',
  'Find My',
  'Finder',
  'Folder Icon',
  'Freeform',
  'Garageband',
  'Home',
  'Keynote',
  'Launch Pad',
  'Mail',
  'Maps',
  'Messages',
  'Movie',
  'Music',
  'News',
  'Notes',
  'Numbers',
  'Pages',
  'Photo Booth',
  'Photos',
  'Podcasts',
  'Preview',
  'Quicktime Player',
  'Reminders',
  'Safari',
  'Shortcuts',
  'Siri',
  'Stocks',
  'Swift Playgrounds',
  'System Preferences',
  'Terminal',
  'TextEdit',
  'Trash Empty',
  'Trash Full',
  'Voice Memos',
  'Xcode',
  'Your App Icon'
];
const SystemAppIcons = () => {
  return (
    <div className="grid grid-cols-8 gap-8">
      {listOfIcons.map((icon) => (
        <img
          key={icon}
          width={50}
          height={50}
          src={`/assets/system-icons/${icon}.png`}
          alt={icon}
        />
      ))}
    </div>
  );
};

export default SystemAppIcons;
