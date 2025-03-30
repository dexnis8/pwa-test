import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setDepartment,
  selectDepartment,
  incrementCompletionStep,
  selectCompletionStep,
  setCompletionStep,
} from "../../redux/slices/profileSlice";

const ChooseDepartment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const savedDepartment = useSelector(selectDepartment);
  const currentStep = useSelector(selectCompletionStep);
  const [selectedDepartment, setSelectedDepartment] = useState(
    savedDepartment || "sciences"
  );
  const totalSteps = 3;

  // Set the current step to 2 when this component mounts
  useEffect(() => {
    if (currentStep !== 2) {
      dispatch(setCompletionStep(2));
    }
  }, [currentStep, dispatch]);

  const departments = [
    {
      id: "arts",
      name: "Arts",
      icon: (
        <svg
          width="56"
          height="45"
          viewBox="0 0 56 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M54.3351 1.42572C54.2313 1.16319 53.9923 0.978464 53.7121 0.944189C53.4326 0.910041 53.1556 1.03174 52.9916 1.26153C52.0184 2.62601 50.7414 3.08084 49.262 3.60756C48.0691 4.03247 46.8356 4.47151 45.5024 5.42867C43.617 6.78224 42.7546 8.62736 43.1846 10.3762L43.1387 10.4351C42.3514 9.29297 41.4947 8.23659 40.5907 7.2933C36.3612 2.88007 30.4513 0.226836 24.3757 0.0141212C24.1081 0.00474991 23.836 0 23.5672 0C16.7832 0 10.2898 3.0327 5.75215 8.32029C1.23827 13.5805 -0.76243 20.4281 0.263276 27.1073C0.34903 27.6656 0.45635 28.2296 0.582541 28.7842C2.25089 36.1274 6.512 41.7136 12.2734 44.1099C13.6936 44.7006 15.1261 45 16.5307 45C20.0203 45 23.0682 43.1336 24.8933 39.8793C25.587 38.641 26.0347 37.3605 26.2233 36.0729C26.3344 35.3129 26.2584 34.5536 26.1848 33.8177C26.1089 33.0603 26.0373 32.3445 26.1519 31.6238C26.4147 29.9718 27.5686 28.9854 29.2389 28.9854C29.714 28.9854 30.1995 29.0636 30.6844 29.218C30.1167 30.2591 29.6012 31.2532 29.1507 32.1747C28.196 34.1275 27.5374 35.7448 27.1927 36.981C26.9803 37.7434 26.4158 39.7695 27.7923 40.7249C28.2294 41.0282 28.7836 41.1353 29.3603 41.028C29.8801 40.9315 31.4617 40.6376 35.9559 35.5213C37.1621 34.1483 38.4619 32.5594 39.8205 30.7979C43.3081 29.6233 46.0222 26.7001 46.7402 23.341C46.9199 22.5013 46.9949 21.6027 46.9629 20.6693C48.2688 18.6513 49.4141 16.7683 50.5667 14.7441C50.5887 14.7051 50.6105 14.6635 50.6321 14.6209C52.305 14.1627 53.7457 12.8609 54.5914 11.0404C55.8261 8.38345 55.7351 4.96871 54.3351 1.42572ZM35.4806 14.007C34.8755 14.9679 33.8356 15.5416 32.6983 15.5416C32.0808 15.5416 31.4768 15.3668 30.9518 15.0362C30.2095 14.5686 29.6933 13.8401 29.4991 12.9847C29.3049 12.1294 29.4548 11.2494 29.9225 10.507C30.5276 9.54613 31.5677 8.97242 32.705 8.97242C33.3226 8.97242 33.9265 9.14714 34.4514 9.47796C35.1936 9.94524 35.7097 10.6738 35.9041 11.5292C36.0983 12.3847 35.948 13.2646 35.4806 14.007ZM39.7435 19.9575C41.4038 17.5111 43.1597 15.0793 44.8276 12.9162C45.0979 13.1604 45.4002 13.3989 45.7277 13.6261C46.2704 14.0026 46.8379 14.2938 47.4176 14.4931C46.0095 16.9012 44.4955 19.2869 42.6623 21.987C39.6503 26.425 36.5185 30.5474 33.8437 33.595C32.3496 35.2973 31.0422 36.6115 30.0347 37.4256C30.4235 36.1816 31.1667 34.4744 32.201 32.4516C34.0505 28.8344 36.7291 24.3973 39.7435 19.9575ZM10.5916 19.9364C9.97398 19.9364 9.36998 19.7617 8.8448 19.4309C8.10255 18.9635 7.58661 18.2352 7.39225 17.3796C7.1979 16.5241 7.34835 15.6441 7.81602 14.9018C8.42078 13.941 9.46087 13.3673 10.598 13.3673C11.2157 13.3673 11.8197 13.542 12.3448 13.8728C13.8771 14.8379 14.3387 16.8697 13.3742 18.4017C12.7688 19.3627 11.7286 19.9364 10.5916 19.9364ZM7.14886 27.1684C7.75388 26.2074 8.79384 25.6337 9.9311 25.6337C10.5486 25.6337 11.1524 25.8085 11.6778 26.1392C12.42 26.6066 12.9359 27.335 13.1303 28.1905C13.3248 29.0457 13.1743 29.9256 12.7065 30.6682C12.1018 31.6288 11.0617 32.2027 9.92455 32.2027C9.30695 32.2027 8.70282 32.028 8.17752 31.6971C7.43526 31.2296 6.91945 30.5013 6.72522 29.6459C6.53112 28.7906 6.68171 27.9106 7.14886 27.1684ZM17.6668 7.66276C18.2718 6.70188 19.3119 6.12818 20.449 6.12818C21.0664 6.12818 21.6704 6.30289 22.1954 6.63358C23.7278 7.59844 24.1894 9.63034 23.2248 11.1626C22.6196 12.1236 21.5795 12.6973 20.4423 12.6973C19.8249 12.6973 19.2209 12.5226 18.6958 12.1918C17.9537 11.7245 17.4379 10.9961 17.2435 10.1405C17.0489 9.28514 17.1994 8.40527 17.6668 7.66276Z"
            fill="white"
          />
        </svg>
      ),
      gradient: "bg-gradient-to-r from-[#FF4D8F] to-[#FF8469]",
      disabled: true,
    },
    {
      id: "sciences",
      name: "Sciences",
      icon: (
        <svg
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.9">
            <path
              d="M28.0112 9.02857C29.6746 9.02857 31.023 7.68018 31.023 6.01685C31.023 4.35352 29.6746 3.00513 28.0112 3.00513C26.3479 3.00513 24.9995 4.35352 24.9995 6.01685C24.9995 7.68018 26.3479 9.02857 28.0112 9.02857Z"
              fill="white"
            />
            <path
              d="M34.0357 4.8195C35.3666 4.8195 36.4455 3.74062 36.4455 2.40975C36.4455 1.07888 35.3666 0 34.0357 0C32.7049 0 31.626 1.07888 31.626 2.40975C31.626 3.74062 32.7049 4.8195 34.0357 4.8195Z"
              fill="white"
            />
            <path
              d="M44.1563 41.1129L31.6258 21.0773V15.0603H35.2404V10.8438H14.7584V15.0603H18.3731V21.0773L5.84254 41.1129C5.38314 41.9646 5.12036 42.9384 5.12036 43.9755C5.12036 47.3022 7.81712 49.9999 11.1447 49.9999H38.855C42.1817 49.9999 44.8794 47.3031 44.8794 43.9755C44.8794 42.9384 44.6166 41.9646 44.1563 41.1129ZM15.435 33.7271L22.5897 22.2868V15.0594H27.4092V22.2868L34.5639 33.7271H15.435Z"
              fill="white"
            />
          </g>
        </svg>
      ),
      gradient: "bg-gradient-to-r from-[#F2994A] to-[#F2C94C]",
      disabled: false,
    },
    {
      id: "commercials",
      name: "Commercials",
      icon: (
        <svg
          width="45"
          height="45"
          viewBox="0 0 45 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.9" clip-path="url(#clip0_55_106)">
            <path
              d="M6.67969 21.0938C7.7433 21.0938 8.70598 20.667 9.41734 19.9817L13.3199 21.9328C13.3003 22.0918 13.2715 22.248 13.2715 22.4121C13.2715 24.5929 15.0458 26.3672 17.2266 26.3672C19.4073 26.3672 21.1816 24.5929 21.1816 22.4121C21.1816 21.8034 21.032 21.2335 20.7851 20.7178L26.0791 15.4238C26.5948 15.6706 27.1647 15.8203 27.7734 15.8203C29.9542 15.8203 31.7285 14.046 31.7285 11.8652C31.7285 11.4546 31.6478 11.0663 31.5311 10.6938L36.1309 7.2448C36.7585 7.66399 37.5108 7.91016 38.3203 7.91016C40.5011 7.91016 42.2754 6.13586 42.2754 3.95508C42.2754 1.77429 40.5011 0 38.3203 0C36.1395 0 34.3652 1.77429 34.3652 3.95508C34.3652 4.36569 34.4459 4.75399 34.5626 5.1265L29.9628 8.57552C29.3352 8.15632 28.583 7.91016 27.7734 7.91016C25.5927 7.91016 23.8184 9.68445 23.8184 11.8652C23.8184 12.4739 23.968 13.0439 24.2149 13.5595L18.9209 18.8536C18.4052 18.6067 17.8353 18.457 17.2266 18.457C16.1629 18.457 15.2003 18.8838 14.4889 19.5691L10.5864 17.618C10.6059 17.459 10.6348 17.3028 10.6348 17.1387C10.6348 14.9579 8.86047 13.1836 6.67969 13.1836C4.4989 13.1836 2.72461 14.9579 2.72461 17.1387C2.72461 19.3195 4.4989 21.0938 6.67969 21.0938Z"
              fill="white"
            />
            <path
              d="M43.6816 42.3633H42.2754V14.502C42.2754 13.7734 41.6856 13.1836 40.957 13.1836H35.6836C34.9551 13.1836 34.3652 13.7734 34.3652 14.502V42.3633H31.7285V22.4121C31.7285 21.6836 31.1387 21.0938 30.4102 21.0938H25.1367C24.4082 21.0938 23.8184 21.6836 23.8184 22.4121V42.3633H21.1816V32.959C21.1816 32.2305 20.5918 31.6406 19.8633 31.6406H14.5898C13.8613 31.6406 13.2715 32.2305 13.2715 32.959V42.3633H10.6348V27.6855C10.6348 26.957 10.0449 26.3672 9.31641 26.3672H4.04297C3.31444 26.3672 2.72461 26.957 2.72461 27.6855V42.3633H1.31836C0.589829 42.3633 0 42.9531 0 43.6816C0 44.4102 0.589829 45 1.31836 45H43.6816C44.4102 45 45 44.4102 45 43.6816C45 42.9531 44.4102 42.3633 43.6816 42.3633Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_55_106">
              <rect width="45" height="45" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
      gradient: "bg-gradient-to-r from-[#9B51E0] to-[#BB6BD9]",
      disabled: true,
    },
  ];

  const handleContinue = () => {
    if (selectedDepartment) {
      // Save to Redux
      dispatch(setDepartment(selectedDepartment));

      // Increment completion step
      dispatch(incrementCompletionStep());

      // Navigate to the next step
      navigate("/profile/complete/step3");
    }
  };

  const handleBack = () => {
    navigate("/profile/complete");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="bg-gray-100 rounded-full p-2 mr-3 hover:bg-gray-200 transition-colors"
              aria-label="Go back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <h1 className="text-[#16956C] text-3xl font-bold">
              Choose
              <br />
              Department
            </h1>
          </div>
          <span className="text-gray-500 font-semibold">
            {currentStep}/{totalSteps}
          </span>
        </div>
        <p className="text-gray-700 text-sm">
          Only Science subjects are supported for now!
        </p>
      </div>

      {/* Department Options */}
      <div className="space-y-5 flex-1">
        {departments.map((dept) => (
          <button
            key={dept.id}
            type="button"
            disabled={dept.disabled}
            className={`${dept.gradient} ${
              selectedDepartment === dept.id
                ? "ring-2 ring-[#16956C] ring-offset-1"
                : ""
            } w-full py-5 text-left px-6 rounded-xl text-white flex justify-between items-center transition-all ${
              dept.disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => !dept.disabled && setSelectedDepartment(dept.id)}
          >
            <span className="text-xl font-bold">
              {dept.name}
              {dept.disabled && (
                <span className="block text-sm font-medium">Coming soon</span>
              )}
            </span>
            <span className="text-white">{dept.icon}</span>
          </button>
        ))}
      </div>

      {/* Continue Button */}
      <div className="mt-auto pt-8">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedDepartment}
          className={`w-full py-4 px-4 rounded-full font-medium transition-colors ${
            selectedDepartment
              ? "bg-[#16956C] text-white hover:bg-[#0F7355]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ChooseDepartment;
