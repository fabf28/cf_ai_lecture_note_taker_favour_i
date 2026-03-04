import type { ReactNode } from "react";
import Navbar from "./NavBar";


type Props = {
    children: ReactNode;
};

export default function Layout({ children }: Props) {
    return (
        <>
            <Navbar />

            <main className="container grid-lg">
                {children}
            </main>
        </>
    );
}