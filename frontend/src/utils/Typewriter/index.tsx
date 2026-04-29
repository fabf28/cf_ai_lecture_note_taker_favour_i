import { useState, useEffect } from "react";
import "./Typewriter.scss";

export default function Typewriter(text: string, speed = 50) {
    const [displayed, setDisplayed] = useState("");

    useEffect(() => {
        let i = 0;

        const interval = setInterval(() => {
            setDisplayed(text.slice(0, i + 1));
            i++;

            if (i === text.length) clearInterval(interval);
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    return (
        <span className="typewriter card-title h3">
            {displayed}
            <span className="typing-cursor">|</span>
        </span>
    );
}