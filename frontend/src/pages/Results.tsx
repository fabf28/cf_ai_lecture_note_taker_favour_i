import { useLocation } from "react-router-dom";

export default function Results() {
    const location = useLocation();
    const data = location.state?.data;
    return (
        <div>
            <h1>Result Page</h1>
            <p>Welcome to my app!</p>
            {data}

        </div>
    );
}