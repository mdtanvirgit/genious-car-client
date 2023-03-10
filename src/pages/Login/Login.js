import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation, useNavigate } from "react-router-dom";
import login from "../../assets/images/login/login.svg";
import { AuthContext } from "../../Contexts/AuthProvider/AuthProvider";
import app from "../../firebase/firebase.config";
import { SocialLogin } from "../Home/Shared/SocialLogin/SocialLogin";
export const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  let from = location.state?.from?.pathname || "/";

  const { loginUser } = useContext(AuthContext);
  const auth = getAuth(app);
  const handleLogin = (e) => {
    const email = e.target.email.value;
    const password = e.target.password.value;
    loginUser(auth, email, password)
      .then((res) => {
        console.log(res);
        const user = res.user;
        fetch("https://genious-car-server-topaz.vercel.app/jwt", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(user),
        })
          .then((res) => res.json())
          .then((data) => console.log(data));
        navigate(from, { replace: true });
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });

    e.preventDefault();
  };

  const googleProvider = new GoogleAuthProvider();
  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        const user = res.user;
        const currentUser = {
          email: user.email,
        };
        fetch("https://genious-car-server-topaz.vercel.app/jwt", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(currentUser),
        })
          .then((res) => res.json())
          .then((data) => {
            localStorage.setItem("token", data.token);
            //localStorage is  but not best to place store in data

            localStorage.setItem("token", data.token);
            navigate(from, { replace: true });
          });
      })
      .catch((error) => {});
  };
  return (
    <div className="hero my-8 bg-base-200 rounded-md">
      <div className="hero-content gap-20 flex-col lg:flex-row">
        <div className="text-center lg:text-left">
          <img src={login} alt="" />
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 space-y-10">
          <form onSubmit={handleLogin} className="card-body">
            <h1 className="text-5xl text-center font-bold">Login now!</h1>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="email"
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="password"
                className="input input-bordered"
              />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
            </div>
            <div className="form-control mt-6">
              <input
                className="btn btn-primary"
                type="submit"
                name="button"
                value="Login"
              />
            </div>
          </form>
          <p className=" text-center">
            Genious car{" "}
            <Link className=" text-orange-600 font-semibold" to="/signup">
              Sign Up
            </Link>{" "}
          </p>
          <div className=" flex space-x-10 pb-8 justify-center items-center">
            <SocialLogin />
            <FcGoogle
              onClick={handleGoogleLogin}
              className=" text-3xl cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
