import { createContext, useState } from "react";

export const interviewContext = createContext(null);

export const InterviewContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [allReports, setAllReports] = useState([]);

  return (
    <interviewContext.Provider
      value={{
        loading,
        setLoading,

        report,
        setReport,

        allReports,
        setAllReports,
      }}
    >
      {children}
    </interviewContext.Provider>
  );
};
