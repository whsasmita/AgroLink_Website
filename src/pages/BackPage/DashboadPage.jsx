

const DashboardPage = () => {
  return (
    <div className="p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row bg-white rounded-lg shadow-sm p-4 justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-main mb-2">
            Dashboard
          </h1>
          <p className="text-main_text text-sm sm:text-base">
            Lihat rangkuman akun Anda
          </p>
        </div>
      </div>
      </div>
  );
};

export default DashboardPage;