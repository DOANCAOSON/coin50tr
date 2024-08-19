import { useEffect, useState } from "react";
import { ethers } from "ethers";
import TradaoTokenABI from "./TradaoTokenABI.json";

const CONTRACT_ADDRESS = "0x1234567890abcdef1234567890abcdef12345678"; // Địa chỉ contract thực tế từ Remix

function App() {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function fetchBalance() {
      if (typeof window.ethereum !== "undefined") {
        try {
          // Yêu cầu người dùng kết nối MetaMask
          await window.ethereum.request({ method: "eth_requestAccounts" });

          // Sử dụng BrowserProvider thay vì Web3Provider
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, TradaoTokenABI, signer);

          // Lấy địa chỉ ví người dùng
          const address = await signer.getAddress();
          console.log("User Address:", address); // Gỡ lỗi địa chỉ ví người dùng

          // Gọi hàm balanceOf từ contract
          const balanceRaw = await contract.balanceOf(address);
          console.log("Balance (raw):", balanceRaw); // Gỡ lỗi dữ liệu trả về

          // Định dạng số dư từ raw thành Ether
          const formattedBalance = ethers.formatEther(balanceRaw);
          setBalance(formattedBalance);
        } catch (err) {
          console.error("Error in fetching balance:", err); // Xử lý lỗi và ghi ra console
        }
      }
    }

    fetchBalance();
  }, []);

  return (
    <div>
      <h1>Your Tradao Balance: {balance} TDO</h1>
    </div>
  );
}

export default App;
