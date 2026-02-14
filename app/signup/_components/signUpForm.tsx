"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { userInput, userSchema } from "@/lib/validators/user-validation";
import { createUser } from "@/app/actions/actions";
import { useToast } from "@/components/toaster/toastProvider";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  //const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<userInput>({ resolver: zodResolver(userSchema) });

  const onSubmit = async (data: userInput) => {
    console.log(data);
    const res = await createUser(data);
    console.log(res);
    if (res.success) {
      showToast({
        message: res.message,
        type: "success",
      });
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      router.push("/");
    } else {
      showToast({
        message: res.message,
        type: "error",
      });
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full max-w-120 mx-auto">
        <CardHeader className="font-heading text-[32px] text-primary font-bold">
          Sign Up
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <input
            className="bg-white px-4 py-4 border w-full focus:outline-none shadow-xs rounded-xl placeholder:text-gray-500"
            placeholder="Name"
            {...register("name")}
          ></input>
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

          <input
            className="bg-white px-4 py-4 border w-full focus:outline-none shadow-xs rounded-xl placeholder:text-gray-500"
            placeholder="Username"
            {...register("username")}
          ></input>
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}

          <input
            className="bg-white px-4 py-4 border w-full focus:outline-none shadow-xs rounded-xl placeholder:text-gray-500"
            placeholder="Email"
            {...register("email")}
          ></input>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
          <input
            className="bg-white px-4 py-4 border w-full focus:outline-none shadow-xs rounded-xl placeholder:text-gray-500"
            placeholder="Country"
            {...register("country")}
          ></input>
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country.message}</p>
          )}
          <input
            className="bg-white px-4 py-4 border w-full focus:outline-none shadow-xs rounded-xl placeholder:text-gray-500"
            placeholder="PhoneNumber"
            {...register("phoneNumber")}
            type="number"
          ></input>
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
          )}
          {/* <textarea
            className="bg-white px-4 py-4 border w-full focus:outline-none shadow-xs rounded-xl placeholder:text-gray-500"
            placeholder="Bio"
          ></textarea> */}

          <div className="w-full border rounded-xl flex flex-row shadow-xs focus:outline-border items-center pr-4">
            <input
              type={showPassword ? "text" : "password"}
              className="bg-white px-4 py-4 focus:outline-none w-full rounded-xl placeholder:text-gray-500"
              placeholder="Password"
              {...register("password")}
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
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
          <div className="w-full border rounded-xl flex flex-row shadow-xs focus:outline-border items-center pr-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="bg-white px-4 py-4 focus:outline-none w-full rounded-xl placeholder:text-gray-500"
              placeholder="Confirm Password"
              {...register("confirmPassword")}
            ></input>
            {showConfirmPassword ? (
              <Eye
                onClick={() => setShowConfirmPassword(false)}
                className="text-primary cursor-pointer"
              />
            ) : (
              <EyeClosed
                onClick={() => setShowConfirmPassword(true)}
                className=" text-primary cursor-pointer"
              />
            )}
          </div>
        </CardContent>
        <div className="w-full flex items-center px-6 justify-center">
          <Button type="submit" className="w-full bg-primary cursor-pointer">
            {isSubmitting ? "Signing In..." : "Sign Up"}
          </Button>
        </div>
        <div className="flex flex-row w-full px-6 justify-center   items-center">
          <p className="text-[14px] text-center">
            Already have an account?
            <span className="font-bold">
              <Link href={"/login"} className="text-primary">
                {" "}
                Log In
              </Link>
            </span>
          </p>
        </div>
      </Card>
    </form>
  );
}
