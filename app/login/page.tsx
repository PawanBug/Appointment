import LoginForm from "./_components/loginForm";

export default function Login() {
  return (
    <section className="w-screen h-screen flex items-center ">
      <div className=" w-full mx-auto ">{<LoginForm />}</div>
    </section>
  );
}
