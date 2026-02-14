import SignUpForm from "./_components/signUpForm";

export default function SignUpPage() {
  return (
    <section className="w-screen h-screen flex items-center ">
      <div className=" w-full mx-auto ">{<SignUpForm />}</div>
    </section>
  );
}
