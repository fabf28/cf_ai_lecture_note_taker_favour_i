import { useLocation } from "react-router-dom";

export default function Loading() {
    const location = useLocation();
    const id = location.state?.id;
    console.log(id);

    return (
        <div>
            <h1>Loading Page</h1>
            <p>Welcome to my app!</p>
        </div>
    );
}