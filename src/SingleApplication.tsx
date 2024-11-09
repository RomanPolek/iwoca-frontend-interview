import React from "react";
import styles from "./SingleApplication.module.css";

const SingleApplication = ({ application }) => {

  /**
   * Returns a string with the number formatted as currency in pounds and commas added
   * Also rounds to 2 decimal places
   * @param number 
   */
  const formatNumber = (number: number): string => {
    return `£${(Math.round(number * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`; 
  }


  /**
   * Takes in a date and returns a formatted date string in the format dd-mm-yyyy
   * @param date 
   */
  const formatDate = (date: Date): string => {
    //e.g. 10-12-2021
    //for some reason en-GB uses / as the separator but we want -
    const dateString = date.toLocaleDateString('en-GB').replaceAll('/', '-');
    //if the date is invalid, return the string Invalid date value
    if (dateString === 'Invalid Date') {
      return 'Invalid date value';
    }

    return dateString;
  }

  let fullName = `${application.first_name ?? ''} ${application.last_name ?? ''}`.trim();
  if (fullName === '') {
    fullName = '-';
  }

  return (
    <div className={styles.SingleApplication}>
      <div className={styles.cell}>
        <sub>Company</sub>
        <div className={styles.value} data-testid="company">{application.company ?? '-'}</div>
      </div>
      <div className={styles.cell}>
        <sub>Name</sub>
        <div className={styles.value} data-testid="name">{fullName}</div>
      </div>
      <div className={styles.cell}>
        <sub>Email</sub>
        <span data-testid="email">
          {application.email? <a className={styles.value}
            href={`mailto:${application.email}`}
          >{application.email}</a> : '-'}
        </span>
      </div>
      <div className={styles.cell}>
        <sub>Loan Amount</sub>
        <div className={styles.value} data-testid="loan-amount">{application.loan_amount !== undefined ? formatNumber(application.loan_amount) : '-'}</div>
      </div>
      <div className={styles.cell}>
        <sub>Application Date</sub>
        <div className={styles.value} data-testid="date-created">{formatDate(new Date(application.date_created))}</div>
      </div>
      <div className={styles.cell}>
        <sub>Expiry date</sub>
        <div className={styles.value} data-testid="expiry-date">{formatDate(new Date(application.expiry_date))}</div>
      </div>
    </div>
  );
};

export default SingleApplication;
