import { useState, useEffect } from "react";

type WindowProps = {
    width: number | undefined;
    height: number | undefined;
};
export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState<WindowProps>({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
};
