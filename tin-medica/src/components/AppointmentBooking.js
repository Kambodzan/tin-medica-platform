import React, { useState } from "react";

const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow p-4 ${className}`}>{children}</div>
);

const CardContent = ({ children }) => <div>{children}</div>;

const Button = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${className}`}
  >
    {children}
  </button>
);

const Select = ({ value, onChange, className, children }) => (
  <select
    value={value}
    onChange={onChange}
    className={`border border-gray-300 bg-white rounded p-2 w-full ${className}`}
  >
    {children}
  </select>
);

const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;

const Calendar = ({ onChange, value }) => (
  <input
    type="date"
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    className="border border-gray-300 rounded p-2 w-full"
  />
);

const TimePicker = ({ value, onChange }) => (
  <input
    type="time"
    value={value || ""}
    onChange={onChange}
    className="border border-gray-300 rounded p-2 w-full"
  />
);

const BookingSteps = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [provider, setProvider] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePreviousStep = () => setStep((prev) => prev - 1);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative">
      <Card className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {step === 1 && "Step 1: Select Service and Provider"}
            {step === 2 && "Step 2: Select Location"}
            {step === 3 && "Step 3: Select Date and Time"}
          </h2>
          <button
            onClick={onClose}
            className="bg-white text-gray-800 font-bold pl-12 pb-5 rounded"
          >
            ×
          </button>
        </div>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <Select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full"
              >
                <SelectItem value="haircut">Kardiolog</SelectItem>
                <SelectItem value="massage">Neurolog</SelectItem>
              </Select>

              <Select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full"
              >
                <SelectItem value="john">dr Anna Nowak</SelectItem>
                <SelectItem value="jane">dr Narek Wiśniewski</SelectItem>
              </Select>

              <Button onClick={handleNextStep} className="w-full">
                Next
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full"
              >
                <SelectItem value="branch1">Klinika Zdrowia - ul. Medyczna 1, Warszawa</SelectItem>
                <SelectItem value="branch2">Centrum Medyczne - ul. Szpitalna 5, Kraków</SelectItem>
              </Select>

              <div className="flex justify-between">
                <Button onClick={handlePreviousStep}>Back</Button>
                <Button onClick={handleNextStep}>Next</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Select
                onChange={(e) => {
                  const [selectedDate, selectedTime] = e.target.value.split(" at ");
                  setDate(selectedDate);
                  setTime(selectedTime);
                }}
                value={`${date} at ${time}`}
              >
                <option value="" disabled>
                  Select a date and time
                </option>
                <option value="2025-01-28 at 10:00 AM">2025-01-28 at 10:00 AM</option>
                <option value="2025-01-28 at 02:00 PM">2025-01-28 at 02:00 PM</option>
                <option value="2025-01-29 at 09:00 AM">2025-01-29 at 09:00 AM</option>
                <option value="2025-01-29 at 03:00 PM">2025-01-29 at 03:00 PM</option>
                {/* Add more options as needed */}
              </Select>

              <div className="flex justify-between">
                <Button onClick={handlePreviousStep}>Back</Button>
                <Button
                  onClick={() => {
                    alert(`Booked ${service} with ${provider} at ${location} on ${date} at ${time}`);
                    onClose();
                  }}
                >
                  Confirm
                </Button>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
};

export default BookingSteps;