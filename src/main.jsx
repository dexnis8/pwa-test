// First, before anything that can navigate: initialising analytics reads the
// landing page's UTM parameters, and the splash screen redirects them away.
import "./lib/analytics";
import { reportStaleBreadcrumbs } from "./lib/analyticsBreadcrumb";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import { Toaster } from "react-hot-toast";
import { AuthInitializer } from "./components/AuthInitializer";
import ErrorBoundary from "./components/ErrorBoundary";
import { SocketProvider } from "./context/SocketProvider";

// A practice session or exam left unfinished last time is reported now, once,
// before this visit can start a new one over the top of it.
reportStaleBreadcrumbs();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthInitializer>
              {/* Inside the router and the query client: the socket patches
                  the React Query cache and its listeners navigate. */}
              <SocketProvider>
                {/* Inside the providers, so the fallback can still route and
                    read the cache; outside App, so any screen's throw is
                    caught rather than blanking the page. */}
                <ErrorBoundary>
                  <App />
                </ErrorBoundary>
                <Toaster
                  /* One notice at a time. react-hot-toast keeps the rest
                     queued rather than painting a column of them. */
                  gutter={8}
                  containerStyle={{ top: 12 }}
                  toastOptions={{ duration: 4000 }}
                />
              </SocketProvider>
            </AuthInitializer>
          </BrowserRouter>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);

/* 

I want you to build a new page "jamb/exam/simulation" for the "Exam Simulation mode" Here is the flow, when the user selects "Exam Simulation" from the "Practice Configuration" modal, it opens a new modal asking them to select 3 more subjects with English selected by default to make 4 subjects in total. A request is then made to the endpoint "/exam/simulation?subject1=mathematics&subject2=chemistry&subject3=physics" based on the subjects selected by the user. This example assumes the user selected mathematics, chemistry, physics. The API will return a response with anobject containing the 4 subjects. Each subjects has an array of questions e.g English is 60 questions, others are 40 questions per subject. This data is what will be used on the "Exam Simulation" page. But we want to have a confirmation screen where the user see their name and profile with a button to start the exam. The exam simulation page should look like the design in the image below but with our custom colors and typography. The exam simulation has a countdown timer of 2hrs in which the user has to complete the 4 subjects. The user can switch between subjects at any time. The user can also skip a question and come back to it later. At the bottom of each subject page are boxes numbered 1 to the total number of questions for that subject. The boxes are colored green when the user has answered the question, gray when the user has not answered the question, and red when the user has skipped the question. The user can click on a box to go to that question. The user can also click on the next and previous buttons to go to the next and previous question. Also the user can click on the subject name at the top to go to that subject. Also, the user can click on "N" for next question and "P" for previous question.

"

*/
