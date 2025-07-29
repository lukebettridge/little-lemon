import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingForm from "../components/BookingForm";
import "@testing-library/jest-dom";

const mockAlert = jest.fn();
global.alert = mockAlert;

describe("BookingForm", () => {
  beforeEach(() => {
    mockAlert.mockClear();
  });

  describe("Rendering", () => {
    test("renders the booking form with all required elements", () => {
      render(<BookingForm />);

      expect(screen.getByText("Book a Table")).toBeInTheDocument();
      expect(
        screen.getByText("Reserve your spot at Little Lemon")
      ).toBeInTheDocument();

      expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Date")).toBeInTheDocument();
      expect(screen.getByLabelText("Time")).toBeInTheDocument();
      expect(screen.getByLabelText("Number of Guests")).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: "Book Table" })
      ).toBeInTheDocument();
    });

    test("renders form with correct initial values", () => {
      render(<BookingForm />);

      const nameInput = screen.getByLabelText("Full Name");
      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");
      const guestsInput = screen.getByLabelText("Number of Guests");

      expect(nameInput).toHaveValue("");
      expect(dateInput).toHaveValue("");
      expect(timeInput).toHaveValue("");
      expect(guestsInput).toHaveValue(1);
    });

    test("renders form with correct input types and attributes", () => {
      render(<BookingForm />);

      const nameInput = screen.getByLabelText("Full Name");
      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");
      const guestsInput = screen.getByLabelText("Number of Guests");

      expect(nameInput).toHaveAttribute("type", "text");
      expect(nameInput).toHaveAttribute("aria-required", "true");
      expect(nameInput).toHaveAttribute("placeholder", "Enter your full name");

      expect(dateInput).toHaveAttribute("type", "date");
      expect(timeInput).toHaveAttribute("type", "time");
      expect(timeInput).toHaveAttribute("min", "11:00");
      expect(timeInput).toHaveAttribute("max", "22:00");

      expect(guestsInput).toHaveAttribute("type", "number");
      expect(guestsInput).toHaveAttribute("min", "1");
      expect(guestsInput).toHaveAttribute("max", "10");
    });
  });

  describe("User Interactions", () => {
    test("allows user to input name", async () => {
      const user = userEvent.setup();
      render(<BookingForm />);

      const nameInput = screen.getByLabelText("Full Name");
      await user.type(nameInput, "John Doe");

      expect(nameInput).toHaveValue("John Doe");
    });

    test("allows user to select date", async () => {
      const user = userEvent.setup();
      render(<BookingForm />);

      const dateInput = screen.getByLabelText("Date");
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split("T")[0];

      await user.type(dateInput, tomorrowString);

      expect(dateInput).toHaveValue(tomorrowString);
    });

    test("allows user to select time", async () => {
      const user = userEvent.setup();
      render(<BookingForm />);

      const timeInput = screen.getByLabelText("Time");
      await user.type(timeInput, "19:30");

      expect(timeInput).toHaveValue("19:30");
    });

    test("allows user to change number of guests", async () => {
      const user = userEvent.setup();
      render(<BookingForm />);

      const guestsInput = screen.getByLabelText("Number of Guests");
      await user.clear(guestsInput);
      await user.type(guestsInput, "4");

      expect(guestsInput).toHaveValue(4);
    });
  });

  describe("Form Validation", () => {
    test("shows error when submitting empty form", async () => {
      const user = userEvent.setup();
      render(<BookingForm />);

      const submitButton = screen.getByRole("button", { name: "Book Table" });
      await user.click(submitButton);

      expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(screen.getByText("Date is required")).toBeInTheDocument();
      expect(screen.getByText("Time is required")).toBeInTheDocument();
    });

    test("shows error for empty name", async () => {
      const user = userEvent.setup();
      render(<BookingForm />);

      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");
      const guestsInput = screen.getByLabelText("Number of Guests");

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split("T")[0];

      await user.type(dateInput, tomorrowString);
      await user.type(timeInput, "19:30");
      await user.clear(guestsInput);
      await user.type(guestsInput, "2");

      const submitButton = screen.getByRole("button", { name: "Book Table" });
      await user.click(submitButton);

      expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(screen.queryByText("Date is required")).not.toBeInTheDocument();
      expect(screen.queryByText("Time is required")).not.toBeInTheDocument();
    });

    test("shows error for empty date", async () => {
      const user = userEvent.setup();
      render(<BookingForm />);

      const nameInput = screen.getByLabelText("Full Name");
      const timeInput = screen.getByLabelText("Time");

      await user.type(nameInput, "John Doe");
      await user.type(timeInput, "19:30");

      const submitButton = screen.getByRole("button", { name: "Book Table" });
      await user.click(submitButton);

      expect(screen.getByText("Date is required")).toBeInTheDocument();
      expect(screen.queryByText("Name is required")).not.toBeInTheDocument();
    });

    test("shows error for empty time", async () => {
      const user = userEvent.setup();
      render(<BookingForm />);

      const nameInput = screen.getByLabelText("Full Name");
      const dateInput = screen.getByLabelText("Date");

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split("T")[0];

      await user.type(nameInput, "John Doe");
      await user.type(dateInput, tomorrowString);

      const submitButton = screen.getByRole("button", { name: "Book Table" });
      await user.click(submitButton);

      expect(screen.getByText("Time is required")).toBeInTheDocument();
      expect(screen.queryByText("Name is required")).not.toBeInTheDocument();
    });

    test("clears errors when user starts typing", async () => {
      const user = userEvent.setup();
      render(<BookingForm />);

      const submitButton = screen.getByRole("button", { name: "Book Table" });
      await user.click(submitButton);

      expect(screen.getByText("Name is required")).toBeInTheDocument();

      const nameInput = screen.getByLabelText("Full Name");
      await user.type(nameInput, "J");

      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    test("submits form successfully with valid data", async () => {
      const user = userEvent.setup();
      render(<BookingForm />);

      const nameInput = screen.getByLabelText("Full Name");
      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");
      const guestsInput = screen.getByLabelText("Number of Guests");

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split("T")[0];

      await user.type(nameInput, "John Doe");
      await user.type(dateInput, tomorrowString);
      await user.type(timeInput, "19:30");
      await user.clear(guestsInput);
      await user.type(guestsInput, "4");

      const submitButton = screen.getByRole("button", { name: "Book Table" });
      await user.click(submitButton);

      expect(mockAlert).toHaveBeenCalledWith(
        "Booking submitted successfully! We will confirm your reservation shortly."
      );
    });

    test("resets form after successful submission", async () => {
      const user = userEvent.setup();
      render(<BookingForm />);

      const nameInput = screen.getByLabelText("Full Name");
      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");
      const guestsInput = screen.getByLabelText("Number of Guests");

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split("T")[0];

      await user.type(nameInput, "John Doe");
      await user.type(dateInput, tomorrowString);
      await user.type(timeInput, "19:30");
      await user.clear(guestsInput);
      await user.type(guestsInput, "4");

      const submitButton = screen.getByRole("button", { name: "Book Table" });
      await user.click(submitButton);

      expect(nameInput).toHaveValue("");
      expect(dateInput).toHaveValue("");
      expect(timeInput).toHaveValue("");
      expect(guestsInput).toHaveValue(1);
    });

    test("clears errors after successful submission", async () => {
      const user = userEvent.setup();
      render(<BookingForm />);

      const submitButton = screen.getByRole("button", { name: "Book Table" });
      await user.click(submitButton);

      expect(screen.getByText("Name is required")).toBeInTheDocument();

      const nameInput = screen.getByLabelText("Full Name");
      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split("T")[0];

      await user.type(nameInput, "John Doe");
      await user.type(dateInput, tomorrowString);
      await user.type(timeInput, "19:30");

      await user.click(submitButton);

      expect(screen.queryByText("Name is required")).not.toBeInTheDocument();
      expect(screen.queryByText("Date is required")).not.toBeInTheDocument();
      expect(screen.queryByText("Time is required")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    test("has proper ARIA labels and roles", () => {
      render(<BookingForm />);

      const form = screen.getByRole("form");
      expect(form).toHaveAttribute("aria-label", "Booking Form");

      const nameInput = screen.getByLabelText("Full Name");
      expect(nameInput).toHaveAttribute("aria-required", "true");
    });

    test("has proper form structure with labels", () => {
      render(<BookingForm />);

      const nameInput = screen.getByLabelText("Full Name");
      const dateInput = screen.getByLabelText("Date");
      const timeInput = screen.getByLabelText("Time");
      const guestsInput = screen.getByLabelText("Number of Guests");

      expect(nameInput).toBeInTheDocument();
      expect(dateInput).toBeInTheDocument();
      expect(timeInput).toBeInTheDocument();
      expect(guestsInput).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    test("handles whitespace-only name input", async () => {
      const user = userEvent.setup();
      render(<BookingForm />);

      const nameInput = screen.getByLabelText("Full Name");
      await user.type(nameInput, "   ");

      const submitButton = screen.getByRole("button", { name: "Book Table" });
      await user.click(submitButton);

      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });

    test("handles minimum and maximum guest values", async () => {
      const user = userEvent.setup();
      render(<BookingForm />);

      const guestsInput = screen.getByLabelText("Number of Guests");

      await user.clear(guestsInput);
      await user.type(guestsInput, "1");
      expect(guestsInput).toHaveValue(1);

      await user.clear(guestsInput);
      await user.type(guestsInput, "10");
      expect(guestsInput).toHaveValue(10);
    });
  });
});
