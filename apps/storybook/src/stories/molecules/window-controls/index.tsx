const WindowControls = () => {
  const styles = {
    border: '0.5px solid #00000020'
  };
  return (
    <div className="max-w-min gap-x-8 flex justify-center">
      <button
        className="w-12 h-12 rounded-full bg-[#FF5F57]"
        style={styles}
      ></button>
      <button
        className="w-12 h-12 rounded-full bg-[#FEBC2E]"
        style={styles}
      ></button>
      <button
        className="w-12 h-12 rounded-full bg-[#28C840]"
        style={styles}
      ></button>
    </div>
  );
};

export default WindowControls;
