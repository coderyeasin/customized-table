import { useState, useRef } from "react";

const TShirtLogoEditor = () => {
  const [logo, setLogo] = useState(null);
  const [logoPosition, setLogoPosition] = useState({ top: 100, left: 100 });
  const [logoSize, setLogoSize] = useState(100);
  const logoRef = useRef(null);

  // Handle Logo Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Dragging the Logo
  const handleDrag = (e) => {
    const offsetX = e.clientX - logoRef.current.offsetWidth / 2;
    const offsetY = e.clientY - logoRef.current.offsetHeight / 2;
    setLogoPosition({ top: offsetY, left: offsetX });
  };

  // Handle Resizing the Logo
  const handleResize = () => {
    if (logoRef.current) {
      const newSize = (logoRef.current.width / 500) * 100; // Resize in percentage
      setLogoSize(newSize);
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* T-shirt Image */}
      <img
        src="https://via.placeholder.com/500x500" // T-shirt placeholder image URL
        alt="T-shirt"
        style={{ width: "500px", height: "500px", position: "relative" }}
      />

      {/* Logo Image */}
      {logo && (
        <img
          src={logo}
          alt="Logo"
          ref={logoRef}
          style={{
            position: "absolute",
            top: logoPosition.top + "px",
            left: logoPosition.left + "px",
            width: logoSize + "%", // Scale logo based on size percentage
            cursor: "pointer",
          }}
          draggable
          onDrag={(e) => handleDrag(e)}
          onClick={handleResize} // Resizes when clicked
        />
      )}

      {/* Upload Logo Button */}
      <input type="file" onChange={handleLogoUpload} accept="image/*" />

      {/* Save Final Image (Optional, can be done using a canvas) */}
      <button onClick={() => console.log("Save image functionality")}>
        Save Image
      </button>
    </div>
  );
};

export default TShirtLogoEditor;
