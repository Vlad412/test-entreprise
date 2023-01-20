import { useState, useEffect } from "react";
import fsp from "fs/promises";
import path from "path";
import playlistData from "../playlist.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";

async function loadFile(songPath) {
    const data = await fsp.readFile(path.resolve(songPath));
    return data;
}

export default function App(props) {
    const { audio } = props;

    const playList = playlistData.songs;

    const [data, setData] = useState([]);
    const [currentSong, setCurrentSong] = useState(0);

    useEffect(() => {
        async function fetchData() {
            const data = await loadFile(playList[currentSong].path);
            setData(data);
            play(data);
        }
        fetchData();
        // eslint-disable-next-line
    }, [currentSong]);

    const play = (data) => {
        audio.src = URL.createObjectURL(
            new Blob([data], { type: "audio/mp3" })
        );
        audio.onended = async () => {
            const nextSong =
                playList.length - 1 === currentSong ? 0 : currentSong + 1;
            setCurrentSong(nextSong);
        };
        audio.play();
    };

    return (
        <>
            <section className="flex App-header">
                <h1>Music player</h1>
                <p>Click on the music to play</p>
                <div className="flex controls">
                    <button className="button" onClick={() => play(data)}>
                        <FontAwesomeIcon icon={faPlay} />
                        Play
                    </button>
                    <button className="button" onClick={() => audio.pause()}>
                        <FontAwesomeIcon icon={faStop} />
                        Stop
                    </button>
                </div>
                <ul className="flex playlist">
                    {playList.map(({ name }, i) => (
                        <li
                            onClick={() => setCurrentSong(i)}
                            key={name}
                            className={`song${
                                playList[currentSong].name === name
                                    ? " activeSong"
                                    : ""
                            }`}
                        >
                            {name}
                        </li>
                    ))}
                </ul>
            </section>
            <footer className="flex">
                Currently playing : {playList[currentSong].name}
            </footer>
        </>
    );
}
