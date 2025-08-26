import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma.js";

const ACCESS_EXP = process.env.JWT_ACCESS_EXPIRES || "15m";
const REFRESH_DAYS = parseInt(process.env.JWT_REFRESH_EXPIRES_DAYS || "7", 10);

function signAccess(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_EXP });
}
function signRefresh(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: `${REFRESH_DAYS}d` });
}

export async function register({ email, name, password }) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw { status: 409, message: "E-mail já cadastrado" };
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, name, passwordHash } });
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

export async function login({ email, password, ip, userAgent }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 401, message: "Credenciais inválidas" };
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw { status: 401, message: "Credenciais inválidas" };

  const accessToken = signAccess({ sub: user.id, role: user.role });
  const refreshToken = signRefresh({ sub: user.id });

  const exp = new Date();
  exp.setDate(exp.getDate() + REFRESH_DAYS);

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt: exp, ip, userAgent }
  });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, name: user.name, role: user.role }
  };
}

export async function refresh({ token, ip, userAgent }) {
  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.revokedAt || stored.expiresAt < new Date())
      throw new Error("refresh inválido");

    await prisma.refreshToken.update({
      where: { token },
      data: { revokedAt: new Date() }
    });

    const accessToken = signAccess({ sub: payload.sub });
    const refreshToken = signRefresh({ sub: payload.sub });

    const exp = new Date();
    exp.setDate(exp.getDate() + REFRESH_DAYS);

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: payload.sub, expiresAt: exp, ip, userAgent }
    });

    return { accessToken, refreshToken };
  } catch {
    throw { status: 401, message: "refresh inválido" };
  }
}

export async function logout({ token }) {
  await prisma.refreshToken.update({
    where: { token },
    data: { revokedAt: new Date() }
  }).catch(() => {});
  return { ok: true };
}
