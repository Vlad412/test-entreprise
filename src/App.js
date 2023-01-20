import "./App.css";
import Player from "./Player";

export default function App() {
    const audio = new Audio();
    audio.loop = false;

    return (
        <div className="flex App">
            <Player audio={audio} />
        </div>
    );
}
