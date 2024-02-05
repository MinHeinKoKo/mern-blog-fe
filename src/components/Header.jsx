import React, { useState } from "react";
import { images } from "../constants";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetUserInfo } from "../store/reducers/userReducer";

const NavItemInfo = [
  { name: "Home", type: "link", href: "/" },
  { name: "Article", type: "link", href: "/articles" },
  {
    name: "Pages",
    type: "dropdown",
    items: [
      { title: "About us", href: "/about" },
      { title: "Contact us", href: "/contact" },
    ],
  },
  { name: "Pricing", type: "link", href: "/pricing" },
  { name: "FAQ", type: "link", href: "/faq" },
];

const NavItem = ({ item }) => {
  const [dropDown, setDropDown] = useState(false);
  const toggleDropDown = () => {
    setDropDown((prev) => {
      return !prev;
    });
  };
  return (
    <li className=" relative group">
      {item.type === "link" ? (
        <>
          <Link to={item.href} className="px-4 py-2 group-hover:text-green-500">
            {item.name}
          </Link>
          <span className="cursor-pointer text-blue-500 absolute transition-all duration-500 font-bold ease-in-out right-0 top-0 opacity-0 group-hover:right-[90%] group-hover:opacity-100">
            /
          </span>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <button
            className="px-4 py-2 flex items-center gap-x-1 group-hover:text-green-500"
            onClick={toggleDropDown}
          >
            {item.name}
            <MdKeyboardArrowDown />
          </button>
          <div
            className={` ${
              dropDown ? "block" : "hidden"
            } lg:hidden transition-all duration-500 pt-4 lg:absolute lg:bottom-0 lg:right-0 lg:transform lg:translate-y-full lg:group-hover:block w-max`}
          >
            <ul className="bg-dark-soft lg:bg-transparent text-center flex flex-col shadow-lg rounded-lg overflow-hidden">
              {item?.items?.map((page, index) => (
                <Link
                  key={index}
                  to={page.href}
                  className="hover:bg-dark-hard hover:text-white px-4 py-2 text-white lg:text-dark-soft"
                >
                  {page.title}
                </Link>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
};

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  const [navIsVisible, setNavIsVisible] = useState(false);
  const [profileDropDown, setProfileDropDown] = useState(false);
  const navVisibilityHandler = () => {
    setNavIsVisible((current) => {
      return !current;
    });
  };
  const logoutHandler = () => {
    dispatch(resetUserInfo());
  };
  return (
    <section className="sticky top-0 left-0 right-0 bg-white z-50">
      <header className="container mx-auto px-5 flex justify-between py-4 items-center">
        <Link to="/" className="flex items-center gap-1">
          <img src={images.Logo} className="h-10" alt="logo" />
          <h3 className="font-semibold text-xl tracking-wider">M1n's Blog</h3>
        </Link>
        <div className="z-50 lg:hidden">
          {navIsVisible ? (
            <AiOutlineClose
              onClick={navVisibilityHandler}
              className="w-6 h-6"
            />
          ) : (
            <AiOutlineMenu onClick={navVisibilityHandler} className="w-6 h-6" />
          )}
        </div>
        <div
          className={`${
            navIsVisible ? "right-0" : "-right-full"
          } transition-all duration-300 z-[49] mt-[60px] lg:mt-0 bg-dark-hard lg:bg-transparent flex flex-col w-full lg:w-auto lg:flex-row justify-center lg:justify-right fixed top-0 bottom-0 lg:static gap-x-9 items-center`}
        >
          <ul className="flex flex-col items-center gap-y-5 text-white lg:text-dark-soft lg:flex-row gap-x-2 font-semibold">
            {NavItemInfo.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
          </ul>
          {user ? (
            <>
              <div className="flex flex-col items-center gap-y-5 text-white lg:text-dark-soft lg:flex-row gap-x-2 font-semibold">
                <div className="relative group">
                  <div className="flex flex-col items-center">
                    <button
                      className="sm:mt-5 lg:flex sm:flex sm:items-center sm:gap-2 lg:items-center lg:gap-x-2 lg:mt-0 border-2 border-blue-500 px-6 py-2 rounded-full text-blue-500 font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out"
                      onClick={() => setProfileDropDown(!profileDropDown)}
                    >
                      Account
                      <MdKeyboardArrowDown />
                    </button>
                    <div
                      className={` ${
                        profileDropDown ? "block" : "hidden"
                      } lg:hidden transition-all duration-500 pt-4 lg:absolute lg:bottom-0 lg:right-0 lg:transform lg:translate-y-full lg:group-hover:block w-max`}
                    >
                      <ul className="bg-dark-soft lg:bg-transparent text-center flex flex-col shadow-lg rounded-lg overflow-hidden">
                        {user.admin&& (
                          <Link
                          to="/admin"
                          className="hover:bg-dark-hard hover:text-white px-4 py-2 text-white lg:text-dark-soft"
                        >
                          Admin Dashboard
                        </Link>
                        )}
                        <Link
                          to="/profile"
                          className="hover:bg-dark-hard hover:text-white px-4 py-2 text-white lg:text-dark-soft"
                        >
                          Profile
                        </Link>
                        <button
                          onClick={logoutHandler}
                          className="hover:bg-dark-hard hover:text-white px-4 py-2 text-white lg:text-dark-soft"
                        >
                          Logout
                        </button>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="sm:mt-5 lg:mt-0 border-2 border-blue-500 px-6 py-2 rounded-full text-blue-500 font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </header>
    </section>
  );
};

export default Header;
