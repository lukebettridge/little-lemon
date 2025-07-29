import React from "react";
import BookingForm from "./components/BookingForm.jsx";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🍋 Little Lemon Restaurant</h1>
        <p>Book your table for an unforgettable dining experience</p>
      </header>
      <main>
        <BookingForm />
      </main>
      <footer>
        <p>&copy; 2024 Little Lemon Restaurant. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
