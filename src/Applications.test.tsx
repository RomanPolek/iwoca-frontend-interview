import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Applications from "./Applications";
import { vi } from "vitest"; // Bring in vi from Vitest

// Let's test our Applications component
describe("Applications Component", () => {
  let originalFetch;

  // Save the original fetch function
  beforeEach(() => {
    originalFetch = global.fetch;
  });

  // Restore it after each test
  afterEach(() => {
    global.fetch = originalFetch;
  });

  test("renders error message when fetch fails", async () => {
    // Simulating a network error
    global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));

    render(<Applications />);

    // Wait for the error
    await waitFor(() => {
      expect(
        screen.getByText("Error loading applications. Please try again later.")
      ).toBeInTheDocument();
    });
  });

  test("renders 'No more applications' message when no data is returned", async () => {
    // Mocking fetch to return an empty array
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );

    render(<Applications />);

    // Check for the No more applications message
    await waitFor(() => {
      expect(
        screen.getByText("There are no more applications to load. Please check back later.")
      ).toBeInTheDocument();
    });
  });

  test("renders applications when data is successfully fetched", async () => {
    // Simulating a successful fetch with some mock data
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              id: "1",
              loan_amount: 5000,
              first_name: "John",
              last_name: "Doe",
              company: "TechCorp",
              email: "john.doe@techcorp.com",
              date_created: "2024-01-01",
              expiry_date: "2024-12-31",
            },
          ]),
      })
    );

    render(<Applications />);

    // Make sure the application appears on the screen
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("TechCorp")).toBeInTheDocument();
      expect(screen.getByText("£5,000")).toBeInTheDocument();
    });
  });

  test("loads more applications when 'Load more' button is clicked", async () => {
    // Mock fetch with initial and additional data
    global.fetch = vi
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve([
              {
                id: "1",
                loan_amount: 3000,
                first_name: "Jane",
                last_name: "Smith",
                company: "FinanceCo",
                email: "jane.smith@gmail.com",
                date_created: "2024-02-01",
                expiry_date: "2024-11-30",
              },
            ]),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve([
              {
                id: "2",
                loan_amount: 10000,
                first_name: "Michael",
                last_name: "Johnson",
                company: "HealthCorp",
                email: "michael.johnson@healthcorp.com",
                date_created: "2024-03-01",
                expiry_date: "2024-12-15",
              },
            ]),
        })
      );

    render(<Applications />);

    // Wait for the initial data to show up
    await waitFor(() => {
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("FinanceCo")).toBeInTheDocument();
    });

    // Click the Load more button and wait for the new data
    const loadMoreButton = screen.getByText("Load more");
    loadMoreButton.click();

    await waitFor(() => {
      expect(screen.getByText("Michael Johnson")).toBeInTheDocument();
      expect(screen.getByText("HealthCorp")).toBeInTheDocument();
    });
  });

  test("hides 'Load more' button when there are no more applications", async () => {
    // Mock fetch to return no more data
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );

    render(<Applications />);

    // Wait for the No more applications message and the load more button to disappear
    await waitFor(() => {
      expect(
        screen.getByText("There are no more applications to load. Please check back later.")
      ).toBeInTheDocument();
      expect(screen.queryByText("Load more")).not.toBeInTheDocument();
    });
  });

  test("displays loading indicator while fetching", async () => {
    // Simulating a fetch that takes a while
    global.fetch = vi.fn(
      () =>
        new Promise(() => {
          // Keeps loading...
        })
    );

    render(<Applications />);

    //we expect loading text to show up
    expect(screen.getByText('Loading applications...')).toBeInTheDocument();
  });

  test('prevents multiple requests from being made at the same time', async () => {
    // Mock fetch to simulate a long-running request
    global.fetch = vi.fn(
      () =>
        new Promise(() => {
          // Keeps loading...
        })
    );
  
    // Mock console.log to spy on it
    const consoleLogSpy = vi.spyOn(console, 'log');
  
    render(<Applications />);
  
    // Click Load more  twice
    const loadMoreButton = screen.getByText('Load more');
    loadMoreButton.click();
    loadMoreButton.click();
  
    // Expect Already loading applications in console log
    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('Already loading applications');
    });
  
    // restore the console.log spy
    consoleLogSpy.mockRestore();
  });
  
});
