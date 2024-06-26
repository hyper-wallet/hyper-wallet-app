import Api from "./Api";
import Network from "./Network";
import Web3AuthService from "./Web3AuthService";

// export const apiService = new Api("http://192.168.31.60:3000");
export const apiService = new Api("https://hyper-wallet-backend.vercel.app/");

export const networkService = new Network();

export const socialAuthService = new Web3AuthService();
