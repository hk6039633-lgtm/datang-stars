import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 本地手机调试时，如需允许局域网 IP 访问 HMR，可临时取消下面注释并替换为当前 IP：
  // allowedDevOrigins: [process.env.LAN_DEV_ORIGIN || "192.168.x.x"],
};

export default nextConfig;
