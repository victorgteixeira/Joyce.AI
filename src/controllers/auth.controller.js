import { login, register, refresh, logout } from "../services/auth.service.js";

export async function registerController(req, res, next) {
  try {
    const { email, name, password } = req.body;
    if (!email || !password) throw { status: 400, message: "email e password são obrigatórios" };
    const user = await register({ email, name, password });
    res.status(201).json(user);
  } catch (e) { next(e); }
}

export async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw { status: 400, message: "email e password são obrigatórios" };
    const ip = req.ip;
    const userAgent = req.headers["user-agent"];
    const data = await login({ email, password, ip, userAgent });
    res.json(data);
  } catch (e) { next(e); }
}

export async function refreshController(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw { status: 400, message: "refreshToken é obrigatório" };
    const ip = req.ip;
    const userAgent = req.headers["user-agent"];
    const data = await refresh({ token: refreshToken, ip, userAgent });
    res.json(data);
  } catch (e) { next(e); }
}

export async function logoutController(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw { status: 400, message: "refreshToken é obrigatório" };
    const data = await logout({ token: refreshToken });
    res.json(data);
  } catch (e) { next(e); }
}
