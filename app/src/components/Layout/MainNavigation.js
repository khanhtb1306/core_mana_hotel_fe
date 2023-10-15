import React from "react";
import { Form, Link, useRouteLoaderData } from "react-router-dom";
import logo from "../../assets/images/logohotel.png";
import ButtonHeader from "../UI/ButtonHeader";

function MainNavigation() {
  const token = useRouteLoaderData('root');
  return (
    <nav className="pl-20 bg-white p-1 flex">
      <div className="">
        <img src={logo} alt="Logo" className="w-10" />
      </div>
      <div className="ml-auto">
        <Form action="/logout" method="post">
          <button>Logout</button>
        </Form>
      </div>
    </nav>
  );
}

export default MainNavigation;
