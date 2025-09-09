import Logo from "../../assets/images/Logo.png";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
	const navigate = useNavigate();

	const handleGoBack = () => {
		navigate(-1);
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
			<img src={Logo} alt="Agrolink Logo" className="w-24 h-24 mb-6 drop-shadow-lg" />
			<h1 className="text-7xl font-extrabold text-main mb-2">404</h1>
			<p className="text-xl text-gray-700 font-semibold mb-4">Halaman tidak ada</p>
			<div className="bg-main/10 rounded-xl px-6 py-4 mt-2 shadow text-main font-medium">
				Maaf, halaman yang kamu cari tidak ditemukan.<br />
				Silakan <button onClick={handleGoBack} className="text-green-600 underline hover:text-green-700 cursor-pointer">kembali</button> ke halaman sebelumnya.
			</div>
		</div>
	);
};

export default ErrorPage;
