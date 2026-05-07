import {useState, useEffect} from "react";
import { getPanchang } from "../api/dashboardsApi";

const DailyPanchang = () => {
    const [daiulyPanchangData, setDailyPanchangData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPanchang();
                setDailyPanchangData(data);
            } catch (error) {
                console.error("Error fetching daily panchang data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // if (loading) return <Spinner />;
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Daily Panchang</h1>
      <p>Content for Daily Panchang will go here.</p>
      <div className="mt-4">
        <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(daiulyPanchangData, null, 2)}</pre>
      </div>

    </div>
  );
};

export default DailyPanchang;
