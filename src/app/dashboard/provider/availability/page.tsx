"use client";

import { useState } from "react";
import {
  Clock,
  Calendar,
  MapPin,
  ToggleLeft,
  ToggleRight,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface WorkingHours {
  day: string;
  enabled: boolean;
  start: string;
  end: string;
}

interface VacationPeriod {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export default function AvailabilityPage() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [instantBooking, setInstantBooking] = useState(false);
  const [loading, setLoading] = useState(false);

  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([
    { day: "Monday", enabled: true, start: "09:00", end: "17:00" },
    { day: "Tuesday", enabled: true, start: "09:00", end: "17:00" },
    { day: "Wednesday", enabled: true, start: "09:00", end: "17:00" },
    { day: "Thursday", enabled: true, start: "09:00", end: "17:00" },
    { day: "Friday", enabled: true, start: "09:00", end: "17:00" },
    { day: "Saturday", enabled: true, start: "10:00", end: "16:00" },
    { day: "Sunday", enabled: false, start: "10:00", end: "16:00" },
  ]);

  const [vacationPeriods, setVacationPeriods] = useState<VacationPeriod[]>([
    {
      id: "1",
      startDate: "2025-09-15",
      endDate: "2025-09-22",
      reason: "Family vacation",
    },
  ]);

  const updateWorkingHours = (
    index: number,
    field: keyof WorkingHours,
    value: string | boolean
  ) => {
    const updated = [...workingHours];
    updated[index] = { ...updated[index], [field]: value };
    setWorkingHours(updated);
  };

  const addVacationPeriod = () => {
    const newPeriod: VacationPeriod = {
      id: Date.now().toString(),
      startDate: "",
      endDate: "",
      reason: "",
    };
    setVacationPeriods([...vacationPeriods, newPeriod]);
  };

  const removeVacationPeriod = (id: string) => {
    setVacationPeriods(vacationPeriods.filter((period) => period.id !== id));
  };

  const updateVacationPeriod = (
    id: string,
    field: keyof VacationPeriod,
    value: string
  ) => {
    setVacationPeriods(
      vacationPeriods.map((period) =>
        period.id === id ? { ...period, [field]: value } : period
      )
    );
  };

  const handleSaveAvailability = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Availability updated:", {
        isAvailable,
        instantBooking,
        workingHours,
        vacationPeriods,
      });
    } catch (error) {
      console.error("Error updating availability:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Availability Settings
        </h1>
        <Button
          onClick={handleSaveAvailability}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Available for Jobs</h3>
              <p className="text-sm text-gray-600">
                Control whether you can receive new job requests
              </p>
            </div>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className="flex items-center"
            >
              {isAvailable ? (
                <ToggleRight className="w-12 h-6 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-12 h-6 text-gray-400" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Instant Booking</h3>
              <p className="text-sm text-gray-600">
                Allow customers to book you directly without quotation approval
              </p>
            </div>
            <button
              onClick={() => setInstantBooking(!instantBooking)}
              className="flex items-center"
            >
              {instantBooking ? (
                <ToggleRight className="w-12 h-6 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-12 h-6 text-gray-400" />
              )}
            </button>
          </div>

          {!isAvailable && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 font-medium">
                You are currently unavailable
              </p>
              <p className="text-red-600 text-sm">
                Customers cannot see your profile or send you job requests while
                unavailable.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workingHours.map((day, index) => (
              <div
                key={day.day}
                className="flex items-center space-x-4 p-4 border rounded-lg"
              >
                <div className="w-24">
                  <span className="font-medium">{day.day}</span>
                </div>

                <button
                  onClick={() =>
                    updateWorkingHours(index, "enabled", !day.enabled)
                  }
                  className="flex items-center"
                >
                  {day.enabled ? (
                    <ToggleRight className="w-8 h-4 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-4 text-gray-400" />
                  )}
                </button>

                {day.enabled ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="time"
                      value={day.start}
                      onChange={(e) =>
                        updateWorkingHours(index, "start", e.target.value)
                      }
                      className="w-32"
                    />
                    <span className="text-gray-500">to</span>
                    <Input
                      type="time"
                      value={day.end}
                      onChange={(e) =>
                        updateWorkingHours(index, "end", e.target.value)
                      }
                      className="w-32"
                    />
                  </div>
                ) : (
                  <span className="text-gray-500 italic">Day off</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              Quick Schedule Templates
            </h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const businessHours = workingHours.map((day) => ({
                    ...day,
                    enabled: !["Saturday", "Sunday"].includes(day.day),
                    start: "09:00",
                    end: "17:00",
                  }));
                  setWorkingHours(businessHours);
                }}
              >
                Business Hours (Mon-Fri, 9-5)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const flexibleHours = workingHours.map((day) => ({
                    ...day,
                    enabled: true,
                    start: "08:00",
                    end: "20:00",
                  }));
                  setWorkingHours(flexibleHours);
                }}
              >
                Flexible (All days, 8-8)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const weekendOnly = workingHours.map((day) => ({
                    ...day,
                    enabled: ["Saturday", "Sunday"].includes(day.day),
                    start: "10:00",
                    end: "18:00",
                  }));
                  setWorkingHours(weekendOnly);
                }}
              >
                Weekends Only
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vacation Mode */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Vacation & Time Off
            </CardTitle>
            <Button onClick={addVacationPeriod} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Time Off
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vacationPeriods.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No scheduled time off</p>
                <p className="text-sm">
                  Add vacation periods or days off to block bookings
                </p>
              </div>
            ) : (
              vacationPeriods.map((period) => (
                <div
                  key={period.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`start-${period.id}`}>Start Date</Label>
                      <Input
                        id={`start-${period.id}`}
                        type="date"
                        value={period.startDate}
                        onChange={(e) =>
                          updateVacationPeriod(
                            period.id,
                            "startDate",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor={`end-${period.id}`}>End Date</Label>
                      <Input
                        id={`end-${period.id}`}
                        type="date"
                        value={period.endDate}
                        onChange={(e) =>
                          updateVacationPeriod(
                            period.id,
                            "endDate",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor={`reason-${period.id}`}>Reason</Label>
                      <Input
                        id={`reason-${period.id}`}
                        placeholder="e.g., Family vacation"
                        value={period.reason}
                        onChange={(e) =>
                          updateVacationPeriod(
                            period.id,
                            "reason",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeVacationPeriod(period.id)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">
              How Time Off Works
            </h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>
                • Customers won&apos;t see available time slots during blocked
                periods
              </li>
              <li>• Existing bookings during this time will be notified</li>
              <li>• You can still manually accept urgent jobs if needed</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Service Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Service Area
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="service-radius">Service Radius (miles)</Label>
            <Input
              id="service-radius"
              type="number"
              placeholder="25"
              className="w-32"
            />
            <p className="text-sm text-gray-600 mt-1">
              Maximum distance you&apos;re willing to travel for jobs
            </p>
          </div>

          <div>
            <Label htmlFor="base-location">Base Location</Label>
            <Input
              id="base-location"
              placeholder="Enter your city or zip code"
              className="max-w-md"
            />
            <p className="text-sm text-gray-600 mt-1">
              Your primary work location for distance calculations
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Travel Charges</h4>
              <p className="text-sm text-gray-600">
                Add extra charges for jobs beyond a certain distance
              </p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
