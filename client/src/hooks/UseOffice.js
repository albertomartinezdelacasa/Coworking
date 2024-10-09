// useOffice.js
import { useState, useEffect } from "react";

const { VITE_API_URL } = import.meta.env;

const useOffice = (officeId) => {
    const [office, setOffice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffice = async () => {
            try {
                const response = await fetch(
                    `${VITE_API_URL}/api/offices/${officeId}`
                );
                const data = await response.json();
                setOffice(data.office);
            } catch (error) {
                console.error("Error fetching office:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOffice();
    }, [officeId]);

    return { office, loading };
};

export default useOffice;
