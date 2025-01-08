import { useState, useRef, useEffect } from "react";
import Button from "../ReusableComponents/Button";

const TShirtLogoEditor = () => {
  const [logo, setLogo] = useState(null);
  const [logoPosition, setLogoPosition] = useState({ top: 100, left: 100 });
  const [logoSize, setLogoSize] = useState(10);
  const logoRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [finalImage, setFinalImage] = useState(null);

  const tShirtImageUrl = "https://i.ibb.co.com/cv6bYdK/tshirt.jpg";

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

  // Handle Mouse Down for Dragging
  const handleMouseDown = (e) => {
    e.preventDefault(); // Prevent default behavior
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  // Handle Mouse Move for Dragging
  const handleMouseMove = (e) => {
    if (isDragging) {
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      const containerRect = containerRef.current.getBoundingClientRect();
      const logoRect = logoRef.current.getBoundingClientRect();
      let newTop = logoPosition.top + dy;
      let newLeft = logoPosition.left + dx;

      if (newTop < 0) newTop = 0;
      if (newLeft < 0) newLeft = 0;
      if (newTop + logoRect.height > containerRect.height)
        newTop = containerRect.height - logoRect.height;
      if (newLeft + logoRect.width > containerRect.width)
        newLeft = containerRect.width - logoRect.width;

      setLogoPosition({ top: newTop, left: newLeft });
      setStartPos({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle Mouse Up for Dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Resizing the Logo while maintaining aspect ratio
  const handleResize = (e) => {
    const aspectRatio =
      logoRef.current.naturalWidth / logoRef.current.naturalHeight;
    let newSize = logoSize;

    if (e.ctrlKey) {
      // Resize larger
      newSize = Math.min(newSize + 5, 200);
    } else if (e.shiftKey) {
      newSize = Math.max(newSize - 5, 10);
    }

    setLogoSize(newSize);

    const newWidth = (500 * newSize) / 100;
    const newHeight = newWidth / aspectRatio;

    // Update the logo size
    logoRef.current.width = newWidth;
    logoRef.current.height = newHeight;
  };

  // Saving the final image with T-shirt and logo
  const handleSaveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const tShirtImg = new Image();
    tShirtImg.crossOrigin = "anonymous";
    tShirtImg.src = tShirtImageUrl;

    tShirtImg.onload = () => {
      // Set canvas size to T-shirt size
      canvas.width = tShirtImg.width;
      canvas.height = tShirtImg.height;

      // Draw T-shirt image to canvas
      ctx.drawImage(tShirtImg, 0, 0);

      // Draw logo onto the T-shirt image
      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous";
      logoImg.src = logo;

      logoImg.onload = () => {
        ctx.drawImage(
          logoImg,
          logoPosition.left,
          logoPosition.top,
          logoRef.current.width,
          logoRef.current.height
        );

        // Create a data URL from the canvas
        const finalImageUrl = canvas.toDataURL("image/png");

        // Set the final image in output section
        setFinalImage(finalImageUrl);
      };

      // If the image loading fail
      logoImg.onerror = () => {
        alert("Failed to load logo image.");
      };
    };
  };

  // Use effect to handle dragging event listeners
  useEffect(() => {
    if (isDragging) {
      containerRef.current.addEventListener("mousemove", handleMouseMove);
      containerRef.current.addEventListener("mouseup", handleMouseUp);
    } else {
      containerRef.current.removeEventListener("mousemove", handleMouseMove);
      containerRef.current.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousemove", handleMouseMove);
        containerRef.current.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [isDragging]);

  return (
    <div className="flex justify-between px-4 py-2 border-2 border-red-300">
      {/* T-shirt Image + Logo */}
      <div
        className="relative inline-block w-600px h-600px overflow-hidden"
        ref={containerRef}
      >
        <img src={tShirtImageUrl} alt="T-shirt" className="w-full h-full" />
        {logo && (
          <img
            src={logo}
            alt="Logo"
            ref={logoRef}
            className="absolute"
            style={{
              top: logoPosition.top + "px",
              left: logoPosition.left + "px",
              width: logoSize + "%",
            }}
            onMouseDown={handleMouseDown}
            onClick={handleResize}
          />
        )}
      </div>

      {/* Upload and Controls */}
      <div className="w-1/3 flex flex-col justify-evenly items-center">
        <div className="mb-4">
          <h3 className="text-xl font-bold">Add Your Logo</h3>
          <input
            type="file"
            onChange={handleLogoUpload}
            accept="image/*"
            className="mt-2"
          />
        </div>
        <Button onClick={handleSaveImage} className="text-lg font-bold">
          Save Image
        </Button>
      </div>

      {/* Final Image Output */}
      <div className="w-1/3 grid place-items-center">
        {finalImage ? (
          <img
            src={finalImage}
            alt="Final T-shirt with logo"
            className="w-full"
          />
        ) : (
          <div className="">
            <h3 className="text-xl font-bold">Final Image</h3>
            <p className="text-red-400">
              No final image yet. Upload and save your T-Shirt with logo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TShirtLogoEditor;
