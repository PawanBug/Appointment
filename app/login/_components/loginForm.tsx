"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/toaster/toastProvider";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  async function handleSubmit() {
    setIsSubmitting(true);
    if (!email || !password) {
      return;
    }
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (!res?.ok) {
      showToast({
        message: "Log in Failed",
        type: "error",
      });
    } else {
      showToast({
        message: "Log in Successfull",
        type: "success",
      });
      router.push("/");
    }
    setIsSubmitting(false);
  }

  return (
    <Card className="w-full max-w-120 mx-auto">
      <CardHeader className="font-heading text-[32px] text-primary font-bold">
        Login
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <input
          className="bg-white px-4 py-4 border w-full focus:outline-none shadow-xs rounded-xl placeholder:text-gray-500"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        {isSubmitting && email.length === 0 && (
          <span className="text-red-500 text-[14px]">
            Please fill in your email.
          </span>
        )}
        <div className="w-full border rounded-xl flex flex-row shadow-xs focus:outline-border items-center pr-4">
          <input
            type={showPassword ? "text" : "password"}
            className="bg-white px-4 py-4 focus:outline-none w-full rounded-xl placeholder:text-gray-500"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          {showPassword ? (
            <Eye
              onClick={() => setShowPassword(false)}
              className="text-primary cursor-pointer"
            />
          ) : (
            <EyeClosed
              onClick={() => setShowPassword(true)}
              className=" text-primary cursor-pointer"
            />
          )}
        </div>
        {isSubmitting && password.length === 0 && (
          <span className="text-red-500 text-[14px]">
            Please enter your password.
          </span>
        )}
      </CardContent>
      <div className="flex flex-row w-full px-6 justify-between">
        <p className="text-[14px]">
          Dont have an account?
          <span className="font-bold">
            <Link href={"/signup"} className="text-primary">
              {" "}
              Sign Up
            </Link>
          </span>
        </p>
        <p className="font-primary text-[14px] underline cursor-pointer text-primary">
          Forgot Password?
        </p>
      </div>

      <div className="w-full flex items-center px-6 justify-center">
        <Button onClick={() => handleSubmit()} className="w-full bg-primary">
          {isSubmitting ? "Logging In" : "Log In"}
        </Button>
      </div>
    </Card>
  );
}
