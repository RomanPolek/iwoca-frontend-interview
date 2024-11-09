import React from "react";
import styles from "./SingleApplication.module.css";

const SingleApplication = ({ application }) => {

  /**
   * Returns a string with the number formatted as currency in pounds and commas added
   * @param number 
   */
  const formatNumber = (number: number): string => {
    return `£${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`; 
  }


  /**
   * Takes in a date and returns a formatted date string in the format dd-mm-yyyy
   * @param date 
   */
  const formatDate = (date: Date): string => {
    //e.g. 10-12-2021
    //for some reason en-GB uses / as the separator but we want -
    return date.toLocaleDateString('en-GB').replaceAll('/', '-');
  }

  return (
    <div className={styles.SingleApplication}>
      <div className={styles.cell}>
        <sub>Company</sub>
        <div className={styles.value}>{application.company}</div>
      </div>
      <div className={styles.cell}>
        <sub>Name</sub>
        <div className={styles.value}>{application.first_name} {application.last_name}</div>
      </div>
      <div className={styles.cell}>
        <sub>Email</sub>
        <a className={styles.value}
          href={`mailto:${application.email}`}
        >{application.email}</a>
      </div>
      <div className={styles.cell}>
        <sub>Loan Amount</sub>
        <div className={styles.value}>{formatNumber(application.loan_amount)}</div>
      </div>
      <div className={styles.cell}>
        <sub>Application Date</sub>
        <div className={styles.value}>{formatDate(new Date(application.date_created))}</div>
      </div>
      <div className={styles.cell}>
        <sub>Expiry date</sub>
        <div className={styles.value}>{formatDate(new Date(application.expiry_date))}</div>
      </div>
    </div>
  );
};

export default SingleApplication;
