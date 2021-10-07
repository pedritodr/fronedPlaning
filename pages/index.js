import { useRouter } from "next/router";
import { useEffect } from "react";
import SignupForm from "../components/login/SignupForm";
import useAuth from "../hooks/useAuth";

export default function Home() {
 const {auth}= useAuth();
  const router = useRouter();

  useEffect(() => {
    if(auth){
     router.replace('/list-planing')
    }
  }, [auth,router])

  return (
    <>
     <SignupForm/>
    </>
  );
}
