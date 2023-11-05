import React, { useState } from "react";
import { Form, Link, useRouteLoaderData } from "react-router-dom";
import logo from "../../assets/images/logohotel.png";
import user from "../../assets/images/user.jpeg";
import ButtonHeader from "../UI/ButtonHeader";

function MainNavigation() {
  const token = useRouteLoaderData("root");
  const [showAction, setShowAction] = useState(false);

  return (
    <nav className="pl-20 bg-white p-1 flex pr-16">
      <div className="">
        <img src={logo} alt="Logo" className="w-10" />
      </div>
      <div className="ml-auto flex">
        <p className="w-10 my-auto">Tien</p>
        <img src={user} className="w-10 mr-5" />
        <div
          className="ml-auto relative"
          onMouseMove={() => setShowAction(true)}
          onMouseOut={() => setShowAction(false)}
        >
          <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700">
            <i className="fa-solid fa-bars"></i>
          </button>
          {showAction ? (
            <>
              <div className="absolute right-0 bg-white ml-auto w-40 py-3 z-10">
                <div className="py-2 px-4 hover:bg-gray-200">
                  <Link to="/account">
                    <i className="fa-solid fa-circle-user pr-4"></i>
                    Tài khoản
                  </Link>
                  <br />
                </div>
                <div className="py-2 px-4 hover:bg-gray-200 flex">
                  <Form action="/logout" method="post">
                    <button>
                      <i className="fa-solid fa-right-from-bracket pr-4 my-auto"></i>
                      Logout
                    </button>
                  </Form>
                  <br />
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

export default MainNavigation;
