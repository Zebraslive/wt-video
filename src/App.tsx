import { useRef, useState, useEffect } from "react";
import videojs, { VideoJsPlayer } from "video.js";
import { VideoJS } from "./components/VideoJS";
import WebTorrent from "webtorrent";

function App() {
  const magnetUrl = new URLSearchParams(window.location.search).get('magnet');
  const [torrentId, setTorrentId] = useState(magnetUrl ? `${magnetUrl}` : "");
  const playerRef = useRef<null | VideoJsPlayer>(null);

  const videoJsOptions = {
    autoplay: true,
    // controls: true,
    responsive: true,
    fluid: true,
  };

  const handlePlayerReady = (player: VideoJsPlayer) => {
    playerRef.current = player;

    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  useEffect(() => {
    if (torrentId) {
      const client = new WebTorrent();

      client.add(torrentId, (torrent) => {
        const file = torrent.files.find((file) => {
          return file.name.endsWith(".mp4");
        });

        file?.renderTo("video", {}, () => {});
        torrent.on("done", () => {});
      });
    }
  }, [torrentId]);

  return (
    <>
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
    </>
  );
}

export default App;
