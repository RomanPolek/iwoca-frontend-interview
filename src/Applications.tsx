import React from "react";
import SingleApplication from "./SingleApplication";
import { getSingleApplicationFixture } from "./__fixtures__/applications.fixture";
import styles from "./Applications.module.css";

const Applications = () => {
  const applications = getSingleApplicationFixture;

  return (
    <>
      <div className={styles.Applications}>
        <SingleApplication application={applications[0]} />
        <SingleApplication application={applications[0]} />
        <SingleApplication application={applications[0]} />
      </div>

      <div className={styles.loadMoreWrapper}>
        <button className={styles.loadMore}>Load more</button>
      </div>
    </>
  );
};

export default Applications;
