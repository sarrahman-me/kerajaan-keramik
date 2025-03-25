"use client";
import Button from "@/components/button";
import Textfield from "@/components/textfield";
import beach from "@/public/images/login-image.png";
import logo from "@/public/images/logo.png";
import Image from "next/image";
import { Loading, Notify } from "notiflix";
import { FormEvent, useState } from "react";

export default function LoginPage() {

  const [payload, setPayload] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    Loading.standard();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        Notify.failure(data.error || "Login gagal");
        return;
      }

      Notify.success("Login berhasil!");
      window.location.href = "/dashboard";
    } catch (error) {
      Notify.failure("Terjadi kesalahan:" + error);
    }

    Loading.remove()
  };

  return (
    <div className="bg-white min-h-screen grid grid-cols-1 xl:grid-cols-2">
      {/* form */}
      <div className="flex flex-col justify-center bg-white p-5">
        {/* logo */}
        <div className="fixed top-5">
          <div className="flex items-center space-x-2">
            <Image
              width={130}
              height={100}
              src={logo}
              alt="logo"
            />
          </div>
        </div>

        <div className="flex justify-center xl:justify-end items-center">
          <form
            onSubmit={handleLogin}
            className="bg-white sm:p-5 py-7 w-full max-w-xl space-y-5"
          >
            <h2 className="text-secondary-medium font-semibold text-2xl">
              Login
            </h2>

            <Textfield
              label="username"
              onChange={(e) => setPayload({ ...payload, username: e })}
              placeholder="username"
              type="username"
            />
            <Textfield
              label="Password"
              onChange={(e) => setPayload({ ...payload, password: e })}
              placeholder="Kata Sandi"
              type="password"
            />
            <Button
              fullWidth
              disabled={!payload.username || !payload.password}
              type="submit"
            >
              Login
            </Button>
          </form>
        </div>

      </div>

      {/* image */}
      <div className="h-screen hidden xl:block">
        <Image src={beach} className="h-screen" alt="Beach" />
      </div>
    </div>
  );
}
