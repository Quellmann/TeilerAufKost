const NotFoundPage = () => {
  return (
    <div className="mt-10 flex flex-col p-2 text-center rounded-lg border border-light-border dark:border-dark-border items-center">
      <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
      <img src="/vincent.gif" alt="404" className="rounded-lg" />
      <p className="m-6">Die URL-Adresse scheint nicht zu existieren.</p>
    </div>
  );
};

export default NotFoundPage;
