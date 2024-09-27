import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="bg-white p-8 rounded-lg border text-center">
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <img src="/vincent.gif" alt="404" className="rounded-lg" />
        <p className="m-6">
          Die URL-Adresse scheint nicht zu existieren
        </p>
        <Link
          to="/"
          className="bg-slate-200 py-2 px-4 rounded hover:bg-slate-300 transition"
        >
          Zurück
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;