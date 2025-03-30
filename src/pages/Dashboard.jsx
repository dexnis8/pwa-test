import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectPersonalInfo } from "../redux/slices/profileSlice";
import PracticeConfigModal from "../components/PracticeConfigModal";

const Dashboard = () => {
  const personalInfo = useSelector(selectPersonalInfo);
  const name = personalInfo.fullName?.split(" ")[0] || "User";
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-[#16956C] text-2xl font-bold mb-1">Hi, {name}</h1>
      <p className="text-gray-700 text-base mb-6">Next Live Quiz</p>

      {/* Quiz card */}
      <div className="bg-[#16956C] rounded-xl p-5 mb-6 text-white relative overflow-hidden">
        {/* Coming soon badge - improved visibility */}
        <div className="absolute -right-12 z-15 top-5 bg-yellow-500 text-white text-[10px] font-bold py-1 px-12 transform rotate-45 shadow-md">
          COMING SOON
        </div>
        <div className="absolute left-[25%] inset-0 ">
          <svg
            width="201"
            height="70"
            viewBox="0 0 201 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0 0C14.8988 40.8411 54.0846 70 100.081 70C146.077 70 185.263 40.8411 200.162 0H168.034C155.018 24.1829 129.469 40.6207 100.081 40.6207C70.6929 40.6207 45.1442 24.1829 32.1274 0H0Z"
              fill="#21A279"
            />
          </svg>
        </div>

        <h2 className="text-xl font-bold mb-2 z-20 relative">
          SATURDAY LIVE QUIZ
        </h2>
        <p className="text-sm mb-3 z-20 relative">
          Entry: 10 hours on-screen practice
        </p>

        <div className="flex items-center mb-3">
          <div className="flex items-center mr-6">
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 2V6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 2V6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 10H21"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>23rd November 2021</span>
          </div>
        </div>

        <div className="flex items-center mb-3">
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 6V12L16 14"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span>9:00pm</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center rounded-full  bg-white/20 px-4 py-2">
            <svg
              width="30"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_245_122)">
                <path
                  d="M3.59375 14.8437C3.335 14.8437 3.125 14.6337 3.125 14.375V11.4256C3.125 10.5856 3.48313 9.78125 4.1075 9.21875L5.11438 8.3125C5.34875 8.10312 5.47688 7.81375 5.47688 7.5C5.47688 7.18625 5.34875 6.89687 5.115 6.68687L4.1075 5.78125C3.48313 5.21875 3.125 4.41437 3.125 3.57437V0.625C3.125 0.36625 3.335 0.15625 3.59375 0.15625C3.8525 0.15625 4.0625 0.36625 4.0625 0.625V3.57437C4.0625 4.14875 4.30813 4.69937 4.735 5.08437L5.74188 5.99062C6.16938 6.375 6.41438 6.925 6.41438 7.5C6.41438 8.075 6.16938 8.625 5.7425 9.01L4.73563 9.91625C4.30813 10.3006 4.0625 10.8512 4.0625 11.4256V14.375C4.0625 14.6337 3.8525 14.8437 3.59375 14.8437Z"
                  fill="#30E0A8"
                />
                <path
                  d="M11.4061 14.8437C11.1473 14.8437 10.9373 14.6337 10.9373 14.375V11.4256C10.9373 10.8512 10.6917 10.3006 10.2648 9.91562L9.25795 9.00937C8.83045 8.625 8.58545 8.075 8.58545 7.5C8.58545 6.925 8.83045 6.375 9.25732 5.99L10.2642 5.08375C10.6917 4.69937 10.9373 4.14875 10.9373 3.57437V0.625C10.9373 0.36625 11.1473 0.15625 11.4061 0.15625C11.6648 0.15625 11.8748 0.36625 11.8748 0.625V3.57437C11.8748 4.41437 11.5167 5.21875 10.8923 5.78125L9.88545 6.6875C9.6517 6.8975 9.52357 7.18625 9.52357 7.50062C9.52357 7.815 9.6517 8.10375 9.88545 8.31375L10.8923 9.22C11.5167 9.78125 11.8748 10.5856 11.8748 11.4256V14.375C11.8748 14.6337 11.6648 14.8437 11.4061 14.8437Z"
                  fill="#30E0A8"
                />
                <path
                  d="M12.6562 0.9375H2.34375C2.085 0.9375 1.875 0.7275 1.875 0.46875C1.875 0.21 2.085 0 2.34375 0H12.6562C12.915 0 13.125 0.21 13.125 0.46875C13.125 0.7275 12.915 0.9375 12.6562 0.9375Z"
                  fill="#30E0A8"
                />
                <path
                  d="M12.6562 15H2.34375C2.085 15 1.875 14.79 1.875 14.5312C1.875 14.2725 2.085 14.0625 2.34375 14.0625H12.6562C12.915 14.0625 13.125 14.2725 13.125 14.5312C13.125 14.79 12.915 15 12.6562 15Z"
                  fill="#30E0A8"
                />
              </g>
              <defs>
                <clipPath id="clip0_245_122">
                  <rect width="15" height="15" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <span className="font-bold">13:05:00</span>
          </div>
          <div>
            <svg
              width="86"
              height="85"
              viewBox="0 0 86 85"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_d_194_5)">
                <path
                  d="M42.616 74.0155C60.6261 74.0155 75.2262 59.6852 75.2262 42.0078C75.2262 24.3304 60.6261 10 42.616 10C24.6059 10 10.0059 24.3304 10.0059 42.0078C10.0059 59.6852 24.6059 74.0155 42.616 74.0155Z"
                  fill="#21A279"
                />
              </g>
              <path
                d="M18.2351 20.2441H70.4728C73.9914 20.2441 76.9686 23.0084 76.9686 26.5623V58.5484C76.9686 61.9708 74.1266 64.8666 70.4728 64.8666H46.5191L20.4004 78.2929V64.8666H18.2351C14.7165 64.8666 11.7393 62.1023 11.7393 58.5484V26.5623C11.7391 23.0083 14.5811 20.2441 18.2351 20.2441Z"
                fill="white"
              />
              <path
                d="M19.4438 79.8461C19.0333 79.5796 18.7596 79.1798 18.7596 78.6466V66.3846H17.9384C13.5586 66.3846 10 62.9193 10 58.6543V26.2669C10 22.0019 13.5586 18.5366 17.9384 18.5366H70.7699C75.1497 18.5366 78.7083 22.0019 78.7083 26.2669V58.6543C78.7083 62.9193 75.1497 66.3846 70.7699 66.3846H46.8178L20.6758 79.8461C20.265 80.1128 19.8544 79.9794 19.4438 79.8461ZM17.9384 21.2023C15.0641 21.2023 12.7374 23.4681 12.7374 26.2669V58.6543C12.7374 61.4533 15.0642 63.719 17.9384 63.719H20.1283C20.9495 63.719 21.497 64.2521 21.497 65.0518V76.5141L45.9966 63.8523C46.1335 63.719 46.4072 63.719 46.6809 63.719H70.9068C73.7812 63.719 76.1078 61.4531 76.1078 58.6543V26.2669C76.1078 23.4679 73.781 21.2023 70.9068 21.2023H17.9384Z"
                fill="#183651"
              />
              <path
                d="M25.6811 59.6853H18.0485C17.5032 59.6853 16.958 59.1553 16.958 58.6252V26.4259C16.958 25.8958 17.5032 25.3657 18.0485 25.3657H70.6602C71.2054 25.3657 71.7507 25.8958 71.7507 26.4259V58.6252C71.7507 59.1553 71.2054 59.6853 70.6602 59.6853H45.172L25.6811 69.756V59.6853Z"
                fill="#2AA0DA"
              />
              <path
                d="M46.819 46.6252H43.4368V44.9541C43.4368 44.3275 43.4368 43.701 43.6624 43.283C43.888 42.8654 44.3388 42.4475 44.7897 41.8209L46.819 39.9411C47.2699 39.5235 47.4954 38.8969 47.4954 38.27C47.4954 37.6432 47.2699 37.0168 46.819 36.5989C46.3681 36.1813 45.6917 35.9723 45.015 35.9723C44.3385 35.9723 43.6621 36.1813 43.2109 36.5989C42.7601 37.0166 42.5345 37.6432 42.3089 38.27H38.7012C38.9267 36.5989 39.6032 35.3458 40.7305 34.5105C41.8578 33.6749 43.4362 33.0483 45.0147 33.0483C46.8187 33.0483 48.1716 33.466 49.2989 34.3015C50.4262 35.1371 50.8773 36.3903 50.8773 37.8524C50.8773 38.8966 50.6517 39.7322 49.9753 40.5677C49.5244 40.9854 49.2989 41.4033 49.0733 41.4033C48.8477 41.6122 48.6224 41.8209 48.3969 42.0299C48.1713 42.2388 47.7204 42.4475 47.4949 42.6565C47.2693 42.8654 47.044 43.0741 47.044 43.283C46.5931 43.7007 46.5931 44.3273 46.5931 44.9541V46.6252H46.819Z"
                fill="white"
              />
              <path
                d="M45.2405 52.6825C44.5641 52.6825 44.1132 52.4735 43.6621 52.0559C43.2112 51.6382 42.9857 51.2203 42.9857 50.5937C42.9857 49.9672 43.2112 49.5495 43.6621 49.1316C44.113 48.714 44.5641 48.505 45.2405 48.505C45.917 48.505 46.3678 48.714 46.819 49.1316C47.2699 49.5492 47.4954 49.9672 47.4954 50.5937C47.4954 51.2203 47.2699 51.638 46.819 52.0559C46.3678 52.4735 45.6914 52.6825 45.2405 52.6825Z"
                fill="white"
              />
              <defs>
                <filter
                  id="filter0_d_194_5"
                  x="0.00585938"
                  y="0"
                  width="85.2202"
                  height="84.0156"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="5" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.14902 0 0 0 0 0.196078 0 0 0 0 0.219608 0 0 0 0.15 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_194_5"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_194_5"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Practice button */}
      <button
        onClick={() => setIsPracticeModalOpen(true)}
        className="block w-full relative bg-[#1B7A93] hover:bg-[#166A80] text-white font-bold py-4 px-6 rounded-lg mb-6 transition-colors"
      >
        <div className="absolute right-0 top-0">
          <svg
            width="67"
            height="43"
            viewBox="0 0 67 43"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M29.6133 34.4297C15.5707 26.4853 5.45254 14.1283 0 0H20.3462C24.5609 7.33561 30.7012 13.6511 38.5228 18.0761C47.5403 23.1776 57.469 25.0176 67 23.9776V42.7617C54.4361 43.7557 41.4557 41.1294 29.6133 34.4297Z"
              fill="#1A97B3"
            />
          </svg>
        </div>
        <div className="flex items-center justify-start">
          <svg
            className="w-6 h-6 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="uppercase text-lg">PRACTICE NOW</span>
        </div>
      </button>

      {/* Practice Configuration Modal */}
      <PracticeConfigModal
        isOpen={isPracticeModalOpen}
        onClose={() => setIsPracticeModalOpen(false)}
      />

      {/* Referral link */}
      <div className="flex items-center bg-gray-100 p-4 rounded-lg">
        <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center mr-3">
          <span className="text-orange-500">👥</span>
        </div>
        <span className="text-gray-600">Refer your friends</span>
      </div>

      {/* Ad banner */}
      <div className="mt-6 bg-[#14213D] text-white p-4 rounded-lg flex justify-between items-center">
        <div className="flex-1 pr-3">
          <p className="uppercase text-xs font-medium">Limited Time Offer</p>
          <p className="uppercase text-base font-bold mb-1">
            Delux Coding School
          </p>
          <p className="text-xs text-white/80">
            Learn to code with industry experts. Get 30% off your first month!
          </p>
        </div>
        <a
          href="https://deluxcodingschool.ng"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap transition-colors"
        >
          ENROLL NOW
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
