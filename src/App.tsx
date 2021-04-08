import * as React from "react";
import { HexColorPicker } from "react-colorful";
import copy from "copy-to-clipboard";
import debounce from "debounce";

import "./styles.css";

const debouncedSetUrl = debounce((url: string) =>
  window.history.replaceState({}, "", url)
);

const DEFAULT_COLOR = "#cccccc";

export default function App() {
  const [bgImage, setBgImage] = React.useState("");
  const [bgColor, setBgColor] = React.useState(DEFAULT_COLOR);

  const setImage = React.useCallback((image: string) => {
    const url = new URL(window.location.toString());
    url.searchParams.set("image", encodeURIComponent(image));
    debouncedSetUrl(url.toString());
    setBgImage(image);
  }, []);
  const setColor = React.useCallback((color: string) => {
    const url = new URL(window.location.toString());
    url.searchParams.set("color", encodeURIComponent(color));
    debouncedSetUrl(url.toString());
    setBgColor(color);
  }, []);
  const copyURL = () => {
    const url = new URL(window.location.toString());
    url.searchParams.set("image", encodeURIComponent(bgImage));
    url.searchParams.set("color", encodeURIComponent(bgColor));
    copy(url.toString());
  };

  React.useEffect(() => {
    // pull image and color from URL if applicable
    const currentUrl = new URL(window.location.toString());
    if (currentUrl.searchParams.has("image")) {
      setBgImage(
        decodeURIComponent(currentUrl.searchParams.get("image") as string)
      );
    }
    if (currentUrl.searchParams.has("color")) {
      setBgColor(
        decodeURIComponent(currentUrl.searchParams.get("color") as string)
      );
    } else {
      const url = new URL(window.location.toString());
      url.searchParams.set("color", encodeURIComponent(DEFAULT_COLOR));
      window.history.replaceState({}, "", url.toString());
    }
  }, [setColor]);

  return (
    <div className="App" style={{ backgroundColor: bgColor }}>
      <div className="main">
        <div className="controls">
          <h1>Chuck's transparent image background color picker</h1>
          <label htmlFor="url-input">background image: </label>
          <input
            id="url-input"
            type="text"
            value={bgImage}
            placeholder="url to image file"
            onChange={(e) => {
              setImage(e.target.value);
            }}
          />

          <label htmlFor="color-input">background color: </label>
          <HexColorPicker color={bgColor} onChange={setColor} />
          <input
            id="color-input"
            type="text"
            value={bgColor}
            onChange={(e) => {
              setColor(e.target.value);
            }}
          />
          <button className="btn-primary" type="button" onClick={copyURL}>
            copy link
          </button>
        </div>
        <div className="image-container">
          <img
            src={bgImage}
            style={{ maxWidth: "80vw", maxHeight: "80vh" }}
            alt="enter a URL in the box to the left"
          />
        </div>
      </div>
    </div>
  );
}
