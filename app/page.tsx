"use client";

import { useEffect, useState } from "react";
import { DailyPlan } from "@/lib/data";

export default function Dashboard() {
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDailyPlan();
  }, []);

  const fetchDailyPlan = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/daily-plan");
      if (!response.ok) {
        throw new Error("Failed to fetch daily plan");
      }
      const data = await response.json();
      setPlan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your wellness plan...</div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">
          Error: {error || "No plan available"}
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-emerald-400">
              Daily Wellness Dashboard
            </h1>
            <p className="text-gray-300 mt-2">{today}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quote of the Day */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Quote of the Day</h2>
            <blockquote className="text-xl italic mb-4">
              "{plan.quote.text}"
            </blockquote>
            <cite className="text-emerald-100">— {plan.quote.author}</cite>
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Workout Plan */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-emerald-400 flex items-center">
              <span className="mr-3">💪</span>
              Today's Workout
            </h2>
            <div className="space-y-4">
              {plan.workout.map((exercise, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-lg text-white mb-2">
                    {exercise.name}
                  </h3>
                  <p className="text-gray-300 mb-2">{exercise.description}</p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="bg-emerald-600 px-2 py-1 rounded text-white">
                      {exercise.duration}
                    </span>
                    {exercise.sets && (
                      <span className="bg-blue-600 px-2 py-1 rounded text-white">
                        {exercise.sets} sets
                      </span>
                    )}
                    {exercise.reps && (
                      <span className="bg-purple-600 px-2 py-1 rounded text-white">
                        {exercise.reps} reps
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Meal Plan */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-emerald-400 flex items-center">
              <span className="mr-3">🥗</span>
              Today's Meals
            </h2>
            <div className="space-y-6">
              {/* Breakfast */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-lg text-orange-400 mb-2">
                  🌅 Breakfast - {plan.meals.breakfast.name}
                </h3>
                <p className="text-gray-300 mb-2">
                  {plan.meals.breakfast.description}
                </p>
                <p className="text-sm text-emerald-400 mb-3">
                  {plan.meals.breakfast.calories} calories
                </p>

                <div className="mb-3">
                  <h4 className="font-medium text-white mb-1">Ingredients:</h4>
                  <ul className="text-sm text-gray-300 list-disc list-inside">
                    {plan.meals.breakfast.ingredients.map((ingredient, i) => (
                      <li key={i}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-1">Instructions:</h4>
                  <ol className="text-sm text-gray-300 list-decimal list-inside space-y-1">
                    {plan.meals.breakfast.instructions.map((instruction, i) => (
                      <li key={i}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Lunch */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-lg text-yellow-400 mb-2">
                  ☀️ Lunch - {plan.meals.lunch.name}
                </h3>
                <p className="text-gray-300 mb-2">
                  {plan.meals.lunch.description}
                </p>
                <p className="text-sm text-emerald-400 mb-3">
                  {plan.meals.lunch.calories} calories
                </p>

                <div className="mb-3">
                  <h4 className="font-medium text-white mb-1">Ingredients:</h4>
                  <ul className="text-sm text-gray-300 list-disc list-inside">
                    {plan.meals.lunch.ingredients.map((ingredient, i) => (
                      <li key={i}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-1">Instructions:</h4>
                  <ol className="text-sm text-gray-300 list-decimal list-inside space-y-1">
                    {plan.meals.lunch.instructions.map((instruction, i) => (
                      <li key={i}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Dinner */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-lg text-purple-400 mb-2">
                  🌙 Dinner - {plan.meals.dinner.name}
                </h3>
                <p className="text-gray-300 mb-2">
                  {plan.meals.dinner.description}
                </p>
                <p className="text-sm text-emerald-400 mb-3">
                  {plan.meals.dinner.calories} calories
                </p>

                <div className="mb-3">
                  <h4 className="font-medium text-white mb-1">Ingredients:</h4>
                  <ul className="text-sm text-gray-300 list-disc list-inside">
                    {plan.meals.dinner.ingredients.map((ingredient, i) => (
                      <li key={i}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-1">Instructions:</h4>
                  <ol className="text-sm text-gray-300 list-decimal list-inside space-y-1">
                    {plan.meals.dinner.instructions.map((instruction, i) => (
                      <li key={i}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-400">
            <p>
              Your daily wellness journey starts here. Updated every day at 4:00
              AM ET.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
