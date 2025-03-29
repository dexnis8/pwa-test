import "./App.css";

function App() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-6 bg-white shadow-md rounded-md">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to My Landing Page
          </h1>
          <p className="text-lg mb-6">
            Built with React, Vite, and Tailwind CSS
          </p>
          <p className="text-lg mb-6">
            I just added an update.....Did you see me?
          </p>
          <p className="text-lg mb-6">
            This is update 2.....did you get me?
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
