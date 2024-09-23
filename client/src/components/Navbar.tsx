import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaMoon, FaSun, FaWindowClose } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { RiLogoutCircleLine } from "react-icons/ri";
import { IoMdLogIn } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>(" ");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const user = localStorage.getItem("username");
    if (user) {
      setUsername(user);
    } else {
      setUsername(" ");
    }
  }, [username, darkMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(".hamburger-menu")
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <nav className="bg-white dark:bg-slate-950 shadow-lg w-full border">
        <div className="max-w-full h-fit px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-blue-500 dark:text-white text-xl sm:text-2xl md:text-2xl font-semibold">
                  <Link className="comic-text font-semibold" href="/">
                    Book Management 📚
                  </Link>
                </h1>
                <span className="comic-smoll font-semibold text-gray-600 dark:text-gray-400 text-sm hidden sm:block">
                  Create your own book
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="px-4 py-2 text-sm font-semibold dark:text-gray-200">
                {isAuthenticated && (
                  <div>
                    <span className="comic-s2 font-semibold text-blue-500">
                      Welcome 😊{" "}
                    </span>
                    <span className="comic-s1 font-semibold text-orange-600">
                      {username ? username : ""} 🔥
                    </span>
                  </div>
                )}
              </div>
              <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <FaBell className="h-6 w-6" />
              </button>
              <button
                onClick={toggleDarkMode}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                {darkMode ? (
                  <FaSun className="h-6 w-6" />
                ) : (
                  <FaMoon className="h-6 w-6" />
                )}
              </button>
              <div className="relative">
                <img
                  onClick={toggleDropdown}
                  className="h-8 w-8 rounded-full cursor-pointer"
                  src="https://ui.shadcn.com/avatars/01.png"
                  alt="User avatar"
                />
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 shadow-lg rounded-md py-1"
                  >
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-900"
                    >
                      Login 😊
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-900"
                    >
                      Signup 🙏
                    </Link>
                    <Link
                      href="/"
                      className="block px-4 py-2 text-sm text-gray-700 font-semibold dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-900"
                    >
                      Home 🏠
                    </Link>
                    {isAuthenticated && (
                      <Link
                        onClick={logout}
                        href="/"
                        className="block px-4 py-2 text-sm text-red-700 font-semibold dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-900"
                      >
                        Logout 🔴
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="md:hidden">
              <button
                onClick={toggleSidebar}
                className="hamburger-menu inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open main menu</span>
                <IoMenu className="block h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar for mobile */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4">
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FaWindowClose className="h-6 w-6" />
          </button>
          <div className="mt-8 space-y-4">
            {isAuthenticated && (
              <div className="text-sm font-semibold dark:text-gray-200 mb-4">
                <span className="comic-s2 font-semibold text-blue-500">
                  Welcome 😊{" "}
                </span>
                <span className="comic-s1 font-semibold text-orange-600">
                  {username ? username : ""} 🔥
                </span>
              </div>
            )}
            <Link
              href="/"
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              <IoHomeOutline className="h-6 w-6 mr-2" />
              <span>Home</span>
            </Link>
            <Link
              href="/login"
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              <IoMdLogIn className="h-6 w-6 mr-2" />
              <span>Login</span>
            </Link>
            <Link
              href="/signup"
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              <IoMdLogIn className="h-6 w-6 mr-2" />
              <span>Signup</span>
            </Link>
            <button
              onClick={toggleDarkMode}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              {darkMode ? (
                <FaSun className="h-6 w-6 mr-2" />
              ) : (
                <FaMoon className="h-6 w-6 mr-2" />
              )}
              <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>
            <button className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
              <FaBell className="h-6 w-6 mr-2" />
              <span>Notifications</span>
            </button>
            {isAuthenticated && (
              <Link
                onClick={logout}
                href="/"
                className="flex items-center text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              >
                <RiLogoutCircleLine className="h-6 w-6 mr-2" />
                <span>Logout</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
