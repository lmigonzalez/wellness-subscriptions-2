"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DailyPlan } from "@/lib/data";

export default function Dashboard() {
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user is premium
    const premiumParam = searchParams.get("is_premium");
    const isUserPremium = premiumParam === "true";
    setIsPremium(isUserPremium);

    if (isUserPremium) {
      fetchDailyPlan();
    } else {
      setLoading(false);
    }
  }, [searchParams]);

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

  // Premium access check
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mb-6">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-emerald-400 mb-4">
              Premium Access Required
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              The Daily Wellness Dashboard is exclusively available to premium
              members.
            </p>
          </div>

          <div className="bg-gray-950 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">
              🌟 What You&apos;ll Get with Premium Access
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mt-1">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-400">
                    Daily AI-Generated Content
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Fresh quotes, workouts, and meal plans every day
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mt-1">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-400">
                    Daily Home Workouts
                  </h3>
                  <p className="text-gray-300 text-sm">
                    7 fresh bodyweight exercises daily • No equipment needed
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mt-1">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-400">
                    Complete Meal Plans
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Breakfast, lunch, and dinner with recipes
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mt-1">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-400">
                    Daily Email & PDF
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Get your plan delivered every morning
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-gray-400">
            <p className="mb-4">
              💡 To access the Daily Wellness Dashboard, you need to be a
              premium member.
            </p>
            <p className="text-sm">
              Visit our Shopify store to upgrade your account and unlock
              exclusive wellness content.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading your wellness plan...</div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-700">
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
          <div className="bg-gray-950 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Today&apos;s Quote</h2>
            <blockquote className="text-xl italic mb-4">
              &quot;{plan.quote.text}&quot;
            </blockquote>
            <cite className="text-emerald-100">— {plan.quote.author}</cite>
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Workout Plan */}
          <section className="bg-gray-950 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400 flex items-center">
              <span className="mr-3">💪</span>
              Today&apos;s Workout Plan
            </h2>
            <p className="text-gray-300 text-sm mb-4 italic">
              🏠 Fresh daily home workout • 7 bodyweight exercises • No equipment needed
            </p>
            <div className="space-y-4">
              {plan.workout.map((exercise, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4">
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
          <section className="bg-gray-950 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400 flex items-center">
              <span className="mr-3">🥗</span>
              Today&apos;s Meal Plan
            </h2>
            <p className="text-gray-300 text-sm mb-4 italic">
              🍽️ Fresh daily recipes designed for today
            </p>
            <div className="space-y-6">
              {/* Breakfast */}
              <div className="bg-gray-800 rounded-lg p-4">
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
              <div className="bg-gray-800 rounded-lg p-4">
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
              <div className="bg-gray-800 rounded-lg p-4">
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
      <footer className="bg-black border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-400">
            <p>
              Your daily wellness journey starts here. Updated every day at 4:00
              AM EST (9:00 AM UTC) with fresh workouts and quotes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
