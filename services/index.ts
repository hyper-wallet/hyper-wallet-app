import Api from "./Api";
import Network from "./Network";
import Web3AuthService from "./Web3AuthService";

export const apiService = new Api("http://192.168.23.102:3000");

export const networkService = new Network();

export const socialAuthService = new Web3AuthService();
