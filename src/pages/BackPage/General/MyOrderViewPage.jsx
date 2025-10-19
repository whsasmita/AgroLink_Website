import React from "react";
import { useState } from "react";
import MyOrderListPage from "../../../pages/BackPage/General/MyOrderListPage";

const API = import.meta.env.VITE_SERVER_DOMAIN;

function PriceIDFormat(price) {
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

  return formatted;
}

const MyOrderViewPage = () => {
  const [status, setStatus] = useState("dikemas");

  // Tab Button Komponen
  const TabButton = ({ currentStatus, targetStatus, children }) => (
    <button
      onClick={() => setStatus(targetStatus)}
      className={`w-full py-2.5 sm:py-3 px-1 text-xs sm:text-sm font-medium transition-colors duration-200 
        ${
          currentStatus === targetStatus
            ? "border-b-2 border-green-600 text-green-600"
            : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
        }`}
    >
      {children}
    </button>
  );

  return (
    <>
      <div className="min-h-screen p-2 bg-gray-50 sm:p-6 lg:p-8">
        <div className="w-full mx-auto max-w-8xl">
          <div className="w-full bg-white shadow-lg rounded-xl">
            <div className="p-4 sm:p-6">
              <h1 className="pb-4 text-xl font-bold text-gray-800">
                Pesanan Saya
              </h1>

              <div className="grid grid-cols-3 border-b border-gray-200">
                <TabButton currentStatus={status} targetStatus="dikemas">
                  Dikemas
                </TabButton>
                <TabButton currentStatus={status} targetStatus="dikirim">
                  Dikirim
                </TabButton>
                <TabButton currentStatus={status} targetStatus="selesai">
                  Selesai
                </TabButton>
              </div>
            </div>

            <div className="p-2 space-y-3 sm:p-4">
              <MyOrderListPage status={status} />{" "}
              <MyOrderListPage status={status} />{" "}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyOrderViewPage;
