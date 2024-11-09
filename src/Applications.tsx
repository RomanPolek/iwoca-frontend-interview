import React, { useEffect, useState } from "react";
import SingleApplication from "./SingleApplication";
import styles from "./Applications.module.css";

export interface Application {
  id: string;
  loan_amount: number;
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  date_created: string;
  expiry_date: string;
}

const Applications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  
  const [currentPage, setCurrentPage] = useState(0); //the last page loaded. 0 means no pages loaded
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  /**
   * Fetches applications from the API at http://localhost:3001/api/applications
   * @param page which page of applications to load
   */
  const fetchApplications = async (page: number): Promise<Application[]> => {
    // Prevent multiple requests from being made at the same
    if (loading) {
      console.log('Already loading applications');
      return [];
    }

    //if already loaded this page, don't load again
    if (page <= currentPage) {
      console.log('Already loaded this page');
      return [];
    }

    setLoading(true);
    const response = await fetch(`http://localhost:3001/api/applications?_page=${page}&_limit=5`);
    try {
      const data = await response.json();
      if (data.length === 0) {
        setHasMore(false);
      }

      setError(false);
      setCurrentPage(page);
      return data as Application[];
    } catch (error) {
      console.error('Error fetching applications', error);
      setError(true);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(1).then((newApplications) => {
      setApplications([...applications, ...newApplications]);
    });
  }, []);

  return (
    <div className={styles.Applications}>
      {applications.map((application) => (
        <SingleApplication key={application.id} application={application} />
      ))}

      {loading && <div className={styles.loading}>Loading applications...</div>}
      {error && <div className={styles.error}>Error loading applications. Please try again later.</div>}

      {hasMore ? (<div className={styles.loadMoreWrapper}>
        <button className={styles.loadMore}
          onClick={() => {
            fetchApplications(currentPage + 1).then((newApplications) => {
              setApplications([...applications, ...newApplications]);
            });
          }}
        >Load more</button>
      </div>) : (
        <div className={styles.noMore}>There are no more applications to load. Please check back later.</div>
      )}
    </div>
  );
};

export default Applications;
