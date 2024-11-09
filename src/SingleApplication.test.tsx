import React from "react";
import { render, screen } from "@testing-library/react";
import SingleApplication from "./SingleApplication";
import { Application } from "./Applications";

interface TestCase {
  application: Application;
  expected: {
    loanAmount: string;
    dateCreated: string;
    expiryDate: string;
  };
}

const testCases: TestCase[] = [
  {
    application: {
      id: "1",
      company: "Standard case",
      first_name: "Alice",
      last_name: "Brown",
      email: "alice.brown@example.com",
      loan_amount: 2500,
      date_created: "2023-03-15T00:00:00Z",
      expiry_date: "2023-09-15T00:00:00Z",
    },
    expected: {
      loanAmount: "£2,500",
      dateCreated: "15-03-2023",
      expiryDate: "15-09-2023",
    },
  },
  {
    application: {
      id: "2",
      company: "Negative Value Loan",
      first_name: "Bob",
      last_name: "Smith",
      email: "bob.smith@outlook.com",
      loan_amount: -5501,
      date_created: "2021-06-30T00:00:00Z",
      expiry_date: "2022-01-01T00:00:00Z",
    },
    expected: {
      loanAmount: "£-5,501",
      dateCreated: "30-06-2021",
      expiryDate: "01-01-2022",
    },
  },
  {
    application: {
      id: "3",
      company: "Zero Loan Value",
      first_name: "Charlie",
      last_name: "Johnson",
      email: "charlie.johnson@gmail.com",
      loan_amount: 0,
      date_created: "2022-11-11T00:00:00Z",
      expiry_date: "2023-11-11T00:00:00Z",
    },
    expected: {
      loanAmount: "£0",
      dateCreated: "11-11-2022",
      expiryDate: "11-11-2023",
    },
  },
  {
    application: {
      id: "4",
      company: "Large Value Holdings",
      first_name: "Diana",
      last_name: "Williams",
      email: "diana.williams@example.com",
      loan_amount: 124560101,
      date_created: "2019-02-28T00:00:00Z",
      expiry_date: "2024-02-28T00:00:00Z",
    },
    expected: {
      loanAmount: "£124,560,101",
      dateCreated: "28-02-2019",
      expiryDate: "28-02-2024",
    },
  },
  {
    application: {
      id: "5",
      company: "Decimal Loan Amounts Ltd",
      first_name: "Edward",
      last_name: "Davis",
      email: "edward.davis@example.com",
      loan_amount: 123456789.512,
      date_created: "2024-02-29T00:00:00Z", // Leap year date
      expiry_date: "2025-02-28T00:00:00Z", // One day before next leap year
    },
    expected: {
      loanAmount: "£123,456,789.51", //we expect to round to 2 decimal places
      dateCreated: "29-02-2024",
      expiryDate: "28-02-2025",
    },
  },
  {
    application: {
      id: "6",
      company: "Special characters in name",
      first_name: "Fëdor Gářčia",
      last_name: "Mejía",
      email: "fedor.garcia@nice.com",
      loan_amount: 35000,
      date_created: "2020-07-04T00:00:00Z",
      expiry_date: "2021-07-04T00:00:00Z",
    },
    expected: {
      loanAmount: "£35,000",
      dateCreated: "04-07-2020",
      expiryDate: "04-07-2021",
    },
  },
  {
    application: {
      id: "7",
      company: "Far date with hours and minutes",
      first_name: "Grace",
      last_name: "Lee",
      email: "grace.lee@gmail.com",
      loan_amount: 7500,
      date_created: "2030-01-01T12:11:00Z",
      expiry_date: "2040-02-01T05:11:00Z",
    },
    expected: {
      loanAmount: "£7,500",
      dateCreated: "01-01-2030",
      expiryDate: "01-02-2040",
    },
  },
  {
    application: {
      id: "8",
      company: "Non standard date format",
      first_name: "Hannah",
      last_name: "Taylor",
      email: "hannah.t@gmail.com",
      loan_amount: 10000,
      date_created: "2030-01-01T12:11:00Z",
      expiry_date: "2024-12-31T5:1",
    },
    expected: {
      loanAmount: "£10,000",
      dateCreated: "01-01-2030",
      expiryDate: "Invalid date value",
    },
  },
  {
    application: {
      id: "9",
      company: "Another invalid date",
      first_name: "Isaac",
      last_name: "Brown",
      email: "i.b@gmail.com",
      loan_amount: 2000,
      date_created: "2030-01-01T12:11:00Z",
      expiry_date: "NULL",
    },
    expected: {
      loanAmount: "£2,000",
      dateCreated: "01-01-2030",
      expiryDate: "Invalid date value",
    },
  },
];

describe("SingleApplication multiple test cases", () => {
  testCases.forEach(({ application, expected }) => {
    test(`renders application with loan amount ${expected.loanAmount}, date created ${expected.dateCreated}, and expiry date ${expected.expiryDate} and other details`, () => {
      render(<SingleApplication application={application} />);
      const loanAmountElement = screen.getByText(expected.loanAmount);
      const dateCreatedElement = screen.getByText(expected.dateCreated);
      const expiryDateElement = screen.getByText(expected.expiryDate);
      expect(loanAmountElement).toBeInTheDocument();
      expect(dateCreatedElement).toBeInTheDocument();
      expect(expiryDateElement).toBeInTheDocument();

      // Check other details
      const companyElement = screen.getByText(application.company);
      const nameElement = screen.getByText(`${application.first_name} ${application.last_name}`);
      const emailElement = screen.getByText(application.email);
      expect(companyElement).toBeInTheDocument();
    });
  });
});


describe("SingleApplication missing attributes", () => {
  beforeEach(() => {
    render(<SingleApplication application={{ id: "10" }} />);
  });

  test("renders '-' for company", () => {
    const companyElement = screen.getByTestId("company");
    expect(companyElement).toHaveTextContent("-");
  });

  test("renders '-' for name", () => {
    const nameElement = screen.getByTestId("name");
    expect(nameElement).toHaveTextContent("-");
  });

  test("renders '-' for email", () => {
    const emailElement = screen.getByTestId("email");
    expect(emailElement).toHaveTextContent("-");
  });

  test("renders '-' for loan amount", () => {
    const loanAmountElement = screen.getByTestId("loan-amount");
    expect(loanAmountElement).toHaveTextContent("-");
  });
});

//We dont expect to see a dash but at least the first name should be displayed
describe("SingleApplication only first name", () => {
  beforeEach(() => {
    render(<SingleApplication application={{ id: "11", first_name: "John" }} />);
  });

  test("renders firstName for name", () => {
    const nameElement = screen.getByTestId("name");
    expect(nameElement).toHaveTextContent("John");
  });
});